import ReactivePluginBase from '../../src/abstracts/ReactivePluginBase';

export default class TestPreExistingTemplate extends ReactivePluginBase {
    construct() {
        this.shown = false;
    }

    template() {
        return document.querySelector('#test');
    }

    mountTo() {
        return document.body;
    }

    show() {
        this.shown = true;
    }

    hide() {
        this.shown = false;
    }
}
