<template>
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    position="bottom"
    :style="{ height: '90%' }"
    >
    <van-cell icon="cross" @click="$emit('input',false)"/>
    <!-- 我的频道 -->
    <van-cell title="我的频道" label="点击进入频道">
      <van-button
        round
        type="danger"
        size="mini"
        v-show="!isEdit"
        @click="isEdit=true"
      >编辑</van-button>

      <van-button
        round
        type="danger"
        size="mini"
        v-show="isEdit"
        @click="isEdit=false"
      >完成</van-button>

    </van-cell>
    <van-grid>
      <van-grid-item
        v-for="(channel,index) in channels"
        :key="channel.id"
        @click="handleMyChannelItem(index,channel.id)"
      >
      <div slot="text"  class="van-grid-item__text" :class="{active:active===index}">
          {{channel.name}}
      </div>
        <!-- 关闭按钮 -->
        <van-icon
          slot="icon"
          class="close-icon"
          name="close"
          v-show="isEdit && index!==0"
        />
      </van-grid-item>
    </van-grid>
    <!-- 推荐频道 -->
    <van-cell title="推荐频道" label="点击添加频道" />
    <van-grid>
      <van-grid-item
        @click="handleChannelItem(channel)"
        v-for="channel in recomendChannels"
        :key="channel.id"
        :text="channel.name"
      />
    </van-grid>

    </van-popup>
</template>

<script>
import { getAllChannels, deleteChannel } from '../../../api/channel'
import { mapState } from 'vuex'
import { setItem } from '../../../utils/localStorage'
export default {
  name: 'ChannelEdit',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    // 接收父组件传过来的我的频道
    channels: {
      type: Array,
      required: true
    },
    // 接收当前频道的索引
    active: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(['user']),
    // 推荐频道
    recomendChannels () {
      // 1 获取我的频道中所有id组成的数组
      const ids = this.channels.map((channel) => {
        return channel.id
      })
      // 2 过滤所有频道，把频道id出现在上面数组中的项去除
      return this.allChannels.filter((channel) => {
        return !ids.includes(channel.id)
      })
    }
  },
  data () {
    return {
      isEdit: false, // 是否是编辑模式
      allChannels: [] // 存储所有的频道
    }
  },
  created () {
    // 加载所有的频道列表
    this.loadAllChannels()
  },
  methods: {
    // 加载所有的频道列表
    async loadAllChannels () {
      try {
        const data = await getAllChannels()
        this.allChannels = data.channels
      } catch (err) {
        console.log(err)
      }
    },
    // 点击我的频道的时候
    async  handleMyChannelItem (index, channelId) {
      // 1 非编辑模式
      if (!this.isEdit) {
        // 告诉父组件，选中频道的索引  关闭对话框
        this.$emit('activeChange', index)
        return
      }
      // 2 编辑模式
      // 把点击的频道，从我的频道移除
      this.channels.splice(index, 1)
      // 判断是否登陆  通过 mapstate 做了映射
      if (this.user) {
        // 登陆 发送请求
        try {
          await deleteChannel(channelId)
        } catch (err) {
          this.$toast.fail('操作失败')
        }
        return
      }
      // 没有登陆把频道列表纪录到本地存储中
      setItem('channels', this.channels)
    },
    // 点击推荐频道的时候
    handleChannelItem (channel) {
      // 1 把channel添加到我的频道
      this.channels.push(channel)
      // 2 判断是否登陆
      if (this.user) {
        // 3 如果登陆，发送请求
        return
      }

      // 4 如果没有登陆，把我的频道存储到我的存储
      setItem('channels', this.channels)
    }
  }

}
</script>

<style lang="less" scoped>
.close-icon {
  position: absolute;
  right: 0;
  top: 0;
}
.active{
    color: red;
}
</style>
