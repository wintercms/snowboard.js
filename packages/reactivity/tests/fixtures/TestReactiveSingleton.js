import ReactiveSingleton from '../../src/abstracts/ReactiveSingleton';

export default class TestReactiveSingleton extends ReactiveSingleton {
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
