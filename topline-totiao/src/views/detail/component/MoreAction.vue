<template>
   <div class="more-action">
    <van-button
      :icon="article.attitude===1?'star':'star-o'"
      round
      :loading="false"
      type="danger"
      @click="handleLike"
    >点赞</van-button>

    <van-button
      icon="delete"
      round
      :loading="false"
      type="danger"
    >不喜欢</van-button>
  </div>
</template>

<script>
import { likeArticle, unlikeArticle } from '../../../api/article'
export default {
  props: ['article'],
  methods: {
    // 点赞和取消点赞
    async handleLike () {
      // 判断是否登陆

      // 点赞或者取消点赞
      try {
        if (this.article.attitude === 1) {
          // 当前是点赞,取消点赞
          await unlikeArticle(this.article.art_id)
          this.article.attitude = -1
        } else {
          await likeArticle(this.article.art_id)
          this.article.attitude = 1
        }
      } catch (error) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.more-action {
  padding: 20px;
  display: flex;
  justify-content: space-around;
}

</style>
