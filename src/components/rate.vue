<template>
    <div class="rate-container">
        <span class="text-primary">☆☆☆☆☆</span>
        <span class="solid text-primary" :style="style">★★★★★</span>
    </div>
</template>
<script>
export default {
  name: 'rate',
  props: {
    value: {
      type: String,
      default: '0'
    }
  },
  computed: {
    style () {
      return `width:${this.value / 2 * 4 / 5}em;`
    }
  }
}
</script>
<style lang="scss" scoped>
.rate-container {
  position: relative;
  display: inline-block;
  text-align: left;
  .solid {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    width: 1em;
    overflow: hidden;
  }
}
</style>
