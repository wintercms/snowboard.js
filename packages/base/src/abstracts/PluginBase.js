/**
 * Plugin base abstract.
 *
 * This class provides the base functionality for all plugins.
 *
 * @copyright 2021 Winter.
 * @author Ben Thomson <git@alfreido.com>
 */
export default class PluginBase {
    /**
     * Constructor.
     *
     * The constructor is provided the Snowboard framework instance, and should not be overwritten
     * unless you absolutely know what you're doing.
     *
     * @param {Snowboard} snowboard
     */
    constructor(snowboard) {
        this.snowboard = snowboard;
        this.destructed = false;
    }

    /**
     * Plugin constructor.
     *
     * This method should be treated as the true constructor of a plugin, and can be overwritten.
     * It will be called straight after construction, but before traits are loaded, allowing you
     * to define any required properties needed for the traits.
     */
    construct() {
    }

    /**
     * Plugin initializer.
     *
     * This method is call after construction is complete and after traits are loaded. It can be
     * used to run any functionality that you want available immediately after the plugin instance
     * is ready to use.
     */
    init() {
    }

    /**
     * Defines the required plugins for this specific module to work.
     *
     * @returns {string[]} An array of plugins required for this module to work, as strings.
     */
    dependencies() {
        return [];
    }

    /**
     * Defines the listener methods for global events.
     *
     * @returns {Object}
     */
    listens() {
        return {};
    }

    /**
     * Plugin destructor.
     *
     * Fired when this plugin is removed. Can be manually called if you have another scenario for
     * destruction, ie. the element attached to the plugin is removed or changed.
     *
     * This method should be treated as the true destructor of a plugin, and can be overwritten.
     */
    destruct() {
    }

    /**
     * Plugin destructor (core)
     *
     * The destructor calls some necessary destruction steps, and should not be overwritten
     * unless you absolutely know what you're doing.
     */
    destructor() {
        this.destruct();
        this.detach();
        delete this.snowboard;
        this.destructed = true;
    }
}
