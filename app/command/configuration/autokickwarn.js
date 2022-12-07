module.exports = {
  name: "autokickwarn",
  desc: "Automatically kicks the user when the user's warning has reached its maximum",
  category: "configuration",
  use: "yes / no",
  isGroup: true,
  isAdmin: true,
  async run({ msg, conn }, { args }) {
    let auk = (args[0] || "").toLowerCase()
    let group = db.data.group[msg.from]
    switch(auk) {
      case 'yes':
        if (group.autokick) return msg.reply(lang.isConfig('Auto kick'))
        group.autokick = true
        msg.reply(lang.successConfig('Auto kick'))
      break
      case 'no':
        if (!group.autokick) return msg.reply(lang.isConfig('No warn'))
        group.autokick = false
        msg.reply(lang.successConfig('Auto kick'))
      break
    default:
      let buttons = [{
	buttonId: `autokickwarn yes`, buttonText: { displayText: 'Yes'}, type: 1
      }, {
	buttonId: `autokickwarn no`, buttonText: { displayText: 'No'}, type: 1
      }]
      let buttonMessage = {
        text: `*AUTO KICK*\n*Current:* ${group.autokick ? 'On' : 'Off'}`,
	footer: ' ',
	buttons: buttons,
	headerType: 4
      }
      conn.sendMessage(msg.from, buttonMessage)
    }
  }
}
