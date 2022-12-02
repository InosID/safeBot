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
