const chalk = require("chalk")

function color(text, color) {
  return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

module.exports = { color }
