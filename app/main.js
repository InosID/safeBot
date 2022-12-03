const {
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  default: Baileys,
  useMultiFileAuthState,
  jidDecode,
  DisconnectReason,
  delay
} = require("@adiwajshing/baileys")
const log = (pino = require("pino"))
const attribute = {}
const fs = require("fs")
const path = require("path")
const { Boom } = require("@hapi/boom")
const { color } = require("./lib/function")
const handler = require("./handler")
const cron = require("node-cron")
const utils = require("./utils")
const Spinnies = require("spinnies")
const spinnies = new Spinnies({
  spinner: {
    interval: 200,
    frames: [
      "▒▒▒▒▒",
      "█▒▒▒▒",
      "██▒▒▒",
      "███▒▒",
      "▒███▒",
      "▒▒███",
      "▒▒▒██",
      "▒▒▒▒█"
    ]
  }
})
const moment = require("moment")
const { self } = require("../config.json")
const mess = require('./lib/response.json')

// mongo db connect
const _ = require('lodash')
const yargs = require('yargs')
var low
try {
  low = require('lowdb')
} catch (e) {
  low = require('../database/lowdb')
}
const { Low, JSONFile } = low
const mongoDB = require('../database/mongoDB')
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
  new cloudDBAdapter(opts['db']) :
  new mongoDB(opts['db'])
  // new mongoDB(opts['db'])
  // new JSONFile(`database/db.json`)
)

global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    setting: {},
    users: {},
    group: {},
    cmd: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

if (global.db) setInterval(async () => {
  if (global.db.data) await global.db.write()
}, 5 * 1000)

attribute.prefix = "#"
attribute.command = new Map() // command

global.store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store"
  })
})

function ReadFeature() {
  let pathdir = path.join(__dirname, "./command")
  let feature = fs.readdirSync(pathdir)
  spinnies.add("spinner-1", {
    text: "Loading commands..",
    color: "green"
  })
  feature.forEach(async (res) => {
    const commands = fs.readdirSync(`${pathdir}/${res}`).filter((file) => file.endsWith(".js"))
    for (let file of commands) {
      const command = require(`${pathdir}/${res}/${file}`)
      if (typeof command.run != "function") continue
      const cmdOptions = {
	name: "command",
	alias: [""],
	desc: "",
	use: "",
	example: "",
	cooldown: 5,
        type: "", // default: changelog
	category: typeof command.category == "undefined" ? "" : res.toLowerCase(),
	wait: false,
	isOwner: false,
	isAdmin: false,
	isQuoted: false,
	isGroup: false,
	isBotAdmin: false,
	query: false,
	isPrivate: false,
	isLimit: false,
	isLimitGame: false,
	isLimitExam: false,
	isSpam: false,
	noPrefix: false,
	noMute: false,
	isMedia: {
	  isQVideo: false,
	  isQAudio: false,
	  isQImage: false,
	  isQSticker: false,
	  isQDocument: false,
	},
	isUrl: false,
	run: () => {},
      }
      let cmd = utils.parseOptions(cmdOptions, command)
      let options = {}
      for (var k in cmd)
        typeof cmd[k] == "boolean"
          ? (options[k] = cmd[k])
          : k == "query" || k == "isMedia"
          ? (options[k] = cmd[k])
	  : ""
      let cmdObject = {
	name: cmd.name,
	alias: cmd.alias,
	desc: cmd.desc,
	use: cmd.use,
	type: cmd.type,
	category: cmd.category,
	options: options,
	run: cmd.run,
      }
      attribute.command.set(cmd.name, cmdObject)
      require("delay")(100)
      global.reloadFile(`./command/${res}/${file}`)
    }
  })
  spinnies.succeed("spinner-1", {
    text: "Command loaded successfully",
    color: "yellow"
  })
}
ReadFeature() // cmd

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState('./session')
  let { version, isLatest } = await fetchLatestBaileysVersion()
  console.log(color(`Using: ${version}, newer: ${isLatest}`, "yellow"))
  const conn = Baileys({
    printQRInTerminal: true,
    auth: state,
    logger: log({ level: "silent" }),
    version,
    patchMessageBeforeSending: (message) => {
      const requiresPatch = !!(
        message.buttonsMessage
          || message.templateMessage
          || message.listMessage
      )
      if (requiresPatch) {
        message = {
          viewOnceMessage: {
            message: {
	      messageContextInfo: {
		deviceListMetadataVersion: 2,
	        deviceListMetadata: {}
	      },
	      ...message,
	    }
          }
        }
      }
      return message
    }
  })
  function decodeJid(jid) {
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {}
      return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid).trim()
    } else return jid
  }
  async function getBuffer(url, options) {
    try {
      options ? options : {};
      const res = await require("axios") ({
        method: "get",
	url,
	headers: {
	  DNT: 1,
	  "Upgrade-Insecure-Request": 1
	},
	...options,
	responseType: "arraybuffer",
      });
      return res.data;
    } catch (e) {
      console.log(`Error : ${e}`);
    }
  }
  store.bind(conn.ev)
  conn.ev.on("creds.update", saveCreds)
  conn.ev.on("connection.update", async (up) => {
    const { lastDisconnect, connection } = up
    if (connection) spinnies.add("spinner-2", { text: "Connecting to the WhatsApp bot...", color: "cyan" });
    if (connection == "connecting") spinnies.add("spinner-2", { text: "Connecting to the WhatsApp bot...", color: "cyan" })
      if (connection) {
	if (connection != "connecting")
	spinnies.update("spinner-2", { text: "Connection: " + connection, color: "yellow" })
      }
      if (connection == "open") spinnies.succeed("spinner-2", { text: "Successfully connected to whatsapp", color: "green" })
      if (connection === "close") {
      let reason = new Boom(lastDisconnect.error).output.statusCode
      if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete ${session} and Scan Again`)
        conn.logout()
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....")
        connect()
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...")
        connect()
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First")
        conn.logout()
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Device Logged Out, Please Delete ${session} and Scan Again.`)
        conn.logout()
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...")
        connect()
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...")
        connect()
      } else {
        conn.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`)
      }
    }
  })
  conn.ws.on("CB:call", async (json) => {
    if (json.content[0].tag == "offer") {
      conn.sendMessage(json.content[0].attrs["call-creator"], {
      text: mess.private.blockCall
    })
    await require("delay")(8000)
      await conn.updateBlockStatus(json.content[0].attrs["call-creator"], "block")
    }
  })
  conn.ev.on("contacts.update", (m) => {
    for (let kontak of m) {
      let jid = decodeJid(kontak.id)
      if (store && store.contacts) store.contacts[jid] = { jid, name: kontak.notify }
    }
  })
  conn.ev.on("groups.update", async (json) => {
    const res = json[0]
    if (res.announce == true) {
      conn.sendMessage(res.id, {
	text: mess.group.change.groupClose,
      })
    } else if (res.announce == false) {
      conn.sendMessage(res.id, {
	text: mess.group.change.groupOpen,
      })
    } else if (res.restrict == true) {
      conn.sendMessage(res.id, {
	text: mess.group.change.groupInfoRestr,
      })
    } else if (res.restrict == false) {
      conn.sendMessage(res.id, {
	text: mess.group.change.groupInfoOpen,
      })
    } else {
      conn.sendMessage(res.id, {
	text: mess.group.change.groupSubject.replace('{subject}', res.subject),
      })
    }
  })
  conn.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0]
    if (msg.key.id.startsWith("BAE5") && msg.key.id.length === 16) return
    const type = msg.message ? Object.keys(msg.message)[0] : ""
    // let dataCek = db.cekDatabase("antidelete", "id", msg.key.remoteJid)
    // if (dataCek) conn.addMessage(msg, type)
    if (msg && type == "protocolMessage") conn.ev.emit("message.delete", msg.message.protocolMessage.key)
    handler(m, conn, attribute)
  })
}

connect()

if (config.server)
  require("http")
    .createServer((__, res) => res.end("Server Running!"))
    .listen(8080)

process.on("uncaughtException", function (err) {
  console.error(err);
})
