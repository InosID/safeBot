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
    }
  }
}
