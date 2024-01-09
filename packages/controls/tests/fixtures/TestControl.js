import Control from '../../src/abstracts/Control';

export default class TestControl extends Control {
    construct(element) {
        super.construct(element);

        this.counter = element.querySelector('.counter');
        this.incrementButton = element.querySelector('button.increment');
        this.events = {
            increment: () => this.increment(),
        };
        this.incrementButton.addEventListener('click', this.events.increment);
    }

    destruct() {
        this.incrementButton.removeEventListener('click', this.events.increment);
        this.incrementButton = null;
        this.counter = null;
    }

    init() {
        this.count = this.getConfig('count');
        this.counter.innerHTML = this.count;
    }

    defaults() {
        return {
            count: 0,
        };
    }

    increment() {
        this.count += 1;
        this.counter.innerHTML = this.count;
    }
}
