import { PluginBase } from '@wintercms/snowboard';

/**
 * Control abstract.
 *
 * A Control instance is a class that can provide front-end functionality for HTML elements.
 * Controls are the primary way of abstracting front-end functionality in Snowboard, and encapsulate
 * logic for HTML components.
 *
 * @copyright 2024 Winter.
 * @author Ben Thomson <git@alfreido.com>
 * @abstract
 */
class Control extends PluginBase {
    /**
     * Constructor.
     *
     * The constructor is provided the Snowboard framework instance, and should not be overwritten
     * unless you absolutely know what you're doing.
     *
     * @param {Snowboard} snowboard
     */
    constructor(snowboard, element) {
        super(snowboard);
        this.snowboard = snowboard;
        this.destructed = false;

        /**
         * The element where the control is initialized.
         * @type {HTMLElement}
         */
        this.element = element;
    }

    /**
     * Plugin destructor (core)
     *
     * The destructor calls some necessary destruction steps, and should not be overwritten
     * unless you absolutely know what you're doing.
     */
    destructor() {
        this.element = undefined;

        super.destructor();
    }

    traits() {
        return ['Configurable'];
    }
}

export default Control;
