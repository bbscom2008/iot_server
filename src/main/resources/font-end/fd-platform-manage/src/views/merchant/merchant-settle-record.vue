<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        :rules="queryRules"
        ref="queryFormData"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="商户名称" prop="merchantId">
          <el-select
            filterable
            v-model="queryFormData.merchantId"
            placeholder="请选择"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in allMerchantList"
              :key="item.merchantId"
              :label="item.userNickName"
              :value="item.merchantId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算时间" prop="create_time">
          <el-date-picker
            v-model="queryFormData.create_time"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="myPickerOptionsAll"
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
        >一键导出</el-button
      >
      <my-table
        class="mt-10"
        :loadData="getSettleRecordListPage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="商户名称" align="center" prop="merchantNickName" />
        <el-table-column label="应结算金额(元)" align="center" prop="dueSettleAmount">
          <template slot-scope="{ row }">
            {{ Number(row.dueSettleAmount) }}
          </template>
        </el-table-column>
        <el-table-column label="实际结算金额(元)" align="center" prop="realSettleAmount">
          <template slot-scope="{ row }">
            {{ Number(row.realSettleAmount) }}
          </template>
        </el-table-column>
        <el-table-column
          label="结算前可用余额(元)"
          align="center"
          prop="beforeSettleAvailableBalance"
        >
          <template slot-scope="{ row }">
            {{ Number(row.beforeSettleAvailableBalance) }}
          </template>
        </el-table-column>
        <el-table-column
          label="结算后可用余额(元)"
          align="center"
          prop="afterSettleAvailableBalance"
        >
          <template slot-scope="{ row }">
            {{ Number(row.afterSettleAvailableBalance) }}
          </template>
        </el-table-column>
        <el-table-column label="结算前押金(元)" align="center" prop="beforeSettleDeposit">
          <template slot-scope="{ row }">
            {{ Number(row.beforeSettleDeposit) }}
          </template>
        </el-table-column>
        <el-table-column label="结算后押金(元)" align="center" prop="afterSettleDeposit">
          <template slot-scope="{ row }">
            {{ Number(row.afterSettleDeposit) }}
          </template>
        </el-table-column>
        <el-table-column label="结算时间" align="center" prop="settleTime" />
        <el-table-column label="结算开始时间" align="center" prop="settleStartTime" />
        <el-table-column label="结算结束时间" align="center" prop="settleEndTime" />
        <el-table-column label="备注信息" align="center" prop="remark" />
        <el-table-column label="操作者" align="center" prop="createByNickName" />
      </my-table>
    </el-card>
  </div>
</template>

<script>
import { getMerchantList, getSettleRecordListPage, exportSettleRecord } from '@/api/merchant-info'
import { formatDateTime } from '@/utils'
import { queryRules } from './rules'
import FileSaver from 'file-saver'
export default {
  name: 'MerchantSettleRecord',
  data() {
    return {
      queryRules: queryRules,
      tableData: [],
      queryFormData: this.getQueryForm(),
      allMerchantList: [] // 所有商户列表
    }
  },
  methods: {
    async exportReport() {
      let obj = {
        tenantId: this.tenantId
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
      let res = await exportSettleRecord(obj)
      console.log(res, 'res')
      FileSaver.saveAs(res, '商户列表结算记录.xlsx')
    },
    updateMerchantList() {
      getMerchantList({}).then((res) => {
        console.log(res)
        this.allMerchantList = res.data
      })
    },
    async getSettleRecordListPage(page) {
      let obj = { tenantId: this.tenantId }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          console.log(this.queryFormData[key], 'this.queryFormData[key]')
          if (key == 'create_time') {
            obj['startTime'] = this.queryFormData['create_time'][0]
            obj['endTime'] = this.queryFormData['create_time'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await getSettleRecordListPage(obj, { ...page })
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let todayStr = formatDateTime(today)
      return {
        merchantId: '',
        create_time: [todayStr, nowStr]
      }
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
      this.$refs.queryFormData.resetFields()
    },

    queryTableData() {
      this.$refs.queryFormData.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    }
  },
  mounted() {
    this.updateMerchantList()
  }
}
</script>

<style lang="scss" scoped></style>
