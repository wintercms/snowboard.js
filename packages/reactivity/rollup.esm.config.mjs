import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/esm.js',
    external: [
        '@wintercms/snowboard',
        'petite-vue',
    ],
    output: [
        {
            file: 'dist/snowboard-reactivity.esm.js',
            format: 'esm',
        }
    ],
    plugins: [
        nodeResolve(),
    ],
};
