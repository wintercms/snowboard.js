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

/**
 * Reactive plugin base abstract.
 *
 * This class provides the base functionality for reactive plugins. Reactive plugins are imbued with
 * Vue functionality to allow for reactivity and quick DOM manipulation.
 *
 * Vue functionality is supplied by the `petite-vue` library, which is a lightweight version of
 * Vue and doesn't have the full feature list of Vue. See https://github.com/vuejs/petite-vue/ for
 * more information on what is available.
 *
 * @copyright 2023 Winter.
 * @author Ben Thomson <git@alfreido.com>
 */
class ReactivePluginBase extends PluginBase {
    constructor(snowboard) {
        super(snowboard);
        reactivityConstructor.call(this);
    }

    construct() {
    }
}

ReactivePluginBase.prototype.reactivityInitialize = reactivityInitialize;
ReactivePluginBase.prototype.reactivityGetProperties = reactivityGetProperties;
ReactivePluginBase.prototype.reactivityCreateStore = reactivityCreateStore;
ReactivePluginBase.prototype.reactivityMapProperties = reactivityMapProperties;
ReactivePluginBase.prototype.reactivityTemplate = reactivityTemplate;
ReactivePluginBase.prototype.reactivityMount = reactivityMount;

export default ReactivePluginBase;
