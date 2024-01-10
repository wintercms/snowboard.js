import TestInstance from '../../src/main/Snowboard';
import TestConfigurable from '../fixtures/configurable/TestConfigurable';
import TestConfigurableAll from '../fixtures/configurable/TestConfigurableAll';
import TestConfigurableNoElement from '../fixtures/configurable/TestConfigurableNoElement';
import TestConfigurableIncorrectElement from '../fixtures/configurable/TestConfigurableIncorrectElement';
import TestConfigurableNoDefaults from '../fixtures/configurable/TestConfigurableNoDefaults';
import TestConfigurableInvalidDefaults from '../fixtures/configurable/TestConfigurableInvalidDefaults';
import TestConfigurableCoerce from '../fixtures/configurable/TestConfigurableCoerce';

describe('The Configurable trait', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/fixtures/assets/';

        window.Snowboard = new TestInstance();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        window.Snowboard.tearDown();
    });

    it('initializes correctly on a plugin instance', () => {
        document.body.innerHTML = '<div id="testElement"></div>';

        Snowboard.addPlugin('testConfigurable', TestConfigurable);
        const instance = Snowboard.testConfigurable(document.querySelector('#testElement'));

        expect(instance.instanceConfig).toBeDefined();
        expect(instance.acceptedConfigs).toBeDefined();
        expect(instance.getConfig).toBeDefined();
        expect(instance.setConfig).toBeDefined();
    });

    it('can read the config from an element\'s data attributes', () => {
        document.body.innerHTML = `<div
            id="testElement"
            data-id="389"
            data-string-value="Hi there"
            data-boolean="true"
        ></div>

        <div
            id="testElementTwo"
            data-string-value="Hi there again"
            data-name="Ben"
            data-boolean="false"
            data-extra-attr="This should not be available"
            data-base64="base64:SSdtIGEgQmFzZTY0LWRlY29kZWQgc3RyaW5n"
        ></div>`;

        Snowboard.addPlugin('testConfigurable', TestConfigurable);
        const instance = Snowboard.testConfigurable(document.querySelector('#testElement'));

        expect(instance.getConfig('id')).toEqual(389);
        // Name should be null as it's the default value and not specified above
        expect(instance.getConfig('name')).toBeNull();
        expect(instance.getConfig('stringValue')).toBe('Hi there');
        // Missing should be undefined as it's neither defined nor part of the default data
        expect(instance.getConfig('missing')).toBeUndefined();
        expect(instance.getConfig('boolean')).toBe(true);

        expect(instance.getConfig()).toMatchObject({
            id: 389,
            name: null,
            stringValue: 'Hi there',
            boolean: true,
            base64: null,
        });

        const instanceTwo = Snowboard.testConfigurable(document.querySelector('#testElementTwo'));

        // ID is null as it's the default value and not specified above
        expect(instanceTwo.getConfig('id')).toBeNull();
        expect(instanceTwo.getConfig('name')).toBe('Ben');
        expect(instanceTwo.getConfig('stringValue')).toBe('Hi there again');
        expect(instanceTwo.getConfig('missing')).toBeUndefined();
        expect(instanceTwo.getConfig('boolean')).toBe(false);
        // Extra attr is specified above, but it should not be available as a config value
        // because it's not part of the `defaults()` in the fixture
        expect(instanceTwo.getConfig('extraAttr')).toBeUndefined();
        // Base-64 decoded string
        expect(instanceTwo.getConfig('base64')).toBe('I\'m a Base64-decoded string');
    });

    it('can read the config from every data attribute of an element with "acceptAllDataConfigs" enabled', () => {
        document.body.innerHTML = `<div
            id="testElement"
            data-string-value="Hi there again"
            data-name="Ben"
            data-boolean="false"
            data-extra-attr="This should now be available"
            data-json="{ &quot;name&quot;: &quot;Ben&quot; }"
            data-another-base64="base64:dHJ1ZQ=="
            data-json-base64="base64:eyAiaWQiOiAxLCAidGl0bGUiOiAiU29tZSB0aXRsZSIgfQ=="
        ></div>`;

        Snowboard.addPlugin('testConfigurable', TestConfigurableAll);
        const instance = Snowboard.testConfigurable(document.querySelector('#testElement'));

        // ID is null as it's the default value and not specified above
        expect(instance.getConfig('id')).toBeNull();
        expect(instance.getConfig('name')).toBe('Ben');
        expect(instance.getConfig('stringValue')).toBe('Hi there again');
        expect(instance.getConfig('missing')).toBeUndefined();
        expect(instance.getConfig('boolean')).toBe(false);
        // These attributes below are specified above, and although they're not part of the
        // defaults, they should be available because "acceptAllDataConfigs" is true
        expect(instance.getConfig('extraAttr')).toBe('This should now be available');
        expect(instance.getConfig('json')).toMatchObject({
            name: 'Ben',
        });
        expect(instance.getConfig('anotherBase64')).toBe(true);
        expect(instance.getConfig('jsonBase64')).toMatchObject({
            id: 1,
            title: 'Some title',
        });

        expect(instance.getConfig()).toMatchObject({
            id: null,
            name: 'Ben',
            stringValue: 'Hi there again',
            boolean: false,
            extraAttr: 'This should now be available',
            json: {
                name: 'Ben',
            },
            anotherBase64: true,
            jsonBase64: {
                id: 1,
                title: 'Some title',
            },
        });
    });

    it('can refresh the config from the data attributes on the fly', () => {
        document.body.innerHTML = `<div
            id="testElement"
            data-string-value="Hi there again"
            data-name="Ben"
            data-boolean="no"
        ></div>`;

        Snowboard.addPlugin('testConfigurable', TestConfigurable);
        const instance = Snowboard.testConfigurable(document.querySelector('#testElement'));

        expect(instance.getConfig('id')).toBeNull();
        expect(instance.getConfig('name')).toBe('Ben');
        expect(instance.getConfig('stringValue')).toBe('Hi there again');
        expect(instance.getConfig('boolean')).toBe(false);

        expect(instance.getConfig()).toMatchObject({
            id: null,
            name: 'Ben',
            stringValue: 'Hi there again',
            boolean: false,
        });

        document.querySelector('#testElement').setAttribute('data-id', '456');
        document.querySelector('#testElement').setAttribute('data-string-value', 'Changed');
        document.querySelector('#testElement').removeAttribute('data-boolean');

        // Refresh config
        instance.refreshConfig();

        expect(instance.getConfig('id')).toBe(456);
        expect(instance.getConfig('name')).toBe('Ben');
        expect(instance.getConfig('stringValue')).toBe('Changed');
        expect(instance.getConfig('boolean')).toBeNull();

        expect(instance.getConfig()).toMatchObject({
            id: 456,
            name: 'Ben',
            stringValue: 'Changed',
            boolean: null,
        });
    });

    it('can set config values at runtime', () => {
        document.body.innerHTML = `<div
            id="testElement"
            data-string-value="Hi there again"
            data-name="Ben"
            data-boolean="no"
        ></div>`;

        Snowboard.addPlugin('testConfigurable', TestConfigurable);
        const instance = Snowboard.testConfigurable(document.querySelector('#testElement'));

        expect(instance.getConfig('name')).toBe('Ben');

        instance.setConfig('name', 'Luke');
        expect(instance.getConfig('name')).toBe('Luke');

        instance.refreshConfig();
        expect(instance.getConfig('name')).toBe('Ben');

        expect(() => {
            instance.setConfig();
        }).toThrow('You must provide a configuration key');
    });

    it('can set config values at runtime that persist through a reset', () => {
        document.body.innerHTML = `<div
            id="testElement"
            data-string-value="Hi there again"
            data-name="Ben"
            data-boolean="no"
        ></div>`;

        Snowboard.addPlugin('testConfigurable', TestConfigurable);
        const instance = Snowboard.testConfigurable(document.querySelector('#testElement'));

        expect(instance.getConfig('name')).toBe('Ben');

        instance.setConfig('name', 'Luke', true);
        expect(instance.getConfig('name')).toBe('Luke');

        instance.refreshConfig();
        expect(instance.getConfig('name')).toBe('Luke');
    });

    it('won\'t allow trait to work if there is no element or an incorrect element', () => {
        Snowboard.addPlugin('testConfigurable', TestConfigurable);
        Snowboard.addPlugin('testConfigurableNoElement', TestConfigurableNoElement);
        Snowboard.addPlugin('testConfigurableIncorrectElement', TestConfigurableIncorrectElement);

        expect(() => {
            Snowboard.testConfigurable(document.querySelector('#testElement'));
        }).toThrow('Data configuration can only be extracted from HTML elements');

        expect(() => {
            Snowboard.testConfigurableNoElement();
        }).toThrow('Data configuration can only be extracted from HTML elements');

        expect(() => {
            Snowboard.testConfigurableIncorrectElement();
        }).toThrow('Data configuration can only be extracted from HTML elements');
    });

    it('won\'t have config values if defaults method doesn\'t exist, or defaults method produces a non-object', () => {
        document.body.innerHTML = `<div
            id="testElement"
            data-string-value="Hi there again"
            data-name="Ben"
            data-boolean="no"
        ></div>`;

        Snowboard.addPlugin('testConfigurableNoDefaults', TestConfigurableNoDefaults);
        Snowboard.addPlugin('testConfigurableInvalidDefaults', TestConfigurableInvalidDefaults);

        const instance = Snowboard.testConfigurableNoDefaults(document.querySelector('#testElement'));

        expect(instance.getConfig()).toEqual({});

        const instance2 = Snowboard.testConfigurableInvalidDefaults(document.querySelector('#testElement'));

        expect(instance2.getConfig()).toEqual({});
    });

    it('can coerce config values', () => {
        document.body.innerHTML = `<div
            id="testElement"
            data-string-value="Hi there again"
            data-name="Ben"
            data-boolean="false"
            data-number-bool-true="1"
            data-number-bool-false="0"
            data-null-value="null"
            data-undefined-value="undefined"
            data-json-value="{ name: 'Ben Thomson', url: 'https://wintercms.com' }"
            data-message="Error: You have encountered an error, please try again"
            data-extra-attr="This should not be available"
            data-base64="base64:SSdtIGEgQmFzZTY0LWRlY29kZWQgc3RyaW5n"
        ></div>`;

        Snowboard.addPlugin('testConfigurableCoerce', TestConfigurableCoerce);
        const instance = Snowboard.testConfigurableCoerce(document.querySelector('#testElement'));

        expect(instance.getConfig('name')).toBe('Ben');
        expect(instance.getConfig('stringValue')).toBe('Hi there again');
        expect(instance.getConfig('boolean')).toBe(false);
        expect(instance.getConfig('numberBoolTrue')).toBe(true);
        expect(instance.getConfig('numberBoolFalse')).toBe(false);
        expect(instance.getConfig('nullValue')).toBeNull();
        expect(instance.getConfig('undefinedValue')).toBeUndefined();
        // Tests a JSON object that passes the JSON parser's strict mode
        expect(instance.getConfig('jsonValue')).toMatchObject({
            name: 'Ben Thomson',
            url: 'https://wintercms.com',
        });
        // Tests a string that would be interpreted as an object/array in the JSON parser without
        // strict mode
        expect(instance.getConfig('message')).toBe('Error: You have encountered an error, please try again');
        expect(instance.getConfig('extraAttr')).toBeUndefined();
        expect(instance.getConfig('base64')).toBe('I\'m a Base64-decoded string');
    });
});
