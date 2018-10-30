import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loginState: 'update'
  },
  mutations: {
    changeLoginState: (state, strType) => {
      const obj = state
      obj.loginState = strType
    }
  }
})

export default store
