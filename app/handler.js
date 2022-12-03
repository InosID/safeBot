require("./global.js");
require("./lib/Proto");
const { getBinaryNodeChild } = require("@adiwajshing/baileys");
const Baileys = require("@adiwajshing/baileys");
const { logger } = Baileys.DEFAULT_CONNECTION_CONFIG;
const { serialize } = require("./lib/serialize");
const { checkPrefix } = require("./lib/checkprefix");
const fs = require("fs");
const { color, getAdmin, isUrl } = require("./lib");
const cooldown = new Map();

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
