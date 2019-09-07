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
        v-for="channel in channels"
        :key="channel.id"
        :text="channel.name"
      >
        <!-- 关闭按钮 -->
        <van-icon
          slot="icon"
          class="close-icon"
          name="close"
          v-show="isEdit"
        />
      </van-grid-item>
    </van-grid>
    <!-- 推荐频道 -->
    <van-cell title="推荐频道" label="点击添加频道" />
    <van-grid>
      <van-grid-item
        v-for="channel in recomendChannels"
        :key="channel.id"
        :text="channel.name"
      />
    </van-grid>

    </van-popup>
</template>

<script>
import { getAllChannels } from '../../../api/channel'
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
    }
  },
  computed: {
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
  methods: {
    // 加载所有的频道列表
    async loadAllChannels () {
      try {
        const data = await getAllChannels()
        this.allChannels = data.channels
      } catch (err) {
        console.log(err)
      }
    }
  },
  created () {
    // 加载所有的频道列表
    this.loadAllChannels()
  }
}
</script>

<style lang="less" scoped>
.close-icon {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
