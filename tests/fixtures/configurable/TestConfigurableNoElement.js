import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestConfigurableNoElement extends PluginBase {
    construct() {
        this.element = null;
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
