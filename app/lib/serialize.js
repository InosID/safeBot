const { proto, jidDecode, downloadContentFromMessage, getContentType } = require("@adiwajshing/baileys"),
      path = require("path"),
      fetch = require("node-fetch"),
      fs = require("fs"),
      chalk = require("chalk"),
      moment = require("moment"),
      Baileys = require("@adiwajshing/baileys"),
      { fromBuffer } = require("file-type"),
      { isUrl } = require("./index"),
      phonenumber = require("awesome-phonenumber"),
      { toOpus, toAudio, convert, convert2 } = require("./convert"),
      { toPTT, toAudio: toAudio2 } = require("./converter"),
      cmd = { 
	1: [
          "-fs 1M",
          "-vcodec",
          "libwebp",
          "-vf",
	  `scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1`,
        ],
        2: ["-fs 1M", "-vcodec", "libwebp"],
      }

function downloadMedia(message, pathFile) {
  new Promise(async (resolve, reject) => {
    let type = Object.keys(message)[0]
    let mimeMap = {
      imageMessage: "image",
      videoMessage: "video",
      stickerMessage: "sticker",
      documentMessage: "document",
      audioMessage: "audio",
    }
    let mes = message;
    if (type == "templateMessage") {
      mes = message.templateMessage.hydratedFourRowTemplate;
      type = Object.keys(mes)[0];
    }
    if (type == "buttonsMessage") {
      mes = message.buttonsMessage;
      type = Object.keys(mes)[0];
    }
    try {
      if (pathFile) {
	const stream = await downloadContentFromMessage(mes[type], mimeMap[type]);
	let buffer = Buffer.from([]);
	for await (const chunk of stream) {
	  buffer = Buffer.concat([buffer, chunk]);
	}
	await fs.promises.writeFile(pathFile, buffer);
	resolve(pathFile);
      } else {
	const stream = await downloadContentFromMessage(mes[type], mimeMap[type]);
	let buffer = Buffer.from([]);
	for await (const chunk of stream) {
	  buffer = Buffer.concat([buffer, chunk]);
	}
	resolve(buffer);
      }
    } catch (e) {
      reject(e)
    }
  })
}
async function serialize(msg, conn) {
  conn.decodeJid = (jid) => {
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid).trim();
    } else return jid;
  };
  /**
   * getBuffer
   * @param {String|Buffer} path
   * @param {Boolean} returnFilename
   */
  conn.getFile = async (PATH, returnAsFilename) => {
    let res, filename;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split`,`[1], "base64")
      : /^https?:\/\//.test(PATH)
      ? await (res = await fetch(PATH)).buffer()
      : fs.existsSync(PATH)
      ? ((filename = PATH), fs.readFileSync(PATH))
      : typeof PATH === "string"
      ? PATH
      : Buffer.alloc(0);
    if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");
    let type = (await fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    if (data && returnAsFilename && !filename)
    (filename = path.join(__dirname, "../temp/" + new Date() * 1 + "." + type.ext)),
    await fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      ...type,
      data,
    }
  }
  
