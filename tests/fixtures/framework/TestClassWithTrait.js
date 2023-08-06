import PluginBase from '../../../src/abstracts/PluginBase';

export default class TestClassWithTrait extends PluginBase {
    construct() {
        this.internalProperty = 'Internal property';
        this.inferredProperty = 'Inferred property';
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
