import ReactivePluginBase from '../../src/abstracts/ReactivePluginBase';

export default class TestPreExisting extends ReactivePluginBase {
    construct() {
        this.shown = false;
    }

    template() {
        return document.querySelector('#test');
    }

    show() {
        this.shown = true;
    }

    hide() {
        this.shown = false;
    }
}
