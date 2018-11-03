<template>
    <div class="detail-container">
        图书id：{{bookId}}
    </div>
</template>
<script>
import {GET} from '../../utils/index'
export default {
    name: 'detail',
    data () {
        return {
            bookId: ''
        }
    },
    methods: {
        async getDetail() {
            let res = await GET('/bookDetail', {id: this.bookId})
            console.log(res)
        }
    },
    mounted () {
        this.bookId = this.$root.$mp.query.id 
        this.getDetail()
    }
}
</script>
<style lang="scss" scoped>
.detail-container {
    
}
</style>
