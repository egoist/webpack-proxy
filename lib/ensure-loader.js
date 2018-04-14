const utils = require('loader-utils')
const localRequire = require('./localRequire')

module.exports = async function (source, map) {
  const callback = this.async()
  const options = utils.getOptions(this)
  try {
    await localRequire(options.loader, this.resourcePath)
    callback(null, source, map)
  } catch (err) {
    callback(err)
  }
}
