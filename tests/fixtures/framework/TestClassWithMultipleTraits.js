import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestClassWithMultipleTraits extends PluginBase {
    construct() {
        this.internalProperty = 'Internal property';
    }

    internalMethod() {
        return 'Internal method called';
    }

    traits() {
        return [
            'TestTrait',
            'TestTraitTwo',
        ];
    }
}
