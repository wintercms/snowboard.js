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
function getTemplate() {
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
    getTemplate,
    template,
    mountTo,
};
