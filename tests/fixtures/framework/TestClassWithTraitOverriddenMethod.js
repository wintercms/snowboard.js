import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestClassWithTraitOverriddenMethod extends PluginBase {
    construct() {
        this.internalProperty = 'Internal property';
        this.traitProperty = 'Overridden property';
    }

    testMethod() {
        return 'Overridden method called';
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
