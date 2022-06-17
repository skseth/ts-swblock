## Enabling ESM Support in nodejs, with modern node resolution

[ESM](https://nodejs.org/dist./v12.12.0/docs/api/esm.html#esm_ecmascript_modules) is enabled by setting `type:module` in package.json.

When this is done you have the following changes in your node project :

- import must be used in your javascript files
- extension is mandatory (e.g. import x from './dir/file.js')
- imported esm modules must follow url semantics. # and ? have to be escaped in the import specifier.
- NODE_PATH not used for resolving import specifiers, symlinks have to be used

- No exports, module.exports, \_\_dirname, \_\_file are unavailable (but can be reproduced).
- No require, require.extensions, require.cache. module.createRequire() can be used if needed.
- import() can be used by commonjs modules to import ESM modules.
- builtins are actually commonjs modules with ESM wrappers. So monkey-patching builtins needs module.syncBuiltinESMExports().

In addition, nodejs adds support for ["exports" in package.json](https://nodejs.org/api/packages.html#package-entry-points), for both commonjs and esm modules. Also [top-level async-await is available](https://stackoverflow.com/questions/56238356/understanding-esmoduleinterop-in-tsconfig-file)

- [import vs require](https://www.voidcanvas.com/import-vs-require/)
- [Getting Started with (and Surviving) Node.js ESM](https://formidable.com/blog/2021/node-esm-and-exports/)

Things become a little harder when we throw in typescript and webpack.

## Enabling ESM in Typescript

To support esm modules in typescript, set `module: 'esnext'`, in tsconfig.json. This ensures that the rules listed above are enforced.

When this is generated, the changes described for nodejs become enabled i.e. import vs require etc.

To enable use of commonjs modules properly in typescript, we should use esModuleInterop (which also enables another flag, allowSyntheticDefaultImports). For understanding the impact, [see this stackoverflow question.](https://stackoverflow.com/questions/56238356/understanding-esmoduleinterop-in-tsconfig-file).

The other part is moduleResolution. You can use `moduleResolution: 'node'` in tsconfig.json, and the resolution will behave pretty much as it does for commonjs.
**EXCEPT**: Typescript will not look at package.exports field for resolving 'modules' redirected via paths setting in tsconfig.json. It will only look at types, typings etc in the root of the package.json of the imported module.

You can also set `moduleResolution: nodenext`. This now picks up package.exports settings.
**EXCEPT**, it unfortunately seems to break baseUrl / paths lookup which work perfectly well with `moduleResolution: node`. To make compilation with tsc work, I have had to use the 'workspaces' feature in package.json to created symlinks to packages folder, to allow accessing package libraries with '@lib/\*' alias.

A key impact of nodenext resolution is that you have to use the '.js' extension for relative paths even for typescript files. e.g. a relative import `import {x} from ./util.js` to import `util.ts` in the same folder. This impacts webpack as given below.

## Enabling ESM in webpack

Using ts-loader with webpack takes care of working with esm modules quite well.

But, doing imports with `import {x} from ./util.js` makes webpack unable to locate `util.ts`. To make this work we have to install a resolve plugin

```javascript
  resolve: {
    plugins: [new ResolveTypescriptPlugin()],
  },
```

An alternative is to use [tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths).

## VScode

As long as you use the standard-approved syntax, vscode works fine with esnext and nodenext. But you need to create symlinks using the `npm workspaces` feature to allow vscode to resolve aliased references.

## Acknowledgements

- [Chrome Extension Webpack](https://github.com/sszczep/chrome-extension-webpack) : ideas on organizing typescript project for chrome extensions

- [Block Service Worker extension](https://github.com/clod81/block_service_workers) : Basic strtategy of redirecting navigator.serviceworker.registration.
