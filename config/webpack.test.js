var path = require('path');
var autoprefixer = require('autoprefixer');
var pixrem = require('pixrem');

var webpack = require('webpack');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var rootPath = path.join(__dirname, '..');
var srcPath = path.join(rootPath, 'src');
var buildPath = path.join(rootPath, 'build', 'test');

module.exports = {
  debug: true,
  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js'],
    root: srcPath
  },
  devtool: 'inline-source-map',
  plugins: [
  ],
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'source-map-loader' }
    ],

    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.tpl.html$/,
        loader: 'raw'
      },
      {
        test: /breakpoints\.js$/,
        loader: "exports?Breakpoints"
      }
    ],

    postLoaders: [

      // Instruments JS files with Istanbul for subsequent code coverage reporting.
      // Instrument only testing sources.
      //
      // See: https://github.com/deepsweet/istanbul-instrumenter-loader
      {
        test: /\.ts$/, loader: 'istanbul-instrumenter-loader',
        include: srcPath,
        exclude: [
          /\.(test\/e2e|unit)\.ts$/,
          /node_modules/
        ]
      }

    ]
  },
  postcss: function() {
    return [
      autoprefixer({ browsers: 'last 2 versions, ie > 9, safari >= 8' }),
      pixrem
    ];
  },
  devServer: {
    hot: false,
    contentBase: buildPath,
  }
}
