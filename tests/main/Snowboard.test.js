import FakeDom from '../helpers/FakeDom';

describe('Snowboard framework', () => {
    it('initialises correctly', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.js',
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
            expect.arrayContaining(['assetloader', 'cookie', 'jsonparser', 'sanitizer', 'url']),
        );
        expect(dom.window.Snowboard.getPlugin('assetLoader').isFunction()).toEqual(false);
        expect(dom.window.Snowboard.getPlugin('assetLoader').isSingleton()).toEqual(true);
        expect(dom.window.Snowboard.getPlugin('cookie').isFunction()).toEqual(false);
        expect(dom.window.Snowboard.getPlugin('cookie').isSingleton()).toEqual(true);
        expect(dom.window.Snowboard.getPlugin('jsonparser').isFunction()).toEqual(false);
        expect(dom.window.Snowboard.getPlugin('jsonparser').isSingleton()).toEqual(true);
        expect(dom.window.Snowboard.getPlugin('sanitizer').isFunction()).toEqual(false);
        expect(dom.window.Snowboard.getPlugin('sanitizer').isSingleton()).toEqual(true);
        expect(dom.window.Snowboard.getPlugin('url').isFunction()).toEqual(false);
        expect(dom.window.Snowboard.getPlugin('url').isSingleton()).toEqual(true);
    });

    it('is frozen on construction and doesn\'t allow prototype pollution', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
                'tests/fixtures/framework/TestPlugin.js',
            ])
            .render();

        expect(() => {
            dom.window.snowboard.newMethod = () => true;
        }).toThrow(TypeError);

        expect(() => {
            dom.window.Snowboard.newProperty = 'test';
        }).toThrow(TypeError);

        expect(() => {
            dom.window.Snowboard.readiness.test = 'test';
        }).toThrow(TypeError);

        expect(dom.window.Snowboard.newMethod).toBeUndefined();
        expect(dom.window.Snowboard.newProperty).toBeUndefined();

        // You should not be able to modify the Snowboard object fed to plugins either
        const instance = dom.window.Snowboard.testPlugin();
        expect(() => {
            instance.snowboard.newMethod = () => true;
        }).toThrow(TypeError);
    });

    it('can add and remove a plugin', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
                'tests/fixtures/framework/TestPlugin.js',
            ])
            .render();

        const { Snowboard } = dom.window;

        // Check plugin caller
        expect('testPlugin' in Snowboard).toEqual(true);
        expect('testSingleton' in Snowboard).toEqual(false);

        expect(Snowboard.hasPlugin('testPlugin')).toBe(true);
        expect(Snowboard.getPluginNames()).toEqual(
            expect.arrayContaining(['testplugin']),
        );

        const instance = Snowboard.testPlugin();

        // Check plugin injected methods
        expect(instance.snowboard).toBeDefined();
        expect(instance.snowboard.getPlugin).toEqual(expect.any(Function));
        expect(() => {
            instance.snowboard.initialise();
        }).toThrow('cannot use');
        expect(instance.destructor).toEqual(expect.any(Function));

        // Check plugin method
        expect(instance.testMethod).toBeDefined();
        expect(instance.testMethod).toEqual(expect.any(Function));
        expect(instance.testMethod()).toEqual('Tested');

        // Check multiple instances
        const instanceOne = Snowboard.testPlugin();
        instanceOne.changed = true;
        const instanceTwo = Snowboard.testPlugin();
        expect(instanceOne).not.toEqual(instanceTwo);
        const factory = Snowboard.getPlugin('testPlugin');
        expect(factory.getInstances()).toEqual([instance, instanceOne, instanceTwo]);

        // Remove plugin
        Snowboard.removePlugin('testPlugin');
        expect(Snowboard.hasPlugin('testPlugin')).toEqual(false);
        expect(dom.window.Snowboard.getPluginNames()).not.toEqual(
            expect.arrayContaining(['testplugin']),
        );
        expect(Snowboard.testPlugin).not.toBeDefined();
    });

    it('can add and remove a singleton', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
                'tests/fixtures/framework/TestSingleton.js',
            ])
            .render();

        const { Snowboard } = dom.window;

        expect('testPlugin' in Snowboard).toEqual(false);
        expect('testSingleton' in Snowboard).toEqual(true);

        // Check plugin caller
        expect(Snowboard.hasPlugin('testSingleton')).toBe(true);
        expect(Snowboard.getPluginNames()).toEqual(
            expect.arrayContaining(['testsingleton']),
        );
        expect(Snowboard.testSingleton).toEqual(expect.any(Function));

        const instance = Snowboard.testSingleton();

        // Check plugin injected methods
        expect(instance.snowboard).toBeDefined();
        expect(instance.snowboard.getPlugin).toEqual(expect.any(Function));
        expect(() => {
            instance.snowboard.initialise();
        }).toThrow('cannot use');
        expect(instance.destructor).toEqual(expect.any(Function));

        // Check plugin method
        expect(instance.testMethod).toBeDefined();
        expect(instance.testMethod).toEqual(expect.any(Function));
        expect(instance.testMethod()).toEqual('Tested');

        // Check multiple instances  (these should all be the same as this instance is a singleton)
        const instanceOne = Snowboard.testSingleton();
        instanceOne.changed = true;
        const instanceTwo = Snowboard.testSingleton();
        expect(instanceOne).toEqual(instanceTwo);
        const factory = Snowboard.getPlugin('testSingleton');
        expect(factory.getInstances()).toEqual([instance]);

        // Remove plugin
        Snowboard.removePlugin('testSingleton');
        expect(Snowboard.hasPlugin('testSingleton')).toEqual(false);
        expect(dom.window.Snowboard.getPluginNames()).not.toEqual(
            expect.arrayContaining([ 'testsingleton']),
        );
        expect(Snowboard.testSingleton).not.toBeDefined();
    });

    it('can listen and call global events', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
                'tests/fixtures/framework/TestListener.js',
            ])
            .render();

        const { Snowboard } = dom.window;

        expect(Snowboard.listensToEvent('eventOne')).toEqual(['test']);
        expect(Snowboard.listensToEvent('eventTwo')).toEqual(['test']);
        expect(Snowboard.listensToEvent('eventThree')).toEqual([]);

        // Call global event one
        const testClass = Snowboard.test();
        Snowboard.globalEvent('eventOne', 42);
        expect(testClass.eventResult).toEqual('Event called with arg 42');

        // Call global event two - should fail as the test plugin doesn't have that method
        expect(() => {
            Snowboard.globalEvent('eventTwo');
        }).toThrow('Missing "notExists" method in "test" plugin');

        // Call global event three - nothing should happen
        expect(() => {
            Snowboard.globalEvent('eventThree');
        }).not.toThrow();
    });

    it('can listen and call global events that are simple closures', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
                'tests/fixtures/framework/TestClosureListener.js',
            ])
            .render();

        const { Snowboard } = dom.window;

        expect(Snowboard.listensToEvent('eventOne')).toEqual(['testclosure']);
        expect(Snowboard.listensToEvent('eventTwo')).toEqual(['testclosure']);
        expect(Snowboard.listensToEvent('eventThree')).toEqual([]);

        // Call global event one
        const testClass = Snowboard.testClosure();
        Snowboard.globalEvent('eventOne');
        expect(testClass.eventResult).toEqual('Closure eventOne called');

        // Call global event two - should fail as the test plugin doesn't have that method
        Snowboard.globalEvent('eventTwo', 42);
        expect(testClass.eventResult).toEqual('Closure eventTwo called with arg \'42\'');

        // Call global event three - nothing should happen
        expect(() => {
            Snowboard.globalEvent('eventThree');
        }).not.toThrow();
    });

    it('can listen and call global promise events', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
                'tests/fixtures/framework/TestPromiseListener.js',
            ])
            .render();

        const { Snowboard } = dom.window;

        expect(Snowboard.listensToEvent('promiseOne')).toEqual(['test']);
        expect(Snowboard.listensToEvent('promiseTwo')).toEqual(['test']);
        expect(Snowboard.listensToEvent('promiseThree')).toEqual([]);

        // Call global event one
        const testClass = Snowboard.test();

        const chain = await Snowboard.globalPromiseEvent('promiseOne', 'promise').then(
            async () => {
                expect(testClass.eventResult).toEqual('Event called with arg promise');

                // Call global event two - it should still work, even though it doesn't return a
                // promise
                const innerChain = await Snowboard.globalPromiseEvent('promiseTwo', 'promise 2').then(
                    async () => {
                        expect(testClass.eventResult).toEqual('Promise two called with arg promise 2');

                        // Call global event three - it should still work
                        const innerInnerChain = await Snowboard.globalPromiseEvent('promiseThree', 'promise 3').then(
                            async () => true,
                            async (error) => error,
                        );

                        return innerInnerChain;
                    },
                    async (error) => error,
                );

                return innerChain;
            },
            async (error) => error,
        );

        expect(chain).toEqual(true);
    });

    it('can listen and call global promise events that are simple closures', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
                'tests/fixtures/framework/TestPromiseClosureListener.js',
            ])
            .render();

        const { Snowboard } = dom.window;

        expect(Snowboard.listensToEvent('promiseOne')).toEqual(['testclosure']);
        expect(Snowboard.listensToEvent('promiseTwo')).toEqual(['testclosure']);
        expect(Snowboard.listensToEvent('promiseThree')).toEqual([]);

        // Call global event one
        const testClass = Snowboard.testClosure();
        const chain = await Snowboard.globalPromiseEvent('promiseOne', 'promise').then(
            async () => {
                expect(testClass.eventResult).toEqual('Event called with arg promise');

                // Call global event two - it should still work, even though it doesn't return a
                // promise
                const innerChain = await Snowboard.globalPromiseEvent('promiseTwo', 'promise 2').then(
                    async () => {
                        expect(testClass.eventResult).toEqual('Promise two called with arg promise 2');

                        // Call global event three - it should still work
                        const innerInnerChain = Snowboard.globalPromiseEvent('promiseThree', 'promise 3').then(
                            async () => true,
                            async (error) => error,
                        );

                        return innerInnerChain;
                    },
                    async (error) => error,
                );

                return innerChain;
            },
            async (error) => error,
        );

        expect(chain).toEqual(true);
    });

    it('will throw an error when using a plugin that has unfulfilled dependencies', async () => {
        const dom = await FakeDom
            .new()
            .addScript([
                'dist/snowboard.min.js',
                'tests/fixtures/framework/TestHasDependencies.js',
            ])
            .render();

        const { Snowboard } = dom.window;

        expect(() => {
            Snowboard.testHasDependencies();
        }).toThrow('The "testhasdependencies" plugin requires the following plugins: testdependencyone, testdependencytwo');
    });
});
