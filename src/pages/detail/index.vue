<template>
    <div class="detail-container">
        <div class="bg-image-container">
            <img :src="info.image" class="bg-image" mode="aspectFill" alt="背景图片">
            <img :src="info.image" mode="aspectFit" class="cover" alt="图书封面">
            <div class="info">
                <p class="title">{{info.title}}</p>
                <p class="author">{{info.author}}</p>
            </div>
        </div>
        <div class="uploader-rate-container">
            <div class="uploader">
                <img class="avatar" :src="userInfo.avatarUrl" alt="上传者头像">
                <span class="nickName">{{userInfo.nickName}}</span>
            </div>
            <div class="rate">
                <span class="score">{{info.rate}}分</span>
                <rate-component :value="info.rate"></rate-component>
            </div>
        </div>
        <div class="publisher-price-container">
            <span class="publisher">出版社：{{info.publisher}}</span>
            <span class="price">{{info.price}}</span>
        </div>
        <div class="tags-container">
            <span class="tag" v-for="(item, index) in tags" :key="index">{{item}}</span>
        </div>
        <div class="summary">
            {{info.summary}}
        </div>
        <comment-list-component :comments="commentList"></comment-list-component>
        <div class="comment" v-if="showAdd">
            <textarea v-model="comment"
                    class="textarea"
                    :maxlength="100"
                    placeholder="请输入图书短评"></textarea>
            <div class="location">
                地理位置：
                <switch color="#007ACC" :checked="location" @change="getGeo"></switch>
                <span class="text-primary">{{location}}</span>
            </div>
            <div class="phone">
              手机型号：
              <switch color="#007ACC" :check="phone" @change="getPhone"></switch>
              <span class="text-primary">{{phone}}</span>
            </div>
            <button class="btn" @click='addComment'>
              评论
            </button>
        </div>
        <div v-else style="text-align: center;">
          已经评论过啦
        </div>
        <button open-type='share' class="btn">转发给好友</button>
    </div>
</template>
<script>
import RateComponent from './../../components/rate.vue'
import CommentListComponent from '../../components/commentList.vue'
import { GET, POST, showModal } from '../../utils/index'
// 引入SDK核心类
import { QQMapWX } from '../../../static/js/qqmap-wx-jssdk.js'
export default {
  name: 'detail',
  data () {
    return {
      bookId: '',
      info: {},
      userInfo: {},
      openId: '',
      tags: [],
      comment: '',
      commentList: [],
      location: '',
      phone: '',
      // 腾讯位置服务API核心类实例
      qqmapsdk: null
    }
  },
  components: {
    RateComponent,
    CommentListComponent
  },
  computed: {
    showAdd () {
      if (this.commentList.filter(item => item.openid === this.openId).length) {
        return false
      }
      return true
    }
  },
  methods: {
    // 添加评论
    async addComment () {
      if (!this.comment) {
        return
      }
      const data = {
        openid: this.openId,
        bookid: this.bookId,
        comment: this.comment,
        phone: this.phone,
        location: this.location
      }
      try {
        await POST('/addcomment', data)
        this.comment = ''
        this.getComments()
      } catch (e) {
        showModal('失败', e.msg)
      }
    },
    // 获取评论
    async getComments () {
      const comments = await GET('/commentlist', { bookid: this.bookId })
      this.commentList = comments.list || []
      console.log('comments', this.commentList)
    },
    // 获取地理位置
    getGeo (e) {
      if (e.target.value) {
        wx.getLocation({
          success: geo => {
            let latitude = geo.latitude
            let longitude = geo.longitude
            this.qqmapsdk.reverseGeocoder({
              location: {
                latitude,
                longitude
              },
              success: res => {
                this.location = res.result.ad_info.city
              },
              fail: res => {
                this.location = res
              }
            })
          }
        })
      } else {
        this.location = ''
      }
    },
    // 获取手机型号
    getPhone (e) {
      if (e.target.value) {
        const phoneInfo = wx.getSystemInfoSync()
        this.phone = phoneInfo.model
      } else {
        this.phone = ''
      }
    },
    // 获取图书详情
    async getDetail () {
      let res = await GET('/bookDetail', { id: this.bookId })
      this.info = Object.assign({}, res.info)
      this.openId = this.info.user.openid
      this.userInfo = JSON.parse(this.info.user.user_info)
      this.tags = this.info.tags.split(',')
      wx.setNavigationBarTitle({
        title: this.info.title
      })
    }
  },
  onLoad () {
    // 实例化API核心类
    this.qqmapsdk = new QQMapWX({
      key: 'F75BZ-LVX63-EII3P-YBKWW-2S636-LLBCR'
    })
  },
  onPullDownRefresh () {
    this.bookId = this.$root.$mp.query.id
    this.getDetail()
    this.getComments()
  },
  onShow () {
    this.bookId = this.$root.$mp.query.id
    this.getDetail()
    this.getComments()
  },
  onShareAppMessage (res) {
    return {
      title: this.info.title
    }
  }
}
</script>
<style lang="scss" scoped>
.btn {
  width: 90%;
  margin-bottom: 20rpx;
}
.detail-container {
  font-size: 14px;
  .bg-image-container {
    width: 100%;
    height: 500rpx;
    position: relative;
    overflow: hidden;
    .bg-image {
      width: 100%;
      filter: blur(5px);
    }
    .cover {
      width: 100%;
      height: 300rpx;
      position: absolute;
      left: 0;
      top: 30rpx;
    }
    .info {
      position: absolute;
      left: 0;
      top: 330rpx;
      width: 100%;
      text-align: center;
      color: white;
      .title {
        font-size: 20px;
      }
      .author {
        font-size: 14px;
      }
    }
  }
  .uploader-rate-container {
    display: flex;
    justify-content: space-between;
    padding: 10rpx;
    .uploader {
      .avatar {
        display: inline-block;
        font-size: 0;
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
        margin-right: 10rpx;
      }
      .nickName {
        display: inline-block;
        font-size: 14px;
        vertical-align: 9px;
      }
    }
    .rate {
      font-size: 14px;
      .score {
        margin-right: 10rpx;
      }
    }
  }
  .publisher-price-container {
    font-size: 14px;
    display: flex;
    padding: 10rpx;
    justify-content: space-between;
  }
  .tags-container {
    padding: 10rpx;
    font-size: 14px;
    .tag {
      border: 1px solid #007acc;
      border-radius: 20rpx;
      margin-right: 10rpx;
      margin-bottom: 10rpx;
      padding: 20rpx;
      display: inline-block;
    }
  }
  .summary {
    font-size: 14px;
    padding: 20rpx;
    text-indent: 2em;
  }
  .comment {
    margin-top: 10px;
    .textarea {
      width: 710rpx;
      height: 200rpx;
      background: #eee;
      padding: 20rpx;
    }
    .location {
      padding: 10rpx 20rpx;
    }
    .phone {
      padding: 10rpx 20rpx;
    }
  }
}
</style>
