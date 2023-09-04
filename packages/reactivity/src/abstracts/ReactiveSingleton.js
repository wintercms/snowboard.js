import { Singleton } from '@wintercms/snowboard';
import {
    reactivityConstructor,
    reactivityInitialize,
    reactivityGetProperties,
    reactivityCreateStore,
    reactivityMapProperties,
    reactivityTemplate,
    reactivityMount,
} from './shared';

class ReactiveSingleton extends Singleton {
    constructor(snowboard) {
        super(snowboard);
        reactivityConstructor.call(this);
    }
}

ReactiveSingleton.prototype.reactivityInitialize = reactivityInitialize;
ReactiveSingleton.prototype.reactivityGetProperties = reactivityGetProperties;
ReactiveSingleton.prototype.reactivityCreateStore = reactivityCreateStore;
ReactiveSingleton.prototype.reactivityMapProperties = reactivityMapProperties;
ReactiveSingleton.prototype.reactivityTemplate = reactivityTemplate;
ReactiveSingleton.prototype.reactivityMount = reactivityMount;

export default ReactiveSingleton;
