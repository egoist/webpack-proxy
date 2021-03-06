const spawn = require('cross-spawn')
const logger = require('install-packages/lib/logger')

function pipeSpawn(cmd, params, opts) {
  const cp = spawn(
    cmd,
    params,
    Object.assign(
      {
        env: Object.assign(
          {
            /* eslint-disable camelcase */
            FORCE_COLOR: logger.color,
            npm_config_color: logger.color ? 'always' : '',
            npm_config_progress: true
            /* eslint-enable camelcase */
          },
          process.env
        )
      },
      opts
    )
  )

  cp.stdout.setEncoding('utf8').on('data', d => logger.writeRaw(d))
  cp.stderr.setEncoding('utf8').on('data', d => logger.writeRaw(d))

  return new Promise((resolve, reject) => {
    cp.on('error', reject)
    cp.on('close', code => {
      if (code !== 0) {
        return reject(new Error(cmd + ' failed.'))
      }

      logger.clear()
      return resolve()
    })
  })
}

module.exports = pipeSpawn
