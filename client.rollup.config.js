import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy'

export default {
    input: 'src/client/index.js',
    output: {
        file: 'output/static/main.js',
        sourcemap: true,
        format: 'iife',
        name: 'main'
    },
    plugins: [
        nodeResolve({
            browser:true,
        }),
        commonjs(),
        copy({
            targets: [{ src: 'src/web/*', dest: 'output/static' }]
        })
    ]
};