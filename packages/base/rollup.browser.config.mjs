import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/browser.js',
    output: [
        {
            file: 'dist/snowboard.js',
            format: 'iife',
            name: 'Snowboard',
        },
        {
            file: 'dist/snowboard.min.js',
            format: 'iife',
            plugins: [terser({ format: { comments: false } })],
            name: 'Snowboard',
        },
    ],
    plugins: [
        nodeResolve(),
        babel({ babelHelpers: 'runtime', exclude: '**/node_modules/**' }),
    ],
};
