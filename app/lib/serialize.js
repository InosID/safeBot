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
