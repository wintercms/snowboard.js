/**
 * @typedef {import('petite-vue/dist/types/context').Context} Context
 * @typedef {import('../abstracts/ReactivePluginBase').default} ReactivePluginBase
 * @typedef {import('../abstracts/ReactiveSingleton').default} ReactiveSingleton
 */

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
                    templateElement.setAttribute(name, value);
                }
            }

            componentElement.replaceWith(templateElement);
        });
    });
}

/**
 * Cleanup/unmount component
 *
 * @param {Context} context
 */
function componentCleanup(/* context */) {
}

/**
 * Directive to link components to a parent.
 *
 * @param {Context} context
 * @param {ReactivePluginBase|ReactiveSingleton} parent
 */
function componentDirective(context /* , parent */) {
    // const scopeKeys = Object.getOwnPropertyNames(context.ctx.scope);

    return () => {
        componentCleanup(context);
    };
}

export {
    prepareComponents,
    componentDirective,
};
