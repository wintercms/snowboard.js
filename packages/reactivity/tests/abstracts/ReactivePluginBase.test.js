import { nextTick } from 'petite-vue';
import { Snowboard as TestInstance, Singleton, PluginBase } from '@wintercms/snowboard';
import TestReactivePlugin from '../fixtures/TestReactivePlugin';
import TestList from '../fixtures/TestList';
import TestPreExisting from '../fixtures/TestPreExisting';

describe('Snowboard Reactivity package', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/assets/';

        window.Snowboard = new TestInstance();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('Can initialise on a plugin and test simple reactivity', () => {
        expect.assertions(17);

        expect(() => {
            Snowboard.addPlugin('testReactivePlugin', TestReactivePlugin);
        }).not.toThrow();

        const instance = Snowboard.testReactivePlugin();
        expect(instance).toBeInstanceOf(TestReactivePlugin);
        expect(instance).not.toBeInstanceOf(Singleton);
        expect(instance).toBeInstanceOf(PluginBase);
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

    test('Allows multiple instances of a plugin with their own data scopes', () => {
        Snowboard.addPlugin('testReactivePlugin', TestReactivePlugin);

        const instanceOne = Snowboard.testReactivePlugin();
        const countOne = instanceOne.reactivityElement.querySelector('strong');
        const buttonOne = instanceOne.reactivityElement.querySelector('button');
        const instanceTwo = Snowboard.testReactivePlugin();
        const countTwo = instanceTwo.reactivityElement.querySelector('strong');
        const buttonTwo = instanceTwo.reactivityElement.querySelector('button');

        expect(document.querySelectorAll('div').length).toBe(2);

        const evt = new Event('click', { bubbles: true });
        buttonOne.dispatchEvent(evt);
        buttonOne.dispatchEvent(evt);

        nextTick(() => {
            expect(instanceOne.count).toBe(2);
            expect(instanceOne.reactivityStore.count).toBe(2);
            expect(countOne.textContent).toBe('2');

            expect(instanceTwo.count).toBe(0);
            expect(instanceTwo.reactivityStore.count).toBe(0);
            expect(countTwo.textContent).toBe('0');

            const evt2 = new Event('click', { bubbles: true });
            buttonTwo.dispatchEvent(evt2);

            nextTick(() => {
                expect(instanceOne.count).toBe(2);
                expect(instanceOne.reactivityStore.count).toBe(2);
                expect(countOne.textContent).toBe('2');

                expect(instanceTwo.count).toBe(1);
                expect(instanceTwo.reactivityStore.count).toBe(1);
                expect(countTwo.textContent).toBe('1');
            });
        });
    });

    test('Allows v-for and running methods direct on instance', () => {
        Snowboard.addPlugin('testList', TestList);

        const instance = Snowboard.testList();
        const div = instance.reactivityElement;

        expect(div.querySelectorAll('li').length).toBe(3);
        expect(div.querySelectorAll('li')[0].textContent).toBe('Luke');
        expect(div.querySelectorAll('li')[1].textContent).toBe('Jack');
        expect(div.querySelectorAll('li')[2].textContent).toBe('Marc');

        instance.addName('Ben');
        nextTick(() => {
            expect(div.querySelectorAll('li').length).toBe(4);
            expect(div.querySelectorAll('li')[3].textContent).toBe('Ben');

            instance.names = [
                'Don',
                'Dan',
                'Din',
            ];

            nextTick(() => {
                expect(div.querySelectorAll('li').length).toBe(3);
                expect(div.querySelectorAll('li')[0].textContent).toBe('Don');
                expect(div.querySelectorAll('li')[1].textContent).toBe('Dan');
                expect(div.querySelectorAll('li')[2].textContent).toBe('Din');
            });
        });
    });

    test('Allows v-if and mounting on a pre-existing element', () => {
        document.body.innerHTML = `
            <div id="test">
                <p v-if="shown">Hello</p>
            </div>
        `;

        Snowboard.addPlugin('testPreExisting', TestPreExisting);

        const instance = Snowboard.testPreExisting();
        const div = instance.reactivityElement;

        expect(div.querySelector('p')).toBeNull();

        instance.show();

        nextTick(() => {
            expect(div.querySelector('p')).not.toBeNull();
            expect(div.querySelector('p').textContent).toBe('Hello');

            instance.hide();

            nextTick(() => {
                expect(div.querySelector('p')).toBeNull();
            });
        });
    });
});
