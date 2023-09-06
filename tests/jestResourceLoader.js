const {ResourceLoader} = require('jsdom');
const {Image} = require('canvas');

/**
 * Custom resource loader for Jest/JSDOM.
 *
 * Mainly used for the AssetLoader utility tests, this allows us to mock certain URLs to respond
 * with custom responses for assets.
 */
class JestResourceLoader extends ResourceLoader {
    fetch(url, options) {
        // Successful JavaScript loads
        if (
            (url.startsWith('https://example.com/') || url.startsWith('http://example.io/'))
            && url.endsWith('.js')
        ) {
            return Promise.resolve(Buffer.from('// Test script'));
        }

        // Failed JavaScript loads
        if (
            (url.startsWith('https://fail.com/'))
            && url.endsWith('.js')
        ) {
            return Promise.reject(new Error('Failed to load script'));
        }

        // Successful stylesheet loads
        if (
            (url.startsWith('https://example.com/') || url.startsWith('http://example.io/'))
            && url.endsWith('.css')
        ) {
            return Promise.resolve(Buffer.from('/* --- Test stylesheet */'));
        }

        // Failed stylesheet loads
        if (
            (url.startsWith('https://fail.com/'))
            && url.endsWith('.css')
        ) {
            return Promise.reject(new Error('Failed to load stylesheet'));
        }

        // Successful image loads
        if (
            (url.startsWith('https://example.com/') || url.startsWith('http://example.io/'))
            && url.endsWith('.png')
        ) {
            const img = new Image();
            img.src = 'data:image/jpeg;base64,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';
            return Promise.resolve(img);
        }

        // Failed images loads
        if (
            (url.startsWith('https://fail.com/'))
            && url.endsWith('.png')
        ) {
            return Promise.reject(new Error('Failed to load image'));
        }

        return super.fetch(url, options);
    }
}

module.exports = JestResourceLoader;
