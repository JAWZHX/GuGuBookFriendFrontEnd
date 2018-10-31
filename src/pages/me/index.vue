<template>
    <div>
        <div v-if="!userInfo">
            <h1>尊敬的用户，你只有先授权登录才可以使用其他功能哦！</h1>
            <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">授权登录</button>
        </div>
        <div v-if="userInfo">
          个人中心
        </div>
    </div>
</template>
<script>
import {login, successToast, failToast, saveOrUpdateUser, userLogin, getUserInfo} from '../../utils/index'
import store from '../../store.js'
export default {
  name: 'me',
  data () {
    return {
      userInfo: null
    }
  },
  computed: {
    loginState () {
      return store.state.loginState
    }
  },
  methods: {
    changeLoginState (loginState) {
      store.commit('changeLoginState', loginState)
    },
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
          let rs = await saveOrUpdateUser(options)
          this.userInfo = rs.userInfo
          wx.setStorage({
            key: 'skey',
            data: rs.skey
          })
          this.changeLoginState('update')
        }
      }
    }
  },
  async onShow () {
    // 登录检查
    let rs = await userLogin()
    if (rs) {
      this.changeLoginState(rs)
    } else {
      // 获取用户信息
      let rs = await getUserInfo()
      this.userInfo = rs.userInfo
    }
  }
}
</script>
