<template>
  <view class="img-box">
    <image class="img" :src="src" :mode="mode" @click="showPreview" ></image>
  </view>
</template>

<script>
  export default {
    props: {
      src: {
        type: String,
        default: ''
      },
      mode: {
        type: String,
        default: 'aspectFit'
      },
    },
    data() {
      return {
        // showPreviwe: false,
      };
    },
    watch: {
      // showPreviwe(v) {
      //   if (this.$refs.previewDialogRef) {
      //     if (v) {
      //       this.$refs.previewDialogRef.open('center')
      //     } else {
      //       this.$refs.previewDialogRef.close()
      //     }
      //   }
      // },
    },
    methods: {
      showPreview(){
        console.log('------showPreview---');
        uni.previewImage({
          urls:[this.src],
          current:0,
          indicator:'none'
        })
      },
      // closeMonitorDialog() {
      //   this.showPreviwe = false
      // },
    }
  }
</script>

<style lang="scss" scoped>
  .img-box {
    width: 100%;
    height: 100%;

    .img {
      width: 100%;
      height: 100%;
    }
  }
  // .content{
  //   position: fixed;
  //   width: 80vw;
  //   height: 80vh;
  //   left: 10vw;
  //   top: 0;
  // }
</style>