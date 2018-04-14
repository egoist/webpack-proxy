const path = require('path')
const commandExists = require('command-exists')
const fs = require('fs-extra')
const config = require('./config')
const promisify = require('./promisify')
const logger = require('./logger')
const emoji = require('./emoji')
const pipeSpawn = require('./pipeSpawn')
const PromiseQueue = require('./PromiseQueue')

// eslint-disable-next-line import/order
const resolve = promisify(require('resolve'))

async function install(modules, filepath, options = {}) {
  let { installPeers = true, saveDev = true, packageManager } = options

  logger.status(emoji.progress, `Installing ${modules.join(', ')}...`)

  const packageLocation = await config.resolve(filepath, ['package.json'])
  const cwd = packageLocation ? path.dirname(packageLocation) : process.cwd()

  if (!packageManager) {
    packageManager = await determinePackageManager(filepath)
  }

  const commandToUse = packageManager === 'npm' ? 'install' : 'add'
  const args = [commandToUse, ...modules]
  if (saveDev) {
    args.push('-D')
  } else if (packageManager === 'npm') {
    args.push('--save')
  }

  // npm doesn't auto-create a package.json when installing,
  // so create an empty one if needed.
  if (packageManager === 'npm' && !packageLocation) {
    await fs.writeFile(path.join(cwd, 'package.json'), '{}')
  }

  try {
    await pipeSpawn(packageManager, args, { cwd })
  } catch (err) {
    throw new Error(`Failed to install ${modules.join(', ')}.`)
  }

  if (installPeers) {
    await Promise.all(
      modules.map(m => installPeerDependencies(filepath, m, options))
    )
  }
}

async function installPeerDependencies(filepath, name, options) {
  const basedir = path.dirname(filepath)
  const [resolved] = await resolve(name, { basedir })
  const pkg = await config.load(resolved, ['package.json'])
  const peers = pkg.peerDependencies || {}

  const modules = []
  for (const peer in peers) {
    // Exclude webpack since you already have it :P
    if (peer !== 'webpack') {
      modules.push(`${peer}@${peers[peer]}`)
    }
  }

  if (modules.length > 0) {
    await install(
      modules,
      filepath,
      Object.assign({}, options, { installPeers: false })
    )
  }
}

async function determinePackageManager(filepath) {
  const configFile = await config.resolve(filepath, [
    'yarn.lock',
    'package-lock.json'
  ])
  const hasYarn = await checkForYarnCommand()

  // If Yarn isn't available, or there is a package-lock.json file, use npm.
  const configName = configFile && path.basename(configFile)
  if (!hasYarn || configName === 'package-lock.json') {
    return 'npm'
  }

  return 'yarn'
}

let hasYarn = null
async function checkForYarnCommand() {
  if (hasYarn !== null) {
    return hasYarn
  }

  try {
    hasYarn = await commandExists('yarn')
  } catch (err) {
    hasYarn = false
  }

  return hasYarn
}

const queue = new PromiseQueue(install, { maxConcurrent: 1, retry: false })
module.exports = function (...args) {
  queue.add(...args)
  return queue.run()
}
