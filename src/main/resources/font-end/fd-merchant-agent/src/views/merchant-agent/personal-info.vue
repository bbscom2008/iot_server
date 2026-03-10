<template>
  <div class="container">
    <h2>个人信息</h2>
    <el-card>
      <div class="request">
        <p class="req-line">
          <span class="req-label">账号：</span>
          <span class="req-value">{{formData.userName?formData.userName:'---'}}</span>
        </p>

        <p class="req-line">
          <span class="req-label">用户名称：</span>
          <span class="req-value">{{ formData.userNickName ?formData.userNickName:'---'}}</span>
        </p>
        <p class="req-line">
          <span class="req-label">登录设备：</span>
          <span class="req-value">{{ formData.deviceType ?formData.deviceType:'---'}}</span>
        </p>
        <p class="req-line">
          <span class="req-label">登录IP：</span>
          <span class="req-value">{{ formData.ip ?formData.ip:'---'}}</span>
        </p>
        <p class="req-line">
          <span class="req-label">最后登录时间：</span>
          <span class="req-value">{{ formData.lastLoginTime ?formData.lastLoginTime:'---'}}</span>
        </p>
        <p class="req-line">
          <span class="req-label">创建时间：</span>
          <span class="req-value">{{ formData.createTime ?formData.createTime:'---'}}</span>
        </p>

        <!-- <p class="req-line">
          <span class="req-label">分润比例：</span>
          <span class="req-value">{{ formData.tenantProfitRate }}</span>
        </p> -->

        <div class="tips" style="color: red;" >
            重置谷歌密钥，请联系系统管理员
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {merchantAgentInfo} from '@/api/user'
export default {
  name: 'PersonalInfo',
  data() {
    return {
      formData: {
          userName:'',
          userNickName:'',
          deviceType:'',
          ip:'',
          lastLoginTime:'',
          createTime:'',
      },
    }
  },
  methods: {
    async merchantAgentInfo(){
      let res=await merchantAgentInfo()
      this.formData=res.data
      console.log(res,'-=-=-=-')
    },
  
  },
  mounted() {
    this.merchantAgentInfo()
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
