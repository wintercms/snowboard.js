import PluginBase from '../abstracts/PluginBase';
import Singleton from '../abstracts/Singleton';
import PluginLoader from './PluginLoader';

import Configurable from '../traits/Configurable';
import FiresEvents from '../traits/FiresEvents';
import AssetLoader from '../utilities/AssetLoader';
import Cookie from '../utilities/Cookie';
import JsonParser from '../utilities/JsonParser';
import Sanitizer from '../utilities/Sanitizer';
import Url from '../utilities/Url';

/**
 * Snowboard.js framework.
 *
 * Originally designed for [Winter CMS](https://wintercms.com), this framework represents the base
 * of a modern take on Javascript functionality management, with a focus on extensibility and
 * reusability without putting any restrictions on UI, and sharing many common practices with PHP
 * development.
 *
 * This version of the framework has been written as a standalone framework, untied to Winter CMS,
 * and can therefore be used in any web-based project.
 *
 * @copyright 2021 Winter.
 * @author Ben Thomson <git@alfreido.com>
 * @link https://wintercms.com/docs/snowboard/introduction
 */
export default class Snowboard {
    /**
     * Constructor.
     *
     * @param {boolean} debug Whether debugging logs should be shown. Default: `false`.
     */
    constructor(debug) {
        this.debugEnabled = (typeof debug === 'boolean' && debug === true);
        this.plugins = {};
        this.traits = {};
        this.listeners = {};
        this.foundBaseUrl = null;
        this.readiness = {
            dom: false,
        };
        // Seal readiness from being added to further, but allow the properties to be modified.
        Object.seal(this.readiness);
        this.attachAbstracts();

        // Freeze the Snowboard class to prevent further modifications.
        Object.freeze(Snowboard.prototype);
        Object.freeze(this);

        this.loadInbuilt();
        this.initialise();

        this.debug('Snowboard framework initialised');
    }

    /**
     * Attaches abstract classes as properties of the Snowboard class.
     *
     * This will allow Javascript functionality with no build process to still extend these
     * abstracts by prefixing them with "Snowboard".
     *
     * For example:
     *
     * ```
     * class MyClass extends Snowboard.PluginBase {
     *     ...
     * }
     * ```
     */
    attachAbstracts() {
        this.PluginBase = PluginBase;
        this.Singleton = Singleton;

        Object.freeze(this.PluginBase.prototype);
        Object.freeze(this.PluginBase);
        Object.freeze(this.Singleton.prototype);
        Object.freeze(this.Singleton);
    }

    /**
     * Loads the default traits and utilities.
     */
    loadInbuilt() {
        this.registerTrait('configurable', Configurable);
        this.registerTrait('firesEvents', FiresEvents);
        this.addPlugin('assetLoader', AssetLoader);
        this.addPlugin('cookie', Cookie);
        this.addPlugin('jsonParser', JsonParser);
        this.addPlugin('sanitizer', Sanitizer);
        this.addPlugin('url', Url);
    }

    /**
     * Initialises the framework.
     *
     * Attaches a listener for the DOM being ready and triggers a global "ready" event for plugins
     * to begin attaching themselves to the DOM.
     */
    initialise() {
        window.addEventListener('DOMContentLoaded', () => {
            this.initialiseSingletons();
            this.globalEvent('ready');
            this.readiness.dom = true;
        });
    }

    /**
     * Initialises an instance of every singleton.
     */
    initialiseSingletons() {
        Object.values(this.plugins).forEach((plugin) => {
            if (plugin.isSingleton() && plugin.dependenciesFulfilled()) {
                plugin.initialiseSingleton();
            }
        });
    }

    /**
     * Adds a plugin to the framework.
     *
     * Plugins are the cornerstone for additional functionality for Snowboard. A plugin must either
     * be an ES2015 class that extends the `PluginBase` or `Singleton` abstract classes, or a simple
     * callback function.
     *
     * When a plugin is added, it is automatically assigned as a new magic method in the Snowboard
     * class using the name parameter, and can be called via this method. This method will always be
     * the "lowercase" version of this name.
     *
     * For example, if a plugin is assigned to the name "myPlugin", it can be called via
     * `Snowboard.myplugin()`.
     *
     * @param {string} name
     * @param {PluginBase} instance
     */
    addPlugin(name, instance) {
        const lowerName = name.toLowerCase();

        if (this.hasPlugin(lowerName)) {
            throw new Error(`A plugin called "${name}" is already registered.`);
        }

        if (instance.prototype instanceof PluginBase === false) {
            throw new Error('The provided plugin must extend the PluginBase class');
        }

        if (this[name] !== undefined || this[lowerName] !== undefined) {
            throw new Error('The given name is already in use for a property or method of the Snowboard class.');
        }

        this.plugins[lowerName] = new PluginLoader(lowerName, this, instance);

        this.debug(`Plugin "${name}" registered`);

        // Check if any singletons now have their dependencies fulfilled, and fire their "ready"
        // handler if we're in a ready state.
        Object.values(this.getPlugins()).forEach((plugin) => {
            if (
                plugin.isSingleton()
                && !plugin.isInitialised()
                && plugin.dependenciesFulfilled()
                && plugin.hasMethod('listens')
                && Object.keys(plugin.callMethod('listens')).includes('ready')
                && this.readiness.dom
            ) {
                const readyMethod = plugin.callMethod('listens').ready;
                plugin.callMethod(readyMethod);
            }
        });
    }

    /**
     * Removes a plugin.
     *
     * Removes a plugin from Snowboard, calling the destructor method for all active instances of
     * the plugin.
     *
     * @param {string} name
     * @returns {void}
     */
    removePlugin(name) {
        const lowerName = name.toLowerCase();

        if (!this.hasPlugin(lowerName)) {
            this.debug(`Plugin "${name}" already removed`);
            return;
        }

        // Call destructors for all instances
        this.plugins[lowerName].getInstances().forEach((instance) => {
            instance.destructor();
        });

        delete this.plugins[lowerName];
        delete this[lowerName];
        delete this[name];

        this.debug(`Plugin "${name}" removed`);
    }

    /**
     * Determines if a plugin has been registered and is active.
     *
     * A plugin that is still waiting for dependencies to be registered will not be active.
     *
     * @param {string} name
     * @returns {boolean}
     */
    hasPlugin(name) {
        const lowerName = name.toLowerCase();

        return (this.plugins[lowerName] !== undefined);
    }

    /**
     * Returns an array of registered plugins as PluginLoader objects.
     *
     * @returns {PluginLoader[]}
     */
    getPlugins() {
        return this.plugins;
    }

    /**
     * Returns an array of registered plugins, by name.
     *
     * @returns {string[]}
     */
    getPluginNames() {
        return Object.keys(this.plugins);
    }

    /**
     * Returns a PluginLoader object of a given plugin.
     *
     * @returns {PluginLoader}
     */
    getPlugin(name) {
        const lowerName = name.toLowerCase();

        if (!this.hasPlugin(lowerName)) {
            throw new Error(`No plugin called "${lowerName}" has been registered.`);
        }

        return this.plugins[lowerName];
    }

    /**
     * Registers a trait with the framework.
     *
     * Traits are reusable classes that are merged into plugins that implement them. Upon
     * initialization of a plugin or singleton instance, after the instance is constructed, all
     * traits that are to be used will also be constructed, and their methods and properties will
     * be merged into the plugin instance.
     *
     * @param {string} name
     * @param {Object} instance
     */
    registerTrait(name, instance) {
        const lowerName = name.toLowerCase();

        if (this.hasTrait(lowerName)) {
            throw new Error(`A trait called "${name}" is already registered.`);
        }

        if (typeof instance !== 'function') {
            throw new Error('The provided trait must be a class.');
        }

        if (this[name] !== undefined || this[lowerName] !== undefined) {
            throw new Error('The given name is already in use for a property or method of the Snowboard class.');
        }

        this.traits[lowerName] = instance;

        this.debug(`Trait "${name}" registered`);
    }

    /**
     * Determines if a trait has been registered.
     *
     * @param {string} name
     * @returns {boolean}
     */
    hasTrait(name) {
        const lowerName = name.toLowerCase();

        return (this.traits[lowerName] !== undefined);
    }

    /**
     * Returns an array of registered traits as individual class objects.
     *
     * @returns {Object[]}
     */
    getTraits() {
        return this.traits;
    }

    /**
     * Finds all plugins that listen to the given event.
     *
     * This works for both normal and promise events. It does NOT check that the plugin's listener
     * actually exists.
     *
     * @param {string} eventName
     * @returns {string[]} The name of the plugins that are listening to this event.
     */
    listensToEvent(eventName) {
        const plugins = [];

        Object.entries(this.plugins).forEach((entry) => {
            const [name, plugin] = entry;

            if (!plugin.dependenciesFulfilled()) {
                return;
            }

            const listeners = plugin.callMethod('listens');

            if (typeof listeners[eventName] === 'string' || typeof listeners[eventName] === 'function') {
                plugins.push(name);
            }
        });

        return plugins;
    }

    /**
     * Add a simple ready listener.
     *
     * Synonymous with jQuery's "$(document).ready()" functionality, this allows inline scripts to
     * attach themselves to Snowboard immediately but only fire when the DOM is ready.
     *
     * @param {Function} callback
     */
    ready(callback) {
        if (this.readiness.dom) {
            callback();
        }

        this.on('ready', callback);
    }

    /**
     * Adds a simple listener for an event.
     *
     * This can be used for ad-hoc scripts that don't need a full plugin. The given callback will be
     * called when the event name provided fires. This works for both normal and Promise events. For
     * a Promise event, your callback must return a Promise.
     *
     * @param {String} eventName
     * @param {Function} callback
     */
    on(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }

        if (!this.listeners[eventName].includes(callback)) {
            this.listeners[eventName].push(callback);
        }
    }

    /**
     * Removes a simple listener for an event.
     *
     * @param {String} eventName
     * @param {Function} callback
     */
    off(eventName, callback) {
        if (!this.listeners[eventName]) {
            return;
        }

        const index = this.listeners[eventName].indexOf(callback);
        if (index === -1) {
            return;
        }

        this.listeners[eventName].splice(index, 1);
    }

    /**
     * Calls a global event to all registered plugins.
     *
     * If any plugin returns a `false`, the event is considered cancelled.
     *
     * @param {string} eventName
     * @returns {boolean} If event was not cancelled
     */
    globalEvent(eventName, ...parameters) {
        this.debug(`Calling global event "${eventName}"`, ...parameters);

        let cancelled = false;

        // Find plugins listening to the event.
        const listeners = this.listensToEvent(eventName);
        if (listeners.length === 0) {
            this.debug(`No listeners found for global event "${eventName}"`);
        } else {
            this.debug(`Listeners found for global event "${eventName}": ${listeners.join(', ')}`);

            listeners.forEach((name) => {
                const plugin = this.getPlugin(name);

                if (plugin.isSingleton() && plugin.getInstances().length === 0) {
                    plugin.initialiseSingleton();
                }

                const listenMethod = plugin.callMethod('listens')[eventName];

                // Call event handler methods for all plugins, if they have a method specified for
                // the event.
                plugin.getInstances().forEach((instance) => {
                    // If a plugin has cancelled the event, no further plugins are considered.
                    if (cancelled) {
                        return;
                    }

                    if (typeof listenMethod === 'function') {
                        try {
                            const result = listenMethod.apply(instance, parameters);
                            if (result === false) {
                                cancelled = true;
                            }
                        } catch (error) {
                            this.error(
                                `Error thrown in "${eventName}" event by "${name}" plugin.`,
                                error,
                            );
                        }
                    } else if (typeof listenMethod === 'string') {
                        if (!instance[listenMethod]) {
                            throw new Error(`Missing "${listenMethod}" method in "${name}" plugin`);
                        }

                        try {
                            if (instance[listenMethod](...parameters) === false) {
                                cancelled = true;
                                this.debug(`Global event "${eventName}" cancelled by "${name}" plugin`);
                            }
                        } catch (error) {
                            this.error(
                                `Error thrown in "${eventName}" event by "${name}" plugin.`,
                                error,
                            );
                        }
                    } else {
                        this.error(`Listen method for "${eventName}" event in "${name}" plugin is not a function or string.`);
                    }
                });
            });
        }

        // Find ad-hoc listeners for this event.
        if (!cancelled && this.listeners[eventName] && this.listeners[eventName].length > 0) {
            this.debug(`Found ${this.listeners[eventName].length} ad-hoc listener(s) for global event "${eventName}"`);

            this.listeners[eventName].forEach((listener) => {
                // If a listener has cancelled the event, no further listeners are considered.
                if (cancelled) {
                    return;
                }

                try {
                    if (listener(...parameters) === false) {
                        cancelled = true;
                        this.debug(`Global event "${eventName} cancelled by an ad-hoc listener.`);
                    }
                } catch (error) {
                    this.error(
                        `Error thrown in "${eventName}" event by an ad-hoc listener.`,
                        error,
                    );
                }
            });
        }

        return !cancelled;
    }

    /**
     * Calls a global event to all registered plugins, expecting a Promise to be returned by all.
     *
     * This collates all plugins responses into one large Promise that either expects all to be
     * resolved, or one to reject.
     *
     * If no listeners are found, a resolved Promise is returned.
     *
     * @param {string} eventName
     */
    globalPromiseEvent(eventName, ...parameters) {
        this.debug(`Calling global promise event "${eventName}"`);

        const promises = [];

        // Find plugins listening to this event.
        const listeners = this.listensToEvent(eventName);
        if (listeners.length === 0) {
            this.debug(`No listeners found for global promise event "${eventName}"`);
        } else {
            this.debug(`Listeners found for global promise event "${eventName}": ${listeners.join(', ')}`);

            listeners.forEach((name) => {
                const plugin = this.getPlugin(name);

                if (plugin.isSingleton() && plugin.getInstances().length === 0) {
                    plugin.initialiseSingleton();
                }

                const listenMethod = plugin.callMethod('listens')[eventName];

                // Call event handler methods for all plugins, if they have a method specified for
                // the event.
                plugin.getInstances().forEach((instance) => {
                    if (typeof listenMethod === 'function') {
                        try {
                            const instancePromise = listenMethod.apply(instance, parameters);

                            if (instancePromise instanceof Promise === false) {
                                return;
                            }

                            promises.push(instancePromise);
                        } catch (error) {
                            this.error(
                                `Error thrown in "${eventName}" event by "${name}" plugin.`,
                                error,
                            );
                        }
                    } else if (typeof listenMethod === 'string') {
                        if (!instance[listenMethod]) {
                            throw new Error(`Missing "${listenMethod}" method in "${name}" plugin`);
                        }

                        try {
                            const instancePromise = instance[listenMethod](...parameters);

                            if (instancePromise instanceof Promise === false) {
                                return;
                            }

                            promises.push(instancePromise);
                        } catch (error) {
                            this.error(
                                `Error thrown in "${eventName}" promise event by "${name}" plugin.`,
                                error,
                            );
                        }
                    } else {
                        this.error(`Listen method for "${eventName}" event in "${name}" plugin is not a function or string.`);
                    }
                });
            });
        }

        // Find ad-hoc listeners listening to this event.
        if (this.listeners[eventName] && this.listeners[eventName].length > 0) {
            this.debug(`Found ${this.listeners[eventName].length} ad-hoc listener(s) for global promise event "${eventName}"`);

            this.listeners[eventName].forEach((listener) => {
                try {
                    const listenerPromise = listener(...parameters);
                    if (listenerPromise instanceof Promise === false) {
                        return;
                    }

                    promises.push(listenerPromise);
                } catch (error) {
                    this.error(
                        `Error thrown in "${eventName}" promise event by an ad-hoc listener.`,
                        error,
                    );
                }
            });
        }

        if (promises.length === 0) {
            return Promise.resolve();
        }

        return Promise.all(promises);
    }

    /**
     * Log a styled message in the console.
     *
     * Includes parameters and a stack trace.
     *
     * @returns {void}
     */
    logMessage(color, bold, message, ...parameters) {
        /* eslint-disable */
        console.groupCollapsed(
            '%c[Snowboard]',
            `color: ${color}; font-weight: ${(bold) ? 'bold' : 'normal'};`,
            message
        );
        if (parameters.length) {
            console.groupCollapsed(
                `%cParameters %c(${parameters.length})`,
                'color: rgb(45, 167, 199); font-weight: bold;',
                'color: rgb(88, 88, 88); font-weight: normal;'
            );
            let index = 0;
            parameters.forEach((param) => {
                index += 1;
                console.log(`%c${index}:`, 'color: rgb(88, 88, 88); font-weight: normal;', param);
            });
            console.groupEnd();

            console.groupCollapsed('%cTrace', 'color: rgb(45, 167, 199); font-weight: bold;');
            console.trace();
            console.groupEnd();
        } else {
            console.trace();
        }
        console.groupEnd();
        /* eslint-enable */
    }

    /**
     * Log a message.
     *
     * @returns {void}
     */
    log(message, ...parameters) {
        this.logMessage('rgb(45, 167, 199)', false, message, ...parameters);
    }

    /**
     * Log a debug message.
     *
     * These messages are only shown when debugging is enabled.
     *
     * @returns {void}
     */
    debug(message, ...parameters) {
        if (!this.debugEnabled) {
            return;
        }

        this.logMessage('rgb(45, 167, 199)', false, message, ...parameters);
    }

    /**
     * Log a warning message.
     *
     * These messages are only shown when debugging is enabled.
     *
     * @returns {void}
     */
    warning(message, ...parameters) {
        if (!this.debugEnabled) {
            return;
        }

        this.logMessage('rgb(229, 179, 71)', true, message, ...parameters);
    }

    /**
     * Logs an error message.
     *
     * @returns {void}
     */
    error(message, ...parameters) {
        this.logMessage('rgb(211, 71, 71)', true, message, ...parameters);
    }
}
