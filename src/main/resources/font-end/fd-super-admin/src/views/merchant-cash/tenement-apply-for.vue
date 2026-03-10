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
        <el-form-item label="交易编号" prop="withdrawalApplyId">
          <el-input
            v-model="queryFormData.withdrawalApplyId"
            placeholder="请输入交易编号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="平台名称" prop="userNickName">
          <el-input
            v-model="queryFormData.userNickName"
            placeholder="请输入平台名称"
            size="small"
          />
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
        :loadData="getTenantWithdrawalPage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column label="交易编号" align="center" prop="withdrawalApplyId">
          <template slot-scope="{ row }"> {{ row.withdrawalApplyId }} </template>
        </el-table-column>
        <el-table-column label="账号" align="center" prop="userName" />
        <el-table-column label="平台名称" align="center" prop="userNickName" />
        <el-table-column label="提现金额(元)" align="center" prop="withdrawalApplyAmount" />
        <el-table-column label="提现收款信息" align="center" prop="payeeInfo" />
        <el-table-column label="提现说明" align="center" prop="withdrawalApplyDesc" />
        <el-table-column label="审核状态" align="center" prop="withdrawalApplyStatus">
          <template slot-scope="{ row }">
            <el-tag v-if="row.withdrawalApplyStatus == '0'" type="primary">申请中 </el-tag>
            <el-tag v-if="row.withdrawalApplyStatus == '1'" type="success">审核通过 </el-tag>
            <el-tag v-if="row.withdrawalApplyStatus == '2'" type="danger">审核驳回 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核说明" align="center" prop="auditDesc" />
        <el-table-column label="备注信息" align="center" prop="remark" />

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

        <el-table-column label="操作" align="center" prop="action">
          <template slot-scope="{ row }">
            <el-button
              v-if="row.withdrawalApplyStatus == '0'"
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="showShenHeDialog(row)"
            >
              审核
            </el-button>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog :visible.sync="showShenHeDialogVisual" title="提现审核" width="600px">
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 50px"
      >
        <el-form-item label="交易编号" prop="withdrawalApplyId">
          <el-input
            v-model="formData.withdrawalApplyId"
            placeholder="请输入交易编号"
            size="small"
            disabled
          />
        </el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input v-model="formData.userName" placeholder="请输入账号" size="small" disabled />
        </el-form-item>
        <el-form-item label="平台名称" prop="userNickName">
          <el-input
            v-model="formData.userNickName"
            placeholder="请输入平台名称"
            disabled
            size="small"
          />
        </el-form-item>
        <el-form-item label="提现金额(元)" prop="withdrawalApplyAmount">
          <el-input
            type="number"
            v-model="formData.withdrawalApplyAmount"
            placeholder="请输入提现金额"
            size="small"
            disabled
          />
        </el-form-item>
        <el-form-item label="审核说明" prop="auditDesc">
          <el-input v-model="formData.auditDesc" placeholder="请输入审核说明" size="small" />
        </el-form-item>

        <el-form-item label="交易密码" prop="tradePassword">
          <el-input type="password" show-password v-model="formData.tradePassword" placeholder="请输入交易密码" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="showShenHeDialogBtnOk(1)" size="small"> 审核通过 </el-button>
        <el-button
          style="margin: 0 20px"
          type="primary"
          @click="showShenHeDialogBtnOk(0)"
          size="small"
        >
          审核驳回
        </el-button>
        <el-button @click="showShenHeDialogBtnCancel()" size="small"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTenantWithdrawalPage, tenantWithdrawalAudit } from '@/api/merchant-cash'
import { merchantCashRules, queryRules } from './rules.js'
import { formatDateTime } from '@/utils'

export default {
  name: 'tenementApply',
  data() {
    return {
      rules: merchantCashRules,
      queryRules: queryRules,
      tableData: [],
      dialogVisible: false,
      formData: {
        withdrawalApplyId: '',
        userName: '',
        userNickName: '',
        withdrawalApplyAmount: '',
        auditDesc: '',
        tradePassword: ''
      },
      queryFormData: this.getQueryForm(),

      // 添加扩展数据，如 options 所需要的数据

      showShenHeDialogVisual: false
    }
  },
  methods: {
    async getTenantWithdrawalPage(page) {
      let obj = { ...this.queryFormData }
      if (this.queryFormData.create_time) {
        obj = {
          ...obj,
          startTime: this.queryFormData.create_time ? this.queryFormData.create_time[0] : '',
          endTime: this.queryFormData.create_time ? this.queryFormData.create_time[1] : ''
        }
      }
      const { create_time, ...rest } = obj
      let res = await getTenantWithdrawalPage(rest, { ...page })
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    showShenHeDialogBtnCancel() {
      this.showShenHeDialogVisual = false
      this.$refs.formData.clearValidate()
      this.$refs.formData.resetFields()
    },
    showShenHeDialogBtnOk(e) {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          console.log(e)
          const { withdrawalApplyId, auditDesc, tradePassword } = this.formData
          let res = await tenantWithdrawalAudit({
            withdrawalApplyId,
            auditDesc,
            tradePassword,
            withdrawalApplyStatus: e
          })

          this.showShenHeDialogBtnCancel()

          this.$refs.tableRef.getTableData()
          console.log(res, 'res')
        }
      })
    },
    showShenHeDialog(row) {
      this.showShenHeDialogVisual = true
      this.formData = Object.assign({}, row)
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
      this.$refs.queryFormData.resetFields()
    },

    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let todayStr = formatDateTime(today)
      return {
        // create_time: [todayStr, nowStr]
        create_time: []
      }
    },

    queryTableData() {
      this.$refs.queryFormData.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
