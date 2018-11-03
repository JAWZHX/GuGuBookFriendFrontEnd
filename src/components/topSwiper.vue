<template>
    <div class="topSwiper-container">
        <swiper
            :indicator-dots='true'
            indicator-color='#007ACC'
            :autoplay='true'
            :interval='4000'
            :duration='1000'
            :circular='true'
        >
            <div :key="index1" v-for="(items, index1) in tops">
                <swiper-item>
                    <img
                        :key="img.id"
                        v-for="img in items"
                        :src="img.image"
                        mode="aspectFit"
                        class="slide-image"
                        @click="goToDetail(img.id)"
                    >
                </swiper-item>
            </div>
        </swiper>
    </div>
</template>
<script>
export default {
    name: 'topSwiper',
    props: {
        topList: {
            type: Array,
            require: true
        }
    },
    computed: {
        tops () {
            let res = this.topList
            return [res.slice(0,3), res.slice(3,6), res.slice(6,9)]
        }
    },
    methods: {
        goToDetail (bookId) {
            this.$router.push({path: '/pages/detail/main', query: {id: bookId}})
        }
    }
}
</script>
<style lang="scss" scoped>
.topSwiper-container{
  margin-top:5px;
  .slide-image{
    width:33%;
    height:250rpx;
  }
}
</style>
