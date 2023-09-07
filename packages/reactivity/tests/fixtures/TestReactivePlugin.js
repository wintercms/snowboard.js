import ReactivePluginBase from '../../src/abstracts/ReactivePluginBase';

export default class TestReactivePlugin extends ReactivePluginBase {
    construct() {
        this.count = 0;
    }

    template() {
        return `
            <div>
                <button @click="increment">Increment</button>
                <strong>{{ count }}</strong>
                <p>{{ countText }}</p>
            </div>
        `;
    }

    mountTo() {
        return document.body;
    }

    get countText() {
        return `Count: ${this.count}`;
    }

    increment() {
        this.count++;
    }
}
