const Config = require('webpack-chain')
const proxy = require('..')

test('chain', () => {
  const config = new Config()
  const rule = config.module.rule('js').test(/\.js$/)
  proxy.chain(rule, {
    loader: 'babel-loader',
    options: {
      babelrc: false
    }
  })
  expect(rule.uses.has('ensure-loader')).toBe(true)
  expect(rule.uses.has('proxy-loader')).toBe(true)
  config.toConfig().module.rules[0].use.forEach(use => {
    expect(use.options).toEqual({
      loader: 'babel-loader',
      options: {
        babelrc: false
      }
    })
  })
})
