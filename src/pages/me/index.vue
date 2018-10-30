<template>
    <div>
        <div v-if="!userInfo">
            <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">授权登录</button>
        </div>
        <div v-if="userInfo">
          个人中心
        </div>
    </div>
</template>
<script>
import {login, successToast, failToast, saveOrUpdateUser, userLogin} from '../../utils/index'
import store from '../../store.js'
export default {
  name: 'me',
  data () {
    return {
      userInfo: null
    }
  },
  watch: {
    userInfo: function (value) {
      console.log(value)
      wx.setStorage({
        key: 'skey',
        data: value.skey
      })
    }
  },
  computed: {
    loginState () {
      return store.state.loginState
    }
  },
  methods: {
    async bindGetUserInfo (e) {
      if (e.mp.detail.errMsg !== 'getUserInfo:ok') {
        // 拒绝授权提示getUserInfo:fail auth deny
        failToast('授权失败')
      } else {
        // 授权成功提示并将用户信息存入数据库
        successToast('授权成功')
        let options = Object.assign({}, e.mp.detail)
        // 将信息保存到数据库
        let res = await login()
        if (res.code) {
          options.code = res.code
          options.loginState = this.loginState
          this.userInfo = await saveOrUpdateUser(options)
        }
      }
    }
  },
  onShow () {
    // // 1、判断skey是否存在
    // let loginFlag = wx.getStorageSync('skey')
    // if(loginFlag) {
    //   // 存在
    //   // 检查session_key是否过期(true:没过期， false：过期)
    //   let isExpired = await checkSession()
    //   if (isExpired) {
    //     // 没过期（做逻辑处理）
    //   } else {
    //     // 过期（需要去更新数据库里的用户信息）
    //   }
    // } else {
    //   // 不存在（跳到登录tab页）
    //   wx.switchTab({
    //     url: '../me/main'
    //   })
    // }
    console.log('me.vue')
    console.log(this.loginState)
  }
}
</script>
