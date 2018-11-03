<template>
    <div class="card-container" @click="goToDetail()">
        <div class="img-container" @click.stop="preview">
            <img :src="book.image" alt="图书封面" mode="aspectFit">
        </div>
        <div class="detail">
            <div class="left">
                <p class="title text-primary">{{book.title}}</p>
                <p class="author">{{book.author}}</p>
                <p class="publisher">{{book.publisher}}</p>
            </div>
            <div class="right">
                <div class="rate-container">
                    <span class="rate">{{book.rate}}</span>
                    <rate-component :value="book.rate"></rate-component>
                </div>
                <p class="count text-primary">浏览：{{book.count}}</p>
                <p class="uploader">{{uploader}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import RateComponent from "./rate.vue";
export default {
  name: "card",
  components: {
    RateComponent
  },
  computed: {
    uploader() {
      return JSON.parse(this.book.user.user_info).nickName;
    }
  },
  methods: {
    goToDetail() {
      this.$router.push({
        path: "/pages/detail/main",
        query: { id: this.book.id }
      });
    },
    preview() {
      wx.previewImage({
        current: this.book.image,
        urls: [this.book.image]
      });
    }
  },
  props: {
    book: {
      type: Object,
      require: true
    }
  }
};
</script>
<style lang="scss" scoped>
.card-container {
  display: flex;
  font-size: 14px;
  padding: 10rpx;
  margin-top: 10px;
  margin-bottom: 10px;
  .img-container {
    width: 180rpx;
    height: 180rpx;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .detail {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    .right {
      text-align: right;
    }
  }
}
</style>
