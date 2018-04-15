const { dirname } = require('path')
const resolve = require('resolve')
const install = require('install-packages')

const cache = new Map()

async function localRequire(
  name,
  { path, version, dependencies },
  triedInstall = false
) {
  const basedir = dirname(path)
  const key = basedir + ':' + name
  let resolved = cache.get(key)
  if (!resolved) {
    try {
      resolved = resolve.sync(name, { basedir })
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND' && !triedInstall) {
        await install(
          [version ? `${name}@${version}` : name].concat(dependencies || []),
          basedir,
          {
            peerFilter(name) {
              return name !== 'webpack'
            }
          }
        )
        return localRequire(name, { path, version, dependencies }, true)
      }
      throw err
    }
    cache.set(key, resolved)
  }

  return require(resolved)
}

module.exports = localRequire
