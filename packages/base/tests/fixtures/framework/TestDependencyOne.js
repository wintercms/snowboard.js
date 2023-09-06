import Singleton from '../../../src/abstracts/Singleton';

export default class TestDependencyOne extends Singleton {
    testMethod() {
        return 'Tested';
    }
}
