import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestEventPlugin extends PluginBase {
    construct() {
        this.eventPrefix = 'test';
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
