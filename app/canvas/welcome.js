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
  }
}

module.exports = Welcomer
