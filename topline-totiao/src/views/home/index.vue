<template>
  <div>
     <!-- 导航头 -->
     <van-nav-bar
        title="黑马头条"
        fixed
        />
     <!-- 频道列表 -->
     <van-tabs animated v-model="activeIndex">
       <!-- 小按钮 ，点击弹出频道管理的弹出层 -->
       <van-icon slot="nav-right" name="wap-nav" class="nav-btn" @click="showChannelEdit=true"/>
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
                    <!-- 点击X按钮，纪录当前的文章对象 -->
                    <van-icon name='cross' class="close" @click="handleAction(article)"/>
                  </p>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
      <!-- 弹出层 moreAction     如果article的值为null 不显示more-action-->
      <more-action
        @handleSuccess='handleSuccess'
        v-if="currentArticle"
        :article="currentArticle"
        v-model="showMoreAction"></more-action>

        <!-- 弹出频道管理 ChannelEdit -->
        <channel-edit v-model="showChannelEdit"></channel-edit>
  </div>
</template>

<script>
import { getDefaultOrUserChannels } from '../../api/channel'
import { getArticles } from '../../api/article'
import { getItem, setItem } from '../../utils/localStorage'
import Vue from 'vue'
import { Lazyload } from 'vant'
// 加载moreaction组件
import MoreAction from './componens/MoreAction'
// 导入频道管理的组件
import ChannelEdit from './componens/ChannelEdit'
// options 为可选参数，无则不传
Vue.use(Lazyload)
export default {
  name: 'Home',
  components: {
    MoreAction,
    ChannelEdit
  },
  data () {
    return {
      // list: [], // 列表用的数据
      // loading: false,
      // finished: false,
      channels: [], // 频道列表
      activeIndex: 0, // tab是组件中默认显示的tab项的索引  通过该index，可以找到当前的频道对象
      successText: '', // 下拉更新完毕之后，成功的提示
      showMoreAction: false, // moreAction组件点X号显示或者隐藏
      currentArticle: null, // 点击X纪录当前文章对象
      showChannelEdit: false // 控制频道管理的弹出层显示
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
        let channels = []
        // 1 如果用户登陆 发送请求 获取数据
        if (this.$store.state.user) {
          const data = await getDefaultOrUserChannels()
          channels = data.channels
        } else {
          // 2 如果没有登陆，先去本地存储中获取数据，如果没有数据在发送请求
          // 如果本地存储中没有值，获取的是null
          channels = getItem('channels')
          if (!channels) {
            const data = await getDefaultOrUserChannels()
            channels = data.channels
            // 存储到本地存储中
            setItem('channels', channels)
          }
        }

        // 遍历频道对象 给所有的频道设置 时间戳和文章数组
        channels.forEach((channel) => {
          channel.timestamp = null
          channel.articles = []
          // 上拉加载
          channel.loading = false
          channel.finished = false
          // 下拉加载
          channel.pullloading = false
        })
        this.channels = channels
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
    },
    // 点击X按钮，弹出MoreAction，并且记录对应的文章列表
    handleAction (article) {
      this.showMoreAction = true
      this.currentArticle = article
    },
    // more-action 中操作成功执行的方法
    handleSuccess () {
      // 隐藏
      this.showMoreAction = false
      // 去掉当前的文章数据
      const articles = this.currentChannel.articles
      const index = articles.findIndex((article) => {
        return article.art_id === this.currentArticle.art_id
      })
      // 删除指定位置元素
      articles.splice(index, 1)
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
.nav-btn{
  position: fixed;
  right: 10px;
  line-height: 44px;
  font-size: 22px;
  background-color: #ffffff;
  opacity: 0.8;
}
</style>
