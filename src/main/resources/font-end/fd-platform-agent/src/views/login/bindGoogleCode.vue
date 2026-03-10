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
      clipboard(`${this.valueItem.googleAuthKey}`, e)
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


<style lang="scss">

</style>
