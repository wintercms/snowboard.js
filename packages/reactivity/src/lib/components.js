import { createApp, reactive, nextTick } from 'petite-vue';
import { getMappableProperties, createReactiveStore, mapReactiveStore } from './scope';
import { getTemplate } from './template';

/**
 * @typedef {import('../../../base/src/main/Snowboard').default} Snowboard
 * @typedef {import('petite-vue/dist/types/context').Context} Context
 * @typedef {import('../abstracts/ReactivePluginBase').default} ReactivePluginBase
 * @typedef {import('../abstracts/ReactiveSingleton').default} ReactiveSingleton
 */

/**
 * Converts shorthand Vue directives to their full name.
 *
 * @param {string} name
 */
function convertShorthands(name) {
    if (name.startsWith('@')) {
        return `v-on:${name.slice(1)}`;
    }
    if (name.startsWith(':')) {
        return `v-bind:${name.slice(1)}`;
    }
    return name;
}

/**
 * Prepares components in a mounted element or template.
 *
 * @param {ReactivePluginBase|ReactiveSingleton} parent
 * @param {HTMLElement} mountElement
 */
function prepareComponents(parent, mountElement) {
    if (!parent.components || !parent.components()) {
        return;
    }

    const components = parent.components();

    Object.keys(components).forEach((componentName) => {
        const componentElements = mountElement.querySelectorAll(componentName);

        // Replace each component holder with a template tag using the correct directive
        componentElements.forEach((componentElement) => {
            const templateElement = document.createElement('ins');
            templateElement.setAttribute('v-component', componentName);

            if (componentElement.hasAttributes()) {
                const { attributes } = componentElement;

                for (let i = 0; i < attributes.length; i += 1) {
                    const { name, value } = attributes[i];
                    templateElement.setAttribute(convertShorthands(name), value);
                }
            }

            componentElement.replaceWith(templateElement);
        });
    });
}

function updateDataStore(scope) {
    const mappable = getMappableProperties.call(this);
    const componentMappable = getMappableProperties.call({ ...scope });

    this.$data = reactive(createReactiveStore.call(this, {
        ...mappable,
        ...componentMappable,
    }));

    mapReactiveStore.call(this, mappable);
    mapReactiveStore.call(this, componentMappable);
}

/**
 * Links a component's newly mounted element to the Vue Block instance within the parent.
 *
 * @param {HTMLElement} oldMount
 * @param {HTMLElement} newMount
 */
function linkBlock(oldMount, newMount) {
    const block = this.$parent.$context.ctx.blocks.find((b) => b.template === oldMount);
    block.template = newMount;
    updateDataStore.call(this, block.ctx.scope);
}

/**
 * Cleanup/unmount component
 *
 * @param {Context} context
 */
function componentCleanup(context, parent) {
    const componentIndex = parent.$components[context.exp].findIndex((c) => c.$context === context);
    if (componentIndex !== -1) {
        parent.$components[context.exp].splice(componentIndex, 1);
    }
}

/**
 * Mount component to the DOM, in place.
 *
 * @this {ReactiveComponent}
 * @param {HTMLElement|null} element
 * @return {void}
 */
function componentMount() {
    if (this.$reactive) {
        throw new Error('Reactivity already initialized for this instance');
    }

    const template = getTemplate.call(this);

    if (!template) {
        throw new Error('No template provided');
    }

    const mountedElement = document.importNode(template, true);
    nextTick(() => {
        const originalElement = this.$context.el;
        this.$context.el.replaceWith(mountedElement);
        this.$context.el = mountedElement;
        linkBlock.call(this, originalElement, mountedElement);

        // Prepare components
        prepareComponents(this, mountedElement);

        this.$app = createApp(this.$data)
            .directive('component', (context) => componentDirective(context, this, this.snowboard))
            .mount(mountedElement);
        this.$el = mountedElement;

        // Import next tick into plugin
        this.$nextTick = this.$data.$nextTick;

        // Prevent reactivity from being reset
        this.$reactive = true;
        Object.defineProperty(this, '$reactive', { configurable: false, writable: false });
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
function componentInitialize() {
    updateDataStore.call(this, this.$context.ctx.scope);
    componentMount.call(this);
}

/**
 * Directive to link components to a parent.
 *
 * @param {Context} context
 * @param {ReactivePluginBase|ReactiveSingleton} parent
 * @param {Snowboard} snowboard
 */
function componentDirective(context, parent, snowboard) {
    if (!parent.components || typeof parent.components !== 'function') {
        throw new Error('Components have not been defined on the parent.');
    }
    const components = parent.components();

    if (!components || !components[context.exp]) {
        snowboard.log(`Component ${context.exp} not found.`);
        context.el.parentNode.removeChild(context.el);
        return componentCleanup(context);
    }

    const pluginName = components[context.exp];

    if (!snowboard.hasPlugin(pluginName)) {
        snowboard.log(`Plugin name ${pluginName} has not been registered with Snowboard and cannot
        be used as a component.`);
        context.el.parentNode.removeChild(context.el);
        return componentCleanup(context);
    }

    parent.$components = parent.$components || {};

    if (!parent.$components[context.exp]) {
        parent.$components[context.exp] = [];
    }

    const instance = snowboard.getPlugin(pluginName).getInstance();
    instance.$context = context;
    instance.$parent = parent;
    componentInitialize.call(instance);
    parent.$components[context.exp].push(instance);

    return () => {
        componentCleanup(context, parent, snowboard);
    };
}

function componentConstructor() {
    /** @type {boolean} Whether reactivity is enabled on this object */
    this.$reactive = false;
    /** @type {Object.<string, any>} The reactive data store */
    this.$data = {};
    /** @type {HTMLElement|null} The mounted element */
    this.$el = null;
    /** @type {Object.<string, ReactivePluginBase[]>} The reactive data store */
    this.$components = {};
    /** @type {ReactivePluginBase|ReactiveSingleton} The parent instance */
    this.$parent = null;
    /** @type {Block} The block for this component */
    this.$block = null;
    /** @type {Object.<string, any>} The context of this component */
    this.$context = null;
}

export {
    prepareComponents,
    componentDirective,
    componentConstructor,
};
