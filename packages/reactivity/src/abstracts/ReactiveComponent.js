import { PluginBase } from '@wintercms/snowboard';
import { componentConstructor } from '../lib/components';
import { template } from '../lib/template';

/**
 * Reactive component abstract.
 *
 * This class provides the base functionality for reactive components. Reactive components can be
 * used within reactive templates to provide reactivity and interactivity for reusable components.
 *
 * Vue functionality is supplied by the `petite-vue` library, which is a lightweight version of
 * Vue and doesn't have the full feature list of Vue. See https://github.com/vuejs/petite-vue/ for
 * more information on what is available.
 *
 * @copyright 2023 Winter.
 * @author Ben Thomson <git@alfreido.com>
 * @abstract
 * @mixes Reactivity
 */
class ReactiveComponent extends PluginBase {
    constructor(snowboard) {
        super(snowboard);
        componentConstructor.call(this);
    }

    construct() {
    }
}

ReactiveComponent.prototype.template = template;

export default ReactiveComponent;
