import TestInstance from '../../src/main/Snowboard';
import TestPlugin from '../fixtures/framework/TestPlugin';
import TestSingleton from '../fixtures/framework/TestSingleton';

describe('PluginLoader class', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/assets/';

        window.Snowboard = new TestInstance();
    });

    it('can mock existing methods on a singleton', () => {
        Snowboard.getPlugin('sanitizer').mock('sanitize', () => 'all good');

        expect(
            Snowboard.sanitizer().sanitize('<p onload="derp;"></p>'),
        ).toEqual('all good');

        // Test unmock
        Snowboard.getPlugin('sanitizer').unmock('sanitize');

        expect(
            Snowboard.sanitizer().sanitize('<p onload="derp;"></p>'),
        ).toEqual('<p></p>');
    });

    it('can mock existing methods on all future instances of a plugin', () => {
        Snowboard.addPlugin('testPlugin', TestPlugin);

        const before = Snowboard.testPlugin();

        expect('testMethod' in before).toBe(true);
        expect(before.testMethod()).toEqual('Tested');

        Snowboard.getPlugin('testPlugin').mock('testMethod', (instance, withArg) => ({ str: `Mocked ${withArg}`, thisInstance: instance }));

        const after = Snowboard.testPlugin();

        expect('testMethod' in after).toBe(true);
        expect(after.testMethod('with arg').str).toBe('Mocked with arg');
        expect(after.testMethod('with arg').thisInstance).toBeInstanceOf(TestPlugin);
    });

    it('is frozen on construction and doesn\'t allow prototype pollution', () => {
        const loader = Snowboard.getPlugin('sanitizer');

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

    it('should prevent modification of root instances', () => {
        Snowboard.addPlugin('testPlugin', TestPlugin);
        Snowboard.addPlugin('testSingleton', TestSingleton);

        const rootInstance = Snowboard.getPlugin('testPlugin').instance;

        expect(() => {
            rootInstance.newMethod = () => true;
        }).toThrow(TypeError);

        expect(rootInstance.newMethod).toBeUndefined();

        // Modifications can however be made to instances retrieved from the loader
        const loadedInstance = Snowboard.getPlugin('testPlugin').getInstance();

        loadedInstance.newMethod = () => true;
        expect(loadedInstance.newMethod).toEqual(expect.any(Function));
        expect(loadedInstance.newMethod()).toBe(true);

        // But shouldn't follow through to new instances
        const loadedInstanceTwo = Snowboard.getPlugin('testPlugin').getInstance();
        expect(loadedInstanceTwo.newMethod).toBeUndefined();

        // The same rules apply for singletons, except that modifications will follow through to
        // other uses of the singleton, since it's only one global instance.
        const rootSingleton = Snowboard.getPlugin('testSingleton').instance;

        expect(() => {
            rootSingleton.newMethod = () => true;
        }).toThrow(TypeError);

        const loadedSingleton = Snowboard.getPlugin('testSingleton').getInstance();

        loadedSingleton.newMethod = () => true;
        expect(loadedSingleton.newMethod).toEqual(expect.any(Function));
        expect(loadedSingleton.newMethod()).toBe(true);

        const loadedSingletonTwo = Snowboard.getPlugin('testSingleton').getInstance();
        expect(loadedSingletonTwo.newMethod).toEqual(expect.any(Function));
        expect(loadedSingletonTwo.newMethod()).toBe(true);
    });
});
