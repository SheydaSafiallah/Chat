import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy'
import externals from "rollup-plugin-node-externals";
import run from "@rollup/plugin-run";

export default [{
    input: 'src/client/index.js',
    output: {
        file: 'output/static/main.js',
        sourcemap: true,
        format: 'iife',
        name: 'main'
    },
    plugins: [
        nodeResolve({
            browser: true,
        }),
        commonjs(),
        copy({
            targets: [{src: 'src/web/*', dest: 'output/static'}]
        })
    ]
}, {
    input: 'src/server/index.js',
    output: {
        file: 'output/server.js',
        format: 'cjs',
        sourcemap: true,
    },
    plugins: [externals({deps: true}), nodeResolve(), run()]
}]