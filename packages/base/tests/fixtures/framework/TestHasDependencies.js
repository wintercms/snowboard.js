import Singleton from '../../../src/abstracts/Singleton';

export default class TestHasDependencies extends Singleton {
    dependencies() {
        return ['testDependencyOne', 'testDependencyTwo'];
    }

    testMethod() {
        return 'Tested';
    }
}
