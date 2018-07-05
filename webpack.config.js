const webpack = require('webpack');
require('es6-promise').polyfill();
let path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let srcPath = path.join(__dirname, 'src');
let stylePath = path.join(__dirname, 'styles');
let nodePath = path.resolve(__dirname, "node_modules");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "8080";

const webpackConfig =  (env, argv) => {console.log(argv.mode);return {
    entry: [
        './src/index.js',
        './styles/index.scss'
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: srcPath,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(scss)$/,
                use: [
                    argv.mode==='development'?"style-loader":MiniCssExtractPlugin.loader,
                    "css-loader", {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            precision: 8,
                            data: "$ENV: " + "PRODUCTION" + ";"
                        },
                    }],
            },
            {
                test: /\.css$/,
                include: [srcPath],
                use: [
                    argv.mode==='development'?"style-loader":MiniCssExtractPlugin.loader,
                    "css-loader"],
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000&mimetype=application/octet-stream"
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: "file-loader"
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000&mimetype=image/svg+xml"
            }, {
                test: /\.png$/,
                use: "url-loader?mimetype=image/png"
            },
            {
                test: /\.jpg$/,
                use: "url-loader?mimetype=image/jpg"
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin("bundle.css"),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            files: {
                css: ['bundle.css'],
                js: [ "bundle.js"]
            }
        })
    ],


    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        // embed the webpack-dev-server runtime into the bundle
        inline: true,
        // serve index.html in place of 404 responses to allow HTML5 history
        historyApiFallback: true,
        port: PORT,
        host: HOST
    }
}};

module.exports = webpackConfig;