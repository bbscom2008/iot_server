<template>
  <div
    class="change-pwd-container"
    :style="{
     backgroundImage:  `url(${pcBackgroundImgUrl})`
    }"
  >
    <el-form
      ref="loginFormRef"
      :model="formData"
      :rules="loginRules"
      class="login-form"
      :label-position="isShowUi ? 'top' : 'right'"
      label-width="150px"
    >
      <div class="title-container">
        <h3 class="title">修改密码</h3>
      </div>

      <el-form-item prop="" label="用户名:">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input :readonly="true" v-model="formData.userId" placeholder="用户名" type="text" />
      </el-form-item>

      <el-form-item prop="oldPassword" label="原登录密码:">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>

        <el-input
          :type="pwdShowType.oldPassword ? 'text' : 'password'"
          v-model="formData.oldPassword"
          placeholder="请输入原密码"
        >
          <template #suffix>
            <span class="show-pwd" @click="pwdShowType.oldPassword = !pwdShowType.oldPassword">
              <svg-icon :icon-class="pwdShowType.oldPassword ? 'eye-open' : 'eye'" />
            </span>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="newPassword" label="新登录密码:">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdShowType.newPassword ? 'text' : 'password'"
          v-model="formData.newPassword"
          placeholder="请输入新密码"
        >
          <template #suffix>
            <span class="show-pwd" @click="pwdShowType.newPassword = !pwdShowType.newPassword">
              <svg-icon :icon-class="pwdShowType.newPassword ? 'eye-open' : 'eye'" />
            </span>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="confirmPassword" label="确认密码:">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdShowType.confirmPassword ? 'text' : 'password'"
          v-model="formData.confirmPassword"
          placeholder="请再次输入新登录密码"
        >
          <template #suffix>
            <span
              class="show-pwd"
              @click="pwdShowType.confirmPassword = !pwdShowType.confirmPassword"
            >
              <svg-icon :icon-class="pwdShowType.confirmPassword ? 'eye-open' : 'eye'" />
            </span>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="googleCode" label="谷歌验证:">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          class="input-light"
          ref="googleCode"
          v-model="formData.googleCode"
          type="text"
          placeholder="请输入谷歌验证码"
          name="googleCode"
          autocomplete="off"
        />
      </el-form-item>

      <div class="btnCon">
        <el-button style="width: 180px" plain type="primary" @click.native.prevent="handleResetPwd"
          >重置</el-button
        >
        <el-button style="width: 180px" type="primary" @click.native.prevent="handleBtnOk"
          >确定</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
// import SocialSign from './components/SocialSignin'

import { mapState } from 'vuex'
import { passwordPattern, googleCode } from '@/utils/validate'
import { changeLoginPassword } from '@/api/user'
export default {
  name: 'ChangePassword',
  components: {},
  data() {
    const confirmPwdCheck = (rule, value, callback) => {
      console.log('---confirmPwdCheck----', value)

      if (this.formData.confirmPassword !== this.formData.newPassword) {
        return callback(new Error('两次输入密码不一致!'))
      } else if (this.formData.confirmPassword === this.formData.oldPassword) {
        return callback(new Error('新密码不能和原密码相同!'))
      } else {
        return callback()
      }
    }

    return {
      formData: {
        userId: sessionStorage.getItem('loginForm.username') || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        googleCode: ''
      },
      pwdShowType: {
        oldPassword: false, // true 明文  false  密文
        newPassword: false, //
        confirmPassword: false
      },
      readonly: true,
      loginRules: {
        userId: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9]{5,19}$/,
            message: '以字母开头，字母和数字，长度在6到20个字符之间'
          }
        ],
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          passwordPattern
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          passwordPattern
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新登录密码', trigger: 'blur' },
          passwordPattern,
          {
            validator: confirmPwdCheck,
            trigger: 'blur'
          }
        ],
        googleCode: [
          { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
          ...googleCode
        ]
      },
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      pageSetting: (state) => state.user.pageSetting
    }),
    pcBackgroundImgUrl() {
      if (this.$store.state.tenant.tenantInfo && this.$store.state.tenant.tenantInfo.pcBackImage && this.$store.state.tenant.tenantInfo.pcBackImage.fileUrl) {
        return this.$store.state.tenant.tenantInfo.pcBackImage.fileUrl
      }else {
        return require('@/assets/img/default-bg.png')
      }
    }
  },
  created() {},
  mounted() {
    // console.log('----changePwd----')
    // console.log(this.$route)
  },
  destroyed() {},
  methods: {
    // showPwd() {
    //   if (this.passwordType === 'password') {
    //     this.passwordType = ''
    //   } else {
    //     this.passwordType = 'password'
    //   }
    //   this.$nextTick(() => {
    //     this.$refs.password.focus()
    //   })
    // },
    handleResetPwd() {
      this.formData = {
        userId: sessionStorage.getItem('loginForm.username') || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        googleCode: ''
      }
      this.$refs.loginFormRef.resetFields()
    },
    handleBtnOk() {
      console.log('------handleBtnOk-----')

      this.$refs['loginFormRef'].validate((valid) => {
        if (valid) {
          // alert('submit!')
          console.log('------校验通过，--------')

          changeLoginPassword({ ...this.formData })
            .then((ret) => {
              console.log(ret)

              this.$message.success('修改密码成功，请重新登录！')

              sessionStorage.setItem('autoLogin', JSON.stringify({
                userId: this.formData.userId,
                newPassword: this.formData.newPassword,
                googleCode: this.formData.googleCode
              }))

              // 传参 ， autoLogin
              this.$router.push({
                path: '/login',
                query: {
                  autoLogin: true
                }
                
              })
            })

            .catch((err) => {
              console.error(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>
