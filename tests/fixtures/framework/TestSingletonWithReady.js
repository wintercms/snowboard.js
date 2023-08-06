import Singleton from '../../../src/abstracts/Singleton';

export default class TestSingletonWithReady extends Singleton {
    construct() {
        this.notReady = true;
    }

    listens() {
        return {
            ready: 'ready',
        };
    }

    ready() {
        this.notReady = false;
    }
}
