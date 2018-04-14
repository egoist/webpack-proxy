module.exports = loader => {
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
