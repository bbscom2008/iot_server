<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        :rules="queryRules"
        ref="queryFormRef"
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

        <el-form-item label="商户用户名" prop="merchantUserName">
          <el-input
            v-model="queryFormData.merchantUserName"
            placeholder="请输入商户用户名"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户号" prop="merchantNo">
          <el-input
            v-model="queryFormData.merchantNo"
            placeholder="请输入商户号"
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
        :defaultPageSize="30"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="系统订单号" align="center" prop="orderId" />
        <el-table-column label="商户订单号" align="center" prop="merchantOrderNo" />
        <el-table-column label="商户号" align="center" prop="merchantNo" />
        <el-table-column label="商户用户名" align="center" prop="merchantUserName" />
        <el-table-column label="商户名称" align="center" prop="merchantUserNickName" />
        <el-table-column label="通道编码" align="center" prop="channelName" />
        <el-table-column label="订单金额(元)" align="center" prop="orderAmount" />
        <el-table-column label="异常说明" align="center" prop="exceptionDesc" />

        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" min-width="100" fixtt="right">
          <template slot-scope="{ row }">
            <div class="opt-box" style="padding: 15px 0">
              <div type="primary" class="btn" @click="orderInfo(row)" v-if="row.orderId"    >
                <i class="el-icon-s-order" />详情
              </div>
            </div>
          </template>
        </el-table-column>


      </my-table>
    </el-card>

    <orderDetail
      ref="incomeOrderInfo"
      v-if="showOrderDetail"
      @close="showOrderDetail = false"
      :orderItem="currOrder"
      payType="collect"
    ></orderDetail>

  </div>
</template>

<script>
import { formatDateTime } from '@/utils'
import orderDetail from './components/except-order-detail.vue'
import { getExceptionOrderListPage ,exportExceptionOrderList} from '@/api/exception-order.js'

import {queryRules} from './rules'
import FileSaver from 'file-saver'
export default {
  name: 'ExceptionOrder',
  components:{
    orderDetail,
  },
  data() {
    return {
      tableData: [],
      queryRules:queryRules,
      queryFormData: this.getQueryForm(),
      currOrder: {},
      showOrderDetail: false,
    }
  },
  // watch: {
  //   '$store.state.tenant.selectTenantId'(newV, oldV) {
  //     this.queryTableData()
  //   }
  // },

  methods: {
  orderInfo(row) {
      // this.$refs.incomeOrderInfo.drawer = true
      // row.orderId = row.merchantOrderNo
      this.currOrder = row
      this.showOrderDetail = true
    },

    async exportReport() {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== undefined ) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await exportExceptionOrderList(params)
      FileSaver.saveAs(res, '异常订单列表.xlsx')
    },
    async loadTableData(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== undefined ) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await getExceptionOrderListPage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    flushPage() {
      this.queryTableData()
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormRef.resetFields()
      this.$refs.tableRef.getTableData(1)
    },
    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59))
      let todayStr = formatDateTime(today)
      return {
        createTime: [todayStr, nowStr]
      }
    },

    queryTableData() {
      this.$refs.queryFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        // 刷新表格
        this.$refs.tableRef.getTableData(1)
      })

    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
