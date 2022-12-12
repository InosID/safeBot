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

exports.featureDesc = (feature) => {
  switch(feature) {
    case 'antinsfw':
      return `Sekarang 18+ foto dan stiker akan dihapus secara otomatis.`
    break
    case 'antibadword':
      return `Sekarang pesan kata buruk akan dihapus secara otomatis.`
    break
  }
}
exports.featureActive = (feature, desc) => {
  return `Berhasil mengaktifkan ${feature}. ${desc}`
}
exports.featureDeactive = (feature) => {
  return `Berhasil menonaktifkan ${feature}`
}
exports.isActive = (feature) => {
  return `${feature} sudah aktif`
}
exports.isDeactive = (feature) => {
  return `${feature} sudah nonaktif`
}

exports.done = () => {
  return `Selesai`
}

exports.isConfig = (feature) => {
  return `Anda telah mengubah menjadi ${feature}`
}
exports.successConfig = (feature) => {
  return `Berhasil diubah menjadi ${feature}`
}

exports.warnkick = () => {
  return `Peringatan Anda telah mencapai maksimum. sampai ketemu lagi.`
}
exports.notAllowedNSFW = (type) => {
  return `Anda tidak diizinkan memposting ${type} di sini`
}
exports.detectedToxic = () => {
  return `Anda terdeteksi mengirimkan kata-kata kasar.`
}

exports.needText = (cmd) => {
  return `Dimana teksnya?\nContoh: ${cmd}`
}
exports.available = (text) => {
  return `${text} tersedia`
}
exports.added = (text) => {
  return `${text} telah ditambahkan`
}
exports.removed = (text) => {
  return `${teks} telah dihapus`
}
exports.notAvailable = (text) => {
  return `${text} tidak tersedia`
}
