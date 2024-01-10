import { Snowboard as TestInstance } from '@wintercms/snowboard';
import Control from '../../src/abstracts/Control';
import ControlHandler from '../../src/lib/ControlHandler';
import TestControl from '../fixtures/TestControl';

describe('Snowboard Controls package', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/assets/';

        window.Snowboard = new TestInstance();
    });

    afterEach(() => {
        document.body.innerHTML = '';

        window.Snowboard.tearDown();
    });

    test('Can register a control', () => {
        document.body.innerHTML = `
            <div id="app">
                <div id="object" data-control="test">
                    <div class="counter"></div>
                    <button class="increment">Increment</button>
                </div>

                <div id="object2" data-control="test" data-count="2">
                    <div class="counter"></div>
                    <button class="increment">Increment</button>
                </div>
            </div>
        `;

        expect(() => {
            Snowboard.addAbstract('Control', Control);
            Snowboard.addPlugin('controls', ControlHandler);
            Snowboard.controls().register('test', TestControl);
        }).not.toThrow();

        // const testApp = document.getElementById('app');
        const testObject = document.getElementById('object');
        const testObject2 = document.getElementById('object2');
        const testCounter = testObject.querySelector('.counter');
        const testCounter2 = testObject2.querySelector('.counter');
        const testIncrement = testObject.querySelector('button.increment');
        const testIncrement2 = testObject2.querySelector('button.increment');

        Snowboard.controls().onReady();

        // Test instance retrieval
        const controlInstance = Snowboard.controls().getControl(testObject);
        expect(controlInstance).toBeInstanceOf(TestControl);
        const controlInstanceAlt = testObject.control;
        expect(controlInstanceAlt).toBeInstanceOf(TestControl);
        expect(controlInstanceAlt).toBe(controlInstance);
        const controlInstance2 = testObject2.control;
        expect(controlInstance2).toBeInstanceOf(TestControl);
        expect(controlInstance2).not.toBe(controlInstance);

        expect(Snowboard.controls().getInstances('test')).toHaveLength(2);
        expect(Snowboard.controls().getInstances('test')[0]).toBe(controlInstance);
        expect(Snowboard.controls().getInstances('test')[1]).toBe(controlInstance2);

        // Test interactivity
        expect(testCounter.innerHTML).toBe('0');
        expect(testCounter2.innerHTML).toBe('2');

        testIncrement.click();

        expect(testCounter.innerHTML).toBe('1');
        expect(testCounter2.innerHTML).toBe('2');

        testIncrement2.click();
        testIncrement2.click();
        testIncrement2.click();

        expect(testCounter.innerHTML).toBe('1');
        expect(testCounter2.innerHTML).toBe('5');
    });

    test('Can destruct controls when the element is removed', async () => {
        expect.assertions(3);

        document.body.innerHTML = `
            <div id="app">
                <div id="object" data-control="test">
                    <div class="counter"></div>
                    <button class="increment">Increment</button>
                </div>

                <div id="object2" data-control="test" data-count="2">
                    <div class="counter"></div>
                    <button class="increment">Increment</button>
                </div>
            </div>
        `;

        expect(() => {
            Snowboard.addAbstract('Control', Control);
            Snowboard.addPlugin('controls', ControlHandler);
            Snowboard.controls().register('test', TestControl);
        }).not.toThrow();

        const testObject = document.getElementById('object');
        const testObject2 = document.getElementById('object2');

        Snowboard.controls().onReady();

        const controlInstance2 = testObject2.control;

        testObject.remove();

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });

        expect(Snowboard.controls().getInstances('test')).toHaveLength(1);
        expect(Snowboard.controls().getInstances('test')[0]).toBe(controlInstance2);
    });
});
