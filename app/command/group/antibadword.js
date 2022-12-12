module.exports = {
  name: "antibadword",
  category: "group",
  use: "on / off",
  desc: "Enable anti bad word in the group",
  isGroup: true,
  isAdmin: true,
  isBotAdmin: true,
  async run({ msg, conn }, { q }) {
    text = q
    if (text === 'on') {
      if (db.data.group[msg.from].antitoxic === true) return msg.reply(lang.isActive('Anti Bad Word'))
      db.data.group[msg.from].antitoxic = true
      msg.reply(lang.featureActive('Anti Bad Word', lang.featureDesc('antibadword')))
    } else if (text === 'off') {
      if (db.data.group[msg.from].antitoxic === false) return msg.reply(lang.isDeactive('Anti Bad Word'))
      db.data.group[msg.from].antitoxic = false
      msg.reply(lang.featureDeactive('Anti Bad Word'))
    } else {
      let buttons = [{ 
	buttonId: `antibadword on`, buttonText: { displayText: 'On'}, type: 1
      }, {
	buttonId: `antibadword off`, buttonText: { displayText: 'Off'}, type: 1
      }]
      let buttonMessage = {
        text: `*ANTI BAD WORD*\n*Status:* ${db.data.group[msg.from].antitoxic ? 'Active' : 'Not active'}`,
	footer: ' ',
	buttons: buttons,
	headerType: 4
      }
      conn.sendMessage(msg.from, buttonMessage)
    }
  }
}
