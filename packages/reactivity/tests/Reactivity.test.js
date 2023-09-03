import { Snowboard as TestInstance } from '@wintercms/snowboard';
import Alpine from 'alpinejs';
import Reactivity from '../src/main/Reactivity';

describe('Snowboard Reactivity module', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/assets/';

        window.Snowboard = new TestInstance();
    });

    test('Reactivity module can be installed', () => {
        expect(() => {
            Snowboard.addPlugin('reactivity', Reactivity);
        }).not.toThrow();

        const instance = Snowboard.reactivity();

        expect(instance).toBeInstanceOf(Reactivity);
        expect(instance.alpine).toBe(Alpine);
        expect(window.Alpine).toBe(Alpine);
    });
});
