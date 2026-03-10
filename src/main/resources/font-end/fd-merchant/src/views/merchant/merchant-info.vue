<template>
  <div class="container">
    <el-dialog
      :visible.sync="keyDialogVisible"
      title="查看商户密钥"
      width="600px"
      v-loading="loading"
    >
      <el-form
        ref="keyFormDataRef"
        :model="keyFormData"
        label-position="right"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="交易密码：" prop="tradePassword">
          <el-input
            type="password"
            show-password
            v-model="keyFormData.tradePassword"
            placeholder="请输入交易密码"
            size="small"
          />
        </el-form-item>

        <el-form-item label="谷歌验证码：" prop="googleCode">
          <el-input v-model="keyFormData.googleCode" placeholder="请输入谷歌密钥" size="small" />
        </el-form-item>
        <el-form-item label="商户密钥：" prop="merchant_key">
          <template> {{ merchant_key }} </template>
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" size="small" @click="checkBtnOk()">查看商户密钥</el-button>
          <el-button @click="checkBtnClose" size="small"> 关闭窗口 </el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-card>
      <div class="request">
        <p class="req-line">
          <span class="req-label">账号：</span>
          <span class="req-value">{{ merchantInfo.userName ? merchantInfo.userName : '---' }}</span>
        </p>

        <p class="req-line">
          <span class="req-label">用户名称：</span>
          <span class="req-value">{{
            merchantInfo.userNickName ? merchantInfo.userNickName : '---'
          }}</span>
        </p>
        <p class="req-line">
          <span class="req-label">商户号：</span>
          <span class="req-value">{{
            merchantInfo.merchantNo ? merchantInfo.merchantNo : '---'
          }}</span>
        </p>
        <p class="req-line">
          <span class="req-label">商户密钥：</span>
          <span class="req-value"> <el-tag>abc**********kidf</el-tag> </span>
          <el-button style="margin-left: 10px" type="text" plain @click="showKeyDialog"
            >查看</el-button
          >
        </p>
        <p class="req-line">
          <span class="req-label">登录设备：</span>
          <span class="req-value">{{
            merchantInfo.loginDevice ? merchantInfo.loginDevice : '---'
          }}</span>
        </p>
        <p class="req-line">
          <span class="req-label">登录IP：</span>
          <span class="req-value">{{ merchantInfo.loginIp ? merchantInfo.loginIp : '---' }}</span>
        </p>
        <p class="req-line">
          <span class="req-label">最后登录时间：</span>
          <span class="req-value">{{
            merchantInfo.lastLoginDate ? merchantInfo.lastLoginDate : '---'
          }}</span>
        </p>
        <p class="req-line">
          <span class="req-label">创建时间：</span>
          <span class="req-value">{{
            merchantInfo.createTime ? merchantInfo.createTime : '---'
          }}</span>
        </p>
        <div class="tips" style="color: red">重置谷歌密钥，请联系系统管理员</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMerchantInfo, getMerchantSecret } from '@/api/merchant-info.js'

import { tradePwd, googleCode } from '@/utils/validate'
export default {
  name: 'MerchantInfo',
  data() {
    return {
      rules: {
        tradePassword: [
          { required: true, message: '请输入交易密码', trigger: 'blur' },
          ...tradePwd
        ],
        googleCode: [
          { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
          ...googleCode
        ]
      },
      keyDialogVisible: false,
      tableData: [],
      keyFormData: {
        tradePassword: '',
        googleCode: ''
      },
      merchant_key: '',

      merchantInfo: {},
      loading: false

      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    showKeyDialog() {
      this.keyDialogVisible = true
      this.keyFormData = {
        tradePassword: '',
        googleCode: ''
      }
      this.merchant_key = ''
      this.$nextTick(() => {
        this.$refs.keyFormDataRef.clearValidate()
      })
    },
    checkBtnClose() {
      this.$refs.keyFormDataRef.resetFields()
      this.merchant_key = ''
      this.keyDialogVisible = false
    },
    async checkBtnOk() {
      this.$refs.keyFormDataRef.validate(async (valid) => {
        if (valid) {
          let res = await getMerchantSecret({
            merchantId: this.merchantInfo.merchantId,
            ...this.keyFormData
          })
          console.log(res)
          this.merchant_key = res.data
          // this.checkBtnClose()
        }
      })
    }
  },
  async mounted() {
    let res = await getMerchantInfo()
    console.log(res)
    this.merchantInfo = res.data
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
