import TestInstance from '../../src/main/Snowboard';
import ProxyHandler from '../../src/main/ProxyHandler';

describe('Url utility', () => {
    it('can get base and asset URLs from data attributes on current script', () => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/assets/';

        window.Snowboard = new Proxy(
            new TestInstance(),
            ProxyHandler,
        );

        expect(Snowboard.url().baseUrl()).toBe('https://example.com/');
        expect(Snowboard.url().assetUrl()).toBe('https://example.com/assets/');
    });

    it('can get base and asset URLs from a <base> tag', () => {
        delete document.currentScript.dataset.baseUrl;
        delete document.currentScript.dataset.assetUrl;

        const base = document.createElement('base');
        base.setAttribute('href', 'https://example.com');
        document.head.appendChild(base);

        window.Snowboard = new Proxy(
            new TestInstance(),
            ProxyHandler,
        );

        expect(Snowboard.url().baseUrl()).toBe('https://example.com/');
        expect(Snowboard.url().assetUrl()).toBe('https://example.com/');
    });

    it('can get base and asset URLs from the location origin as a last resort', () => {
        document.querySelector('base').remove();

        window.Snowboard = new Proxy(
            new TestInstance(),
            ProxyHandler,
        );

        expect(Snowboard.url().baseUrl()).toBe('http://localhost/');
        expect(Snowboard.url().assetUrl()).toBe('http://localhost/');
    });

    it('can prepend the base on a relative URL using to()/asset()', () => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/assets/';

        window.Snowboard = new Proxy(
            new TestInstance(),
            ProxyHandler,
        );

        expect(Snowboard.url().to('/something')).toBe('https://example.com/something');
        expect(Snowboard.url().to('something/else')).toBe('https://example.com/something/else');
        expect(Snowboard.url().asset('/something')).toBe('https://example.com/assets/something');
        expect(Snowboard.url().asset('something/else')).toBe('https://example.com/assets/something/else');
    });

    it('will leave absolute URLs untouched when using to()/asset()', () => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/assets/';

        window.Snowboard = new Proxy(
            new TestInstance(),
            ProxyHandler,
        );

        expect(Snowboard.url().to('https://wintercms.com')).toBe('https://wintercms.com');
        expect(Snowboard.url().to('https://wintercms.com/something')).toBe('https://wintercms.com/something');
        expect(Snowboard.url().asset('https://example.com/something')).toBe('https://example.com/something');
    });

    it('won\'t allow malformed or non-HTTP base URLs', () => {
        expect(() => {
            Snowboard.url().setBaseUrl('example.com');
        }).toThrow('Invalid base URL detected');

        expect(() => {
            Snowboard.url().setAssetUrl('://example.com');
        }).toThrow('Invalid base URL detected');

        expect(() => {
            Snowboard.url().setBaseUrl('ftp://example.com');
        }).toThrow('Invalid base URL detected');

        expect(() => {
            Snowboard.url().setAssetUrl('http://');
        }).toThrow('Invalid base URL detected');
    });
});
