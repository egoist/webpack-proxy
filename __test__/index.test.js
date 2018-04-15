const Config = require('webpack-chain')
const proxy = require('../lib')

test('chain', () => {
  const config = new Config()
  const rule = config.module.rule('js').test(/\.js$/)
  proxy.chain(rule, {
    loader: 'babel-loader',
    options: {
      babelrc: false
    }
  }, {
    version: '^1.0.0',
    dependencies: ['lol@^2.0.1']
  })
  expect(rule.uses.has('ensure-loader')).toBe(true)
  expect(rule.uses.has('proxy-loader')).toBe(true)

  for (const name in rule.uses.entries()) {
    expect(rule.use(name).get('options')).toMatchSnapshot(name)
  }
})
