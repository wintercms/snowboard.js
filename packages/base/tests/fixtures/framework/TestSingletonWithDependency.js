import Singleton from '../../../src/abstracts/Singleton';

export default class TestSingletonWithDependency extends Singleton {
    dependencies() {
        return ['testDependencyOne'];
    }

    listens() {
        return {
            ready: 'ready',
        };
    }

    ready() {
        return 'Ready';
    }

    testMethod() {
        return 'Tested';
    }

    dependencyTest() {
        return this.snowboard.testDependencyOne().testMethod();
    }
}
