const proxy = loader => {
  return [
    {
      loader: require.resolve('./proxy-loader'),
      options: loader
    },
    {
      loader: require.resolve('./ensure-loader'),
      options: loader
    }
  ]
}

proxy.chain = (rule, loader) => {
  proxy(loader).forEach((use, index) => {
    const name = index === 0 ? 'proxy-loader' : 'ensure-loader'
    rule.use(name)
      .loader(use.loader)
      .options(use.options)
  })

  return rule
}

module.exports = proxy
