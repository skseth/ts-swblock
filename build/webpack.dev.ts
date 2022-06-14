import * as webpack from 'webpack'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import webpackDevServer from 'webpack-dev-server'
import { merge } from 'webpack-merge'
import common from './webpack.common'
import TerserPlugin from 'terser-webpack-plugin'

export default merge<webpack.Configuration>(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            defaults: false,
            unused: true,
          },
          mangle: false,
          format: {
            comments: 'all',
          },
        },
      }),
    ],
  },
})
