<template>
    <div class="me-container">
        <div v-if="!userInfo">
            <h1>尊敬的用户，你只有先授权登录才可以使用其他功能哦！</h1>
            <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">授权登录</button>
        </div>
        <div v-if="userInfo">
          <div class="userinfo">
              <img :src="userInfo.avatarUrl" alt="用户头像">
              <span class="nickname">{{userInfo.nickName}}</span>
          </div>
          <progress-component></progress-component>
          <button class="btn" @click="scanBook">添加图书</button>
        </div>
    </div>
</template>
<script>
import {login, successToast, failToast, saveOrUpdateUser, userLogin, getUserInfo, POST} from '../../utils/index'
import store from '../../store.js'
import ProgressComponent from '../../components/progress.vue'
import config from '../../config'
export default {
  name: 'me',
  data () {
    return {
      userInfo: null
    }
  },
  components: {
    ProgressComponent
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
    // 添加图书
    async addBook (isbn) {
      let skey = wx.getStorageSync('skey')
      let data = {
            isbn,
            skey
          }
      console.log(data)
      wx.request({
        data,
        method: 'POST',
        url: config.host + '/saveBook',
        success: (res) => {
          wx.showModal({
            title: '添加图书',
            content: res.data.data.msg,
            showCancel: false
          })
        }
      })
    },
    // 扫描图书
    scanBook () {
      wx.scanCode({
        success: (res) => {
          if(res.result) {
            this.addBook(res.result)
          }
        }
      })
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
          this.userInfo = Object.assign({}, JSON.parse(rs.userInfo))
          console.log('测试', this.userInfo)
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
      this.userInfo = Object.assign({}, rs.userInfo)
      console.log(this.userInfo)
    }
  }
}
</script>
<style lang="scss" scoped>
.me-container {
  padding: 0 40rpx;
  .userinfo {
    margin-top: 100rpx;
    margin-bottom: 50rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      border-radius: 50%;
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 30rpx;
    }
    .nickname {
      color: #989898;
    }
  }
}
</style>
