module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: '> 0.5%, last 2 versions, not dead, Firefox ESR, not ie > 0',
            },
        ],
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
    ],
};
