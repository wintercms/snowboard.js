import Singleton from '../../../src/abstracts/Singleton';

export default class TestClosureListener extends Singleton {
    listens() {
        return {
            eventOne: () => {
                this.eventResult = 'Closure eventOne called';
            },
            eventTwo: (arg) => {
                this.eventResult = `Closure eventTwo called with arg '${arg}'`;
            },
        };
    }
}
