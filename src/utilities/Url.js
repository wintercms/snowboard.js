import Singleton from '../abstracts/Singleton';

/**
 * URL utility.
 *
 * This utility provides URL functions.
 *
 * @copyright 2022 Winter.
 * @author Ben Thomson <git@alfreido.com>
 */
export default class Url extends Singleton {
    construct() {
        this.foundBaseUrl = null;
        this.foundAssetUrl = null;
        this.determineUrls();
    }

    /**
     * Gets a URL based on a relative path.
     *
     * If an absolute URL is provided, it will be returned unchanged.
     *
     * @param {string} url
     * @returns {string}
     */
    to(url) {
        const urlRegex = /^(?:[^:]+:\/\/)[-a-z0-9@:%._+~#=]{1,256}\b([-a-z0-9()@:%_+.~#?&//=]*)/i;

        if (url.match(urlRegex)) {
            return url;
        }

        const theUrl = url.replace(/^\/+/, '');

        return `${this.baseUrl()}${theUrl}`;
    }

    /**
     * Gets an Asset URL based on a relative path.
     *
     * If an absolute URL is provided, it will be returned unchanged.
     *
     * @param {string} url
     * @returns {string}
     */
    asset(url) {
        const urlRegex = /^(?:[^:]+:\/\/)[-a-z0-9@:%._+~#=]{1,256}\b([-a-z0-9()@:%_+.~#?&//=]*)/i;

        if (url.match(urlRegex)) {
            return url;
        }

        const theUrl = url.replace(/^\/+/, '');

        return `${this.assetUrl()}${theUrl}`;
    }

    /**
     * Gets the base URL.
     *
     * @returns {string}
     */
    baseUrl() {
        return this.foundBaseUrl;
    }

    /**
     * Gets the asset URL.
     *
     * @returns {string}
     */
    assetUrl() {
        return this.foundAssetUrl;
    }

    /**
     * Determines the base and asset URLs.
     *
     * This determines the URLs from three sources, in order:
     *  - If Snowboard is loaded via a script tag and it has a `data-base-url` and `data-asset-url`
     *    attribute, it will use these values accordingly.
     *  - If a `<base>` tag is available, it will use the URL specified in the base tag for both
     *    the base URL and asset URL.
     *  - Finally, it will take a guess from the current location origin. This will likely not work
     *    for sites that reside in subdirectories.
     *
     * The base URL will always contain a trailing backslash.
     *
     * @returns {string}
     */
    determineUrls() {
        if (document.currentScript && document.currentScript.dataset.baseUrl !== null) {
            this.foundBaseUrl = this.validateBaseUrl(document.currentScript.dataset.baseUrl);
        }
        if (document.currentScript && document.currentScript.dataset.assetUrl !== null) {
            this.foundAssetUrl = this.validateBaseUrl(document.currentScript.dataset.assetUrl);
        }

        if (document.querySelector('base') !== null) {
            this.foundBaseUrl = this.validateBaseUrl(
                document.querySelector('base').getAttribute('href'),
            );
            this.foundAssetUrl = this.foundBaseUrl;
        }

        this.foundBaseUrl = window.location.origin;
        this.foundAssetUrl = this.foundBaseUrl;
    }

    /**
     * Validates the base URL, ensuring it is a HTTP/HTTPs URL.
     *
     * If the Snowboard script or <base> tag on the page use a different type of URL, this will fail
     * with an error.
     *
     * @param {string} url
     * @returns {string}
     */
    validateBaseUrl(url) {
        const urlRegex = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/i;
        const urlParts = urlRegex.exec(url);
        const protocol = urlParts[2];
        const domain = urlParts[4];

        if (protocol && ['http', 'https'].indexOf(protocol.toLowerCase()) === -1) {
            throw new Error('Invalid base URL detected');
        }
        if (!domain) {
            throw new Error('Invalid base URL detected');
        }

        return (url.substring(-1) === '/')
            ? url
            : `${url}/`;
    }
}
