/**
 * @typedef {import('../abstracts/Control').default} Control
 */

import { Singleton } from '@wintercms/snowboard';

/**
 * Control handler.
 *
 * Handles the creation and disposal of controls on a page. Controls may be registered in this
 * handler to be created and disposed of automatically.
 *
 * @copyright 2024 Winter.
 * @author Ben Thomson <git@alfreido.com>
 */
export default class ControlHandler extends Singleton {
    /**
     * Constructor.
     */
    construct() {
        /**
         * Registered controls.
         * @type {Array.<{
         *  name: String, pluginName: String, control: Control, callback: Function
         * }>}
         */
        this.registeredControls = [];
        /**
         * The elements where controls have been initialized.
         * @type {Array.<{element: HTMLElement, control: String, instance: Control}>}}
         */
        this.elements = [];
        /**
         * Event handlers.
         * @type {Object.<string, function>}
         */
        this.events = {
            mutate: (mutations) => this.onMutation(mutations),
        };
        /**
         * Mutation observer.
         * @type {MutationObserver|null}
         */
        this.observer = null;
    }

    /**
     * Listeners.
     *
     * @returns {Object.<string, string>}
     */
    listens() {
        return {
            ready: 'onReady',
        };
    }

    /**
     * Ready handler.
     *
     * Initializes controls within the entire HTML body.
     */
    onReady() {
        this.initializeControls(document.body);

        // Register a DOM observer and watch for any removed nodes
        if (!this.observer) {
            this.observer = new MutationObserver(this.events.mutate);
            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    }

    /**
     * Destructor.
     *
     * Disconnects the observer if applicable.
     */
    destruct() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }

    /**
     * Registers a control.
     *
     * Registering a control will allow any element that contains a "data-control" attribute
     * matching the control name to be initialized with the given Control class.
     *
     * You may optionally provide a callback that will be fired when an instance of the control is
     * initialized - the callback will be provided the element and the control instance as
     * parameters.
     *
     * @param {String} name
     * @param {Control} control
     * @param {Function} callback
     */
    register(name, control, callback) {
        if (this.registeredControls.some((registered) => registered.control === control)) {
            throw new Error('Control already registered.');
        }

        // Assign a random plugin name for the control
        const pluginName = `control.${Math.random().toString(36).substring(2, 9)}${Math.random().toString(36).substring(2, 9)}`;
        this.snowboard.addPlugin(pluginName, control);

        this.registeredControls.push({
            name,
            pluginName,
            control,
            callback,
        });
    }

    /**
     * Unregisters a data control.
     *
     * This will remove the control from the list of registered widgets. It does not prevent any
     * already-initialized controls from continuing to function.
     *
     * @param {String} control
     */
    unregister(control) {
        this.registeredControls = this.registeredControls.filter(
            (widget) => widget.name !== control,
        );
    }

    /**
     * Initializes all controls within an element.
     *
     * If an element within contains a "data-control" attribute matching a registered control,
     * the control is initialized and attached to the element as a "control" property.
     *
     * Only one control may be initialized to a particular element.
     *
     * @param {HTMLElement} element
     */
    initializeControls(element) {
        this.registeredControls.forEach((control) => {
            const instances = element.querySelectorAll(
                `[data-control="${control.name}"]:not([data-control-initialized])`,
            );

            if (instances.length) {
                instances.forEach((instance) => {
                    // Prevent double-control initialization
                    if (instance.dataset.controlInitialized) {
                        return;
                    }

                    const controlInstance = this.snowboard[control.pluginName](instance);
                    this.elements.push({
                        element: instance,
                        control: control.name,
                        instance: controlInstance,
                    });
                    instance.dataset.controlInitialized = true;
                    instance.control = controlInstance;
                    this.snowboard.globalEvent('control.initialized', instance, controlInstance);

                    if (typeof control.callback === 'function') {
                        control.callback(controlInstance, instance);
                    }
                });
            }
        });
    }

    /**
     * Returns a control instance that is attached to the given element, if any.
     *
     * @param {HTMLElement} element
     * @returns {Control|null}
     */
    getControl(element) {
        const found = this.elements.find((control) => control.element === element);

        if (found) {
            return found.instance;
        }

        return null;
    }

    /**
     * Gets all instances of a control by name.
     *
     * @param {String} name
     * @returns {Control[]}
     */
    getInstances(name) {
        const registered = this.registeredControls.some((control) => control.name === name);

        if (!registered) {
            throw new Error(`Control "${name}" is not registered.`);
        }

        return this.elements
            .filter((element) => element.control === name)
            .map((element) => element.instance);
    }

    /**
     * Callback for mutation events.
     *
     * We're only tracking removed nodes, to ensure that those controls (and any controls of
     * descendant nodes) are disposed of.
     *
     * @param {MutationRecord[]} mutations
     */
    onMutation(mutations) {
        const removedNodes = mutations.filter(
            (mutation) => mutation.removedNodes.length,
        ).map(
            (mutation) => Array.from(mutation.removedNodes),
        ).flat();

        if (!removedNodes.length) {
            return;
        }

        removedNodes.forEach((node) => {
            const controls = this.elements.filter((control) => node.contains(control.element));

            if (controls.length) {
                controls.forEach((control) => {
                    control.instance.destructor();
                    this.elements = this.elements.filter((element) => element !== control);
                });
            }
        });
    }
}
