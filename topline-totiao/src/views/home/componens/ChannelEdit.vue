<template>
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    position="bottom"
    :style="{ height: '80%' }"
    >
    hhhhhh
    </van-popup>
</template>

<script>
export default {
  name: 'ChannelEdit',
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style>

</style>
