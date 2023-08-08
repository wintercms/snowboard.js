import JSON5 from 'json5';
import Singleton from '../abstracts/Singleton';

/**
 * JSON Parser utility.
 *
 * This utility parses JSON-like data that does not strictly meet the JSON specifications in order
 * to simplify development. It uses the JSON5 library under the hood, but adds in some additional
 * parsing logic (in order of precedence):
 *
 * - An unquoted string, without a comma, colon, or object or array boundaries, will be considered
 *   a string. ie: `foo` will be considered `"foo"`.
 * - A string that is not quoted but contains a colon and is not wrapped with object boundaries,
 *   will be considered an object. ie: `foo: bar, baz: buzz` will be considered `"{"foo": "bar",
 *   "baz": "buzz"}"`.
 * - A string that is not quoted but contains a comma and is not wrapped with array boundaries,
 *   will be considered an array. ie: `foo, bar, baz` will be considered `["foo", "bar", "baz"]`.
 *
 * @author Ben Thomson <git@alfreido.com>
 */
export default class JsonParser extends Singleton {
    parse(str) {
        // Handle special cases
        if (str === 'undefined') {
            return undefined;
        }

        try {
            // First pass at parsing
            return JSON5.parse(str);
        } catch (e) {
            // Try to prepare string and then parse again
            const jsonString = this.prepareString(String(str));

            return JSON5.parse(jsonString);
        }
    }

    /**
     * Prepares a string for a second-pass at parsing.
     *
     * @param {string} str
     * @returns {string}
     */
    prepareString(str) {
        // Unquoted string that is definitely not an object or array
        if (str.match(/^[^,:{}[\]]+$/)) {
            return `"${str}"`;
        }

        // Remove all boundaries and whitespace to guess if an object or an array
        const stripped = str.replace(/(\s|'[^'+]'|"[^"+]"|\{[^}+]\}|\[[^\]+]\])/g, '');

        // Object
        if (stripped.includes(':')) {
            return `{${str}}`;
        }

        return `[${str}]`;
    }
}
