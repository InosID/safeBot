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
const { color } = require("./lib/color")
const handler = require("./handler")
const cron = require("node-cron")
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
