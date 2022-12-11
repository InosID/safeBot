module.exports = async (msg, conn) => {
  const { isGroup, from, sender, body, type } = msg
  let isAntiToxic = isGroup ? db.data.group[from].antitoxic : false
  let toxicList = db.data.group[from].toxiclist
  if (isGroup && isAntiToxic) {
    let confirm = false
    var i;
    for (i = 0; i < toxicList.length; i++) {
      if (body.toLowerCase().includes(toxicList[i].toLowerCase()))
        confirm = true
    }
    if (confirm) {
      await conn.sendMessage(msg.from, { delete: msg.key })
      conn.sendMessage(from, { text: `@${sender.split('@')[0]} ` + lang.detectedToxic(), mentions: [sender] })
      if (group.autokick) {
        db.data.users[sender].warn += 1
        if (!oAdmin && warn >= maxwarn) {
          msg.reply(lang.warnkick())
          require('delay')(3000)
          await conn.groupParticipantsUpdate(msg.from, [sender], "remove")
          db.data.users[sender] = 0
        }
      }
    }
  }
}
