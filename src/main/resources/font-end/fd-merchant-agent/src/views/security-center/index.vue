<template>
  <div class="container">
    <!-- <h3>安全中心</h3> -->
    <div class="config" style="width: 50%">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="修改登录密码" name="tab1">
          <div class="mt-20 base-config">
            <el-form :modal="formData" label-width="110px">
              <el-form-item label="原登录密码:">
                <el-input v-model="formData.oldPassword"  placeholder="请输入原登录密码" ></el-input>
              </el-form-item>
              <el-form-item label="新密码:">
                <el-input v-model="formData.newPassword" placeholder="请输入新登录密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码:">
                <el-input v-model="formData.newPassword2" placeholder="请再次输入新登录密码" ></el-input>
              </el-form-item>
              <el-form-item label="谷歌验证码:">
                <el-input v-model="formData.googleCode"  placeholder="请输入谷歌验证码" ></el-input>
              </el-form-item>
              
            </el-form>
            <div style="margin-left: 130px">
              <el-button type="primary">确认</el-button>
              <el-button>重置</el-button>
            </div>
          </div>
        </el-tab-pane>

        <!----------------- tab2 -----文本信息配置------- -->

        <el-tab-pane label="修改交易密码" name="tab2">
          <div class="mt-20 base-config">
            <el-form :modal="formData" label-width="110px">
              <el-form-item label="原交易密码:">
                <el-input v-model="formData.oldPassword" placeholder="请输入原交易密码"></el-input>
              </el-form-item>
              <el-form-item label="新密码:">
                <el-input v-model="formData.newPassword" placeholder="请输入新交易密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码:">
                <el-input v-model="formData.newPassword2" placeholder="请再次输入新交易密码" ></el-input>
              </el-form-item>
              <el-form-item label="登录密码:">
                <el-input v-model="formData.googleCode" placeholder="请输入登录密码"></el-input>
              </el-form-item>

              <el-form-item label="谷歌验证码:">
                <el-input v-model="formData.googleCode" placeholder="请输入谷歌验证码" ></el-input>
              </el-form-item>
              
            </el-form>
            <div style="margin-left: 130px">
              <el-button type="primary">确认</el-button>
              <el-button>重置</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'tab1',
      formData: {
        password: ''
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
