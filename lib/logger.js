const readline = require('readline')
const chalk = require('chalk')

class Logger {
  constructor(options) {
    this.lines = 0
    this.statusLine = null
    this.setOptions(options)
  }

  setOptions(options) {
    this.logLevel =
      options && isNaN(options.logLevel) === false ?
        Number(options.logLevel) :
        3
    this.color =
      options && typeof options.color === 'boolean' ?
        options.color :
        chalk.supportsColor
    this.chalk = new chalk.constructor({ enabled: this.color })
    this.isTest =
      options && typeof options.isTest === 'boolean' ?
        options.isTest :
        process.env.NODE_ENV === 'test'
  }

  countLines(message) {
    return message.split('\n').reduce((p, line) => {
      if (process.stdout.columns) {
        return p + Math.ceil((line.length || 1) / process.stdout.columns)
      }

      return p + 1
    }, 0)
  }

  writeRaw(message) {
    this.lines += this.countLines(message) - 1
    process.stdout.write(message)
  }

  write(message, persistent = false) {
    if (!persistent) {
      this.lines += this.countLines(message)
    }

    this._log(message)
  }

  log(message) {
    if (this.logLevel < 3) {
      return
    }

    this.write(message)
  }

  persistent(message) {
    if (this.logLevel < 3) {
      return
    }

    this.write(this.chalk.bold(message), true)
  }

  clear() {
    if (!this.color || this.isTest) {
      return
    }

    while (this.lines > 0) {
      readline.clearLine(process.stdout, 0)
      readline.moveCursor(process.stdout, 0, -1)
      this.lines--
    }

    readline.cursorTo(process.stdout, 0)
    this.statusLine = null
  }

  writeLine(line, msg) {
    if (!this.color) {
      return this.log(msg)
    }

    const n = this.lines - line
    const stdout = process.stdout
    readline.cursorTo(stdout, 0)
    readline.moveCursor(stdout, 0, -n)
    stdout.write(msg)
    readline.clearLine(stdout, 1)
    readline.cursorTo(stdout, 0)
    readline.moveCursor(stdout, 0, n)
  }

  status(emoji, message, color = 'gray') {
    if (this.logLevel < 3) {
      return
    }

    const hasStatusLine = this.statusLine !== null
    if (!hasStatusLine) {
      this.statusLine = this.lines
    }

    this.writeLine(
      this.statusLine,
      this.chalk[color].bold(`${emoji}  ${message}`)
    )

    if (!hasStatusLine) {
      process.stdout.write('\n')
      this.lines++
    }
  }

  handleMessage(options) {
    this[options.method](...options.args)
  }

  _log(message) {
    console.log(message)
  }
}

module.exports = new Logger()
