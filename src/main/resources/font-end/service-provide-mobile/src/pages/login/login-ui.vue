<template>
  <view
    class="login-container isShowUi"
    :style="{
      paddingTop: $store.state.navBarHeight + 'rpx'
    }"
  >
    <view class="logo-box1" style="display: flex">
      <view class="left-txt" style="display: flex; flex-direction: column">
        
        <!-- tenantId 1061 闪电支付 显示 独家支付  四个字 -->
        <!-- tenantId 1056 闪电888 显示 闪电发财  四个字 -->
        <view class="pname" v-if="tempTenantId == 1061"  >
          独家支付
        </view>
        <view class="pname" v-if="tempTenantId == 1056"  >
          闪电发财
        </view>
        <view class="pname" v-if="tempTenantId == 1096"  >
          澳门娱乐
        </view>
        <view class="pname" v-else >
          {{ tenantName }}
        </view>

        <image
          src="/static/imgs/login1.png"
          mode=""
          style="width: 248rpx; height: 66rpx"
        ></image>
        <image
          src="/static/imgs/login2.png"
          style="width: 324rpx; height: 52rpx; margin-top: 20rpx"
          mode=""
        ></image>
      </view>
      <view class="right-img">
        <image
          src="/static/imgs/login-deco.png"
          style="width: 251rpx; height: 251rpx"
          mode=""
        ></image>
      </view>
    </view>


    <template  v-if="testUI" >
      <view class="bind-box">
        <view class="bind-title"> 绑定地址 </view>
        <view class="bind-body">
          <uni-easyinput v-model="ceshiUrl" placeholder="码商手机端url地址" />
        </view>
        <u-button type="primary" style="width: 50%" @click="testUrl()"
          >确定</u-button
        >
      </view>

    </template>

    <template v-if="!testUI">
      <!-- 正式环境 -->
      <template v-if="isAndroidApp()" >

        <view v-if="!tenantName " class="bind-box">
          <view class="bind-title"> 绑定地址 </view>
          <view class="bind-body">
            <uni-easyinput v-model="ceshiUrl" placeholder="码商手机端url地址" />
          </view>
          <u-button type="primary" style="width: 50%" @click="testUrl()"
            >确定</u-button
          >
        </view>

      </template>
      
    </template>

    <!-- 上面这段，打包时，要注释 掉 -->

    <view class="login-box2" v-if="tenantName">
      <uni-forms
        ref="loginForm"
        :model="formData"
        :rules="rules"
        label-align="right"
        :label-width="isShowUi ? 0 : 70"
      >
        <!-- 用户名输入框 -->
        <uni-forms-item
          :label="isShowUi ? '' : '用户名'"
          name="username"
          :required="!isShowUi"
        >
          <uni-easyinput
            class="login-input"
            v-model="formData.username"
            placeholder="请输入用户名（字母开头，6-20位字母数字）"
            @blur="validateField('username')"
          />
        </uni-forms-item>

        <!-- 密码输入框 -->
        <uni-forms-item
          :label="isShowUi ? '' : '密码'"
          name="password"
          :required="!isShowUi"
        >
          <uni-easyinput
            class="pwd-input"
            type="password"
            v-model="formData.password"
            placeholder="请输入密码（8-20位字母和数字组合）"
            @blur="validateField('password')"
          />
        </uni-forms-item>

        <uni-forms-item :label="isShowUi ? '' : '谷歌密钥'" name="googleCode">
          <uni-easyinput
            class="gcode-input"
            type="googleCode"
            v-model="formData.googleCode"
            placeholder="请输入谷歌密钥,首次登录可不输入"
            @blur="validateField('googleCode')"
          />
        </uni-forms-item>

        <uni-forms-item label=" " name="">
          <checkbox-group @change="checkboxChange">
            <label>
              <checkbox
                value="saveUserName"
                :checked="isSaveUsername"
              />记住用户名
            </label>
          </checkbox-group>
        </uni-forms-item>

        <!-- 登录按钮 -->
        <button
          type="primary"
          @click="submitForm"
          class="login-btn"
          :class="isShowUi ? 'k-btn' : ''"
        >
          登录
        </button>
      </uni-forms>
    </view>
    <!--  -->
  </view>
</template>

<script>
import { rules } from './rules.js'
import { login, getGoogleAuthKeyQr } from '@/api/login.js'

import { mapMutations } from 'vuex'

import { setChangePwd, bindGoogleCode as bindGcode } from '@/utils/auth.js'

import { getUserAccount, getTenantDomainByDomainName } from '@/api/user.js'

import { getToken, getTokenHead } from '@/utils/auth'

import { getDeviceType, isAndroidApp } from '@/utils'

import {checkApkVersion} from '@/utils/checkApkVersion'

export default {
  name: 'Login',
  data() {
    return {
      ceshiUrl: '',
      // tempTenantId: '1006',
      // tenantName: '',
      formData: {
        username: '',
        password: '',
        googleCode: ''
      },
      rules: rules,
      isSaveUsername: true,
      valueItem: ''
    }
  },
  computed: {
    tempTenantId() {
      return this.$store.state.tenantInfo.tenantId || ''
    },
    tenantName() {
      return this.$store.state.tenantInfo.tenantName || ''
    }
  },
  created() {
    // 如果有token ，直接跳至首页
    if (this.isHaveSavedInfo()) {
      console.log('------isHaveSavedInfo---------')
      uni.redirectTo({
        url: '/pages/index/index?tab=0'
      })
      return
    }
		
		if(this.testUI){
			this.ceshiUrl = 'test0010bc6f19b8d-sup.fykknn.xyz'
		}
		
		
    let saveName = uni.getStorageSync('isSaveUsername')
    if (saveName) {
      this.formData.username = saveName
    }

    // 不是测试，也不是 android app 端 才会自动联接
    if (!this.testUI  && !isAndroidApp()) {
      const addUrl = location.href
      this.getTenantInfo(addUrl)
    }
  },
  mounted() {
    checkApkVersion();
  },
  methods: {
    isAndroidApp,
    isHaveSavedInfo() {
      if (!getToken() || !getTokenHead()) {
        return false
      }
      if (!this.$store.state.personalInfo) {
        return false
      }
      if (!this.$store.state.userAccount) {
        return false
      }
      if (!this.$store.state.tenantId) {
        return false
      }

      return true
    },
    ...mapMutations(['setToken', 'setTokenHead']),

    testUrl() {
      this.getTenantInfo(this.ceshiUrl)
    },
    checkboxChange(e) {
      console.log(e)
      this.isSaveUsername = e.detail.value.length > 0
    },

    getTenantInfo(addUrl) {
      console.log('-----addUrl----', addUrl)
      this.domain = this.getDomain(addUrl)
      console.log('domain :' + this.domain)
      this.getTenantDomainByDomainName()
    },
    getDomain(url) {
      // 如果 url 不是以 http 或 https 开头, 就添加 http 头，组成正确的 url 
      if( !url.startsWith('http://') && !url.startsWith('https://')){
        url = "https://"+url
      }

      // 创建 URL 对象
      const parsedUrl = new URL(url)
      // 返回域名（hostname）
      const doman = parsedUrl.hostname
      return doman
    },
    async getTenantDomainByDomainName() {
      const res = await getTenantDomainByDomainName({
        domainName: this.domain
      })
      if (res.data) {
        this.$store.commit('set_tenant_info', res.data)
        // this.tempTenantId = res.data.tenantId
        // this.tenantName = res.data.tenantName
        this.$store.state.tenantId = this.tempTenantId
      } else {
        this.$message.error('未找到域名相关配置信息，请联系管理员')
      }
    },

    // 提交表单
    submitForm() {
      this.$refs.loginForm
        .validate()
        .then(async (res) => {
          let ret = await login(
            {
              tenantId: this.tempTenantId,
              ...this.formData,
              userType: '5' // 用户类型（0-系统用户、1-租户代理、2-租户、3-商户代理、4-商户、5-码商）
            },
            getDeviceType()
          )
          uni.$showMsg('登录成功')
          let data = ret.data
          console.log(data, '000000登录')
          this.$store.state.loginResult = ret.data

          this.$store.state.userName = this.formData.username // 登录成功，用户名存仓库
          //
          this.setToken(data.token)
          this.$store.commit('setToken', data.token)
          this.setTokenHead(data.tokenHead)

          console.log('-----isSaveUsername-----', this.isSaveUsername)
          if (this.isSaveUsername) {
            uni.setStorageSync('isSaveUsername', this.formData.username)
          }

          if (data.isBindGoogleCode == '0') {
            ///是否绑定谷歌验证码(1绑定,0未绑定)
            uni.navigateTo({
              url: '/pages/login/bindGoogleCode'
            })
          } else {
            // 已经绑定了
            bindGcode(this.googleCode)
            if (data.isFirstLoginPassword == '1') {
              //是否为初次登录密码(1是初始密码,0不是初始密码)
              uni.redirectTo({
                url: '/pages/login/changePassword'
              })
            } else {
              // 不是初始密码，直接登录
              setChangePwd()
              // 此时才 登录成功，
              console.log('-----此时才 登录成功------')

              // 获得userId 成功后，才跳转，否则会出现 登录成功，但是 userId 还没获取到,又返回登陆页面
              let res = await getUserAccount()
              console.log('-----获得userId 成功后，才跳转------', res)
              //   this.$store.state.userAccount = res.data
              this.$store.commit('setUserAccount', res.data)
              console.log(res)

              this.$store.commit('setTenantId', this.tempTenantId)

              // 非阻塞提前获取 个人信息
              this.$store.dispatch('getPersonalInfo')

              // 非阻塞获得平台配置
              this.$store.dispatch('getTenantConfig')

              uni.redirectTo({
                url: '/pages/index/index?tab=0'
              })

              // this.$router.push({
              // 	path: this.redirect || '/',
              // 	query: this.otherQuery
              // })
            }
          }
        })
        .catch((err) => {
          console.log('校验失败:', err)
        })
    },

    // 单独校验字段
    validateField(name) {
      this.$refs.loginForm.validateField(name)
    }
  }
}
</script>

<style lang="scss" scoped>
.isShowUi.login-container {
  // padding: 40rpx 0;
  background-color: #f5f5f5;
  min-height: 100vh;
  background-image: url(../../static/imgs/login-bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;

  .pname {
    color: #edd0be;
    font-size: 40rpx;
    transform: scale(1.3, 1.5);
    transform-origin: 0 center;
    margin-bottom: 20rpx;
    background: linear-gradient(90deg, #af9381, #edd0be);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .bind-box {
    width: 90%;
    margin: 20rpx auto;
    padding-bottom: 30rpx;
    background-color: white;
    border-radius: 15px;

    .bind-body {
      padding: 30rpx 20rpx;
    }
    .bind-title {
      padding: 20rpx 30rpx;
      border-radius: 30rpx 30rpx 0 0;
      margin-bottom: 0;
      font-weight: 600;
      font-size: 32rpx;
      background-image: linear-gradient(90deg, #edd0be 0, #fff6ed 50%, #ae9281);
    }
  }

  .login-btn {
    margin-top: 60rpx;
  }

  .k-btn {
    background-image: linear-gradient(to right, #ae9281 0%, #edd0be 100%);
    font-weight: 600;
    color: #000;
    border-radius: 20rpx;
  }

  /* 自定义错误提示样式 */
  ::v-deep .uni-forms-item__error {
    color: #f56c6c;
    font-size: 24rpx;
    margin-top: 8rpx;
    padding-left: 20rpx;
  }

  /* 输入框样式 */
  ::v-deep .uni-easyinput__content {
    border-radius: 8rpx;
  }

  .logo-box1 {
    display: flex;
    padding-top: 140rpx;
    justify-content: space-evenly;
    align-items: center;

    .left-txt {
      display: flex;
      flex-direction: column;
    }
  }

  .logo {
    width: 200rpx;
    height: 200rpx;
  }

  .login-box2 {
    background-color: #fff;
    border-radius: 40rpx 40rpx 0 0;
    padding: 40rpx;
    flex: 1;

    .pwd-input,
    .gcode-input,
    .login-input {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 30rpx;
        top: 50%;
        width: 40rpx;
        height: 40rpx;
        background-image: url(/static/login/user.png);
        background-size: contain;
        transform: translateY(-50%);
      }
    }

    .login-input::after {
      background-image: url(/static/login/user.png);
    }

    .pwd-input::after {
      background-image: url(/static/login/lock.png);
    }

    .gcode-input::after {
      background-image: url(/static/login/key.png);
    }

    ::v-deep .uni-easyinput__content-input {
      padding-left: 80rpx !important;
    }

    ::v-deep .uni-easyinput__content.is-input-border {
      border-radius: 20rpx;
    }
  }
}
</style>
