<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="comment in list"
        :key="comment.com_id.toString()"
      >
        <div slot="icon">
          <img class="avatar" :src="comment.aut_photo" alt="">
        </div>
        <div slot="title">
          <span>{{comment.aut_name}}</span>
        </div>
        <div slot="default">
          <van-button icon="like-o" size="mini" plain>{{comment.like_count}}赞</van-button>
        </div>
        <div slot="label">
          <p>{{comment.content}}</p>
          <p>
            <span>{{comment.pubdate | fmtDate}}</span>
            ·
            <span @click="handleShowReplyList(comment)">回复{{comment.reply_count}}</span>
          </p>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getComments } from '../../../api/comment'
import eventHub from '@/utils/eventHub'
export default {
  name: 'CommentList',
  props: ['isArticle', 'id'],
  data () {
    return {
      loading: false,
      finished: false,
      list: [], // 评论列表
      offset: null, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
      limit: 10 // 每页获取多少条数据
    }
  },
  created () {
    // 注册评论发布成功的事件
    eventHub.$on('sendSuccess', (obj) => {
      // obj.comment 新增的属性  isArticle
      if (this.isArticle === obj.isArticle) {
        this.list.unshift(obj.comment)
      }
    })
  },
  methods: {
    async onLoad () {
      // 获取评论列表
      try {
        const data = await getComments({
          isArticle: this.isArticle,
          source: this.id,
          offset: this.offset,
          limit: this.limit
        })
        // 当前获取的最后一条数据的id存储
        this.offset = data.last_id
        this.list.push(...data.results)
        this.loading = false
        if (data.results.length === 0) {
          this.finished = true
        }
      } catch (err) {
        this.$toast.fail('获取评论失败')
      }
    },
    // 点击回复按钮，显示回复评论的列表
    handleShowReplyList (comment) {
      this.$store.commit('setShowReplyList', true)
      // 把 comment纪录到仓库里
      this.$store.commit('setCurrentComment', comment)
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  width: 25px;
  height: 25px;
  border-radius: 100%;
  margin-right: 5px;
}
.van-list{
  margin-bottom: 64px;
}
</style>
