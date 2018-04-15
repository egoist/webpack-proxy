const utils = require('loader-utils')
const localRequire = require('./localRequire')

module.exports = async function (source, map) {
  const callback = this.async()
  const { loader, version, dependencies } = utils.getOptions(this)
  try {
    await localRequire(loader, {
      path: this.resourcePath,
      version,
      dependencies
    })
    callback(null, source, map)
  } catch (err) {
    callback(err)
  }
}
