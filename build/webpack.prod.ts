import * as webpack from 'webpack'
import { merge } from 'webpack-merge'
import common from './webpack.common'

module.exports = merge<webpack.Configuration>(common, {
  mode: 'production',
  optimization: {
    usedExports: true,
  },
  devtool: 'inline-source-map',
})
