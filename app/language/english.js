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

exports.helpHi = (botname) => {
  return `Hi, I'm ${botname}. Here is my list of commands`
}

exports.featureDesc = (feature) => {
  switch(feature) {
    case 'antinsfw':
      return `Now 18+ photos and stickers will be automatically removed.`
    break
    case 'antibadword':
      return `Now bad word message will be automatically removed.`
    break
  }
}
exports.featureActive = (feature, desc) => {
  return `Successfully activated ${feature}. ${desc}`
}
exports.featureDeactive = (feature) => {
  return `successfully deactivate ${feature}`
}
exports.isActive = (feature) => {
  return `${feature} is active`
}
exports.isDeactive = (feature) => {
  return `${feature} is nonactive`
}

exports.done = () => {
  return `Done.`
}

exports.isConfig = (feature) => {
  return `You have changed to ${feature}`
}
exports.successConfig = (feature) => {
  return `Successfully changed to ${feature}`
}

exports.warnkick = () => {
  return `Your warning has reached its maximum. see you later.`
}
exports.notAllowedNSFW = (type) => {
  return `You are not allowed to post ${type} here`
}
exports.detectedToxic = () => {
  return `You are detected sending abusive words.`
}

exports.needText = (cmd) => {
  return `Where's the text?\nEx: ${cmd}`
}
exports.available = (text) => {
  return `${text} is available`
}

exports.added = (text) => {
  return `${text} has been added`
}
exports.removed = (text) => {
  return `${text} has been removed`
}

exports.notAvailable = (text) => {
  return `${text} not available`
}
