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
  } = {}) {}
}

module.exports = Welcomer
