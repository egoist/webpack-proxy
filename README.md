
# webpack-proxy

[![NPM version](https://img.shields.io/npm/v/webpack-proxy.svg?style=flat)](https://npmjs.com/package/webpack-proxy) [![NPM downloads](https://img.shields.io/npm/dm/webpack-proxy.svg?style=flat)](https://npmjs.com/package/webpack-proxy) [![CircleCI](https://circleci.com/gh/egoist/webpack-proxy/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/webpack-proxy/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate) [![chat](https://img.shields.io/badge/chat-on%20discord-7289DA.svg?style=flat)](https://chat.egoist.moe)

<img src="https://cdn.rawgit.com/egoist/76286067838fbd60db786b5a75df386c/raw/63a63a8f0a732f17e38427e33daa8ab79beec7d6/webpack-proxy.svg" alt="preview" width="500">

## Install

```bash
yarn add webpack-proxy
```

## Usage

Let's say you want to use `buble-loader`, you can just add it to your webpack config __without__ installing `buble-loader` and `buble`, since `webpack-proxy` will handle that for you!

📝 webpack.config.js:

```js
const proxy = require('webpack-proxy')

module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: proxy({
          loader: 'buble-loader',
          options: {
            // ...loader options
          }
        })
      }
    ]
  }
}
```

## API

### proxy(UseEntry)

Return an array of [UseEntry](https://webpack.js.org/configuration/module/#useentry).

### proxy.chain(Rule, UseEntry)

Add UseEntry to certain [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) rule.

## Credits

Heavily inspired by Parcel bundler and preact-cli.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**webpack-proxy** © [egoist](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/egoist/webpack-proxy/contributors)).

> [github.com/egoist](https://github.com/egoist) · GitHub [@egoist](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
