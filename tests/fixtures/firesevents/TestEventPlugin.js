import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestEventPlugin extends PluginBase {
    construct() {
        this.eventPrefix = 'test';
        this.ready = false;
    }

    traits() {
        return ['FiresEvents'];
    }

    init() {
        this.ready = true;
    }

    test() {
        this.triggerEvent('test', 'Tested');
    }

    done() {
        this.triggerEvent('done');
    }
}
