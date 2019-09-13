<template>
  <van-dialog
  :value='value'
  @input="$emit('input',$event)"
  :showCancelButton='false'
  closeOnClickOverlay
>
  <van-cell-group>
    <van-cell title="从相册选者图片"  />
    <van-cell title="拍照" />
    <van-cell title="取消" @click="$emit('input',false)"/>
  </van-cell-group>
</van-dialog>
</template>

<script>
export default {
  name: 'UploadFile',
  props: ['value']
}
</script>

<style lang='less' scoped>
  .van-cell__title{
    text-align: center;
  }
</style>
