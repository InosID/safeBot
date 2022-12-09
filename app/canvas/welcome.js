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
    membercount,
    avatar,
    gif,
    layer,
    blur,
    delay,
    frame_limit
  } = {}) {
    this.background = background || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPYmX5NwYe5IgH0Gq1XOOxxQXa7eSZ8gimVw&usqp=CAU'
    this.name ??= name
    this.memberCount ??= membercount
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

  /** Set member count of user
   * @param {String} count
   */
  setMemberCount(membercount) {
    this.memberCount = membercount
    return this
  }

  /** Set avatar of the user (url) + png
   * @param {String} avatar
   */
  setAvatar(avatar) {
    this.avatar = avatar
    return this
  }

  /** Set if the background you want to use is a gif or not
   * @param {Boolean} condition
   */
  setGIF(condition) {
    this.gif = condition
    return this
  }

  /** Set the blur value if don't then don't use it
   * @param {Number} value
   */
  setBlur(value) {
    this.blur = value
    return this
  }

  /** Set delay between each frame
   * @param {Number} delay
   */
  setDelay(delay) {
    this.delay = delay
  }

  /** Set frame limit
   * @param {Number} limit
   */
  setFrameLimit(limit) {
    this.frame_limit = limit
  }

  /** Method to get image size from its url
   * @param {String} url
   */
  async _getImageSize(url) {
    const data = await axios.get(url, {
      responseType: 'arraybuffer'
    })
    return sizeOf(data.data)
  }

  /** Method to render frame
   * @param {Number} frame
   */
  async _renderFrame(frame) {
    const canvas = Canvas.createCanvas(700, 250)
  }
}

module.exports = Welcomer
