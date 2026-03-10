<template>
  <div class="container">
    <!-- <h3>安全中心</h3> -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="安全中心"
      width="600px"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick" >
        <el-tab-pane label="修改登录密码" name="tab1">
          <div class="mt-20 base-config">
            <el-form :rules="rules" ref="loginFormData" :model="loginFormData" label-width="110px">
              <el-form-item label="用户名:" prop="">
                <el-input
                :value="$store.state.user.userName"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="原登录密码:" prop="oldPassword">
                <el-input type="password"  v-model="loginFormData.oldPassword" show-password placeholder="请输入原登录密码"></el-input>
              </el-form-item>
              <el-form-item label="新密码:" prop="newPassword">
                <el-input type="password" v-model="loginFormData.newPassword" show-password placeholder="请输入新登录密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码:" prop="confirmPassword">
                <el-input
                  type="password"
                  v-model="loginFormData.confirmPassword" show-password
                  placeholder="请再次输入新登录密码"
                ></el-input>
              </el-form-item>
              <el-form-item label="谷歌验证码:" prop="googleCode">
                <el-input v-model="loginFormData.googleCode" placeholder="请输入谷歌验证码"></el-input>
              </el-form-item>
            </el-form>
            <div style="margin-left: 130px">
              <el-button type="primary" @click="loginBtnOk()">确认</el-button>
              <el-button @click="resetFields()">重置</el-button>
            </div>
          </div>
        </el-tab-pane>

        <!----------------- tab2 -----修改交易密码------- -->

        <el-tab-pane label="修改交易密码" name="tab2">
          <div class="mt-20 base-config">
            <el-form :rules="rules" ref="tradeFormData"  :model="tradeFormData"  label-width="110px">
              <el-form-item label="用户名:" prop="">
                <el-input
                :value="$store.state.user.userName"
                  disabled
                ></el-input>
              </el-form-item>

              <el-form-item label="原交易密码:" prop="oldTradePwd">
                <el-input type="password" v-model="tradeFormData.oldTradePwd" show-password placeholder="请输入原交易密码"></el-input>
              </el-form-item>
              <el-form-item label="新密码:" prop="newTradePwd">
                <el-input  type="password" v-model="tradeFormData.newTradePwd" show-password placeholder="请输入新交易密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码:" prop="confirmPassword">
                <el-input
                type="password"
                  v-model="tradeFormData.confirmPassword" show-password 
                  placeholder="请再次输入新交易密码"
                ></el-input>
              </el-form-item>
              <el-form-item label="登录密码:" prop="loginPwd">
                <el-input type="password" v-model="tradeFormData.loginPwd" show-password placeholder="请输入登录密码"></el-input>
              </el-form-item>

              <el-form-item label="谷歌验证码:" prop="googleCode">
                <el-input v-model="tradeFormData.googleCode" placeholder="请输入谷歌验证码"></el-input>
              </el-form-item>
            </el-form>
            <div style="margin-left: 130px">
              <el-button type="primary" @click="tradeBtnOk()">确认</el-button>
              <el-button @click="resetFields()">重置</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import {passwordRules} from "./rules"
import {changeLoginPassword,changeTradePassword} from "@/api/user"
export default {
  data() {
    return {
      rules:passwordRules,
      dialogVisible:false,
      activeName: 'tab1',
      loginFormData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        googleCode: ''
      },
      tradeFormData: {
        oldTradePwd: '',
        newTradePwd: '',
        loginPwd: '',
        confirmPassword: '',
        googleCode: ''
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    resetFields() {
      this.$nextTick(() => {
        this.$refs.loginFormData.resetFields()
        this.$refs.loginFormData.clearValidate()
        this.$refs.tradeFormData.resetFields()
        this.$refs.tradeFormData.clearValidate()
      })
    },
    loginBtnOk(){
      this.$refs.loginFormData.validate(async (valid) => {
        if (valid) {
          let res=await changeLoginPassword(this.loginFormData)
          console.log(res)
          this.dialogVisible=false
          this.resetFields()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    tradeBtnOk(){
      this.$refs.tradeFormData.validate(async (valid) => {
        if (valid) {
          let res=await changeTradePassword(this.tradeFormData)
          console.log(res)
          this.dialogVisible=false
          this.resetFields()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>

::v-deep .el-dialog__body{
  padding-top:0 !important;
}
</style>
