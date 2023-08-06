import FakeDom from '../helpers/FakeDom';

describe('PluginLoader class', () => {
    it('can mock plugin methods', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
            ])
            .render();

        dom.window.Snowboard.getPlugin('sanitizer').mock('sanitize', () => 'all good');

        expect(
            dom.window.Snowboard.sanitizer().sanitize('<p onload="derp;"></p>'),
        ).toEqual('all good');

        // Test unmock
        dom.window.Snowboard.getPlugin('sanitizer').unmock('sanitize');

        expect(
            dom.window.Snowboard.sanitizer().sanitize('<p onload="derp;"></p>'),
        ).toEqual('<p></p>');
    });

    it('is frozen on construction and doesn\'t allow prototype pollution', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
            ])
            .render();

        const loader = dom.window.Snowboard.getPlugin('sanitizer');

        expect(() => {
            loader.newMethod = () => true;
        }).toThrow(TypeError);

        expect(() => {
            loader.newProperty = 'test';
        }).toThrow(TypeError);

        expect(() => {
            loader.singleton.test = 'test';
        }).toThrow(TypeError);

        expect(loader.newMethod).toBeUndefined();
        expect(loader.newProperty).toBeUndefined();
    });

    it('should prevent modification of root instances', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
                'tests/fixtures/framework/TestPlugin.js',
                'tests/fixtures/framework/TestSingleton.js',
            ])
            .render();

        const rootInstance = dom.window.Snowboard.getPlugin('testPlugin').instance;

        expect(() => {
            rootInstance.newMethod = () => true;
        }).toThrow(TypeError);

        expect(rootInstance.newMethod).toBeUndefined();

        // Modifications can however be made to instances retrieved from the loader
        const loadedInstance = dom.window.Snowboard.getPlugin('testPlugin').getInstance();

        loadedInstance.newMethod = () => true;
        expect(loadedInstance.newMethod).toEqual(expect.any(Function));
        expect(loadedInstance.newMethod()).toBe(true);

        // But shouldn't follow through to new instances
        const loadedInstanceTwo = dom.window.Snowboard.getPlugin('testPlugin').getInstance();
        expect(loadedInstanceTwo.newMethod).toBeUndefined();

        // The same rules apply for singletons, except that modifications will follow through to
        // other uses of the singleton, since it's only one global instance.
        const rootSingleton = dom.window.Snowboard.getPlugin('testSingleton').instance;

        expect(() => {
            rootSingleton.newMethod = () => true;
        }).toThrow(TypeError);

        const loadedSingleton = dom.window.Snowboard.getPlugin('testSingleton').getInstance();

        loadedSingleton.newMethod = () => true;
        expect(loadedSingleton.newMethod).toEqual(expect.any(Function));
        expect(loadedSingleton.newMethod()).toBe(true);

        const loadedSingletonTwo = dom.window.Snowboard.getPlugin('testSingleton').getInstance();
        expect(loadedSingletonTwo.newMethod).toEqual(expect.any(Function));
        expect(loadedSingletonTwo.newMethod()).toBe(true);
    });
});
