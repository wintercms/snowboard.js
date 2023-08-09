/**
 * Data configuration provider.
 *
 * Provides a mechanism for passing configuration data through an element's data attributes. This
 * is generally used for widgets or UI interactions to configure them.
 *
 * @copyright 2022 Winter.
 * @author Ben Thomson <git@alfreido.com>
 */
export default class Configurable {
    /**
     * Trait constructor and definition.
     */
    constructor() {
        this.instanceConfig = {};
        this.acceptedConfigs = {};
    }

    /**
     * Instance constructor.
     */
    construct(options) {
        if (this.element instanceof HTMLElement === false) {
            throw new Error('Data configuration can only be extracted from HTML elements');
        }

        // Lock acceptAllDataConfigs to prevent it from being changed externally
        Object.defineProperty(this, 'acceptAllDataConfigs', {
            enumerable: true,
            writable: false,
            configurable: false,
            value: (options.acceptAllDataConfigs || false),
        });

        this.refreshConfig();
    }

    /**
     * Provide empty defaults in the plugin instance does not contain a `defaults()` method.
     */
    defaults() {
        return {};
    }

    /**
     * Gets the config for this instance.
     *
     * If the `config` parameter is unspecified, returns the entire configuration.
     *
     * @param {string} config
     */
    getConfig(config) {
        if (config === undefined) {
            return this.instanceConfig;
        }

        if (this.instanceConfig[config] !== undefined) {
            return this.instanceConfig[config];
        }

        return undefined;
    }

    /**
     * Sets the config for this instance.
     *
     * This allows you to override, at runtime, any configuration value as necessary.
     *
     * @param {string} config
     * @param {any} value
     * @param {boolean} persist
     */
    setConfig(config, value, persist) {
        if (config === undefined) {
            throw new Error('You must provide a configuration key to set');
        }

        this.instanceConfig[config] = value;

        if (persist === true) {
            this.element.dataset[config] = value;
        }
    }

    /**
     * Refreshes the configuration from the element.
     *
     * This will allow you to make changes to the data config on a DOM level and re-apply them
     * to the config on the JavaScript side.
     */
    refreshConfig() {
        this.acceptedConfigs = this.getAcceptedConfigs();
        this.instanceConfig = this.processConfig();
    }

    /**
     * Determines the available configurations that can be set through the data config.
     *
     * If an instance has an `acceptAllDataConfigs` property, set to `true`, then all data
     * attributes will be available as configuration values. This can be a security concern, so
     * tread carefully.
     *
     * Otherwise, available configurations will be determined by the keys available in an object
     * returned by a `defaults()` method in the instance.
     *
     * @returns {string[]|boolean}
     */
    getAcceptedConfigs() {
        if (
            this.acceptAllDataConfigs !== undefined
            && this.acceptAllDataConfigs === true
        ) {
            return true;
        }

        if (typeof this.defaults() === 'object') {
            return Object.keys(this.defaults());
        }

        return false;
    }

    /**
     * Returns the default values for the instance.
     *
     * This will be an empty object if the instance either does not have a `defaults()` method, or
     * the method itself does not return an object.
     *
     * @returns {object}
     */
    getDefaultConfig() {
        if (typeof this.defaults() === 'object') {
            return this.defaults();
        }

        return {};
    }

    /**
     * Processes the configuration.
     *
     * Loads up the defaults, then populates it with any configuration values provided by the data
     * attributes, based on the rules of the accepted configurations.
     *
     * This configuration object is then cached and available through `config.get()` calls.
     *
     * @returns {object}
     */
    processConfig() {
        const config = this.getDefaultConfig();

        if (this.acceptedConfigs === false) {
            return config;
        }

        /* eslint-disable */
        for (const key in this.element.dataset) {
            if (this.acceptedConfigs === true || this.acceptedConfigs.includes(key)) {
                config[key] = this.coerceConfigValue(this.element.dataset[key], config[key]);
            }
        }
        /* eslint-enable */

        return config;
    }

    /**
     * Coerces configuration values for JavaScript.
     *
     * Takes the string value returned from the data attribute and coerces it into a more suitable
     * type for JavaScript processing.
     *
     * @param {*} value
     * @param {*} defaultValue
     * @returns {*}
     */
    coerceConfigValue(value, defaultValue) {
        const stringValue = String(value);

        // Null value
        if (stringValue === 'null') {
            return null;
        }

        // Undefined value
        if (stringValue === 'undefined') {
            return undefined;
        }

        // Base64 value
        if (stringValue.startsWith('base64:')) {
            const base64str = stringValue.replace(/^base64:/, '');
            const decoded = atob(base64str);
            return this.coerceConfigValue(decoded);
        }

        // Boolean value
        if (['true', 'yes'].includes(stringValue.toLowerCase())) {
            return true;
        }
        if (['false', 'no'].includes(stringValue.toLowerCase())) {
            return false;
        }

        // Numeric value
        if (/^[-+]?[0-9]+(\.[0-9]+)?$/.test(stringValue)) {
            if (defaultValue !== undefined && typeof defaultValue === 'boolean') {
                // If the default value is boolean and we have a 1 or a 0, coerce to boolean.
                if (['0', '1'].includes(stringValue)) {
                    return (Number(stringValue) === 1);
                }
            }
            return Number(stringValue);
        }

        // JSON value
        try {
            return this.snowboard.jsonParser().parse(stringValue, true);
        } catch (e) {
            return (stringValue === '') ? true : stringValue;
        }
    }
}
