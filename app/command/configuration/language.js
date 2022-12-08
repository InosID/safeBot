module.exports = {
  name: "language",
  category: "configuration",
  alias: ["lang"],
  use: "[language]",
  isGroup: true,
  isAdmin: true,
  async run({ msg, conn }, { args }) {
    let { sender } = msg
    let user = db.data.group[sender]
    let languages = (args[0] || '').toLowerCase()
    switch(languages) {
      case "english":
        if (user.language == 'english') return msg.reply("You are already in English")
        user.language = 'english'
        msg.reply('Successfully changed the language to English')
      break
      case "indonesia":
        if (user.language == 'indonesia') return msg.reply("Kamu sudah berbahasa Indonesia")
        user.language = 'indonesia'
        msg.reply('Berhasil mengganti ke bahasa Indonesia')
      break
    default:
      let buttons = [{ 
	buttonId: `language english`, buttonText: { displayText: 'English'}, type: 1
      }, {
	buttonId: `language indonesia`, buttonText: { displayText: 'Indonesia'}, type: 1
      }]
      let buttonMessage = {
        text: `*Change Language*\n*Current:* ${user.language == 'english' ? 'English' : '' || user.language == 'indonesia' ? 'Indonesia' : ''}`,
	footer: ' ',
	buttons: buttons,
	headerType: 4
      }
      conn.sendMessage(msg.from, buttonMessage)
    }
  }
}
