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
        msg.reply(msg.successConfig('Only Member'))
      break
      case 'no':
        if (group.onlymember) return msg.reply(lang.isConfig('All participants'))
        group.onlymember = false
        msg.reply(msg.successConfig('All participants'))
      break
    default:
      let buttons = [{ 
	buttonId: `onlymember on`, buttonText: { displayText: 'On'}, type: 1
      }, {
	buttonId: `onlymember off`, buttonText: { displayText: 'Off'}, type: 1
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
