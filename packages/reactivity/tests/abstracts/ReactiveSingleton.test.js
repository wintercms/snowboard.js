import { nextTick } from 'petite-vue';
import { Snowboard as TestInstance, Singleton, PluginBase } from '@wintercms/snowboard';
import TestReactiveSingleton from '../fixtures/TestReactiveSingleton';
import TestSnowboardTemplate from '../fixtures/TestSnowboardTemplate';

describe('Snowboard Reactivity package', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/assets/';

        window.Snowboard = new TestInstance();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('Can initialise on a singleton and test simple reactivity', () => {
        expect.assertions(17);

        expect(() => {
            Snowboard.addPlugin('testReactivitySingleton', TestReactiveSingleton);
        }).not.toThrow();

        const instance = Snowboard.testReactivitySingleton();
        expect(instance).toBeInstanceOf(TestReactiveSingleton);
        expect(instance).toBeInstanceOf(Singleton);
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

    test('Won\'t allow reactivity to be initialised twice', () => {
        expect(() => {
            Snowboard.addPlugin('testReactivitySingleton', TestReactiveSingleton);
        }).not.toThrow();

        const instance = Snowboard.testReactivitySingleton();
        expect(instance.reactivityInitialized).toBe(true);

        expect(() => {
            instance.reactivityConstructor();
        }).toThrow();
        expect(() => {
            instance.reactivityInitialize();
        }).toThrow();
        expect(() => {
            instance.reactivityGetProperties();
        }).toThrow();
        expect(() => {
            instance.reactivityCreateStore();
        }).toThrow();
        expect(() => {
            instance.reactivityMapProperties();
        }).toThrow();
        expect(() => {
            instance.reactivityTemplate();
        }).toThrow();
        expect(() => {
            instance.reactivityMount();
        }).toThrow();

        expect(() => {
            instance.reactivityInitialized = false;
        }).toThrow();
    });

    test('Won\'t populate Snowboard in the template', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        Snowboard.addPlugin('testSnowboardTemplate', TestSnowboardTemplate);

        const instance = Snowboard.testSnowboardTemplate();
        const div = instance.reactivityElement;

        expect(div.querySelector('strong').textContent).toBe('');
        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenLastCalledWith(new ReferenceError('snowboard is not defined'));
    });

    test('Allows a single instance of a singleton', () => {
        Snowboard.addPlugin('testReactivitySingleton', TestReactiveSingleton);
        const instanceOne = Snowboard.testReactivitySingleton();
        const countOne = instanceOne.reactivityElement.querySelector('strong');
        const buttonOne = instanceOne.reactivityElement.querySelector('button');
        const instanceTwo = Snowboard.testReactivitySingleton();
        const countTwo = instanceTwo.reactivityElement.querySelector('strong');
        const buttonTwo = instanceTwo.reactivityElement.querySelector('button');

        expect(instanceOne).toBe(instanceTwo);
        expect(document.querySelectorAll('div').length).toBe(1);

        const evt = new Event('click', { bubbles: true });
        buttonOne.dispatchEvent(evt);
        buttonTwo.dispatchEvent(evt);

        nextTick(() => {
            expect(instanceOne.count).toBe(2);
            expect(instanceOne.reactivityStore.count).toBe(2);
            expect(countOne.textContent).toBe('2');

            expect(instanceTwo.count).toBe(2);
            expect(instanceTwo.reactivityStore.count).toBe(2);
            expect(countTwo.textContent).toBe('2');

            const evt2 = new Event('click', { bubbles: true });
            buttonTwo.dispatchEvent(evt2);

            nextTick(() => {
                expect(instanceOne.count).toBe(3);
                expect(instanceOne.reactivityStore.count).toBe(3);
                expect(countOne.textContent).toBe('3');

                expect(instanceTwo.count).toBe(3);
                expect(instanceTwo.reactivityStore.count).toBe(3);
                expect(countTwo.textContent).toBe('3');
            });
        });
    });
});
