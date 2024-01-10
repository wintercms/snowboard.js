import TestInstance from '../../src/main/Snowboard';

describe('AssetLoader utility', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/fixtures/assets/';

        window.Snowboard = new TestInstance();
    });

    afterEach(() => {
        window.Snowboard.tearDown();
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

    it('throws an error event if a script fails to load', async () => {
        expect.assertions(4);

        // Test global event fired when asset is loaded
        const eventResolver = new Promise((resolve) => {
            Snowboard.on('assetLoader.error', (type, asset, element) => {
                resolve({
                    type,
                    asset,
                    element,
                });
            });
        });

        const promise = Snowboard.assetLoader().load({
            js: [
                'https://fail.com/test.js',
            ],
        });

        expect(promise).toBeInstanceOf(Promise);
        const script = document.querySelector('script[src="https://fail.com/test.js"]');
        expect(script).not.toBeNull();

        const result = await promise.then(() => true).catch(() => false);
        const resolved = await eventResolver.then((data) => data);

        expect(result).toEqual(false);
        expect(resolved).toEqual({
            type: 'script',
            asset: 'https://fail.com/test.js',
            element: script,
        });
    });

    it('can load a stylesheet', async () => {
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
            css: '/test.css',
        });

        expect(promise).toBeInstanceOf(Promise);
        const link = document.querySelector('link[rel="stylesheet"][href="https://example.com/fixtures/assets/test.css"]');
        expect(link).not.toBeNull();

        const result = await promise.then(() => true).catch(() => false);
        const resolved = await eventResolver.then((data) => data);

        expect(result).toEqual(true);
        expect(resolved.type).toEqual('style');
        expect(resolved.asset).toEqual('/test.css');
        expect(resolved.element).toEqual(link);
    });

    it('can load multiple stylesheets', async () => {
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
            css: [
                '/test.css',
                'http://example.io/test2.css',
            ],
        });

        expect(promise).toBeInstanceOf(Promise);
        const css1 = document.querySelector('link[rel="stylesheet"][href="https://example.com/fixtures/assets/test.css"]');
        expect(css1).not.toBeNull();
        const css2 = document.querySelector('link[rel="stylesheet"][href="http://example.io/test2.css"]');
        expect(css2).not.toBeNull();

        const result = await promise.then(() => true).catch(() => false);
        const resolved = await eventResolver.then((data) => data);

        expect(result).toEqual(true);
        expect(resolved).toHaveLength(2);
        expect(resolved[0].type).toEqual('style');
        expect(resolved[0].asset).toEqual('/test.css');
        expect(resolved[0].element).toEqual(css1);
        expect(resolved[1].type).toEqual('style');
        expect(resolved[1].asset).toEqual('http://example.io/test2.css');
        expect(resolved[1].element).toEqual(css2);
    });

    it('throws an error event if a stylesheet fails to load', async () => {
        expect.assertions(4);

        // Test global event fired when asset is loaded
        const eventResolver = new Promise((resolve) => {
            Snowboard.on('assetLoader.error', (type, asset, element) => {
                resolve({
                    type,
                    asset,
                    element,
                });
            });
        });

        const promise = Snowboard.assetLoader().load({
            css: [
                'https://fail.com/test.css',
            ],
        });

        expect(promise).toBeInstanceOf(Promise);
        const style = document.querySelector('link[rel="stylesheet"][href="https://fail.com/test.css"]');
        expect(style).not.toBeNull();

        const result = await promise.then(() => true).catch(() => false);
        const resolved = await eventResolver.then((data) => data);

        expect(result).toEqual(false);
        expect(resolved).toEqual({
            type: 'style',
            asset: 'https://fail.com/test.css',
            element: style,
        });
    });

    it('can load images but not insert them into the DOM', async () => {
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
            img: [
                '/test.png',
            ],
        });

        expect(promise).toBeInstanceOf(Promise);

        const result = await promise.then(() => true).catch(() => false);
        const resolved = await eventResolver.then((data) => data);

        expect(result).toEqual(true);
        expect(resolved.type).toEqual('image');
        expect(resolved.asset).toEqual('/test.png');
        expect(resolved.element).toBeInstanceOf(Image);
        expect(resolved.element.src).toEqual('https://example.com/fixtures/assets/test.png');
    });

    it('throws an error event if an image fails to load', async () => {
        expect.assertions(6);

        // Test global event fired when asset is loaded
        const eventResolver = new Promise((resolve) => {
            Snowboard.on('assetLoader.error', (type, asset, element) => {
                resolve({
                    type,
                    asset,
                    element,
                });
            });
        });

        const promise = Snowboard.assetLoader().load({
            img: [
                'https://fail.com/test.png',
            ],
        });

        expect(promise).toBeInstanceOf(Promise);

        const result = await promise.then(() => true).catch(() => false);
        const resolved = await eventResolver.then((data) => data);

        expect(result).toEqual(false);
        expect(resolved.type).toEqual('image');
        expect(resolved.asset).toEqual('https://fail.com/test.png');
        expect(resolved.element).toBeInstanceOf(Image);
        expect(resolved.element.src).toEqual('https://fail.com/test.png');
    });

    afterEach(() => {
        document.querySelectorAll('link').forEach((link) => {
            link.remove();
        });
        document.querySelectorAll('script').forEach((script) => {
            script.remove();
        });
    });
});
