const ExtractTextPlugin = require('extract-text-webpack-plugin');
const helpers = require('./helpers');

const extractPlugin = new ExtractTextPlugin({
  filename: 'main.css',
});

module.exports = {
  context: helpers.root('src'),
  entry: {
    index: [
      './index.js',
      './css/main.scss',
    ],
  },
  output: {
    path: __dirname,
    publicPath: '/dist',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: extractPlugin.extract({
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    extractPlugin,
  ],
};
