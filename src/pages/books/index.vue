<template>
    <div>
        图书中心
    </div>
</template>
<script>
import {GET, userLogin} from '../../utils/index.js'
import store from '../../store'
export default {
  name: 'books',
  methods: {
    changeLoginState (loginState) {
      store.commit('changeLoginState', loginState)
    }
  },
  async onLoad () {
    // const res = await GET('/demo')
    // console.log(res)
  },
  async onShow () {
    // 登录检查
    let rs = await userLogin()
    if (rs) {
      this.changeLoginState(rs)
      this.$router.push({path: '/pages/me/main', isTab: true})
    } else {
      // 业务处理
    }
  }
}
</script>
