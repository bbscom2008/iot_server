<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        ref="queryFormData"
        :rules="queryRules"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="收款码名称" prop="payeeAccountName">
          <el-input
            v-model="queryFormData.payeeAccountName"
            placeholder="请输入收款码名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户UID" prop="userId">
          <el-input v-model="queryFormData.userId" placeholder="请输入商户UID" size="small" />
        </el-form-item>

        <el-form-item label="授权状态" prop="status">
          <el-select
            filterable
            v-model="queryFormData.status"
            placeholder="请选择授权状态"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="成功" :value="1"></el-option>
            <el-option label="失败" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间" prop="">
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
      <my-table
        class="mt-10"
        :loadData="getAlipayAuthPage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="租户ID" align="center"  prop="tenantId" />
        <el-table-column label="码商账号" align="center" prop="userName" />
        <el-table-column label="收款码名称" align="center" prop="payeeAccountName" />
        <el-table-column label="支付宝码商账号" align="center" prop="alipayAccount" />
        <el-table-column label="APPID" align="center" prop="appId" />
        <el-table-column label="商户UID" align="center" prop="userId" />

        <el-table-column label="授权状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.status==0?'danger':'success'">{{row.status==0?'失败':'成功'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="授权token" align="center" prop="appAuthToken" />

        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>

        <el-table-column label="更新时间" align="center" prop="updateTime">
          <template slot-scope="{ row }">
            {{ row.updateTime }}
          </template>
        </el-table-column>
      </my-table>
    </el-card>
  </div>
</template>

<script>
import { getAlipayAuthPage } from '@/api/ali-pay'
import { formatDateTime } from '@/utils'
import { queryRules } from './rules.js'
export default {
  name: 'AliAuthList',
  data() {
    return {
      tableData: [],
      queryRules: queryRules,
      queryFormData: this.getQueryForm()
    }
  },
  methods: {
    async getAlipayAuthPage(page) {
      let params = {}
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          if (key == 'create_time') {
            params['startTime'] = this.queryFormData['create_time'][0]
            params['endTime'] = this.queryFormData['create_time'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })
      let res = await getAlipayAuthPage(params, { ...page })
      this.tableData = res.data.list
      console.log(res)
      return res
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
        payeeAccountName: '',
        userId: '',
        status: '',
        // create_time: [todayStr, nowStr]
        create_time: []
      }
    },
    queryTableData() {
      this.$refs.queryFormData.validate((valid) => {
        if (valid) {
          console.log(this.queryFormData)
          this.$refs.tableRef.getTableData(1)
        }
      })
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
