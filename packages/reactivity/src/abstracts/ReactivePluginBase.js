import { PluginBase } from '@wintercms/snowboard';
import {
    reactivityConstructor,
    reactivityInitialize,
    reactivityGetProperties,
    reactivityCreateStore,
    reactivityMapProperties,
    reactivityTemplate,
    reactivityMount,
} from './shared';

class ReactivePluginBase extends PluginBase {
    constructor(snowboard) {
        super(snowboard);
        reactivityConstructor.call(this);
    }
}

ReactivePluginBase.prototype.reactivityInitialize = reactivityInitialize;
ReactivePluginBase.prototype.reactivityGetProperties = reactivityGetProperties;
ReactivePluginBase.prototype.reactivityCreateStore = reactivityCreateStore;
ReactivePluginBase.prototype.reactivityMapProperties = reactivityMapProperties;
ReactivePluginBase.prototype.reactivityTemplate = reactivityTemplate;
ReactivePluginBase.prototype.reactivityMount = reactivityMount;

export default ReactivePluginBase;
