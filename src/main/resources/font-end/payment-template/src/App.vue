<template>
  <div id="app">
    <router-view />
  </div>

</template>

<script>
export default {
  name: 'App',

  methods: {
    detectDeviceType() {
      const ua = navigator.userAgent.toLowerCase();
      // 先检查是否为移动设备
      const isMobile = /mobile/i.test(ua);
      // 再判断是否为平板设备
      if (
        (isMobile && /tablet|ipad|android(?!.*mobile)|kindle|silk/i.test(ua)) ||
        (window.innerWidth >= 768 && window.innerWidth <= 1024 && isMobile)
      ) {
        return 'pad';
      }

      // 判断是否为手机设备
      if (isMobile && !/ipad/i.test(ua)) {
        return 'phone';
      }

      // 剩下的情况就认为是PC设备
      return 'pc';
    },
    setRootFontSize() {

      let deviceType = this.detectDeviceType()

      let screenWidth = 900;
      if (deviceType == 'phone') {
        screenWidth = window.innerWidth
      } else if (deviceType == 'pad') {
        screenWidth = window.innerWidth
      } else if (deviceType == 'pc') {
        screenWidth = 400
      }


      const htmlElement = document.documentElement;
      const fontSize = screenWidth / 100; // 屏幕宽度的 100 分之一
      htmlElement.style.fontSize = `${fontSize}px`;
    }
  },
  mounted() {
    // 设置 rem  

    this.setRootFontSize()
    // 窗口大小变化时重新计算
    window.addEventListener('resize', this.setRootFontSize);
  },
}
</script>

<style lang="scss">
.mt-20 {
  margin-top: 5.33rem;
}

.el-button {
  // padding: 3.20rem 5.33rem;
  font-size: 3.73rem;
  border-radius: 1.07rem;
}



.el-form-item__content {
  width: 49.07rem
}
</style>
