const resolve = require('resolve')
const install = require('install-packages')

const cache = new Map()

async function localRequire(
  name,
  { baseDir = process.cwd(), version, dependencies, peerFilter } = {},
  triedInstall = false
) {
  const key = baseDir + ':' + name
  let resolved = cache.get(key)
  if (!resolved) {
    try {
      resolved = resolve.sync(name, { basedir: baseDir })
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND' && !triedInstall) {
        await install(
          [version ? `${name}@${version}` : name].concat(dependencies || []),
          baseDir,
          {
            peerFilter(name, version) {
              return name !== 'webpack' && (!peerFilter || peerFilter(name, version))
            }
          }
        )
        // TODO: figure out why do we need this
        return localRequire(name, { baseDir, version, dependencies, peerFilter }, true)
      }
      throw err
    }
    cache.set(key, resolved)
  }

  return require(resolved)
}

module.exports = localRequire
