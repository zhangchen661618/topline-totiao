<template>
  <div>
    <!-- 搜索框 -->
    <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(value)"
        @cancel="onCancel"
        @input="handleInput"
        clearable
        background="#3e9df8"
    />
    <!-- 搜索提示 -->
    <van-cell-group v-show="value">
        <van-cell
        @click="onSearch(item)"
         v-for="item in suggestionList"
         :key="item"
         :title="item"
         icon='search'/>
    </van-cell-group>

    <!-- 历史纪录 -->
    <van-cell-group v-show="!value">
        <van-cell title="历史纪录">
            <!-- 自定义右侧内容 -->
            <div v-show="isEdit" style="display:inline-block">
                <span>全部删除</span>&nbsp;
                <span @click="isEdit=false">完成</span>&nbsp;
            </div>
            <van-icon v-show="!isEdit" @click="isEdit=true" name="delete" size='20px'/>
        </van-cell>
        <van-cell v-for="item in histories" :key="item" :title="item">
            <!-- 自定义右侧内容 -->
            <van-icon v-show="isEdit" name="close" size='18px'/>
        </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getSuggestion } from '../api/search'
export default {
  name: 'Search',
  data () {
    return {
      value: '',
      suggestionList: [], // 存储搜索建议
      isEdit: false, // 编辑模式
      histories: [] // 历史纪录
    }
  },
  methods: {
    onSearch (item) {
      // 判断 histories 中是否已经存在 item
      if (!this.histories.includes(item)) {
        // 纪录搜索历史
        this.histories.push(item)
      }
    },
    onCancel () {},
    // 在文本框输入的过程获取搜索提示
    async handleInput () {
      // 判断是否为空
      if (this.value.length === 0) {
        return
      }
      try {
        const data = await getSuggestion(this.value)
        this.suggestionList = data.options
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>

</style>
