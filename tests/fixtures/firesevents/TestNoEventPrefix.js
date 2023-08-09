import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestNoEventPrefix extends PluginBase {
    construct() {
    }

    traits() {
        return ['FiresEvents'];
    }

    test() {
        this.triggerEvent('test', 'Tested');
    }

    done() {
        this.triggerEvent('done');
    }
}
