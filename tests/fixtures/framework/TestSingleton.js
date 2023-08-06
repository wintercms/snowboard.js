import Singleton from '../../../src/abstracts/Singleton';

export default class TestSingleton extends Singleton {
    testMethod() {
        return 'Tested';
    }
}
