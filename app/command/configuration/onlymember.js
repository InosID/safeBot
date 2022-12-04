/*module.exports = {
  name: "onlymember",
  alias: ["onlymem"],
  category: "configuration",
  use: "yes / no",
  isGroup: true,
  async run({ msg, conn }, { args }) {
    let om = (args[0] || "").toLowerCase()
    let group = db.data.group[msg.from]
    switch(om) {
      case 'yes':
        if (group.onlymember) return msg.reply()
        group.onlymember = true
        msg.reply(msg.done())
      break
      case 'no':
        
      break
    }
  }
}*/
