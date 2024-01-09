import Control from './abstracts/Control';
import ControlHandler from './lib/ControlHandler';

if (!window.Snowboard) {
    throw new Error('Snowboard must be loaded before any other packages.');
}

window.Snowboard.addAbstract('Control', Control);
window.Snowboard.addPlugin('controls', ControlHandler);
