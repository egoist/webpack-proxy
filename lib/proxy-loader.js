const path = require('path')
const utils = require('loader-utils')
const resolve = require('resolve')

function proxyLoader(source, map) {
  const options = utils.getOptions(this)

  // First run proxy-loader run
  if (!this.query.__proxy_loader__) {
    // Store passed options for future calls to proxy-loader with same loaderContext (this)
    // e.g. calls via 'this.addDependency' from actual loader
    // eslint-disable-next-line camelcase
    this.query.__proxy_loader__ = { loader: options.loader, cwd: options.cwd }

    // Remove proxy-loader options and make this.query act as requested loader query
    swapOptions(this, options.options)
  }
  const proxyOptions = this.query.__proxy_loader__

  const loader = require(resolve.sync(proxyOptions.loader, {
    basedir: path.dirname(this.resourcePath)
  }))

  // Run actual loader
  return loader.call(this, source, map)
}

function swapOptions(loaderContext, newOptions) {
  const copy = {}

  for (const key in newOptions) {
    copy[key] = newOptions[key]
  }

  // Delete all existing loader options
  delete loaderContext.query.options
  delete loaderContext.query.loader
  delete loaderContext.query.cwd

  // Add new options
  for (const key in copy) {
    loaderContext.query[key] = copy[key]
  }
}

module.exports = proxyLoader
