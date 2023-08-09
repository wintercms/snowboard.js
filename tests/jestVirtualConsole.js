const {VirtualConsole} = require('jsdom');

const virtualConsole = new VirtualConsole();

// Suppress errors regarding being unable to load assets
virtualConsole.on('jsdomError', (error) => {
    if (error.message.startsWith('Could not load')) {
        return;
    }
    if (error.message.startsWith('Unable to load')) {
        return;
    }
});

module.exports = virtualConsole;
