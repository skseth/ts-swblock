import * as path from 'path'
import webpack from 'webpack'
import DotenvPlugin from 'dotenv-webpack'
import ESLintPlugin from 'eslint-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ResolveTypescriptPlugin from 'resolve-typescript-plugin'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename)
// import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const ROOT_PATH = path.join(__dirname, '..')
const APP_PATH = path.join(ROOT_PATH, 'apps')
const BG_PATH = path.join(APP_PATH, 'background')
const CONTENT_PATH = path.join(APP_PATH, 'content')
const PAGE_PATH = path.join(APP_PATH, 'page')
const POPUP_PATH = path.join(APP_PATH, 'popup')

function tsBuild(
  instance: string,
  basepath: string,
  include?: string[],
): webpack.RuleSetRule {
  if (typeof include === 'undefined') {
    include = [basepath]
  }
  return {
    test: /\.ts$/,
    include,
    use: {
      loader: 'ts-loader',
      options: {
        instance: instance,
        configFile: path.join(basepath, 'tsconfig.json'),
        onlyCompileBundledFiles: true,
        projectReferences: true,
      },
    },
  }
}

const config: webpack.Configuration = {
  context: ROOT_PATH,
  entry: {
    background: path.join(BG_PATH, 'src', 'index.ts'),
    'content-script': path.join(CONTENT_PATH, 'src', 'index.ts'),
    'inject-stop-registrations': path.join(
      PAGE_PATH,
      'src',
      'inject-stop-registrations.ts',
    ),
    'inject-apply-preferences': path.join(
      PAGE_PATH,
      'src',
      'inject-apply-preferences.ts',
    ),
    'inject-remove-registration': path.join(
      PAGE_PATH,
      'src',
      'inject-remove-registration.ts',
    ),
    popup: path.join(POPUP_PATH, 'src', 'index.ts'),
  },
  module: {
    rules: [
      tsBuild('bg', BG_PATH),
      tsBuild('content-script', CONTENT_PATH),
      tsBuild('page', PAGE_PATH),
      tsBuild('popup', POPUP_PATH),
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    /***** 
        This is plugin is necessary as we are using "esnext" modules with "nodenext" module resolution 
        This means our typescript files have statements like "import x from './util.js'" where ./util.ts 
        exists, but there is no ./util.js file.

        VSCode and TSC take care of this, but webpack doesn't, hence the plugin.
    *****/
    plugins: [new ResolveTypescriptPlugin()],
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
      patterns: [{ from: 'apps/static' }],
    }),
  ],
}

export default config
