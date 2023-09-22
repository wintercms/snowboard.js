import ReactivePluginBase from './abstracts/ReactivePluginBase';
import ReactiveSingleton from './abstracts/ReactiveSingleton';
import ReactiveComponent from './abstracts/ReactiveComponent';

window.Snowboard.addAbstract('ReactiveSingleton', ReactiveSingleton);
window.Snowboard.addAbstract('ReactivePluginBase', ReactivePluginBase);
window.Snowboard.addAbstract('ReactiveComponent', ReactiveComponent);
