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
var buildPath = path.join(rootPath, 'build', 'development');

module.exports = {
  debug: true,
  entry: path.join(srcPath, 'main.ts'),
  output: {
    path: buildPath,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js']
  },
  devtool: 'cheap-module-eval-source-map',
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
      foo: 'bar',
      env: 'development'
    }),
    new CopyWebpackPlugin([
     { from: path.join(srcPath, 'assets'), to: path.join('assets') }
    ])
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
      pixrem
    ];
  },
  devServer: {
    hot: false,
    contentBase: buildPath,
    outputPath: buildPath
  }
}
