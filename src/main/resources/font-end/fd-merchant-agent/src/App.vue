<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    if (this.isShowUi) {
      document.documentElement.classList.add('showui')
      document.documentElement.classList.remove('nui')
    } else {
      document.documentElement.classList.remove('showui')
      document.documentElement.classList.add('nui')
    }
  }
}
</script>
