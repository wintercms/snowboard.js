import TestInstance from '../../src/main/Snowboard';

describe('JsonParser utility', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/fixtures/assets/';

        window.Snowboard = new TestInstance();
    });

    it('parses a null or undefined', () => {
        expect(Snowboard.jsonParser().parse('null')).toEqual(null);
        expect(Snowboard.jsonParser().parse('undefined')).toBeUndefined();
    });

    it('parses a simple string', () => {
        expect(Snowboard.jsonParser().parse('test')).toEqual('test');
        expect(Snowboard.jsonParser().parse('"test"')).toEqual('test');
        expect(Snowboard.jsonParser().parse('"null"')).toEqual('null');
        expect(Snowboard.jsonParser().parse('\'test\'')).toEqual('test');
    });
});
