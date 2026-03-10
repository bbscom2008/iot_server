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
        <el-form-item label="账号" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="登录IP" prop="loginIp">
          <el-input v-model="queryFormData.loginIp" placeholder="请输入登录IP" size="small" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleId">
          <el-select v-model="queryFormData.roleId" placeholder="请选择角色" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in rolesOptions"
              :key="'' + item.roleId"
              :label="item.roleName"
              :value="'' + item.roleId"
            ></el-option>
          </el-select>
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
        :loadData="getOnlineUserPage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="账号" align="center" prop="userName" />
        <el-table-column label="用户名称" align="center" prop="userNickName" />
        <el-table-column label="角色名称" align="center" prop="roleName" />
        <el-table-column label="登录设备" align="center" prop="deviceType">
          <template slot-scope="{ row }">
            <span v-if="row.deviceType == '未知'">
              <svg-icon icon-class="weizhi" /> &nbsp;未知</span
            >
            <span v-if="row.deviceType == 'Windows'">
              <svg-icon icon-class="windows" />&nbsp;Windows</span
            >
            <span v-if="row.deviceType == 'macOS'"><svg-icon icon-class="MACOS" />&nbsp;macOS</span>
            <span v-if="row.deviceType == 'Linux'"><svg-icon icon-class="linux" />&nbsp;linux</span>
            <span v-if="row.deviceType == 'iPhone'"
              ><svg-icon icon-class="iphone" />&nbsp;iPhone</span
            >
            <span v-if="row.deviceType == 'iPad'"><svg-icon icon-class="ipad" />&nbsp;iPad</span>
            <span v-if="row.deviceType == 'Android'"
              ><svg-icon icon-class="android" />&nbsp;Android</span
            >
          </template>
        </el-table-column>
        <el-table-column label="登录IP" align="center" prop="ip" />
        <el-table-column label="最后登录时间" align="center" prop="lastLoginTime" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button type="primary" size="small" @click="showConfirmDelete(row)">
              <i class="el-icon-delete" /> 踢出
            </el-button>
          </template>
        </el-table-column>
      </my-table>
    </el-card>
  </div>
</template>

<script>
import { getOnlineUserPage, onlineUserKickOut, getRoleList } from '@/api/system-manager'
import { queryRules } from './rules'
export default {
  name: 'OnlineUser',
  components: {},
  data() {
    return {
      queryRules: queryRules,
      tableData: [],
      queryFormData: {
        userName: '',
        loginIp: '',
        roleId: ''
      },
      rolesOptions: []
    }
  },
  methods: {
    async getRoleList() {
      let res = await getRoleList({ tenantId: this.tenantId })
      this.rolesOptions = res.data
      console.log(res.data)
    },
    async getOnlineUserPage(page) {
      let res = await getOnlineUserPage(
        { ...this.queryFormData, tenantId: this.tenantId },
        { ...page }
      )
      this.tableData = res.data.list
      return res
    },
    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确定踢出用户 【 ${row.userName} 】 吗？`)
        let res = await onlineUserKickOut(row.userId)
        this.$refs.tableRef.getTableData()
        console.log(res, '删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },
    resetQueryForm() {
      this.queryFormData = {
        userName: '',
        loginIp: '',
        roleId: ''
      }
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
    this.getRoleList()
  }
}
</script>

<style lang="scss" scoped></style>
