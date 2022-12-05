module.exports = {
  name: "onlymember",
  alias: ["onlymem"],
  category: "configuration",
  use: "yes / no",
  isGroup: true,
  isAdmin: true,
  async run({ msg, conn }, { args }) {
    let om = (args[0] || "").toLowerCase()
    let group = db.data.group[msg.from]
    switch(om) {
      case 'yes':
        if (group.onlymember) return msg.reply(lang.isConfig('Only member'))
        group.onlymember = true
        msg.reply(lang.successConfig('Only Member'))
      break
      case 'no':
        if (group.onlymember) return msg.reply(lang.isConfig('All participants'))
        group.onlymember = false
        msg.reply(lang.successConfig('All participants'))
      break
    default:
      let buttons = [{
	buttonId: `onlymember yes`, buttonText: { displayText: 'Yes'}, type: 1
      }, {
	buttonId: `onlymember no`, buttonText: { displayText: 'No'}, type: 1
      }]
      let buttonMessage = {
        text: `*ONLY MEMBER*\n*Current:* ${group.onlymember ? 'On' : 'Off'}`,
	footer: ' ',
	buttons: buttons,
	headerType: 4
      }
      conn.sendMessage(msg.from, buttonMessage)
    }
  }
}
