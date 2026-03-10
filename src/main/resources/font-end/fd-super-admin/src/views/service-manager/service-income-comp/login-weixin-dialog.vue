<template>
  <el-dialog
    :visible.sync="dialogVisible"
    @close="closeMobileAuth()"
    title="微信登录授权"
    width="500px"
  >
    <el-form ref="queryFormDataRef" :inline="true" :model="queryFormData" class="form">
      <el-form-item
        label="选择地址"
        prop="address"
        :rules="[{ required: true, message: '请选择地区', trigger: 'blur' }]"
      >
        <el-select
          v-model="queryFormData.address"
          filterable
          placeholder="请选择地区"
          size="small"
        >
          <el-option v-for="item in citys" :key="item.name" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">获得二维码</el-button>
      </el-form-item>
    </el-form>

    <div class="status">
     
      <div class="info" v-if="statusData">
        <div>当前状态： <el-tag type="success">授权成功</el-tag></div>
        <div>微信昵称： {{ statusData.nickname }}</div>
      </div>
      <div class="info" v-else>当前状态： <el-tag type="danger">未授权</el-tag></div>

       <el-button type="success" @click="flushStatus">刷新状态</el-button>
    </div>

    <div class="qrcode-box" v-if="qrData && qrData.qrBase64">
      <img class="img" :src="qrData.qrBase64" alt="" />
      <div class="tips mt-10 red">打开微信扫描二维码，授权后，点击刷新查看状态，成功后即可关闭弹窗</div>
    </div>

    <!-- <div slot="footer" style="text-align: center">
      <el-button size="small" type="success" @click="dialogVisible = false"> 关闭 </el-button>
    </div> -->
  </el-dialog>
</template>

<script>
import { getProxyIp, getWeixinLoginQrcode, getWechatUserInfo } from '@/api/service-income-info'


import {citys} from './citys'


export default {
  name: 'LoginWeiXinDialog',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      citys,
      dialogVisible: false,
      proxyList: [],
      queryFormData: {},
      qrData: null,
      statusData:null,
    }
  },
  mounted() {
    this.dialogVisible = true
    // this.getProxyIp()
    this.flushStatus()
  },
  methods: {
    flushStatus() {
      getWechatUserInfo(this.row.payeeAccountId)
        .then((res) => {
          this.statusData = res.data
          this.$message({
            message: `微信用户信息: ${res.data.nickname}`,
            type: 'success'
          })
        })
        .catch((err) => {
          // this.$message({
          //   message: `获取微信用户信息失败: ${err.message}`,
          //   type: 'error'
          // })
        })
    },
    handleSubmit() {
      this.$refs.queryFormDataRef.validate((valid) => {
        if (valid) {
          getWeixinLoginQrcode(this.row.payeeAccountId, {
            adr: this.queryFormData.address,
          }).then((res) => {
            this.qrData = res.data
            this.$message({
              message: '二维码获取成功',
              type: 'success'
            })
          })
        }
      })
    },
    // async getProxyIp() {
    //   let res = await getProxyIp()
    //   this.proxyList = res.data
    // },
    closeMobileAuth() {
      this.dialogVisible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.qrcode-box {
  text-align: center;
  margin-top: 20px;
}

.info{
  width: 290px;
}
.status{
  display: flex;
  gap: 15px;
  align-items: center;
}

</style>
