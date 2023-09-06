import ReactivePluginBase from '../../src/abstracts/ReactivePluginBase';

export default class TestDeferredMount extends ReactivePluginBase {
    construct() {
        this.names = [
            'Luke',
            'Jack',
            'Marc',
        ];
    }

    addName(name) {
        this.names.push(name);
    }
}
