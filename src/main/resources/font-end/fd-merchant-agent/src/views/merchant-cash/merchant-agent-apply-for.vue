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
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()"
        >提现申请</el-button
      >

      <my-table
        class="mt-10"
        :loadData="getMerchantAgentWithdrawalPage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" />

        <el-table-column label="交易编号" align="center" prop="withdrawalApplyId">
          <template slot-scope="{ row }"> {{ row.withdrawalApplyId }} </template>
        </el-table-column>
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
        <el-table-column label="审核说明" align="center" prop="auditDesc">
          <template slot-scope="{ row }">
            {{ row.auditDesc ? row.auditDesc : '---' }}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remark">
          <template slot-scope="{ row }">
            {{ row.remark ? row.remark : '---' }}
          </template>
        </el-table-column>

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

    <el-dialog :visible.sync="dialogVisible" title="提现申请" width="600px">
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 50px"
      >
        <el-form-item label="账号" prop="userName">
          <el-input v-model="formData.userName" placeholder="请输入账号" size="small" disabled />
        </el-form-item>

        <el-form-item label="可用余额" prop="availableBalance">
          <el-input
            v-number-input
            type="number"
            v-model="$store.state.userAccount.availableBalance"
            placeholder="请输入可用余额"
            size="small"
            disabled
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="提现金额" prop="withdrawalApplyAmount">
          <el-input
            v-number-input-positive
            type="number"
            v-model="formData.withdrawalApplyAmount"
            placeholder="请输入提现金额"
            size="small"
            ><template slot="append">元</template></el-input
          >
        </el-form-item>

        <el-form-item label="提现收款信息" prop="payeeInfo">
          <el-input
            type="textarea"
            rows="4"
            v-model="formData.payeeInfo"
            placeholder="请输入提现收款信息"
            size="small"
          />
        </el-form-item>

        <el-form-item label="提现说明" prop="withdrawalApplyDesc">
          <el-input
            v-model="formData.withdrawalApplyDesc"
            placeholder="请输入提现说明"
            size="small"
          />
        </el-form-item>
        <el-form-item label="交易密码" prop="tradePwd">
          <el-input v-model="formData.tradePwd" placeholder="请输入交易密码" size="small" />
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCode">
          <el-input v-model="formData.googleCode" placeholder="请输入谷歌验证码" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMerchantAgentWithdrawalPage, merchantAgentWithdrawalAdd } from '@/api/merchant-agent'
import { getUserAccount } from '@/api/user'
import { merchantCashRules, queryRules } from './rules.js'
import { formatDateTime } from '@/utils'
export default {
  name: 'ApplyFor',
  data() {
    return {
      rules: merchantCashRules,
      queryRules: queryRules,
      tableData: [],
      dialogVisible: false,
      formData: {
        userName: '',
        availableBalance: '',
        withdrawalApplyAmount: '',
        payeeInfo: '',
        withdrawalApplyDesc: '',
        tradePwd: '',
        googleCode: ''
      },
      queryFormData: this.getQueryForm()

      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    async getUserAccount() {
      let res = await getUserAccount()
      this.$store.state.userAccount.availableBalance = res.data.availableBalance
      this.$store.state.userAccount.freezeBalance = res.data.freezeBalance
      console.log(res, 'res')
    },
    async getMerchantAgentWithdrawalPage(page) {
      let obj = { ...this.queryFormData }
      if (this.queryFormData.create_time) {
        obj = {
          ...obj,
          startTime: this.queryFormData.create_time ? this.queryFormData.create_time[0] : '',
          endTime: this.queryFormData.create_time ? this.queryFormData.create_time[1] : ''
        }
      }
      const { create_time, ...rest } = obj
      let res = await getMerchantAgentWithdrawalPage(rest, { ...page })
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    showAddDialog() {
      this.dialogVisible = true
      this.formData = {
        userName: sessionStorage.getItem('loginForm.username'),
        availableBalance: this.$store.state.userAccount.availableBalance,
        withdrawalApplyAmount: '',
        payeeInfo: '',
        withdrawalApplyDesc: '',
        tradePwd: '',
        googleCode: ''
      }
      this.$nextTick(() => {
        this.$refs.formData.resetFields()
        this.$refs.formData.clearValidate()
      })
    },
    onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          const { userName, availableBalance, ...obj } = this.formData
          let res = await merchantAgentWithdrawalAdd({
            withdrawalApplyAmount: +obj.withdrawalApplyAmount,
            payeeInfo: obj.payeeInfo,
            withdrawalApplyDesc: obj.withdrawalApplyDesc,
            tradePwd: obj.tradePwd,
            googleCode: obj.googleCode
          })
          this.dialogVisible = false
          this.$refs.tableRef.getTableData(1)
          this.getUserAccount()
          console.log(res, 'res')
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
        withdrawalApplyId: '',
        // create_time: [todayStr, nowStr]
        create_time: []
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
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
