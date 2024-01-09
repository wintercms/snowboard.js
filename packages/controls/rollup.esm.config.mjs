import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/esm.js',
    external: [
        '@wintercms/snowboard',
    ],
    output: [
        {
            file: 'dist/snowboard-controls.esm.js',
            format: 'esm',
        }
    ],
    plugins: [
        nodeResolve(),
    ],
};
