/*module.exports = {
  name: "language",
  category: "configuration",
  alias: ["lang"],
  use: "[language]",
  isGroup: true,
  isAdmin: true,
  async run({ msg, conn }, { args }) {
    let { sender } = msg
    let user = db.data.users[sender]
    let languages = (args[0] || '').toLowerCase()
    switch(languages) {
      case "english":
        if (user.language == require('./language/english')) return msg.reply("You are already in English")
        user.language = require('./language/english')
        msg.reply('Successfully changed the language to English')
      break
      case "indonesia":
      break
    }
  }
}
*/
