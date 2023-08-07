import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestConfigurableAll extends PluginBase {
    construct(element) {
        this.element = element;
    }

    traits() {
        return {
            Configurable: {
                acceptAllDataConfigs: true,
            },
        };
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
