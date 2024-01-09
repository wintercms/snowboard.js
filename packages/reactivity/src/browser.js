import ReactivePluginBase from './abstracts/ReactivePluginBase';
import ReactiveSingleton from './abstracts/ReactiveSingleton';
import ReactiveComponent from './abstracts/ReactiveComponent';

if (!window.Snowboard) {
    throw new Error('Snowboard must be loaded before any other packages.');
}

window.Snowboard.addAbstract('ReactiveSingleton', ReactiveSingleton);
window.Snowboard.addAbstract('ReactivePluginBase', ReactivePluginBase);
window.Snowboard.addAbstract('ReactiveComponent', ReactiveComponent);
