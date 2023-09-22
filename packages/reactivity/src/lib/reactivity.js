import { createApp, reactive } from 'petite-vue';
import { componentDirective, prepareComponents } from './components';
import { getTemplate } from './template';
import { getMappableProperties, createReactiveStore, mapReactiveStore } from './scope';
/**
 * @typedef {import('../abstracts/ReactivePluginBase').default} ReactivePluginBase
 * @typedef {import('../abstracts/ReactiveSingleton').default} ReactiveSingleton
 */

/**
 * Cleanup/unmount root instance
 *
 * @param {Context} context
 */
function rootCleanup(/* context */) {
}

/**
 * Adds the current Vue context to the root element, so that components are correctly linked.
 *
 * @param {*} context
 * @param {*} root
 * @returns
 */
function rootDirective(context, root) {
    root.$context = context;

    return () => {
        rootCleanup(context);
        root.destruct();
    };
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
            mountedElement = getTemplate.call(this);

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

    // Prepare components
    prepareComponents(this, mountedElement);

    // Set root directive on mounted element
    mountedElement.setAttribute('v-root', '');

    this.$app = createApp(this.$data)
        .directive('root', (context) => rootDirective(context, this, this.snowboard))
        .directive('component', (context) => componentDirective(context, this, this.snowboard))
        .mount(mountedElement);
    this.$el = mountedElement;

    // Import next tick into plugin
    this.$nextTick = this.$data.$nextTick;

    // Prevent reactivity from being reset
    this.$reactive = true;
    Object.defineProperty(this, '$reactive', { configurable: false, writable: false });
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
    const mappable = getMappableProperties.call(this);
    this.$data = reactive(createReactiveStore.call(this, mappable));
    mapReactiveStore.call(this, mappable);
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
    /** @var {Object.<string, ReactivePluginBase[]>} The reactive data store */
    this.$components = {};
    /** @type {Object.<string, any>} The context of this instance */
    this.$context = null;

    // Wrap the instance's constructor to call the Reactivity initialisation after construct
    if (typeof this.construct === 'function') {
        this.baseConstruct = this.construct;
        this.construct = (...args) => {
            this.baseConstruct(...args);
            reactivityInitialize.call(this);
        };
    }
}

export {
    reactivityConstructor,
    reactivityMount,
};
