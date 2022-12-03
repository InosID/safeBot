exports.cooldown = (cooldown) => {
  return `Cooldown ${cooldown} second, wait and try again`
}

exports.onlyOwner = () => {
  return `This command can only be used by the owner`
}
exports.onlyGroup = () => {
  return `This command can only be used in groups`
}
exports.onlyGroupAdmin = () => {
  return `This command can only be used by group admins`
}
exports.onlyBotAdmin = () => {
  return `Make Bot as admin to use command`
}
exports.onlyPrivate = () => {
  return `This command can only be used in private chat`
}
