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
  let isAutoKick = isGroup ? group.autokick : false
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
        conn.sendMessage(msg.from, { text: `@${msg.sender.split('@')[0]} You are not allowed to post ${typeNSFW} here`, mentions: [msg.sender] })
        if (group.autokick && !isAdmin) {
          if (warn >= maxwarn) {
            msg.reply(`Your warning has reached its maximum. see you later.`)
            require('delay')(2000)
            await conn.groupParticipantsUpdate(msg.from, [sender], "remove")
            db.data.users[sender] = 0
          } else db.data.users[sender].warn += 1
        }
      } else console.log('Neutral')
    }
  }
}
