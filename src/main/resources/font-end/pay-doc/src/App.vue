<template>
  <div id="app" >
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
      document.documentElement.classList.add('showui')
  }
}
</script>
