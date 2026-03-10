<template>
  <div class="container">
    <!-- <h2>个人信息</h2> -->
    <el-card>
      <div class="request">
        <p class="req-line">
          <span class="req-label">账号：</span>
          <span class="req-value">{{ formData.userName?formData.userName:'---' }}</span>
        </p>

        <p class="req-line">
          <span class="req-label">用户名称：</span>
          <span class="req-value">{{ formData.userNickName ?formData.userNickName:'---'}}</span>
        </p>
        <p class="req-line">
          <span class="req-label">登录设备：</span>
          <span class="req-value">{{ formData.loginDevice ?formData.loginDevice:'---'}}</span>
        </p>
        <p class="req-line">
          <span class="req-label">登录IP：</span>
          <span class="req-value">{{ formData.loginIp ?formData.loginIp:'---'}}</span>
        </p>
        <p class="req-line">
          <span class="req-label">最后登录时间：</span>
          <span class="req-value">{{ formData.lastLoginDate ?formData.lastLoginDate:'---'}}</span>
        </p>
        <p class="req-line">
          <span class="req-label">创建时间：</span>
          <span class="req-value">{{ formData.createTime ?formData.createTime:'---'}}</span>
        </p>

        <!-- <p class="req-line">
          <span class="req-label">分润比例：</span>
          <span class="req-value">5%</span>
        </p> -->

        <div class="tips" style="color: red">重置谷歌密钥，请联系系统管理员</div>
      </div>
    </el-card>
  </div>
</template>

<script>

import {getProviderInfoDetailByProvider} from '@/api/personal-info.js'

export default {
  name: 'PersonalInfo',
  data() {
    return {
      code: '',
      tableData: [],
      formData: {
        providerId: '',
        userNickName: '',
        loginDevice: '',
        loginIp: '',
        userName:'',
        lastLoginDate: '',
        createTime: ''
      }
    }
  },
  methods: {
    // 获取个人信息
    async fetchProfileData() {
      try {
        let ret = await getProviderInfoDetailByProvider()

        this.formData = ret.data
      } catch (error) {
        console.error('API Error:', error)
      } finally {
      }
    }
  },
  mounted() {
    this.fetchProfileData()
  }
}
</script>

<style lang="scss" scoped>
.request {
  padding: 15px 20px;

  .req-line {
    display: flex;
    line-height: 40px;
    .req-label {
      width: 120px;
    }
  }
}
</style>
