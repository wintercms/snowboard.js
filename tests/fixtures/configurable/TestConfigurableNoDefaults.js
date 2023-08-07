import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestConfigurableNoDefaults extends PluginBase {
    construct(element) {
        this.element = element;
    }

    traits() {
        return ['Configurable'];
    }
}
