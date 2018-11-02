<template>
    <div>
        评论中心
    </div>
</template>
<script>
import {POST, userLogin} from '../../utils/index'
import store from '../../store.js'
export default {
  name: 'comments',
  methods: {
    changeLoginState (loginState) {
      store.commit('changeLoginState', loginState)
    }
  },
  async onShow () {
    // 登录检查
    let rs = await userLogin()
    if (rs) {
      this.changeLoginState(rs)
      this.$router.push({path: '/pages/me/main', isTab: true})
    } else {
      // 业务处理
      const res = await POST('/demo')
      console.log(res)
    }
  }
}
</script>
