import TestInstance from '../../src/main/Snowboard';
import ProxyHandler from '../../src/main/ProxyHandler';

describe('AssetLoader utility', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/fixtures/assets/';

        window.Snowboard = new Proxy(
            new TestInstance(),
            ProxyHandler,
        );
    });

    it('can load a script', async () => {
        expect.assertions(6);

        // Test global event fired when asset is loaded
        const eventResolver = new Promise((resolve) => {
            Snowboard.on('assetLoader.loaded', (type, asset, element) => {
                resolve({
                    type,
                    asset,
                    element,
                });
            });
        });

        const promise = Snowboard.assetLoader().load({
            js: '/test.js',
        });

        expect(promise).toBeInstanceOf(Promise);
        const script = document.querySelector('script[src="https://example.com/fixtures/assets/test.js"]');
        expect(script).not.toBeNull();

        const result = await promise.then(() => true).catch(() => false);
        const resolved = await eventResolver.then((data) => data);

        expect(result).toEqual(true);
        expect(resolved.type).toEqual('script');
        expect(resolved.asset).toEqual('/test.js');
        expect(resolved.element).toEqual(script);
    });

    it('can load multiple scripts', async () => {
        expect.assertions(11);

        // Test global event fired when asset is loaded
        const eventResolver = new Promise((resolve) => {
            const resolved = [];

            Snowboard.on('assetLoader.loaded', (type, asset, element) => {
                resolved.push({
                    type,
                    asset,
                    element,
                });
                if (resolved.length === 2) {
                    resolve(resolved);
                }
            });
        });

        const promise = Snowboard.assetLoader().load({
            js: [
                '/test.js',
                'http://example.io/test2.js',
            ],
        });

        expect(promise).toBeInstanceOf(Promise);
        const script1 = document.querySelector('script[src="https://example.com/fixtures/assets/test.js"]');
        expect(script1).not.toBeNull();
        const script2 = document.querySelector('script[src="http://example.io/test2.js"]');
        expect(script2).not.toBeNull();

        const result = await promise.then(() => true).catch(() => false);
        const resolved = await eventResolver.then((data) => data);

        expect(result).toEqual(true);
        expect(resolved).toHaveLength(2);
        expect(resolved[0].type).toEqual('script');
        expect(resolved[0].asset).toEqual('/test.js');
        expect(resolved[0].element).toEqual(script1);
        expect(resolved[1].type).toEqual('script');
        expect(resolved[1].asset).toEqual('http://example.io/test2.js');
        expect(resolved[1].element).toEqual(script2);
    });

    afterEach(() => {
        document.querySelectorAll('script').forEach((script) => {
            script.remove();
        });
    });
});
