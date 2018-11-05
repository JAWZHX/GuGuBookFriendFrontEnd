<template>
    <div class="comments-container">
      <comment-list-component type="user"
                  :comments="commentArray"></comment-list-component>
      <div class="page-title">我的图书</div>
      <card-component 
        v-for='book in books' 
        :key='book.id'
        :book='book'></card-component>
      <div v-if='!books.length'>暂时还没添加过书，快去添加几本把</div>
    </div>
</template>
<script>
import { GET, userLogin } from '../../utils/index'
import CardComponent from '@/components/card.vue'
import CommentListComponent from '@/components/commentList.vue'
import store from '../../store.js'
export default {
  name: 'comments',
  data () {
    return {
      commentArray: [],
      books: [],
      skey: ''
    }
  },
  components: {
    CardComponent,
    CommentListComponent
  },
  methods: {
    changeLoginState (loginState) {
      store.commit('changeLoginState', loginState)
    },
    async getBooks () {
      const books = await GET('/booklist', {
        skey: this.skey
      })
      this.books = books.list
    },
    async getComments () {
      const comments = await GET('/commentlist', {
        skey: this.skey
      })
      this.commentArray = comments.list
    },
    init () {
      this.skey = wx.getStorageSync('skey')
      wx.showNavigationBarLoading()
      this.getComments()
      this.getBooks()
      wx.hideNavigationBarLoading()
    }
  },
  onPullDownRefresh () {
    this.init()
    wx.stopPullDownRefresh()
  },
  async onShow () {
    // 登录检查
    let rs = await userLogin()
    if (rs) {
      this.changeLoginState(rs)
      this.$router.push({ path: '/pages/me/main', isTab: true })
    } else {
      // 业务处理
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
.comments-container {
  .page-title {
    padding: 20rpx;
    background: #eee;
  }
}
</style>
