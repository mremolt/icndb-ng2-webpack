var path = require('path');

// webpack plugins
var webpack = require('webpack');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var AppCachePlugin = require('appcache-webpack-plugin');

// postcss
var autoprefixer = require('autoprefixer');
var pixrem = require('pixrem');
var cssnano = require('cssnano');

// base settings
var rootPath = path.join(__dirname, '..');
var srcPath = path.join(rootPath, 'src');
var buildPath = path.join(rootPath, 'build', 'production');


module.exports = {
  debug: false,
  entry: path.join(srcPath, 'main.ts'),
  output: {
    path: buildPath,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js']
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['development', 'production'], {
      root: path.join(rootPath, 'build'),
      verbose: true
    }),
    new ForkCheckerPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(srcPath, 'index.ejs'),
      env: 'production'
    }),
    new CopyWebpackPlugin([
      { from: path.join(srcPath, 'assets'), to: path.join('assets') }
    ]),
    new WebpackMd5Hash(),
    new DedupePlugin(),
    new UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8 : true,
        keep_fnames: true
      }, //prod
      compress: {
        screw_ie8: true
      },
      comments: false
    }),
    new AppCachePlugin({
      settings: ['prefer-online'],
      output: 'application.manifest'
    })
  ],
  module: {
    loaders: [
      {
          test:   /\.scss$/,
          loader: 'style!css!postcss!sass'
      },
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
      },
      { test: /\.jpg$/, loader: "file-loader" },
      { test: /\.png$/, loader: "file-loader" },
      { test: /\.gif$/, loader: "file-loader" },
      { test: /\.ttf$/, loader: "file-loader" },
      { test: /\.woff$/, loader: "file-loader" },
      { test: /\.eot$/, loader: "file-loader" },
      { test: /\.svg$/, loader: "file-loader" },
    ]
  },
  postcss: function() {
    return [
      autoprefixer({ browsers: 'last 2 versions, ie > 9, safari >= 8' }),
      pixrem,
      cssnano
    ];
  }
}
