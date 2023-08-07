import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestConfigurableIncorrectElement extends PluginBase {
    construct() {
        this.element = { some: 'object' };
    }

    traits() {
        return ['Configurable'];
    }

    defaults() {
        return {
            id: null,
            name: null,
            stringValue: null,
            boolean: null,
            base64: null,
        };
    }
}
