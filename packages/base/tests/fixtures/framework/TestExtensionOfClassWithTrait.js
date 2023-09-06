/* eslint-disable max-classes-per-file */
import PluginBase from '../../../src/abstracts/PluginBase';

class TestClassWithTrait extends PluginBase {
    construct() {
        this.internalProperty = 'Internal property';
    }

    internalMethod() {
        return 'Internal method called';
    }

    traits() {
        return [
            'TestTrait',
        ];
    }
}

class TestExtensionOfClassWithTrait extends TestClassWithTrait {
    extendedMethod() {
        return 'Extension method called';
    }

    testMethodTwo() {
        return 'Overridden method called';
    }

    traits() {
        return [
            'TestTraitTwo',
        ];
    }
}

export {
    TestClassWithTrait,
    TestExtensionOfClassWithTrait,
};
