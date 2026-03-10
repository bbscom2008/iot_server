<template>
  <div class="other_container">
    <el-dialog
      title="绑定谷歌验证码"
      width="800px"
      v-loading="$store.state.app.loading"
      :visible="value"
      @update:visible="(e) => $emit('input', e)"
    >
      <div class="dialog-textCon">
        <p class="margin2px-0 font-bold font-red">1.(使用Google验证码APP)扫描二维码</p>
        <p class="margin2px-0 font-bold font-red">2.填写(Google验证码APP显示的动态验证码)</p>
        <p class="margin2px-0 font-bold font-red">3.点击【输入验证码进行绑定】按钮，进行确认绑定</p>
        <p class="margin2px-0 font-bold font-red">绑定成功后需要重新登录！！！</p>
      </div>
      <div class="dialog-scanCode">
        <p class="margin2px-0 font-bold font-red">
          【绑定二维码】一旦绑定后，将无法查看，请妥善保管，切勿泄露！
        </p>
        <div class="dialog-line">
          <p class="font-bold">扫码</p>
          <div class="line-right">
            <!-- <img :src="valueItem.googleAuthKeyQrCode" alt="" class="dialog-img" /> -->
            <MyQrCode :value="valueItem.googleAuthKeyQrCode" alt="" class="dialog-img" />
            <el-tag>请确认手机时间与标准时间是否一致</el-tag>
          </div>
        </div>
        <div class="dialog-line">
          <p class="font-bold">导入</p>
          <div class="line-right">
            <p class="margin2px-0">如果扫码绑定失败，复制如下的密钥；也可以导入绑定</p>
            <div class="copyCon">
              <p class="font28">{{ valueItem.googleAuthKey }}</p>
              <p>
                <el-button
                  class="rightBtn"
                  size="mini"
                  @click="
                    (e) => {
                      copyInfo(e)
                    }
                  "
                  >复制</el-button
                >
              </p>
            </div>
          </div>
        </div>
        <div class="dialog-line">
          <p class="font-bold">绑定</p>
          <div class="line-right">
            <el-input
              @blur="checkInputGoogleCode"
              class="black"
              v-model="googleCode"
              placeholder="请输入手机上显示的验证码"
              style="width: 400px; max-width: 100%; border: 1px solid #eee; border-radius: 5px"
            ></el-input>
            <div style="color: red; height: 15px">{{ tipMsg }}</div>

            <el-button @click="btnBindCode()" style="width: 200px; margin-top: 10px" type="primary"
              >输入验证码进行绑定</el-button
            >
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { bindGoogleCode } from '@/api/user'

import MyQrCode from '@/components/MyQrCode/MyQrCode.vue'

import { bindGoogleCode as bindGcode, setChangePwd } from '@/utils/auth'
import clipboard from '@/utils/clipboard'
// import SocialSign from './components/SocialSignin'
export default {
  name: 'BindGoogleCode',
  components: { MyQrCode },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isFirstLoginPassword: {
      type: Number,
      default: 0
    },
    valueItem: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      googleCode: '',

      tipMsg: '',

      copySecretStr: '',
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      isSaveUsername: true
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
  created() {},
  mounted() {
    console.log(this.$route)

    console.log(this.valueItem, 'valueItemvalueItemvalueItemvalueItem')
  },
  destroyed() {},
  methods: {
    checkInputGoogleCode() {
      console.log('--------checkInputGoogleCode------')
      let reg = /^[0-9]{6}$/
      if ('' == this.googleCode) {
        this.tipMsg = '请输入google 验证码'
        return false
      }
      if (!reg.test(this.googleCode.trim())) {
        this.tipMsg = '谷歌验证码必须是6位数字'
        return false
      }

      if (this.googleCode.trim() == this.valueItem.googleAuthKey) {
        this.tipMsg = '输入谷歌验证码，并不是输入密钥'
        return false
      }

      this.tipMsg = ''
      return true
    },
    copyInfo(e) {
      clipboard(
        `${this.valueItem.googleAuthKey}`,
        e
      )
    },
    async btnBindCode() {
      if (!this.checkInputGoogleCode()) {
        return
      }

      try {
        await bindGoogleCode(this.googleCode)
        bindGcode(this.googleCode)
        if (this.isFirstLoginPassword == '1') {
          //是否为初次登录密码(1是初始密码,0不是初始密码)
          this.$router.push({
            path: '/changePassword'
          })
        } else {
          // 不是初始密码，直接登录
          setChangePwd()

          // 此时才 登录成功，
          console.log('-----此时才 登录成功------')

          this.$router.push({
            path: this.redirect || '/',
            query: this.otherQuery
          })
        }
      } catch (err) {
        console.log(err)
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
  }
}
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  // .login-container .el-input input {
  //   color: black;
  // }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

::v-deep .el-form-item__label {
  line-height: 52px;
  color: $dark_gray;
}

.save-username {
  padding: 0 20px 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.other_container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
  .font-bold {
    font-weight: bold;
  }
  .margin2px-0 {
    margin: 2px 0;
  }
  .dialog-textCon {
    padding: 0 0 20px;
    box-shadow: 0 1px #889aa4;
  }
  .font-red {
    color: red;
  }
  .flex-center {
    align-items: center;
  }
  .dialog-scanCode {
    padding: 20px 0;
    .dialog-line {
      display: flex;
      margin-top: 15px;
      .line-right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        font-size: 12px;
        .dialog-img {
          width: 200px;
        }
        .font28 {
          font-size: 16px;
          line-height: 0;
        }
        .copyCon {
          display: flex;
          align-items: center;
        }
        .rightBtn {
          margin-left: 15px;
        }
      }
    }
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
