<template>
  <div
    v-loading="firstLoading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="login-container-page"
    :style="{
      backgroundImage: `url(${pcBackgroundImgUrl})`
    }"
  >
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      :label-position="isShowUi ? 'top' : 'right'"
      label-width="100px"
    >
      <div class="title-container">
        <!-- tenantId 1061 闪电支付 显示 独家支付  四个字 -->
        <h3 class="title" v-if="tempTenantId == 1061" >独家支付</h3>
        <!-- tenantId 1056 闪电888 显示 闪电发财  四个字 -->
        <h3 class="title" v-if="tempTenantId == 1056" >闪电发财</h3>
        <h3 class="title" v-if="tempTenantId == 1096" >澳门娱乐</h3>
        <h3 class="title" v-else >{{ tenantName }} 码商端 - 登录页面</h3>
      </div>

      <div style="display: flex; margin: 20px 0" v-if="isShowDomainInput">
        <el-input v-model="addUrl" placeholder="仅测试用，当前端配置的域名 " type="text" />
        <el-button type="primary" @click="getTenantInfo('http://' + addUrl)">OK</el-button>
      </div>

      <!-- <div style="display:flex; margin:20px; align-items: center;" v-if="!isShowUi">
        <div style="color:#fff;margin-right: 10px;" >平台ID: </div><el-input  style="width:300px;" v-model="tempTenantId" placeholder="测试用，平台ID" type="text" />
      </div> -->

      <el-form-item prop="username" label="用户名:">
        <el-input
          v-model="loginForm.username"
          class="input-light"
          placeholder="请输入用户名"
          type="text"
        />
      </el-form-item>

      <el-form-item prop="password" label="密码:">
        <el-input
          v-model="loginForm.password"
          type="password"
          show-password
          ref="password"
          class="input-light"
          placeholder="请输入密码"
        />
      </el-form-item>

      <el-form-item prop="googleCode" label="谷歌验证:">
        <el-input
          v-model="loginForm.googleCode"
          class="input-light"
          type="text"
          placeholder="请输入谷歌验证码，首次登录无需输入谷歌验证码"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        class="btn-login"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >
      <div class="save-username">
        <el-checkbox v-model="isSaveUsername" label="记住用户名" />
      </div>
    </el-form>
    <BindGoogleCode
      v-model="showGoogleDialog"
      :value-item="valueItem"
      :isFirstLoginPassword="isFirstLoginPassword"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { login, getGoogleAuthKeyQr, getTenantDomainByDomainName } from '@/api/user'
import BindGoogleCode from './bindGoogleCode.vue'
import { setTokenHead, setToken, removeToken } from '@/utils/auth'

import { bindGoogleCode as bindGcode, setChangePwd } from '@/utils/auth'

import { googleCode } from '@/utils/validate'
import { getDeviceType } from '@/utils'

import { getFileById } from '@/api/upload.js'

import {webSocketService} from '@/utils/websocket.js'

export default {
  name: 'Login',
  components: { BindGoogleCode },
  data() {
    return {
      tempTenantId: '', // 临时ID
      tenantName: '', // 平台名称
      loginForm: {
        username: '',
        password: '',
        googleCode: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // {
          //   pattern: /^[a-zA-Z][a-zA-Z0-9]{5,19}$/,
          //   message: '以字母开头，字母和数字，长度在6到20个字符之间'
          // }
        ],
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
            message: '密码必须包含至少一个字母、一个数字，长度在8到20个字符之间',
            trigger: 'blur'
          }
        ],
        googleCode: [{ required: false, trigger: 'blur' }, ...googleCode]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      isSaveUsername: true,
      addUrl: 'test0010bc6f19b8d-sup.fykknn.xyz', // 地址栏的完整地址，方便测试用
      domain: '', // 当前的域名
      showGoogleDialog: false,
      isFirstLoginPassword: 0,
      valueItem: {},
      firstLoading: false // 首次加载loading
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
      if (
        this.$store.state.tenant.tenantInfo &&
        this.$store.state.tenant.tenantInfo.pcBackImage &&
        this.$store.state.tenant.tenantInfo.pcBackImage.fileUrl
      ) {
        return this.$store.state.tenant.tenantInfo.pcBackImage.fileUrl
      } else {
        return require('@/assets/img/default-bg.png')
      }
    }
  },
  created() {
    if (!this.isShowDomainInput) {
      this.getTenantInfo(location.href)
    }
  },
  mounted() {
    if (this.isSaveUsername) {
      this.loginForm.username = localStorage.getItem('loginForm.username') || ''
    }

    // 刚修改好密码，自动登陆
    console.log('this.$route--',this.$route);
    console.log(sessionStorage.getItem('autoLogin'));
    
    if(this.$route.query.autoLogin){
      const autoLoginData = JSON.parse(sessionStorage.getItem('autoLogin'))
      if(autoLoginData){
        this.tempTenantId = this.$store.state.tenant.currTenantId
        this.loginForm.username = autoLoginData.userId
        this.loginForm.password = autoLoginData.newPassword
        this.loginForm.googleCode = autoLoginData.googleCode
        this.$nextTick(()=>{
          sessionStorage.removeItem('autoLogin')
          this.handleLogin()
        })
      }
    }

  },

  methods: {
    getTenantInfo(addUrl) {
      this.domain = this.getDomain(addUrl)
      console.log('domain :' + this.domain)
      this.getTenantDomainByDomainName()
    },

    getDomain(url) {
      // const regex = /^(https?:\/\/[^:\/]+)/
      // const result = url.match(regex)
      // if (result) {
      //   return result[2]
      // }
      // return null

      // 创建 URL 对象
      const parsedUrl = new URL(url)
      // 返回域名（hostname）
      const doman = parsedUrl.hostname
      return doman
    },

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    getGoogleAuthKeyList() {
      getGoogleAuthKeyQr().then((ret) => {
        this.valueItem = ret.data
        console.log(this.valueItem, 'this.valueItem')
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          // if (this.tempTenantId == '') {
          //   // if (this.tenantId == '') {
          //   // 再次判断租户id是否为空
          //   await this.getTenantDomainByDomainName()
          // }

          this.loading = true

          console.log('isSaveUsername', this.isSaveUsername)
          if (this.isSaveUsername) {
            localStorage.setItem('loginForm.username', this.loginForm.username)
          }else {
            localStorage.setItem('loginForm.username', '')
          }
          // 清空原的 token
          removeToken()

          console.log('-----this.tenantId-------', this.tenantId)
          this.firstLoading = true
          // 用户类型（0-系统用户、1-租户代理、2-租户、3-商户代理、4-商户、5-码商）
          login({ ...this.loginForm, tenantId: this.tempTenantId, userType: '5' }, getDeviceType())
            .then((ret) => {
              console.log(ret.data, '000000登录')
              const data = ret.data
              this.isFirstLoginPassword = data.isFirstLoginPassword
              // console.log('-----token----', data);

              setToken(data.token)
              this.$store.commit('user/SET_TOKEN', data.token )
              setTokenHead(data.tokenHead)
              webSocketService.connentIfy()
              sessionStorage.setItem('loginForm.username', this.loginForm.username)

              if (data.isBindGoogleCode == '0') {
                // /是否绑定谷歌验证码(1绑定,0未绑定)
                this.getGoogleAuthKeyList()
                this.showGoogleDialog = true
              } else {
                // 已经绑定了
                bindGcode(this.googleCode)
                if (data.isFirstLoginPassword == '1') {
                  // 是否为初次登录密码(1是初始密码,0不是初始密码)
                  this.$router.push({
                    path: '/changePassword'
                  })
                } else {
                  // 不是初始密码，直接登录
                  setChangePwd()

                  // 此时才 登录成功，
                  console.log('-----此时才 登录成功------')
                  this.$store.state.user.userName = this.loginForm.username
                  this.$store.state.user.tenantId = this.tempTenantId
                  this.$store.state.tenant.currTenantId = this.tempTenantId
                  this.$store.state.tenant.selectTenantId = this.tempTenantId

                  this.$router.push({
                    path: this.redirect || '/',
                    query: this.otherQuery
                  })
                }
              }
            })
            .catch((err) => {
              console.error(err)
            }).finally(() => {
              this.firstLoading = false
            })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getTenantDomainByDomainName() {
      this.firstLoading = true
      const res = await getTenantDomainByDomainName({ domainName: this.domain })
      this.$store.commit('tenant/set_tenant_info', res.data)
      
      if (res.data) {
        this.firstLoading = false
        this.tempTenantId = res.data.tenantId
        this.tenantName = res.data.tenantName
        this.$store.state.user.tenantId = this.tempTenantId
        this.$store.state.tenant.currTenantId = this.tempTenantId
        this.$store.state.tenant.selectTenantId = this.tempTenantId
      } else {
        this.$message.error('未找到域名相关配置信息，请联系管理员')
      }
    },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>
