<template>
    <div>
        图书中心
    </div>
</template>
<script>
import utils from '../../utils/index.js'
export default {
  name: 'books',
  async created () {
    const res = await utils.get('/demo')
    console.log(res)
  }
}
</script>
