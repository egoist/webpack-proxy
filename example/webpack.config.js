const path = require('path')
const proxy = require('../')

module.exports = {
  mode: 'development',
  entry: './example/index.js',
  output: {
    path: path.resolve('example/dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: proxy({
          loader: 'buble-loader',
          options: {
            objectAssign: 'assign'
          }
        })
      }
    ]
  }
}
