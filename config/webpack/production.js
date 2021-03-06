const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies

const defaultConfig = require('./default');

module.exports = webpackMerge(defaultConfig, {
  module: {
    rules: [{
      test: /\.(eot|svg|ttf|woff)$/,
      include: /src\/assets\/fonts/,
      loader: 'file-loader',
      options: {
        outputPath: '/fonts/',
        publicPath: '/fonts/',
      },
    }, {
      test: /\.scss$/,
      exclude: /(bower_components|node_modules)/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            importLoaders: 3,
            localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
            modules: true,
          },
        }, 'resolve-url-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer,
            ],
          },
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }],
      }),
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new ExtractTextPlugin('style.css'),
    new OptimizeCssAssetsPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ],
});
