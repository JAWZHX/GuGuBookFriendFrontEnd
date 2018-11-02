import config from '../config'

// get请求
export const GET = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      url: config.host + url,
      success: (res) => {
        if (parseInt(res.data.code) === 0) {
          resolve(res.data.data)
        } else {
          reject(res.data)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// post请求
export const POST = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method: 'POST',
      url: config.host + url,
      success: (res) => {
        if (parseInt(res.data.code) === 0) {
          resolve(res.data.data)
        } else {
          reject(res.data)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 封装微信login方法
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 保存或者更新用户信息
export const saveOrUpdateUser = (options) => {
  return new Promise((resolve, reject) => {
    const url = '/getOpenIDAndSK'
    async function startGet () {
      let rs = await GET(url, options)
      resolve(rs)
    }
    startGet()
  })
}

// 成功的Toast
export const successToast = (msg) => {
  wx.showToast({
    title: msg,
    icon: 'success'
  })
}

// 失败的Toast
export const failToast = (msg) => {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}

// 检查session_key是否过期
export const checkSession = () => {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

// 用户登录
export const userLogin = () => {
  return new Promise((resolve, reject) => {
    // 1、判断skey是否存在
    let loginFlag = wx.getStorageSync('skey')
    // 检查session_key是否过期(true:没过期， false：过期)
    async function checkSession () {
      let isExpired = await checkSession()
      return isExpired
    }

    if (loginFlag) {
      // 存在
      let isExpired = checkSession()
      if (isExpired) {
        // 没过期（做逻辑处理）
        resolve(false)
      } else {
        // 过期（需要去更新数据库里的用户信息）
        resolve('update')
      }
    } else {
      // 不存在（跳到登录tab页）
      resolve('save')
    }
  })
}
