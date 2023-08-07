import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestConfigurableCoerce extends PluginBase {
    construct(element) {
        this.element = element;
    }

    traits() {
        return ['Configurable'];
    }

    defaults() {
        return {
            id: null,
            name: null,
            nullValue: 'test',
            undefinedValue: 'test',
            numberBoolTrue: false,
            numberBoolFalse: true,
            stringValue: null,
            boolean: null,
            base64: null,
            jsonValue: null,
        };
    }
}
