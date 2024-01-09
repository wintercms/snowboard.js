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
    construct(element) {
        /**
         * The element where the control is initialized.
         * @type {HTMLElement}
         */
        this.element = element;
    }

    traits() {
        return ['Configurable'];
    }
}

export default Control;
