<template>
  <div class="container">
    <el-card>
      <div class="header">Excel代付订单批量添加</div>
      <div class="tips mt-10 head-con">
        <div class="head-line mt-10">
          1>下载【下载批量代付模板】。2>按下载的Excel进行填写，选择上传。3>进行提交申请
        </div>
        <div class="head-notify red">
          （注意：上传批量代付文件会将列表中数据重置为文件中数据，而不是添加）
        </div>
        <div class="mt-10 btn-con">
          <el-button
            type="warning"
            icon="el-icon-download"
            @click="exportReport()"
            style="margin-right: 20px"
            >下载批量代付模板</el-button
          >

          <el-upload
            class="avatar-uploader"
            action="#"
            :multiple="false"
            :file-list="fileList"
            :show-file-list="false"
            :before-upload="beforeUploadFile"
            :http-request="uploadConfigFile"
            :on-success="(res, file, fileList) => handleFileSuccess(res, file, fileList)"
            :on-remove="(file, fileList) => handleFileRemove(file, fileList)"
          >
            <el-button type="success" icon="el-icon-folder-add" style="margin-right: 20px"
              >上传批量代付文件</el-button
            >
          </el-upload>
          <el-button
            v-if="errorFlag"
            type="danger"
            size="mini"
            icon="el-icon-warning-outline"
            @click="checkError()"
            >查看失败订单</el-button
          >
        </div>
      </div>
    </el-card>

    <el-card class="mt-10">
      <div class="red">
        点击如下的【新增】可以进行录入数据，录入后的数据也可以点左边【删除】进行删除
      </div>

      <el-table
        class="mt-10"
        ref="tableRef"
        :data="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55"> </el-table-column>
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column align="center">
          <template slot="header">
            <el-button type="success" size="mini" @click="handleAdd()">新增</el-button>
          </template>
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>

        <el-table-column align="center" prop="merchantOrderNo">
          <template slot="header">
            <p>
              <!-- <span class="red">*</span> -->
              <span>商户订单号</span>
            </p>
          </template>
          <template slot-scope="{ row }">
            <el-input
              v-model="row.merchantOrderNo"
              placeholder="请输入商户订单号"
              @blur="merchantOrderNoBlur"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="" align="center" prop="orderAmount">
          <template slot="header">
            <p><span class="red">*</span><span>订单金额</span></p>
          </template>
          <template slot-scope="{ row }">
            <!-- v-input-int-positive -->
            <el-input
              v-number-input-positive
              type="number"
              v-model="row.orderAmount"
              placeholder="请输入订单金额"
              @blur="orderAmountBlur"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="" align="center" prop="payee">
          <template slot="header">
            <p><span class="red">*</span><span>收款人姓名</span></p>
          </template>
          <template slot-scope="{ row }">
            <el-input v-model="row.payee" placeholder="请输入收款人姓名"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="" align="center" prop="payeeNo" width="200">
          <template slot="header">
            <p><span class="red">*</span><span>收款人账号</span></p>
          </template>
          <template slot-scope="{ row }">
            <el-input v-model="row.payeeNo" placeholder="请输入收款人账号或卡号"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="" align="center" prop="payeeAddress">
          <template slot="header">
            <p><span class="red">*</span><span>收款人地址</span></p>
          </template>
          <template slot-scope="{ row }">
            <el-input v-model="row.payeeAddress" placeholder="请输入收款人地址"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="" align="center" prop="notifyUrl">
          <template slot="header">
            <p><span class="red">*</span><span>回调地址</span></p>
          </template>
          <template slot-scope="{ row }">
            <el-input v-model="row.notifyUrl" placeholder="请输入回调地址"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="拓展参数" align="center" prop="extParam">
          <template slot-scope="{ row }">
            <el-input v-model="row.extParam" placeholder="拓展参数"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="付款说明" align="center" prop="paymentDesc">
          <template slot-scope="{ row }">
            <el-input v-model="row.paymentDesc" placeholder="请输入付款说明"></el-input>
          </template>
        </el-table-column>
      </el-table>

      <div>
        <div class="money-line">
          代付余额：<span>
            {{
              this.paymentBalance
                ? this.paymentBalance
                : this.$store.state.userAccount.availableBalance
            }}
          </span>
        </div>
        <div class="money-line">
          订单总额：<span> {{ this.totalAmount ? this.totalAmount : 0 }} </span>
        </div>
        <div class="money-line">
          订单笔数：<span> {{ this.totalOrderNum ? this.totalOrderNum : 0 }}</span>
        </div>
        <div class="form-con">
          <el-form
            ref="checkData"
            :rules="rules"
            :inline="true"
            :model="checkData"
            class="demo-form-inline"
          >
            <el-form-item label="请选择支付通道" prop="channelCode">
              <el-select
                filterable
                v-model="checkData.channelCode"
                placeholder="请选择支付通道"
                size="small"
                @change="channelChange"
              >
                <el-option
                  v-for="item in allChannelList"
                  :key="item.channelId"
                  :label="item.channelName"
                  :value="item.channelCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请输入google验证码:" prop="googleCode">
              <el-input v-model="checkData.googleCode" placeholder="请输入google验证码"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-button type="success" size="mini" @click="handleOkBtn()">立即提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { creatRules } from './rules.js'
import FileSaver from 'file-saver'
import { getPaymentChannelListByTenantId } from '@/api/merchant.js'
import { getMerchantInfo } from '@/api/merchant-info.js'
import {
  paymentOrderImport,
  createManualMerchantPaymentOrder,
  downloadExcelTemplate
} from '@/api/create-order'
export default {
  name: 'HandleCreateOrder',
  data() {
    return {
      allChannelList: [],
      fileList: [],
      formData: {},
      paymentBalance: '',
      rules: creatRules,
      tableData: [
        {
          merchantOrderNo: '',
          orderAmount: '0',
          payee: '',
          payeeNo: '',
          payeeAddress: '',
          notifyUrl: '',
          extParam: '',
          paymentDesc: ''
        }
      ],
      totalAmount: '',
      // totalOrderNum:"",
      selectedRows: [], // 当前选择的行
      checkData: {
        channelCode: '',
        googleCode: '',
        channelName: ''
      },
      merchantOrderNoFlag: true,
      errorFlag: false
    }
  },
  computed: {
    totalOrderNum() {
      return this.tableData.length || 0
    }
  },
  methods: {
    channelChange(value) {
      const channelName = this.allChannelList.find(
        (option) => option.channelCode == value
      ).channelName
      this.checkData.channelName = channelName
    },
    async exportReport() {
      let res = await downloadExcelTemplate()
      FileSaver.saveAs(res, '批量代付模板.xlsx')
      console.log(res)
    },
    handleSelectionChange(val) {
      this.selectedRows = val

      if (val.length > 1) {
        this.$refs.tableRef.clearSelection()
        this.$refs.tableRef.toggleRowSelection(val.pop())
      }
    },
    orderAmountBlur(e) {
      let value = e.target.value
      if (!value || String(value).trim().length == 0) {
        return
      }
      const sum = this.tableData.reduce((acc, obj) => acc + Number(obj.orderAmount), 0)
      this.totalAmount = sum
    },
    merchantOrderNoBlur(e) {
      this.merchantOrderNoFlag = true
      let value = e.target.value
      if (!value || String(value).trim().length == 0) {
        return
      }
      if (String(value).length > 128) {
        this.$message.error('最长 128 位')
        return
      }
    },
    async uploadBatch() {
      let res = await paymentOrderImport()
      console.log(res)
    },
    handleDelete(index, row) {
      this.tableData.splice(index, 1)
      const sum = this.tableData.reduce((acc, obj) => acc + Number(obj.orderAmount), 0)
      this.totalAmount = sum
      // this.totalOrderNum=this.tableData.length
    },
    checkError() {
      this.$router.push('/merchant-order/check-error-order')
    },
    beforeUploadFile(file) {
      console.log('----beforeUploadFile------', file)
      const isJPG =
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      return isJPG
    },
    async uploadConfigFile(action) {
      try {
        let res = await paymentOrderImport(action.file)
        console.log(res.data,'----------')
        this.paymentBalance = res.data.paymentBalance
        this.totalAmount = res.data.totalAmount
        // this.totalOrderNum = res.data.totalOrderNum
        this.tableData =this.tableData.concat(res.data.manualMerchantPaymentOrderImportData
          ? res.data.manualMerchantPaymentOrderImportData
          : [])
        // this.tableData = res.data.manualMerchantPaymentOrderImportData
        //   ? res.data.manualMerchantPaymentOrderImportData
        //   : []
        this.$message.success('上传成功！')
      } catch (e) {
        console.log(e)
      }
    },
    async handleFileSuccess(response, file, fileList) {
      console.log('handleFileSuccess--', response, file)

      // if (response && response.data) {
      //   let ret = await getFileById(response.data)
      //   console.log(ret)
      //   this.formData.payeeAccountConfig.files[index].fileId = response.data // fileId
      //   this.$set(this.formData.payeeAccountConfig.files[index], 'fileUrl', ret.data.fileUrl)
      // } else {
      //   console.error('上传文件出错，data 为空')
      //   this.$set(this.formData.payeeAccountConfig.files[index], 'fileUrl', [])
      // }

      // this.$refs.formDataRef.clearValidate([`payeeAccountConfig.files[${index}].fileUrl`])
    },
    handleFileRemove(file, fileList) {
      console.log('---handleFileRemove---', file, fileList)
      // this.formData.payeeAccountConfig.files[index].fileUrl = undefined
    },
    handleAdd() {
      this.tableData.push({
        merchantOrderNo: '',
        orderAmount: '0',
        payee: '',
        payeeNo: '',
        payeeAddress: '',
        notifyUrl: '',
        extParam: '',
        paymentDesc: ''
      })
      // this.totalOrderNum=this.tableData.length
      const sum = this.tableData.reduce((acc, obj) => acc + Number(obj.orderAmount), 0)
      this.totalAmount = sum
    },
    handleOkBtn() {
      let tableData = this.tableData
      if (tableData.length == 0) {
        this.$message.error('请至少填写一条表格数据！！')
        return
      }
      if (!this.merchantOrderNoFlag) {
        this.$message.error('请正确填写表格数据！！')
        return
      }
      if (this.selectedRows.length > 0) {
        tableData = this.selectedRows
      }
      if (tableData.length !== 0) {
        let arr = [
          // 'merchantOrderNo',
          'orderAmount',
          'payee',
          'payeeNo',
          'payeeAddress',
          'notifyUrl'
        ]
        let flag = true
        tableData.forEach((item) => {
          Object.keys(item).forEach((key) => {
            if (arr.includes(key) && item[key] == '') {
              flag = false
              return
            }
          })
        })
        if (!flag) {
          this.$message.error(
            `${
              this.selectedRows.length > 0
                ? '请将当前选择的行数据填写完整！！'
                : '请先将表格数据填写完整！！'
            }`
          )
          return
        }
      }
      this.$refs['checkData'].validate(async (valid) => {
        if (valid) {
          let res = await createManualMerchantPaymentOrder({
            channelCode: this.checkData.channelCode,
            googleCode: this.checkData.googleCode,
            channelName: this.checkData.channelName,
            manualMerchantPaymentOrderImportData: tableData
          })
          if (res.data.manualMerchantPaymentOrderErrorInfoList.length == 0) {
            this.errorFlag = false
            this.$message.success('提交成功！')
            this.$router.go(-1)
            this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
              // if (this.isActive(view)) {
              //   this.toLastView(visitedViews, view)
              // }
            })
          } else {
            this.errorFlag = true
            sessionStorage.setItem('errorData', JSON.stringify(res.data))
            this.$message.error('提交不成功,请查看失败订单！！')
          }
        }
      })
    }
  },
  async mounted() {
    let merchantId = ''
    let res = await getMerchantInfo()
    merchantId = res.data.merchantId
    await getPaymentChannelListByTenantId(this.tenantId, {
      merchantId: merchantId
    }).then((res) => {
      if (res.data && res.data.length > 0) {
        this.allChannelList = res.data
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.header {
  font-size: 20px;
}
.head-con {
  font-size: 16px;
}
.head-notify {
  margin-top: 8px;
  font-size: 14px;
}
.red {
  color: red;
}
.money-line {
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #606266;
}
.form-con {
  margin-top: 20px;
}
.btn-con {
  display: flex;
}
</style>
