const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const VENDOR_LIBS = [ "axios", "lodash", "prop-types", "react", "react-dnd", "react-dnd-html5-backend", "react-dom",
                      "react-page-click", "react-redux", "react-router", "react-router-dom", "redux", "redux-form",
                      "redux-promise", "redux-thunk" ];

console.log(' *** webpack: process.env.NODE_ENV', process.env.NODE_ENV);

/* Webpack Loaders */
// Babel Loader.
const babelLoader = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: "babel-loader"
    }
};

// CSS, PostCSS Loader.
const cssLoader = {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            {
                loader: "css-loader",
                // We’re setting this because we want PostCSS to @import statements first.
                options: { importLoaders: 1, sourceMap: true }
            },
            {
                loader: "postcss-loader",
                options: { sourceMap: true }
            }
        ]
    })
};

// Array of Loaders.
const rules = [
    babelLoader,
    cssLoader
];

const config = {
    entry: {
        bundle: "./src/index.js",
        vendor: VENDOR_LIBS
    },
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, "build"),
        filename: "[name].[chunkhash].js"
    },
    // Loaders.
    module: {
        rules: rules
    },
    plugins: [
        // webpack.DefinePlugin define window scope variable NODE_ENV.
        // and assigns corresponding value to it.
        new webpack.DefinePlugin({
            // NODE_ENV NODE.JS environment variable, we will set
            // value for it manually.
            // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new ExtractTextPlugin("styles.css"),
        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendor", 'manifest']
        }),
        new HtmlWebpackPlugin({
            template: "src/index.html"
        })
    ]
};

module.exports = config;
