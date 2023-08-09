import TestInstance from '../../src/main/Snowboard';
import TestEventPlugin from '../fixtures/firesevents/TestEventPlugin';
import TestLocalEventPlugin from '../fixtures/firesevents/TestLocalEventPlugin';
import TestNoEventPrefix from '../fixtures/firesevents/TestNoEventPrefix';
import TestPromiseEventPlugin from '../fixtures/firesevents/TestPromiseEventPlugin';

describe('The FiresEvents trait', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/fixtures/assets/';

        window.Snowboard = new TestInstance();
    });

    it('requires an event prefix if global events are enabled', () => {
        Snowboard.addPlugin('testEvent', TestNoEventPrefix);

        expect(() => {
            Snowboard.testEvent();
        }).toThrow('Event prefix is required');
    });

    it('can trigger events locally and globally', () => {
        Snowboard.addPlugin('testEvent', TestEventPlugin);

        const instance = Snowboard.testEvent();

        let test = null;
        let done = false;
        let globalTest = null;
        let globalDone = false;

        instance.on('test', (arg) => {
            test = arg;
        });
        Snowboard.on('test.test', (arg) => {
            globalTest = arg;
        });
        instance.on('done', () => {
            done = true;
        });
        Snowboard.on('test.done', () => {
            globalDone = true;
        });

        instance.test();
        instance.done();

        expect(test).toEqual('Tested');
        expect(done).toBe(true);
        expect(globalTest).toEqual('Tested');
        expect(globalDone).toBe(true);
    });

    it('can trigger events only locally', () => {
        Snowboard.addPlugin('testEvent', TestLocalEventPlugin);

        const instance = Snowboard.testEvent();

        let test = null;
        let done = false;
        let globalTest = null;
        let globalDone = false;

        instance.on('test', (arg) => {
            test = arg;
        });
        Snowboard.on('test.test', (arg) => {
            globalTest = arg;
        });
        instance.on('done', () => {
            done = true;
        });
        Snowboard.on('test.done', () => {
            globalDone = true;
        });

        instance.test();
        instance.done();

        expect(test).toEqual('Tested');
        expect(done).toBe(true);
        expect(globalTest).toEqual(null);
        expect(globalDone).toBe(false);
    });

    it('can disable listeners on the fly', () => {
        Snowboard.addPlugin('testEvent', TestEventPlugin);

        const instance = Snowboard.testEvent();

        let called = 0;

        const callback = () => {
            called += 1;
        };
        // Enable listener
        instance.on('test', callback);

        // Trigger event twice
        instance.test();
        instance.test();

        // Disable listener
        instance.off('test', callback);

        // Trigger event once more
        instance.test();

        expect(called).toEqual(2);
    });

    it('allows once-off listeners', () => {
        Snowboard.addPlugin('testEvent', TestEventPlugin);

        const instance = Snowboard.testEvent();

        let called = 0;

        const callback = () => {
            called += 1;
        };
        // Enable listener as a once-only listener
        instance.once('test', callback);

        // Trigger event twice
        instance.test();
        instance.test();

        expect(called).toEqual(1);
    });

    it('allows listeners to cancel events', () => {
        Snowboard.addPlugin('testEvent', TestEventPlugin);

        const instance = Snowboard.testEvent();

        let called = 0;

        const callbackOne = () => {
            called += 1;
            return false;
        };
        const callbackTwo = () => {
            called += 1;
        };
        // Enable listeners
        instance.on('test', callbackOne);
        instance.on('test', callbackTwo);

        // Trigger event twice
        instance.test();
        instance.test();

        // Should be two calls, as the first event is fired, but the second is not
        expect(called).toEqual(2);
    });

    it('can trigger promise events locally and globally', async () => {
        Snowboard.addPlugin('testEvent', TestPromiseEventPlugin);

        const instance = Snowboard.testEvent();

        const promise = new Promise((resolve) => {
            const triggered = {
                local: false,
                global: false,
            };

            instance.on('test', () => {
                triggered.local = true;
                return Promise.resolve();
            });

            Snowboard.on('test.test', () => {
                triggered.global = true;
                resolve(triggered);
            });
        });

        // Trigger promise event
        instance.test();

        const result = await promise;

        expect(result).toEqual({
            local: true,
            global: true,
        });
    });
});
