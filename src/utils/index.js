import config from '../config'

// GET请求
export function GET (url, data) {
  return request(url, 'GET', data)
}
// POST请求
export function POST (url, data) {
  return request(url, 'POST', data)
}

function request (url, method, data, header = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method,
      header,
      url: config.host + url,
      success: function (res) {
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          showModal('失败', res.data.data.msg)
          reject(res.data)
        }
      }
    })
  })
}

// 显示提示模态框
export function showModal (title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false
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
