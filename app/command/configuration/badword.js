module.exports = {
  name: "badword",
  category: "configuration",
  use: "[add/remove/reset]",
  isGroup: true,
  isAdmin: true,
  async run({ msg, conn }, { args }) {
    let select = (args[0] || '').toLowerCase()
    let text = msg.body.trim().split(/ +/).slice(2).join(" ")
    let group = db.data.group[msg.from]
    let badwordList = group.toxiclist
    let listed = badwordList.findIndex(e => e === text)
    switch(select) {
      case "add":
        if (args.length < 2) return msg.reply(lang.needText())
        if (listed == -1) {
          badwordList.push(text)
          msg.reply(lang.added(text))
        } else msg.reply(lang.available(text))
      break
      case "remove":
        if (args.length < 2) return msg.reply(lang.needText())
        if (!listed == -1) {
          badwordList.splice(badwordList.indexOf(text), 1)
          msg.reply(removed(text))
        } else msg.reply(lang.notAvailable(text))
      break
      case "reset":
        badwordList = []
        msg.reply(lang.done())
      break
    default:
      msg.reply(`Example:\nbadword add f***\nbadword remove f***\nbadword reset`)
    }
  }
}
