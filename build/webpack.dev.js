const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false,
      terserOptions: {
          compress: {
              defaults: false,
              unused: true
          },
          mangle: false,
          format: {
              comments: 'all'
          }
      }
  })]
  },
});
