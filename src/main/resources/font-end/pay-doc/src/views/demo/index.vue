<template>
  <div class="app-container">
    <h2>DEMO下载</h2>
    <p>为方便系统业务使用，我们提供了各语言的demo</p>

    <div style="margin-top: 20px;" >
      <span style="color: #666; margin-right: 20px;">java-demo下载地址</span> <a href="#">java-demo下载</a>
    </div>

    <div style="margin-top: 20px;" >
      <span style="color: #666; margin-right: 20px;">php-demo下载地址</span> <a href="#">php-demo下载</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>

.app-container{
  padding-left: 30px;
}

.app-container a{
  color: #007bff;
  text-decoration: none; 
}
</style>
