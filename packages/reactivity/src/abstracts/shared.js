import { createApp, reactive } from 'petite-vue';

/**
 * @typedef {import('../abstracts/ReactivePluginBase').default} ReactivePluginBase
 * @typedef {import('../abstracts/ReactiveSingleton').default} ReactiveSingleton
 */

/**
 * Fetches the available template.
 *
 * If the object provides a template function or string, this will create a template and embed it
 * to the mount point.
 *
 * In the case of a function, the function may also return a DOM element directly, in which case
 * this element will be cloned and used as the template.
 *
 * @this {ReactiveSingleton|ReactivePluginBase}
 * @return {HTMLElement}
 */
function reactivityTemplate() {
    const reactiveTemplate = this.template();

    if (!reactiveTemplate) {
        throw new Error('You must either specify a template or a mount point');
    }

    if (typeof reactiveTemplate === 'string') {
        const parser = new DOMParser();
        const rendered = parser.parseFromString(reactiveTemplate, 'text/html');
        if (rendered.body.childElementCount > 1) {
            throw new Error('Template must only have one root node');
        }
        if (rendered.body.firstElementChild instanceof HTMLTemplateElement) {
            throw new Error('A string template must not return a template element');
        }
        return rendered.body.firstElementChild;
    }
    if (reactiveTemplate instanceof HTMLTemplateElement) {
        if (reactiveTemplate.content.childElementCount > 1) {
            throw new Error('Template must only have one root node');
        }
        const cloned = reactiveTemplate.content.firstElementChild.cloneNode(true);
        return cloned;
    }
    if (reactiveTemplate instanceof HTMLElement) {
        const cloned = reactiveTemplate.cloneNode(true);
        return cloned;
    }

    throw new Error('Invalid template - you must provide either a string, a template element or a HTML element');
}

/**
 * Mount reactivity to the DOM.
 *
 * The reactivity will be mounted to the DOM on the given element (or template), and will
 * then be created as an application in Vue. It will then be ready for use.
 *
 * It will use the mountTo() method to determine where the mounted element should be added to in
 * the DOM, unless the mounted element already exists within the DOM.
 *
 * @this {ReactiveSingleton|ReactivePluginBase}
 * @param {HTMLElement|null} element
 * @return {void}
 */
function reactivityMount(element = null) {
    if (this.$reactive) {
        throw new Error('Reactivity already initialized for this instance');
    }

    let mountedElement = element;

    if (!element) {
        const parentElement = this.mountTo();

        if (parentElement !== document.body && !document.body.contains(parentElement)) {
            throw new Error('The mount element must exist in the DOM');
        }
        if (parentElement instanceof HTMLTemplateElement) {
            throw new Error('You cannot mount to a template element');
        }

        if (!this.template()) {
            mountedElement = parentElement;
        } else {
            mountedElement = reactivityTemplate.call(this);

            if (!mountedElement) {
                throw new Error('No template or mountable element provided');
            }

            if (!document.body.contains(mountedElement)) {
                if (!parentElement) {
                    throw new Error('You must specify a mount element with mountTo() if using a template.');
                }
                parentElement.appendChild(mountedElement);
            }
        }
    }

    this.$app = createApp(this.$data).mount(mountedElement);
    this.$el = mountedElement;

    // Import next tick into plugin
    this.$nextTick = this.$data.$nextTick;

    // Prevent reactivity from being reset
    this.$reactive = true;
    Object.defineProperty(this, '$reactive', { configurable: false, writable: false });
}

/**
 * Get mappable properties.
 *
 * This method analyzes the current object and retrieves all properties and methods that will be
 * made available to the reactivity data store.
 *
 * This will ignore certain properties and methods that are either required by Snowboard or are
 * provided by the Reactivity package itself.
 *
 * The returned object will be keyed by the property or method name, and the value will be the
 * definition of the method or property.
 *
 * @this {ReactiveSingleton|ReactivePluginBase}
 * @return {Object.<string, {type: string, value: any}>}
 */
function reactivityGetProperties() {
    const mappable = {};
    const props = Object.getOwnPropertyDescriptors(this);
    const protoProps = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this));
    const ignore = [
        'snowboard',
        'baseConstruct',
        'constructor',
        'construct',
        'init',
        'destruct',
        'destructor',
        'detach',
        'template',
        'mountTo',
        '$reactive',
        '$mount',
        '$el',
        '$data',
    ];

    Object.entries(protoProps).forEach(([key, prop]) => {
        if (ignore.includes(key) || key.startsWith('reactivity')) {
            return;
        }

        if (typeof prop.value === 'function') {
            mappable[key] = {
                type: 'function',
                value: prop.value,
            };
        } else if (prop.get && typeof prop.get === 'function') {
            mappable[key] = {
                type: 'getter',
                value: prop.get,
            };
        } else {
            mappable[key] = {
                type: 'value',
                value: prop.value,
            };
        }
    });
    Object.entries(props).forEach(([key, prop]) => {
        if (ignore.includes(key) || key.startsWith('reactivity')) {
            return;
        }

        if (typeof prop.value === 'function') {
            mappable[key] = {
                type: 'function',
                value: prop.value,
            };
        } else if (prop.get && typeof prop.get === 'function') {
            mappable[key] = {
                type: 'getter',
                value: prop.get,
            };
        } else {
            mappable[key] = {
                type: 'value',
                value: prop.value,
            };
        }
    });

    return mappable;
}

/**
 * Create a reactivity data store.
 *
 * Taking the mappable properties, this converts them into an object that is then fed to Vue as the
 * data store for reactivity.
 *
 * @this {ReactiveSingleton|ReactivePluginBase}
 * @param {Object.<string, {type: string, value: any}>} mappable
 * @return {Object.<string, {type: string, value: PropertyDescriptor}>}
 */
function reactivityCreateStore(mappable) {
    const obj = {};

    Object.entries(mappable).forEach(([key, prop]) => {
        if (prop.type === 'function') {
            Object.defineProperty(obj, key, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: (...args) => this[key].call(this, ...args),
            });
        } else if (prop.type === 'getter') {
            Object.defineProperty(obj, key, {
                configurable: true,
                enumerable: false,
                get: prop.value,
            });
        } else if (prop.type === 'value') {
            Object.defineProperty(obj, key, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: prop.value,
            });
        }
    });

    return obj;
}

/**
 * Map reactive properties to the original object.
 *
 * Once the mappable properties have been converted into a reactive data store, this method will
 * map the properties back to the original object. This allows for the properties and methods to
 * be accessed directly from the plugin instance and will react accordingly.
 *
 * @this {ReactiveSingleton|ReactivePluginBase}
 * @param {Object.<string, {type: string, value: any}>} mappable
 * @return {void}
 */
function reactivityMapProperties(mappable) {
    Object.entries(mappable).forEach(([key, prop]) => {
        if (prop.type === 'getter') {
            Object.defineProperty(
                this,
                key,
                Object.getOwnPropertyDescriptor(this.$data, key),
            );
        } else if (prop.type === 'value') {
            Object.defineProperty(this, key, {
                get() { return this.$data[key]; },
                set(value) { this.$data[key] = value; },
            });
        }
    });
}

/**
 * Initialize the Reactivity functionality.
 *
 * This provides the lifecycle workflow in order to initialize reactivity and make it available in
 * the plugin.
 *
 * @this {ReactiveSingleton|ReactivePluginBase}
 * @return {void}
 */
function reactivityInitialize() {
    const mappable = reactivityGetProperties.call(this);
    this.$data = reactive(reactivityCreateStore.call(this, mappable));
    reactivityMapProperties.call(this, mappable);
    if (this.mountTo()) {
        reactivityMount.call(this);
    }
}

/**
 * Constructor for the Reactivity functionality.
 *
 * This creates the necessary properties and modifies the constructor to initialize the Reactivity
 * functionality.
 *
 * @mixin Reactivity
 * @this {ReactiveSingleton|ReactivePluginBase}
 * @return {void}
 */
function reactivityConstructor() {
    /** @var {boolean} Whether reactivity is enabled on this object */
    this.$reactive = false;
    /** @var {Object.<string, any>} The reactive data store */
    this.$data = {};
    /** @var {HTMLElement} The mounted element */
    this.$el = null;

    // Wrap the instance's constructor to call the Reactivity initialisation after construct
    if (typeof this.construct === 'function') {
        this.baseConstruct = this.construct;
        this.construct = (...args) => {
            this.baseConstruct(...args);
            reactivityInitialize.call(this);
        };
    }
}

/**
 * The HTML template of this plugin to use for reactivity.
 *
 * This can be used to define either a HTML template as a string, for reactive plugins that
 * generate their own HTML, or alternatively, a HTML element to mount to.
 *
 * @returns
 */
function template() {
    return null;
}

/**
 * Determines the mount point for the template.
 *
 * By default, reactive plugins will not auto-mount to the DOM. In these cases, you can manually
 * mount the element by calling `this.$mount()` with the element you wish to mount to.
 *
 * If you set this to a HTML element, this plugin will do one of two things:
 *
 *  - If this plugin has a template, it will append to the mount point as a child node and will
 *    mount to this child node.
 *  - If this plugin does not have a template, it will mount to the element directly.
 *
 * @returns {HTMLElement|null}
 */
function mountTo() {
    return null;
}

export {
    reactivityConstructor,
    reactivityMount,
    template,
    mountTo,
};
