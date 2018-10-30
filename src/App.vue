<script>
import {login, getUserInfo, getOpenIdAndSK, checkSession, userLogin} from './utils/index'

export default {
  async onLoad () {
    conso.log('app.vue')
    // 查看是否授权
    // wx.getSetting({
    //   success (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res)
    //         }
    //       })
    //     } else {
    //       wx.switchTab({
    //         url: '../me/main'
    //       })
    //     }
    //   }
    // })
  }
}
</script>

