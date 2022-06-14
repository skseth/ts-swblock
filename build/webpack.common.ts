import * as path from 'path'
import DotenvPlugin from 'dotenv-webpack'
import ESLintPlugin from 'eslint-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// const DotenvPlugin = require('dotenv-webpack');
// const ESLintPlugin = require('eslint-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ROOT_PATH = path.join(__dirname, '..')
const SRC_PATH = path.join(ROOT_PATH, 'src')
const BG_PATH = path.join(SRC_PATH, 'background')
const CONTENT_PATH = path.join(SRC_PATH, 'content')
const PAGE_PATH = path.join(SRC_PATH, 'page')
const POPUP_PATH = path.join(SRC_PATH, 'popup')

export default {
  entry: {
    background: path.join(BG_PATH, 'index.ts'),
    'content-script': path.join(CONTENT_PATH, 'index.ts'),
    'inject-stop-registrations': path.join(
      PAGE_PATH,
      'inject-stop-registrations',
    ),
    'inject-apply-preferences': path.join(
      PAGE_PATH,
      'inject-apply-preferences',
    ),
    'inject-remove-registration': path.join(
      PAGE_PATH,
      'inject-remove-registration',
    ),
    popup: path.join(POPUP_PATH, 'index.ts'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [CONTENT_PATH],
        use: [
          {
            loader: 'ts-loader',
            options: {
              instance: 'content-script',
              configFile: path.join(CONTENT_PATH, 'tsconfig.json'),
              onlyCompileBundledFiles: true,
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        include: [BG_PATH],
        use: [
          {
            loader: 'ts-loader',
            options: {
              instance: 'bg',
              configFile: path.join(BG_PATH, 'tsconfig.json'),
              onlyCompileBundledFiles: true,
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        include: [PAGE_PATH],
        use: [
          {
            loader: 'ts-loader',
            options: {
              instance: 'page',
              configFile: path.join(PAGE_PATH, 'tsconfig.json'),
              onlyCompileBundledFiles: true,
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        include: [POPUP_PATH],
        use: [
          {
            loader: 'ts-loader',
            options: {
              instance: 'popup',
              configFile: path.join(POPUP_PATH, 'tsconfig.json'),
              onlyCompileBundledFiles: true,
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        include: [
          path.join(SRC_PATH, 'shared'),
          path.join(SRC_PATH, 'shared-bg'),
        ],
        use: [
          {
            loader: 'ts-loader',
            options: {
              instance: 'shared',
              configFile: path.join(CONTENT_PATH, 'tsconfig.json'),
              onlyCompileBundledFiles: true,
            },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(ROOT_PATH, 'dist'),
    clean: true,
  },
  plugins: [
    new DotenvPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'ts'],
      overrideConfigFile: path.resolve(ROOT_PATH, '.eslintrc'),
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    new CopyPlugin({
      patterns: [{ from: 'static' }],
    }),
  ],
}
