import config from '../config'

const get = function (url) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      success: (res) => {
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          reject(res.data)
        }
      }
    })
  })
}

export default {
  get
}
