const babel = require("rollup-plugin-babel"),
    resolve = require("rollup-plugin-node-resolve"),
    commonjs = require("rollup-plugin-commonjs"),
    replace = require("rollup-plugin-replace"),
    alias = require('rollup-plugin-alias'),
    typescript = require('rollup-plugin-typescript2'),
    {
        terser
    } = require('rollup-plugin-terser'),
    {
        DEFAULT_EXTENSIONS
    } = require('@babel/core'),
    filesize = require('rollup-plugin-filesize'),
    progress = require('rollup-plugin-progress');

module.exports = {
    input: "./src/lazys.ts",
    onwarn(warning, warn) {
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        warn(warning); // this requires Rollup 0.46
    },
    output: {
        file: "./dist/lazys.min.js",
        format: 'umd',
        // sourcemap: true,
    },
    plugins: [
        progress(),
        alias(),
        resolve({
            mainFields: ['jsnext:main'],
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            browser: true,
        }),
        commonjs({
            sourceMap: false,
        }),
        typescript({
            clean: true,
            check: false,
        }),
        babel({
            exclude: /node_modules\/(?!(dom7|swiper|vue|vuex|@fullcalendar)\/).*/,
            runtimeHelpers: true,
            presets: [
                [
                    "@babel/preset-env",
                    {
                        targets: {
                            ie: "10",
                            edge: "16",
                            firefox: "52",
                            chrome: "67",
                            safari: "9",
                        },
                        useBuiltIns: "usage",
                        corejs: 3,
                        modules: false,
                    },
                ]
            ],
            extensions: [
                ...DEFAULT_EXTENSIONS,
                '.js',
                '.jsx',
                '.ts',
                '.tsx'
            ]
        }),
        filesize(),
        terser({
            // output: {
            //     comments: function (node, comment) {
            //         var text = comment.value;
            //         var type = comment.type;
            //         console.log(type)
            //         if (type == "comment2") {
            //             return /@preserve|@license|(c)|@cc_on/i.test(text);
            //         }
            //     }
            // }
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    ],
};