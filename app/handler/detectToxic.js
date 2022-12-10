module.exports = async (msg, conn) => {
  const { isGroup, from, sender, body, type } = msg
  let isAntiToxic = isGroup ? db.data.group[from].antitoxic : false
  let toxicList = db.data.group[from].toxiclist
  if (isGroup && isAntiToxic) {
    if (toxicList.some(v => body.includes(v))) {
      console.log('Detected toxic')
    }
  }
}
