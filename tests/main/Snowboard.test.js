import FakeDom from '../helpers/FakeDom';

describe('Snowboard framework', () => {
    it('initialises correctly', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
            ])
            .render();

        expect(dom.window.Snowboard).toBeDefined();
        expect(dom.window.Snowboard.addPlugin).toBeDefined();
        expect(dom.window.Snowboard.addPlugin).toEqual(expect.any(Function));

        // Check PluginBase and Singleton abstracts exist
        expect(dom.window.Snowboard.PluginBase).toBeDefined();
        expect(dom.window.Snowboard.Singleton).toBeDefined();

        // Check in-built plugins
        expect(dom.window.Snowboard.getPluginNames()).toEqual(
            expect.arrayContaining(['jsonparser', 'sanitizer'])
        );
        expect(dom.window.Snowboard.getPlugin('jsonparser').isFunction()).toEqual(false);
        expect(dom.window.Snowboard.getPlugin('jsonparser').isSingleton()).toEqual(true);
        expect(dom.window.Snowboard.getPlugin('sanitizer').isFunction()).toEqual(false);
        expect(dom.window.Snowboard.getPlugin('sanitizer').isSingleton()).toEqual(true);
    });

    it('is frozen on construction and doesn\'t allow prototype pollution', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
            ])
            .render();

        expect(() => {
            dom.window.snowboard.newMethod = () => true;
        }).toThrow(TypeError);
    });
});
