const proxy = (loader, options) => {
  options = options || {}
  return [
    {
      loader: require.resolve('./proxy-loader'),
      options: loader
    },
    {
      loader: require.resolve('./ensure-loader'),
      options: Object.assign({
        loader: loader.loader
      }, options)
    }
  ]
}

proxy.chain = (rule, loader, options) => {
  proxy(loader, options).forEach((use, index) => {
    const name = index === 0 ? 'proxy-loader' : 'ensure-loader'
    rule.use(name)
      .loader(use.loader)
      .options(use.options)
  })

  return rule
}

module.exports = proxy
