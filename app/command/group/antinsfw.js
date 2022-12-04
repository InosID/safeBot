module.exports = {
  name: "antinsfw",
  category: "group",
  use: "on / off",
  desc: "Enable anti nsfw in the group",
  isGroup: true,
  isAdmin: true,
  isBotAdmin: true,
  async run({ msg, conn }, { q }) {
    text = q
    if (text === 'on') {
      if (db.data.group[msg.from].antinsfw === true) return msg.reply('anti nsfw is active')
      db.data.group[msg.from].antinsfw = true
      msg.reply(`Successfully activated anti nsfw. Now 18+ photos and stickers will be automatically removed.`)
    } else if (text === 'off') {
      if (db.data.group[msg.from].antinsfw === false) return msg.reply('anti nsfw is deactivated')
      db.data.group[msg.from].antinsfw = false
      msg.reply(`Successfully disable anti nsfw`)
    } else {
      let buttons = [{ 
	buttonId: `antinsfw on`, buttonText: { displayText: 'On'}, type: 1
      }, {
	buttonId: `antinsfw off`, buttonText: { displayText: 'Off'}, type: 1
      }]
      let buttonMessage = {
        text: `*ANTI NSFW [BETA]*\n*Status:* ${db.data.group[msg.from].antinsfw ? 'Active' : 'Not active'}`,
	footer: ' ',
	buttons: buttons,
	headerType: 4
      }
      conn.sendMessage(msg.from, buttonMessage)
    }
  }
}
