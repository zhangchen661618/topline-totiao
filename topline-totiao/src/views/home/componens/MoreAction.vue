<template>
    <van-dialog
        :value="value"
        @input="$emit('input',$event)"
        :showConfirmButton='false'
        closeOnClickOverlay
        >
        <van-cell-group v-show="!showReports">
            <van-cell title="不感兴趣" icon="location-o" @click="handle('dislike')"/>
            <van-cell title="反馈垃圾内容" icon="location-o" is-link @click="showReports=true"/>
            <van-cell title="拉黑作者" icon="location-o" @click="handle('blacklist')"/>
        </van-cell-group>
        <!-- 举报文章 -->
        <van-cell-group v-show="showReports">
            <van-cell icon="arrow-left" @click="showReports=false"/>
            <van-cell
             v-for="item in reportList"
             :key="item.type"
             :title="item.title"
             @click="handle('report',item.type)"/>
        </van-cell-group>
    </van-dialog>
</template>

<script>
import { dislikeArticle, reportArtice } from '../../../api/article'
import { blacklists } from '../../../api/user'
export default {
  name: 'MoreAction',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showReports: false,
      // 举报类型： 0-其他问题，1-标题夸张，2-低俗色情，3-错别字多，4-旧闻重复，5-广告软文，6-内容不实，7-涉嫌违法犯罪，8-侵权
      reportList: [
        { title: '标题夸张', type: 1 },
        { title: '低俗色情', type: 2 },
        { title: '错别字多', type: 3 },
        { title: '旧闻重复', type: 4 },
        { title: '广告软文', type: 5 },
        { title: '内容不实', type: 6 },
        { title: '涉嫌违法犯罪', type: 7 },
        { title: '侵权', type: 8 },
        { title: '其他问题', type: 0 }
      ]
    }
  },
  // 点击所有的cell的时候 都执行这个方法 通过type判断具体要执行的操作
  methods: {
    handle (type, reportType) {
      switch (type) {
        case 'dislike':
          // 不感兴趣
          this.dislike()
          break
        case 'blacklist':
          // 拉黑作者
          this.blacklistUser()
          break
        case 'report':
          this.report(reportType)
          break
      }
    },
    // 拉黑作者
    async blacklistUser () {
      try {
        await blacklists(this.article.aut_id)
        // 通知父组件 拉黑成功  隐藏对话框，删除数据
        this.$emit('handleSuccess')
        this.$toast.success('操作成功')
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    },
    // 不感兴趣
    async dislike () {
      try {
        await dislikeArticle(this.article.art_id)
        this.$toast.success('操作成功')
        // 隐藏弹出层  移除数据
        // 告知父组件，操作成功
        this.$emit('handleSuccess')
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    },
    async report (reportType) {
      try {
        await reportArtice({
          target: this.article.art_id,
          type: reportType
        })
        this.$emit('input', false) // 告诉父组件关闭对话框
        this.$toast.success('操作成功')
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style>

</style>
