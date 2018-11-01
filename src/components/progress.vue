<template>
    <div class="progress-container">
        <progress :percent="percent" color="#007ACC" />
        <p><span style="color: #007acc;">{{year}}</span>已经过去<span style="color: #007acc;">{{day}}</span>天，<span style="color: #007acc;">{{percent}}</span>%</p>
    </div>
</template>
<script>
export default {
  name: 'progressCom',
  data () {
    return {

    }
  },
  methods: {
    // 判断是否是闰年
    isLeapYear () {
      const year = new Date().getFullYear()
      if (year % 400 === 0) {
        return true
      } else if (year % 4 === 0 && year % 100 !== 0) {
        return true
      } else {
        return false
      }
    },
    // 计算当年有多少天
    totalDay () {
      return this.isLeapYear() ? 366 : 365
    }
  },
  computed: {
    year () {
      return new Date().getFullYear()
    },
    day () {
      // 一年的第一天
      let start = new Date()
      start.setMonth(0)
      start.setDate(1)
      //
      const offset = new Date().getTime() - start.getTime()
      return parseInt(offset / 1000 / 60 / 60 / 24) + 1
    },
    percent () {
      return (this.day / this.totalDay() * 100).toFixed(1)
    }
  }
}
</script>
<style lang="scss" scoped>
.progress-container {
    margin-bottom: 50rpx;
    p {
        text-align: center;
        margin-top: 10rpx;
    }
}
</style>
