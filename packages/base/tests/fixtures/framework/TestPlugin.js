import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestPlugin extends PluginBase {
    testMethod() {
        return 'Tested';
    }
}
