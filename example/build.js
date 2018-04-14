const fs = require('fs-extra')
const webpack = require('webpack')

const compiler = webpack(require('./webpack.config'))

fs.writeFileSync('./example/package.json', '{}', 'utf8')

compiler.run((err, stats) => {
  if (err) return console.error(err)
  console.log(stats.toString({
    colors: true,
    chunks: false,
    children: false,
    modules: false
  }))

  fs.remove('./example/package.json')
})
