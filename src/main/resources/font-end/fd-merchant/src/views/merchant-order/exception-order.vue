<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        label-width
        ref="queryFormDataRef"
        :rules="queryRules"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="商户订单号" prop="merchantOrderNo">
          <el-input
            v-model="queryFormData.merchantOrderNo"
            placeholder="请输入商户订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryFormData.createTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="myPickerOptions"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
            >搜索</el-button
          >
          <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-10">
      <el-button type="success" plain icon="el-icon-download" @click="exportReport()"
        >导出</el-button
      >
      <my-table
        class="mt-10"
        :loadData="loadTableData"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="商户订单号" align="center" prop="merchantOrderNo" />

        <el-table-column label="通道名称" align="center" prop="channelName" />
        <el-table-column label="订单金额(元)" align="center" prop="orderAmount" />
        <el-table-column label="异常说明" align="center" prop="exceptionDesc" />

        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>
      </my-table>
    </el-card>
  </div>
</template>

<script>
import {
  getMerchantPaymentOrderListPage,
  exportMerchantExceptionOrderDetail,
  exportMerchantExceptionOrderList
} from '@/api/exception-order.js'

import { orderRules, queryRules } from './rules.js'

import { formatDateTime } from '@/utils'
import FileSaver from 'file-saver'
export default {
  name: 'ExceptionOrder',
  data() {
    return {
      rules: orderRules,
      queryRules,
      tableData: [],
      queryFormData: this.getQueryForm()

      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    async exportReport() {
      let params = {
        // tenantId: this.$store.state.tenant.currTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await exportMerchantExceptionOrderList(params)
      FileSaver.saveAs(res, '异常订单列表.xlsx')
    },
    async loadTableData(page) {
      let params = {
        // tenantId: this.$store.state.tenant.currTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await getMerchantPaymentOrderListPage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    flushPage() {
      this.queryTableData()
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
    },

    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let todayStr = formatDateTime(today)
      return {
        createTime: [todayStr, nowStr]
      }
    },

    queryTableData() {
      // 刷新表格
      this.$refs.tableRef.getTableData(1)
    },
  },
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
