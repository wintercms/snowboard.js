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
    });

    test('Can register a control', () => {
        document.body.innerHTML = `
            <div id="app">
                <div id="object" data-control="test">
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

        const testApp = document.getElementById('app');
        const testObject = document.getElementById('object');
        const testCounter = testObject.querySelector('.counter');
        const testIncrement = testObject.querySelector('button.increment');

        Snowboard.controls().initializeControls(testApp);

        expect(testCounter.innerHTML).toBe('0');

        testIncrement.click();

        expect(testCounter.innerHTML).toBe('1');
    });
});
