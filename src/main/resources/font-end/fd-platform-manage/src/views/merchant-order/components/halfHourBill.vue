<template>
  <div class="container">
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      title="近半小时流水"
      width="1200px"
      @close="onDialogBtnCancel"
    >
      <el-card>
        <el-form
          :inline="true"
          :rules="queryRules"
          ref="queryFormData"
          :model="queryFormData"
          class="demo-form-inline"
        >
          <el-form-item label="系统订单号" prop="systemOrderNo">
            <el-input
              v-model="queryFormData.systemOrderNo"
              placeholder="请输入系统订单号"
              size="small"
            />
          </el-form-item>
          <!-- <el-form-item label="码商名称" prop="providerName">
            <el-input
              v-model="queryFormData.providerName"
              placeholder="请输入码商名称"
              size="small"
            />
          </el-form-item>
          <el-form-item label="收款码名称" prop="payeeAccountName">
            <el-input
              v-model="queryFormData.payeeAccountName"
              placeholder="请输入收款码名称"
              size="small"
            />
          </el-form-item> -->
          <el-form-item label="收入/支出" prop="direction">
            <el-select v-model="queryFormData.direction" placeholder="请选择收入/支出" size="small">
              <el-option label="全部" value=""></el-option>
              <el-option label="收入" value="收入"></el-option>
              <el-option label="支出" value="支出"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额（元）" prop="transAmount">
            <el-input type="number" v-number-input-positive v-model="queryFormData.transAmount" placeholder="请输入金额" size="small" />
          </el-form-item>
          <el-form-item label="账务备注" prop="transMemo">
            <el-input v-model="queryFormData.transMemo" placeholder="请输入账务备注" size="small" />
          </el-form-item>
          <!-- <el-form-item label="入账时间" prop="">
            <el-date-picker
              v-model="queryFormData.create_time"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="myPickerOptionsAll"
            >
            </el-date-picker>
          </el-form-item> -->

          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
              >搜索</el-button
            >
            <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="mt-10">
        <el-button type="primary" size="small" icon="el-icon-refresh" @click="refreshBtn"
          >刷新</el-button
        >
        <my-table
          class="mt-10"
          :loadData="loadTableData"
          :tableData="tableData"
          ref="tableRef"
          style="width: 100%"
          border
        >
          <!-- <el-table-column label="租户ID" align="center" prop="tenantId" /> -->
          <el-table-column label="系统订单号" align="center" prop="systemOrderNo" />
          <el-table-column label="码商名称" align="center" prop="providerName" />
          <el-table-column
            label="收款码名称"
            align="center"
            prop="payeeAccountName"
            width="100"
          />
          <el-table-column label="商户订单号" align="center" prop="merchantOrderNo" />
          <el-table-column label="账户余额(元)" align="center" prop="balance" width="100" />
          <!-- <el-table-column label="业务账单来源" align="center" prop="billSource" width="100" />
          <el-table-column
            label="账单的补全信息"
            align="center"
            prop="complementInfo"
            width="110"
          /> -->
          <el-table-column label="收入/支出" align="center" prop="direction" />
          <el-table-column label="对方账户" align="center" prop="otherAccount" />
          <el-table-column label="金额(元)" align="center" prop="transAmount" />
          <el-table-column label="入账时间" align="center" prop="transDt" />
          <el-table-column label="账务备注" align="center" prop="transMemo" />
          <el-table-column label="账务记录类型" align="center" prop="type" width="100" />
          <el-table-column label="创建时间" align="center" prop="createTime" />
        </my-table>
      </el-card>
      <div slot="footer">
        <!-- <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button> -->
        <el-button type="primary" @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLastHalfHourAlipayBillPage } from '@/api/collect-order'
import { queryRules } from '../rules.js'
import {formatDateTime} from '@/utils/index.js'

export default {
  name: 'gCodePreview',
  props: {
    orderItem: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      queryRules: queryRules,
      tableData: [],
      dialogVisible: false,
      queryFormData: this.getQueryForm()
    }
  },
  methods: {
    onDialogBtnCancel() {
      this.dialogVisible = false
      this.$emit('close')
    },
    async loadTableData(page) {
      let obj = {
        payeeAccountId: this.orderItem.collectInfoId,
        tenantId:this.$store.state.user.tenantId,
        startTime: this.orderItem.createTime,
        endTime:  formatDateTime(new Date(new Date(this.orderItem.createTime).getTime() + 30*60*1000)), // 结束时间是 startTime 后的半小时
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'create_time') {
            obj['startTime'] = this.queryFormData['create_time'][0]
            obj['endTime'] = this.queryFormData['create_time'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await getLastHalfHourAlipayBillPage(obj, page)
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    refreshBtn() {
      this.flushPage()
    },
    flushPage() {
      this.$refs.tableRef.getTableData(1)
    },

    resetQueryForm() {
      this.$refs.queryFormData.resetFields()

      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
    },
    getQueryForm() {
      return {
         direction:'',
         transAmount:'',
         systemOrderNo:'',
         transMemo:'',
      }
    },

    queryTableData() {
      // 刷新表格
      this.$refs.tableRef.getTableData(1)
    }
  },
  mounted() {
    this.dialogVisible = true
  }
}
</script>

<style lang="scss" scoped></style>
