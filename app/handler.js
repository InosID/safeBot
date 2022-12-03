require("./global.js");
require("./lib/Proto");
const { getBinaryNodeChild } = require("@adiwajshing/baileys");
const Baileys = require("@adiwajshing/baileys");
const { logger } = Baileys.DEFAULT_CONNECTION_CONFIG;
const { serialize } = require("./lib/serialize");
const { checkPrefix } = require("./lib/checkprefix");
const fs = require("fs");
const { color, getAdmin, isUrl } = require("./lib/function");
const cooldown = new Map();
const owner = config.owner;
const thumbnail = config.thumbnail;
const toMs = require('ms')

function printSpam(conn, isGc, sender, groupName) {
  if (isGc) {
    return conn.logger.warn("Detect SPAM", color(sender.split("@")[0], "lime"), "in", color(groupName, "lime"));
  } 
  if (!isGc) {
    return conn.logger.warn("Detect SPAM", color(sender.split("@")[0], "lime"));
  }
}
function printLog(isCmd, sender, msg, body, groupName, isGc) {
  if (isCmd && isGc) {
    return console.log(
      color("[ COMMAND GC ]", "aqua"),
      color(sender.split("@")[0], "lime"),
      color(body, "aqua"),
      "in",
      color(groupName, "lime")
    );
  }
  if (isCmd && !isGc) {
    return console.log(color("[ COMMAND PC ]", "aqua"), color(sender.split("@")[0], "lime"), color(body, "aqua"));
  }
}
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const getBuffer = async (url, options) => {
  try {
    options ? options : {}
    const res = await axios({
      method: "get",
      url,
      headers: {
	'DNT': 1,
	'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    })
    return res.data
  } catch (e) {
    console.log(`Error : ${e}`)
  }
}

module.exports = handler = async (m, conn, map) => {
  try {
    // if (m.type !== "notify") return;
    let ms = m.messages[0];
    // ms.message = Object.keys(ms.message)[0] === "ephemeralMessage" ? ms.message.ephemeralMessage.message : ms.message;
    let msg = await serialize(JSON.parse(JSON.stringify(ms)), conn);
    if (!msg.message) return;

    // detect msg type senderKey and delete in order to be able to respond
    if (Object.keys(msg.message)[0] == "senderKeyDistributionMessage")
    delete msg.message.senderKeyDistributionMessage;
    if (Object.keys(msg.message)[0] == "messageContextInfo") delete msg.message.messageContextInfo;
    if (msg.key && msg.key.remoteJid === "status@broadcast") return;
    if (
      msg.type === "protocolMessage" ||
      msg.type === "senderKeyDistributionMessage" ||
      !msg.type ||
      msg.type === ""
    )
    return;
    let { body, type } = msg;
    // global.dashboard = JSON.parse(fs.readFileSync("./database/dashboard.json"));
    // global.customLanguage = JSON.parse(fs.readFileSync("./database/language.json"));
    const { isGroup, sender, from } = msg;
    const groupMetadata = isGroup ? await conn.groupMetadata(from) : "";
    const groupName = isGroup ? groupMetadata.subject : "";
    const isAdmin = isGroup ? (await getAdmin(conn, msg)).includes(sender) : false;
    const isPrivate = msg.from.endsWith("@s.whatsapp.net");
    const botAdmin = isGroup ? (await getAdmin(conn, msg)).includes(conn.decodeJid(conn.user.id)) : false;
    const isOwner = owner.includes(sender);
    if (msg.isSelf) return;
    var prefa = /^[#$+.?_&<>!/\\]/
    var prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#%^&.©^]/gi)[0] : checkPrefix(prefa, body).prefix ?? "#"
    const arg = body.substring(body.indexOf(" ") + 1);
    const args = body.trim().split(/ +/).slice(1);
    const comand = body.trim().split(/ +/)[0];
    let q = body.trim().split(/ +/).slice(1).join(" ");
    const isCmd = body.startsWith(prefix);

    // type message
    const isVideo = type === "videoMessage";
    const isImage = type === "imageMessage";
    const isLocation = type === "locationMessage";
    const contentQ = msg.quoted ? JSON.stringify(msg.quoted) : [];
    const isQAudio = type === "extendedTextMessage" && contentQ.includes("audioMessage");
    const isQVideo = type === "extendedTextMessage" && contentQ.includes("videoMessage");
    const isQImage = type === "extendedTextMessage" && contentQ.includes("imageMessage");
    const isQDocument = type === "extendedTextMessage" && contentQ.includes("documentMessage");
    const isQSticker = type === "extendedTextMessage" && contentQ.includes("stickerMessage");
    const isQLocation = type === "extendedTextMessage" && contentQ.includes("locationMessage");
    global.gcount = config.limit.gameLimitPremium;
    global.limitCount = config.limit.limitUser;
    const Media = (media = {}) => {
      list = [];
      if (media.isQAudio) {
	list.push("audioMessage");
      }
      if (media.isQVideo) {
        list.push("videoMessage");
      }
      if (media.isQImage) {
	list.push("imageMessage");
      }
      if (media.isQDocument) {
        list.push("documentMessage");
      }
      if (media.isQSticker) {
	list.push("stickerMessage");
      }
      return list;
    }

    // read command
    const cmdName = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase();
    const cmd =
      map.command.get(body.trim().split(/ +/).shift().toLowerCase()) ||
      [...map.command.values()].find((x) =>
        x.alias.find((x) => x.toLowerCase() == body.trim().split(/ +/).shift().toLowerCase())
      ) ||
      map.command.get(cmdName) ||
      [...map.command.values()].find((x) => x.alias.find((x) => x.toLowerCase() == cmdName));

    /** 
     * Mongo DB database
     */
    let setting = db.data.setting
    if (typeof setting !== 'object') db.data.setting = {} 
    if (setting) {
      if (!('thumb' in setting)) setting.thumb = thumbnail
      if (!('info' in setting)) setting.info = ''
      if (!('autoRead' in setting)) setting.autoRead = false
      if (!('gcOnly' in setting)) setting.gcOnly = false 
    } else db.data.setting = {
      thumb: thumbnail,
      info: '',
      autoRead: false,
      gcOnly: false 
    }
  } catch {}
}
