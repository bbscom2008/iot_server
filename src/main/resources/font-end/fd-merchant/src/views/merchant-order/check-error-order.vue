<template>
  <div class="container">
    <el-card>
      <div class="header">部分代付订单批量添加失败订单详情</div>
      <div class="tips mt-10 head-con">
        <div class="head-line mt-10 head-notify">
          注意事项：1、商户订单号若原来没有填写，则展示的为系统自动生成订单号。
          <span class="red"
            >2、编辑数据未保存后台，页面编辑后批量再提交，请妥善操作！3、删除功能会同步删除后台数据，若某笔订单需要废弃可以点击删除！</span
          >
        </div>
      </div>
      <div class="money-con">
        <div class="line-money">
          代付余额：
          <span>{{ this.paymentBalance ? this.paymentBalance : 0 }} </span>
        </div>
        <div class="line-money">
          订单总额：
          <span> {{ this.totalAmount ? this.totalAmount : 0 }} </span>
        </div>
      </div>
    </el-card>

    <el-card class="mt-10">
      <el-table class="mt-10" ref="tableRef" :data="tableData" style="width: 100%" border>
        <el-table-column label="序号" align="center" type="index" width="60" />
        <!-- <el-table-column align="center">
          <template slot="header">
            <el-button type="success" size="mini" @click="handleAdd()">新增</el-button>
          </template>
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column> -->

        <el-table-column align="center" prop="merchantOrderNo">
          <template slot="header">
            <!-- <span class="red">*</span> -->
            <p><span>商户订单号</span></p>
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
            <el-input
              type="number"
              v-input-int-positive
              v-model="row.orderAmount"
              placeholder="请输入订单金额"
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
        <el-table-column label="付款说明" align="center" prop="paymentDesc" width="145">
          <template slot-scope="{ row }">
            <el-input v-model="row.paymentDesc" placeholder="请输入付款说明"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="通道名称" align="center" prop="channelName">
          <template slot-scope="{ row }">
            {{ row.channelName }}
          </template>
        </el-table-column>
        <el-table-column label="错误原因" align="center" prop="errorMsg">
          <template slot-scope="{ row }">
            {{ row.errorMsg }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div>
        <div class="form-con">
          <el-form
            ref="checkData"
            :rules="rules"
            :inline="true"
            :model="checkData"
            class="demo-form-inline"
          >
            <el-form-item label="请输入google验证码:" prop="googleCode">
              <el-input v-model="checkData.googleCode" placeholder="请输入google验证码"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-button type="primary" size="mini" @click="handleOkBtn()">提交</el-button>
        <el-button type="" size="mini" @click="checkError()">关闭</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { creatRules } from './rules.js'
import { createManualMerchantPaymentOrder } from '@/api/create-order'
export default {
  name: 'CheckErrorOrder',
  data() {
    return {
      checkData: {
        channelCode: '',
        googleCode: ''
      },
      paymentBalance: '',
      channelName: '',
      totalAmount: '',
      errorData: {},
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
      merchantOrderNoFlag: true,
      rules: creatRules
    }
  },
  methods: {
    orderAmountBlur(e) {
      let value = e.target.value
      if (!value || String(value).trim().length == 0) {
        return
      }
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
    handleDelete(index, row) {
      this.tableData.splice(index, 1)
      let totalAmount = Number(this.totalAmount) - Number(row.orderAmount)
      this.errorData.totalAmount = totalAmount
      this.errorData.manualMerchantPaymentOrderErrorInfoList = this.tableData
      sessionStorage.setItem('errorData', JSON.stringify(this.errorData))
      this.getTableData()
    },
    handleOkBtn() {
      let tableData = this.tableData
      if (!this.merchantOrderNoFlag) {
        this.$message.error('请正确填写表格数据！！')
        return
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
          this.$message.error(`${'请先将表格数据填写完整！！'}`)
          return
        }
      }
      this.$refs['checkData'].validate(async (valid) => {
        if (valid) {
          let res = await createManualMerchantPaymentOrder({
            channelCode: this.errorData.channelCode,
            channelName: this.errorData.channelName,
            googleCode: this.checkData.googleCode,
            manualMerchantPaymentOrderImportData: tableData
          })
          if (res.data.manualMerchantPaymentOrderErrorInfoList.length == 0) {
            this.errorFlag = false
            this.$message.success('提交成功！')
            this.checkError()
          } else {
            this.errorFlag = true
            sessionStorage.setItem('errorData', JSON.stringify(res.data))
            this.getTableData()
            this.$message.error('提交不成功！！')
          }
        }
      })
    },
    checkError() {
      this.$router.go(-1)
      this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
        // if (this.isActive(view)) {
        //   this.toLastView(visitedViews, view)
        // }
      })
    },
    getTableData() {
      this.errorData = JSON.parse(sessionStorage.getItem('errorData'))
      this.tableData = this.errorData.manualMerchantPaymentOrderErrorInfoList
      this.paymentBalance = this.errorData.paymentBalance
      this.totalAmount = this.errorData.totalAmount
      this.channelName = this.errorData.channelName
      this.tableData.forEach((item) => {
        item.channelName = this.channelName
      })
      this.$forceUpdate()
    }
  },
  mounted() {
    this.getTableData()
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
.form-con {
  margin-top: 20px;
}
.money-con {
  display: flex;
  padding: 0 100px;
  justify-content: space-around;
}
.line-money {
  background: #e9e8e899;
  width: 40%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #606266;
}
</style>
