let { webp2png } = require('../lib/webp2')
let tf = require('@tensorflow/tfjs-node')
let nsfw = require('nsfwjs')
let axios = require('axios')

/* Anti NSFW [ BETA ] by @moo-d & @mrfzvx12 */

module.exports = async (msg, conn) => {
  const { isGroup, from, sender, body, type } = msg
  let isAntiNSFW = isGroup ? db.data.group[from].antinsfw : false 
  let isImage = type === 'imageMessage'
  let isSticker = type === 'stickerMessage' 
  let isMedia = isImage || isSticker
  let group = db.data.group[from]
  let warn = db.data.users[sender].warn
  if (isGroup && isAntiNSFW) {
    if (isMedia) {
      let imgURL = isMedia ? await webp2png(await msg.download()) : ''
      let pic = await axios.get(imgURL, {
        responseType: 'arraybuffer',
      })
      const model = await nsfw.load()
      let image = tf.node.decodeImage(pic.data, 3)
      let predictions = await model.classify(image)
      let typeNSFW = predictions[0].className == 'Porn' ? 'Porn' : '' || predictions[0].className == 'Hentai' ? 'Hentai' : ''
      let maxDet = isImage ? 0.9 : '' || isSticker ? 0.75 : ''
      if (await predictions[0].probability > maxDet && (typeNSFW == 'Porn' || typeNSFW == 'Hentai')) {
        await conn.sendMessage(msg.from, { delete: msg.key })
        await conn.sendMessage(msg.from, { delete: msg.key })
        require('delay')(2000) 
        conn.sendMessage(msg.from, { text: `@${msg.sender.split('@')[0]} ` + lang.notAllowedNSFW(typeNSFW), mentions: [msg.sender] })
        if (group.autokick) {
          db.data.users[sender].warn += 1
          if (!oAdmin && warn >= maxwarn) {
            msg.reply(lang.warnkick())
            require('delay')(3000)
            await conn.groupParticipantsUpdate(msg.from, [sender], "remove")
            db.data.users[sender] = 0
          }
        }
      } else console.log('Neutral')
    }
  }
}
