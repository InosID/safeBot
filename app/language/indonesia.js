exports.cooldown = (cooldown) => {
  return `Cooldown ${cooldown} detik, tunggu dan coba lagi`
}

exports.onlyOwner = () => {
  return `Perintah ini hanya dapat digunakan oleh owner`
}
exports.onlyGroup = () => {
  return `Perintah ini hanya dapat digunakan di dalam grup`
}
exports.onlyGroupAdmin = () => {
  return `Perintah ini hanya dapat digunakan oleh admin grup`
}
exports.onlyBotAdmin = () => {
  return `Jadikan Bot sebagai admin untuk menggunakan perintah`
}
exports.onlyPrivate = () => {
  return `Perintah ini hanya dapat digunakan dalam chat pribadi`
}

exports.helpHi = (botname) => {
  return `Hai, saya ${botname}. Ini daftar perintah saya`
}
