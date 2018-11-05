<template>
    <div class="book-container">
      <top-swiper :top-list="topList"></top-swiper>
      <div v-if="bookList.length > 0">
        <card-component v-for="book in bookList" :key="book.isbn" :book="book"></card-component>
      </div>
      <p class="text-footer" v-if="!more">
        没有更多数据
      </p>
    </div>
</template>
<script>
import { GET, userLogin } from '../../utils/index.js'
import store from '../../store'
import CardComponent from './../../components/card.vue'
import config from '../../config'
import TopSwiper from './../../components/topSwiper.vue'
export default {
  name: 'books',
  components: {
    CardComponent,
    TopSwiper
  },
  data () {
    return {
      bookList: [],
      page: 1,
      pageSize: 10,
      more: true,
      topList: []
    }
  },
  methods: {
    changeLoginState (loginState) {
      store.commit('changeLoginState', loginState)
    },
    // 获取图书列表
    async getBookList (init) {
      if (init) {
        this.page = 1
        this.more = true
      }
      wx.showNavigationBarLoading()

      // let res = await GET('/booklist', {page: this.page, pageSize: this.pageSize})
      let result = []
      let that = this
      wx.request({
        data: { page: this.page, pageSize: this.pageSize },
        url: config.host + '/booklist',
        success: (res) => {
          if (res.data.code === 0) {
            result = res.data.data
            if (result.list.length < this.pageSize && this.page > 0) {
              this.more = false
            }
            if (init) {
              this.bookList = result.list
              wx.stopPullDownRefresh()
            } else {
              this.bookList = this.bookList.concat(result.list)
            }

            wx.hideNavigationBarLoading()
          }
        },
        fail: (err) => {
          console.log(err)
        }
      })
    },
    // 获取轮播图数据
    async getTop () {
      wx.request({
        url: config.host + '/top',
        success: (res) => {
          this.topList = res.data.data.list
        },
        fail: (err) => {
          console.log(err)
        }
      })
    }
  },
  onPullDownRefresh () {
    this.getBookList(true)
  },
  onReachBottom () {
    if (!this.more) {
      // 没有更多数据
      return false
    }
    this.page += 1
    this.getBookList()
  },
  async onShow () {
    // 登录检查
    let rs = await userLogin()
    if (rs) {
      this.changeLoginState(rs)
      this.$router.push({ path: '/pages/me/main', isTab: true })
    } else {
      // 业务处理(获取图书列表信息)
      this.getBookList()
      this.getTop()
    }
  }
}
</script>
<style lang="scss" scoped>
.book-container {
  .text-footer {
    text-align: center;
    line-height: 70rpx;
    font-size: 14px;
  }
}
</style>
