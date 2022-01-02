import {nodeResolve} from '@rollup/plugin-node-resolve';
import externals from 'rollup-plugin-node-externals'
import run from '@rollup/plugin-run';

export default {
    input: 'src/server/index.js',
    output: {
        file: 'output/server.js',
        format: 'cjs',
        sourcemap:true,
    },
    plugins: [externals({deps:true}), nodeResolve(),run()]
};