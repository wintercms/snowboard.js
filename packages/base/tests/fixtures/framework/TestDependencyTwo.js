import Singleton from '../../../src/abstracts/Singleton';

export default class TestDependencyTwo extends Singleton {
    testMethod() {
        return 'Tested';
    }
}
