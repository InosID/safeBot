let sizeOf = require('image-size')
let axios = require('axios')
let Canvas = require('canvas')
let jimp = require('jimp')
let gifframes = require('gif-frames')
let GIFEncoder = require('gif-encoder-2')

Canvas.registerFont(require('@canvas-fonts/arial-bold'), {
  family: 'Arial-Bold'
})

class Welcomer {
  constructor({
    background,
    name,
    discriminator,
    avatar,
    gif,
    layer,
    blur,
    delay,
    frame_limit
  } = {}) {
    this.background = background || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPYmX5NwYe5IgH0Gq1XOOxxQXa7eSZ8gimVw&usqp=CAU'
    this.name ??= name
    this.discriminator ??= discriminator
    this.avatar ??= avatar
    this.gif ??= gif
    this.layer = layer || './assets/layer.png'
    this.blur ??= blur
    this.delay = delay || 50
    this.frame_limit = frame_limit || 30
  }

  /** Set background of the image (url)
   * @param {String} background
   */
  setBackground(background) {
    this.background = background
    return this
  }

  /** Set user name
   * @param {String} name
   */
  setName(name) {
    this.name = name
    return this
  }

  /** Set discriminator of user
   * @param {String} discriminator
   */
  setDiscriminator(discriminator) {
    this.discriminator = discriminator
    return this
  }

  /** Set avatar of the user (url) + png
   * @param {String} avatar
   */
  setAvatar(avatar) {
    this.avatar = avatar
    return this
  }
}

module.exports = Welcomer
