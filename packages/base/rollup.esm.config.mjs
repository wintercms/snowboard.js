import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/esm.js',
    external: [
        'js-cookie',
        'json5'
    ],
    output: [
        {
            file: 'dist/snowboard.esm.js',
            format: 'esm',
        }
    ],
    plugins: [
        nodeResolve(),
    ],
};
