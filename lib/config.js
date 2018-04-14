const path = require('path')
const fs = require('fs-extra')

const existsCache = new Map()

async function resolve(filepath, filenames, root = path.parse(filepath).root) {
  filepath = path.dirname(filepath)

  // Don't traverse above the module root
  if (filepath === root || path.basename(filepath) === 'node_modules') {
    return null
  }

  for (const filename of filenames) {
    const file = path.join(filepath, filename)
    const exists = existsCache.has(file) ?
      existsCache.get(file) :
      await fs.exists(file) // eslint-disable-line no-await-in-loop
    if (exists) {
      existsCache.set(file, true)
      return file
    }
  }

  return resolve(filepath, filenames, root)
}

async function load(filepath, filenames, root = path.parse(filepath).root) {
  const configFile = await resolve(filepath, filenames, root)
  if (configFile) {
    try {
      const extname = path.extname(configFile).slice(1)
      if (extname === 'js') {
        return require(configFile)
      }

      const configStream = await fs.readFile(configFile)
      return require('json5').parse(configStream.toString())
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND' || err.code === 'ENOENT') {
        existsCache.delete(configFile)
        return null
      }

      throw err
    }
  }

  return null
}

exports.resolve = resolve
exports.load = load
