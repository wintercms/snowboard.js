import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestLocalEventPlugin extends PluginBase {
    construct() {
        this.eventPrefix = 'test';
        this.localEventsOnly = true;
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
