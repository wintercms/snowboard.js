import { nextTick } from 'petite-vue';
import { Snowboard as TestInstance } from '@wintercms/snowboard';
import TestReactiveSingleton from '../fixtures/TestReactiveSingleton';

describe('Snowboard Reactivity package', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/assets/';

        window.Snowboard = new TestInstance();
    });

    test('Can initialise on a singleton and test simple reactivity', () => {
        expect.assertions(14);

        expect(() => {
            Snowboard.addPlugin('testReactivitySingleton', TestReactiveSingleton);
        }).not.toThrow();

        const instance = Snowboard.testReactivitySingleton();
        const div = instance.reactivityElement;

        expect(instance.count).toBe(0);
        expect(instance.reactivityStore.count).toBe(0);
        expect(div).toBeInstanceOf(HTMLDivElement);
        expect(div.querySelector('strong').textContent).toBe('0');
        expect(div.querySelector('p').textContent).toBe('Count: 0');

        const evt = new Event('click', { bubbles: true });
        div.querySelector('button').dispatchEvent(evt);

        nextTick(() => {
            expect(instance.count).toBe(1);
            expect(instance.reactivityStore.count).toBe(1);
            expect(div.querySelector('strong').textContent).toBe('1');
            expect(div.querySelector('p').textContent).toBe('Count: 1');

            const evt2 = new Event('click', { bubbles: true });
            div.querySelector('button').dispatchEvent(evt2);

            nextTick(() => {
                expect(instance.count).toBe(2);
                expect(instance.reactivityStore.count).toBe(2);
                expect(div.querySelector('strong').textContent).toBe('2');
                expect(div.querySelector('p').textContent).toBe('Count: 2');
            });
        });
    });
});
