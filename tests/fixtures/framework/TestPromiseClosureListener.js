import Singleton from '../../../src/abstracts/Singleton';

export default class TestPromiseClosureListener extends Singleton {
    listens() {
        return {
            promiseOne: (arg) => new Promise((resolve) => {
                window.setTimeout(() => {
                    this.eventResult = `Event called with arg ${arg}`;
                    resolve();
                }, 500);
            }),
            promiseTwo: (arg) => {
                this.eventResult = `Promise two called with arg ${arg}`;
                return true;
            },
        };
    }
}
