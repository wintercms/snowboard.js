import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/browser.js',
    external: [
        '@wintercms/snowboard',
    ],
    output: [
        {
            file: 'dist/snowboard-controls.js',
            format: 'iife',
            globals: {
                '@wintercms/snowboard': 'Snowboard',
            },
        },
        {
            file: 'dist/snowboard-controls.min.js',
            format: 'iife',
            plugins: [terser({ format: { comments: false } })],
            globals: {
                '@wintercms/snowboard': 'Snowboard',
            },
        },
    ],
    plugins: [
        nodeResolve(),
        babel({ babelHelpers: 'runtime', exclude: '**/node_modules/**' }),
    ],
};
