import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestPromiseEventPlugin extends PluginBase {
    construct() {
        this.eventPrefix = 'test';
    }

    traits() {
        return ['FiresEvents'];
    }

    test() {
        this.triggerPromiseEvent('test');
    }
}
