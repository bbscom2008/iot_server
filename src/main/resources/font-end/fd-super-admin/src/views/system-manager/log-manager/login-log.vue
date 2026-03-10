<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        :model="formData"
        ref="queryFormRef"
        :rules="queryRules"
        class="demo-form-inline"
      >
        <el-form-item label="账号:" prop="userName">
          <el-input v-model="formData.userName" size="small" placeholder="账号"></el-input>
        </el-form-item>

        <el-form-item label="用户名称:" prop="userNickName">
          <el-input
            v-model="formData.userNickName"
            size="small"
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="访问时间" prop="handle_time">
          <el-date-picker
            v-model="formData.handle_time"
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
        ref="tableRef"
        :tableData="tableData"
        :loadData="getLoginLogPage"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" label="序号" align="center" width="55"> </el-table-column>
        <el-table-column align="center" label="账号">
          <template slot-scope="{ row }">
            <span>{{ row.userName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="用户名称">
          <template slot-scope="{ row }">
            <span>{{ row.userNickName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="登录设备">
          <template slot-scope="{ row }">
            <span>{{ row.deviceType }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="登录IP">
          <template slot-scope="{ row }">
            <span>{{ row.ip }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="登录地点">
          <template slot-scope="{ row }">
            <span>{{ row.ipLocation }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="登录状态">
          <template slot-scope="{ row }">
            <el-tag :type="row.loginStatus == 1 ? 'success' : 'danger'">{{
              row.loginStatus == 1 ? '成功' : '失败'
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="描述">
          <template slot-scope="{ row }">
            <span>{{ row.loginMsg }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="访问时间">
          <template slot-scope="{ row }">
            <span>{{ row.lastLoginTime }}</span>
          </template>
        </el-table-column>
      </my-table>
    </el-card>
  </div>
</template>

<script>
import { getLoginLogPage } from '@/api/system-manager'
import { formatDateTime } from '@/utils'
import { queryRules } from '../rules.js'
export default {
  name: 'LoginLog',

  data() {
    return {
      queryRules: queryRules,
      tableData: [],
      formData: this.getQueryForm(),
      selectedRows: [] // 当前选择的行
    }
  },
  methods: {
    async getLoginLogPage(page) {
      let obj = { ...this.formData, tenantId: this.$store.state.tenant.selectTenantId }
      if (this.formData.handle_time) {
        obj = {
          ...obj,
          startTime: this.formData.handle_time ? this.formData.handle_time[0] : '',
          endTime: this.formData.handle_time ? this.formData.handle_time[1] : ''
        }
      }
      const { handle_time, ...rest } = obj
      let res = await getLoginLogPage(rest, { ...page })
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
        userName: '',
        userNickName: '',
        handle_time: [todayStr, nowStr]
      }
    },
    resetQueryForm() {
      this.formData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
    },

    queryTableData() {
      this.$refs.queryFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        // todo 搜索
        console.log(this.queryFormData)
        this.$refs.tableRef.getTableData(1)
      })
    },
    handleSelectionChange(val) {
      console.log('---handleSelectionChange----' + JSON.stringify(val))
      this.selectedRows = val
    }
  },
  mounted() {
    // 由 my-table 组件自己加载数据
    // this.getDataList()
  }
}
</script>

<style lang="scss" scoped>
.tips {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 20px;
}
</style>
