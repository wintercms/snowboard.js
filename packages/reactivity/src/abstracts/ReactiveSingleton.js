import { Singleton } from '@wintercms/snowboard';
import { reactivityConstructor, reactivityMount } from '../lib/reactivity';
import { template, mountTo } from '../lib/template';

/**
 * Reactive singleton abstract.
 *
 * This class provides the base functionality for reactive singletons. Reactive plugins are imbued
 * with Vue functionality to allow for reactivity and quick DOM manipulation. Singletons only allow
 * one instance of the plugin to be used in a global capacity.
 *
 * Vue functionality is supplied by the `petite-vue` library, which is a lightweight version of
 * Vue and doesn't have the full feature list of Vue. See https://github.com/vuejs/petite-vue/ for
 * more information on what is available.
 *
 * @copyright 2023 Winter.
 * @author Ben Thomson <git@alfreido.com>
 */
class ReactiveSingleton extends Singleton {
    constructor(snowboard) {
        super(snowboard);
        reactivityConstructor.call(this);
    }

    construct() {
    }
}

ReactiveSingleton.prototype.$mount = reactivityMount;
ReactiveSingleton.prototype.template = template;
ReactiveSingleton.prototype.mountTo = mountTo;

export default ReactiveSingleton;
