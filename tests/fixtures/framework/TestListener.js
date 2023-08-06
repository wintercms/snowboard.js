import Singleton from '../../../src/abstracts/Singleton';

export default class TestListener extends Singleton {
    listens() {
        return {
            eventOne: 'eventOne',
            eventTwo: 'notExists',
        };
    }

    eventOne(arg) {
        this.eventResult = `Event called with arg ${arg}`;
    }
}
