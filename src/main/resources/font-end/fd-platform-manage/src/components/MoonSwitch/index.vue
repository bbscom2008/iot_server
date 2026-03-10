<template>
  <div class="root" @click="isMoon = !isMoon" :class="{ 'is-moon': isMoon, 'is-sun': !isMoon }">
    <span class="icon" :style="{ 'margin-left': isMoon ? '20px' : '0px' }">
      <svg-icon v-if="isMoon" icon-class="moon" />
      <svg-icon v-else icon-class="sun" />
    </span>
  </div>
</template>

<script>

import { toggleClass } from '@/utils'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css


export default {
  name: 'MoonSwitch',

  data() {
    return {
      isMoon: false, //白天    true-夜晚
      themes: ""
    }
  },
  watch: {
    isMoon(a, old) {
      // let theme = a == false ? 'sun' : 'moon'
      // this.theme(theme)
      toggleClass(document.body, 'custom-theme')
    }
  },
  created() {
    this.themes=this.isMoon == false ? 'sun' : 'moon'
    this.theme(this.themes)
  },
  methods: {
    theme(val) {
      window.document.documentElement.setAttribute('data-theme', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.root {
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  width: 38px;
  padding: 1px;
  height: 20px;
  border: 1px solid #aaa;

  border-radius: 20px;
  .icon {
    display: flex;
    margin-left: 0px;
    transition: all 0.3s;
    align-items: center;
    justify-content: center;

    width: 16px;
    height: 16px;
    border-radius: 50%;
    ::v-deep .svg-icon {
      width: 13px;
      height: 13px;
    }
  }
}

.is-moon {
  background-color: #333;
  .icon {
    background-color: #ccc;
    ::v-deep .svg-icon {
      color: #055536;
    }
  }
}

.is-sun {
  background-color: #ddd;
  .icon {
    background-color: #fff;
    ::v-deep .svg-icon {
      color: #333;
    }
  }
}
</style>
