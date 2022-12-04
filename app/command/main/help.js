module.exports = {
  name: "help",
  category: "main",
  alias: ["menu", "h"],
  async run({ msg, conn }, { map, args }) {
    const { pushName, sender } = msg
    const { prefix, command } = map
    const cmds = command.keys()
    let category = []
    for (let cmd of cmds) {
      let info = command.get(cmd)
      if (!cmd) continue
      if (config.ignore.directory.includes(info.category.toLowerCase())) continue
      cteg = info.category || "No Category"
      if (info.type == "changelog") continue
      if (cteg == "hidden") continue
      if (!cteg || cteg === "private") cteg = "owner command"
      if (Object.keys(category).includes(cteg)) category[cteg].push(info)
      else {
	category[cteg] = []
	category[cteg].push(info)
      }
    }
    let botname = db.data.setting.botName
    let str = lang.helpHi + '\n'
    const keys = Object.keys(category)
    for (const key of keys) {
      str += `╭─「 *${key.toUpperCase()}* 」\n${category[key]
        .map(
	  (cmd, index) =>
	    `│ ❏ *${cmd.name}* ${
	      cmd.category == "private"
	        ? ""
		: cmd.use
		? cmd.use.replace(">", "").replace("<", "")
		: ""
	    }`
	)
	.join("\n")}\n╰────\n\n`
    }
    let templateButtons = [
      { urlButton: { displayText: "WhatsApp Group", url: db.data.setting.groupWhatsApp } }
    ]
    let templateMessage = {
      location: { jpegThumbnail: await reSize(db.data.setting.thumb, 300, 175) },
      caption: str,
      footer: '',
      templateButtons: templateButtons
    }
    await conn.sendMessage(msg.from, templateMessage)
  }
}

async function reSize(image, width, height) {
  let jimp = require('jimp')
  var read = await jimp.read(image)
  var data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
  return data
}
