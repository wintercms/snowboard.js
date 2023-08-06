const {ResourceLoader} = require('jsdom');

/**
 * Custom resource loader for Jest/JSDOM.
 *
 * Mainly used for the AssetLoader utility tests, this allows us to mock certain URLs to respond
 * with custom responses for assets.
 */
class JestResourceLoader extends ResourceLoader {
    fetch(url, options) {
        if (
            (url.startsWith('https://example.com/') || url.startsWith('http://example.io/'))
            && url.endsWith('.js')
        ) {
            return Promise.resolve(Buffer.from('// Test script'));
        }

        return super.fetch(url, options);
    }
}

module.exports = JestResourceLoader;
