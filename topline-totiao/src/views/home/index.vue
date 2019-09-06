<template>
  <div>
     <!-- 导航头 -->
     <van-nav-bar
        title="黑马头条"
        fixed
        />
     <!-- 频道列表 -->
     <van-tabs animated v-model="activeIndex">

        <!-- 遍历标签页，显示频道列表 -->
        <van-tab
         v-for="channel in channels"
         :title="channel.name"
         :key="channel.id">

         <!-- 下拉加载更改组件 -->
          <van-pull-refresh
            :success-text="successText"
            v-model="currentChannel.pullloading"
            @refresh="onRefresh">
            <!-- 文章列表 不同的标签页有不同的列表-->
            <van-list
              v-model="currentChannel.loading"
              :finished="currentChannel.finished"
              finished-text="没有更多了"
              @load="onLoad"
              >
              <van-cell
                v-for="article in currentChannel.articles"
                :key="article.art_id.toString()"
                :title="article.title">

                <div slot='label'>
                  <!-- grid 显示封面 -->
                  <van-grid v-if="article.cover.type" :border="false" :column-num="3">
                    <van-grid-item
                    v-for="(img,index) in article.cover.images"
                    :key="img+index">
                      <van-image lazy-load height="80" :src="img">
                        <template v-slot:loading>
                          <van-loading type="spinner" size="20" />
                        </template>
                        <!-- 自定义加载失败 -->
                        <template v-slot:error>加载失败</template>
                      </van-image>
                    </van-grid-item>
                  </van-grid>
                  <p>
                    <span>{{article.aut_name}}</span>&nbsp;
                    <span>{{article.comm_count}}评论</span>&nbsp;
                    <span>{{article.pubdate | fmtDate}}</span>&nbsp;
                    <van-icon name='cross' class="close"/>
                  </p>
                </div>
              </van-cell>

            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
      <!-- 弹出层 moreAction-->
      <more-action></more-action>
  </div>
</template>

<script>
import { getDefaultOrUserChannels } from '../../api/channel'
import { getArticles } from '../../api/article'
import Vue from 'vue'
import { Lazyload } from 'vant'
// 加载moreaction组件
import MoreAction from './componens/MoreAction'

// options 为可选参数，无则不传
Vue.use(Lazyload)
export default {
  name: 'Home',
  components: {
    MoreAction
  },
  data () {
    return {
      list: [], // 列表用的数据
      loading: false,
      finished: false,
      channels: [], // 频道列表
      activeIndex: 0, // tab是组件中默认显示的tab项的索引  通过该index，可以找到当前的频道对象
      successText: '' // 下拉更新完毕之后，成功的提示
    }
  },
  created () {
    // 加载频道列表
    this.loadChannels()
  },
  computed: {
    // 返回当前的频道对象
    currentChannel () {
      return this.channels[this.activeIndex]
    }
  },
  methods: {
    // 加载频道列表
    async loadChannels () {
      try {
        const data = await getDefaultOrUserChannels()
        // 遍历频道对象 给所有的频道设置 时间戳和文章数组
        data.channels.forEach((channel) => {
          channel.timestamp = null
          channel.articles = []
          // 上拉加载
          channel.loading = false
          channel.finished = false
          // 下拉加载
          channel.pullloading = false
        })
        this.channels = data.channels
      } catch (err) {
        console.log(err)
      }
    },
    // list组件的load
    async onLoad () {
      // 发送请求   获取当前频道对象   下面不需要写了，因为设置了一个计算属性
      // const currentChannel = this.channel[this.activeIndex]
      // 当前频道对象要有时间戳   当前频道对象文章数组
      const data = await getArticles({
        // 频道id  时间戳
        channel_id: this.currentChannel.id,
        timestamp: this.currentChannel.timestamp || Date.now(),
        // 是否包含置顶1  0不包含
        with_top: 1
      })
      // 纪录文章列表 ，纪录最后一条数据的时间戳
      this.currentChannel.timestamp = data.pre_timestamp
      this.currentChannel.articles.push(...data.results)

      // this.loading = false
      this.currentChannel.loading = false
      // 文章加载完毕
      if (data.results.length === 0) {
        // this.finished = true
        this.currentChannel.finished = true
      }
    },
    // 下拉加载更多
    async onRefresh () {
      try {
        const data = await getArticles({
          // 频道id
          channel_id: this.currentChannel.id,
          // 时间戳
          timestamp: Date.now(),
          // 是否包含置顶1  0不包含
          with_top: 1
        })
        // 设置加载完毕
        this.currentChannel.pullloading = false
        // 把数据放到数组的最前面(最新数据)
        this.currentChannel.articles.unshift(...data.results)
        this.successText = `加载了${data.results.length}条数据`
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  // 在scoped中书写的样式，给动态生成的标签或者子组件中不可用
  // 深度作用选择器 /deep/
.van-tabs {
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 46px;
    left: 0px;
    right: 10px;
    z-index: 100;
  }
  /deep/ .van-tabs__content {
    margin-top: 90px;
    margin-bottom: 50px;
  }
}
.close {
  float: right;
  font-size: 18px;
}
</style>
