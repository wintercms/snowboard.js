import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/main.js',
    output: [
        {
            file: 'dist/snowboard.js',
            format: 'iife',
        },
        {
            file: 'dist/snowboard.min.js',
            format: 'iife',
            plugins: [terser({ format: { comments: false } })],
        },
    ],
    plugins: [
        nodeResolve(),
        babel({ babelHelpers: 'runtime', exclude: '**/node_modules/**' }),
    ],
};
