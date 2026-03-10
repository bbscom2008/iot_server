<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        :rules="rules"
        ref="queryFormData"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="交易编号" prop="accountChangeRecordId">
          <el-input
            v-model="queryFormData.accountChangeRecordId"
            placeholder="请输入交易编号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            v-model="queryFormData.systemOrderNo"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="商户订单号" prop="">
          <el-input
            v-model="queryFormData.merchantOrderNo"
            placeholder="请输入商户订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="业务类型" prop="businessType">
          <el-select
            filterable
            v-model="queryFormData.businessType"
            placeholder="请选择业务类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="代收类" value="0"></el-option>
            <el-option label="代付类" value="1"></el-option>
            <el-option label="业务类" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="账变类型" prop="changeType">
          <el-select
            filterable
            v-model="queryFormData.changeType"
            placeholder="请选择账变类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="充值" value="0"></el-option>
            <el-option label="扣款" value="1"></el-option>
            <el-option label="提现" value="2"></el-option>
            <el-option label="冲正" value="3"></el-option>
            <el-option label="余额划拔" value="4"></el-option>
            <el-option label="结算" value="5"></el-option>
            <el-option label="押金" value="6"></el-option>
            <el-option label="订单交易" value="7"></el-option>
            <el-option label="订单手续费" value="8"></el-option>
            <el-option label="下级分佣" value="9"></el-option>
            <el-option label="冻结" value="10"></el-option>
            <el-option label="解冻" value="11"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账变金额" prop="changeAmount">
          <el-input
            v-number-input
            type="number"
            v-model="queryFormData.changeAmount"
            placeholder="请输入账变金额"
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
            :picker-options="myPickerOptionsAll"
          >
          </el-date-picker>
          <!-- <div class="help-tip">只能选择某一天的不同时间段，（开始日期和结束日期为同一天）</div> -->
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
        :loadData="getTenantAccountChangePage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="交易编号" align="center" prop="accountChangeRecordId">
          <template slot-scope="{ row }"> {{ row.accountChangeRecordId }} </template>
        </el-table-column>
        <el-table-column label="业务类型" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.businessType == '2'" type="primary"> 业务类 </el-tag>
            <el-tag v-if="row.businessType == '1'" type="success"> 代付类 </el-tag>
            <el-tag v-if="row.businessType == '0'" type="success"> 代收类 </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="账变类型" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.changeType == '0'">充值</span>
            <span v-if="row.changeType == '1'">扣款</span>
            <span v-if="row.changeType == '2'">提现</span>
            <span v-if="row.changeType == '3'"
              >冲正<el-tooltip
                class="item"
                effect="dark"
                content="订单失败后，返还金额"
                placement="top"
              >
                <i class="el-icon-question"></i> </el-tooltip
            ></span>
            <span v-if="row.changeType == '4'">余额划拨</span>
            <span v-if="row.changeType == '5'">结算</span>
            <span v-if="row.changeType == '6'">押金</span>
            <span v-if="row.changeType == '7'">订单交易</span>
            <span v-if="row.changeType == '8'">订单手续费</span>
            <span v-if="row.changeType == '9'"
              >下级分佣<el-tooltip
                class="item"
                effect="dark"
                content="下级交易产生的利润"
                placement="top"
              >
                <i class="el-icon-question"></i> </el-tooltip
            ></span>
            <span v-if="row.changeType == '10'">冻结</span>
            <span v-if="row.changeType == '11'">解冻</span>
          </template>
        </el-table-column>
        <el-table-column label="账变金额(元)" align="center" prop="changeAmount" />
        <el-table-column label="账变后账户余额(元)" align="center" prop="balanceAfterChange" />
        <el-table-column label="备注信息" align="center" prop="remark" />
        <el-table-column label="系统订单号" align="center" prop="systemOrderNo">
          <template slot-scope="{ row }">
            {{ row.systemOrderNo ? row.systemOrderNo : '---' }}
          </template>
        </el-table-column>
        <el-table-column label="商户订单号" align="center" prop="merchantOrderNo">
          <template slot-scope="{ row }">
            {{ row.merchantOrderNo ? row.merchantOrderNo : '---' }}
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>
      </my-table>
    </el-card>
    <el-dialog
      :visible.sync="dialogVisible"
      title="选择导出时间"
      width="500px"
      @close="onDialogBtnCancel"
    >
      <el-form>
        <el-form-item>
          <el-date-picker
            v-model="exportTime"
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
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTenantAccountChangePage,tenantAccountChangeExport  } from '@/api/cash-manage'

import { formatDateTime } from '@/utils'

import { cashRules } from './rules'
import { mapState } from 'vuex'
import FileSaver from 'file-saver'
export default {
  name: 'tenementChangeRecord',
  data() {
    return {
      rules: cashRules,
      tableData: [],
      queryFormData: this.getQueryForm(),
      dialogVisible: false,
      exportTime: ''
      // 添加扩展数据，如 options 所需要的数据
    }
  },
  computed: {
    selectTenantId() {
      return this.$store.state.tenant.selectTenantId
    }
  },

  watch: {
    selectTenantId(newVal, oldVal) {
      console.log(newVal, oldVal)
      if (this.$route.name == 'tenementChangeRecord') {
        this.$refs.tableRef.getTableData(1)
      }
    }
  },
  methods: {
    onDialogBtnCancel() {
      this.dialogVisible = false
      this.exportTime = ''
    },
    exportReport() {
      this.dialogVisible = true
      this.exportTime = ''
    },
    async onDialogBtnOk() {
      if (!this.exportTime) {
        this.$message.error('请先选择导出日期！')
        return
      }


      let obj = {
        userType: '2',
        tenantId: this.$store.state.tenant.selectTenantId,
        exportTime: this.exportTime,
        startTime: this.exportTime[0],
        endTime: this.exportTime[1]
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          obj[key] = this.queryFormData[key]
        }
      })
      const { createTime, exportTime, ...rest } = obj
      let res = await tenantAccountChangeExport(rest)
      this.$message.success('导出成功')
      this.onDialogBtnCancel()
      console.log(res, 'res')
      FileSaver.saveAs(res, '平台账变记录.xlsx')
    },
    async getTenantAccountChangePage(page) {
      let obj = { ...this.queryFormData, tenantId: this.selectTenantId }
      if (this.queryFormData.createTime) {
        obj = {
          ...obj,
          startTime: this.queryFormData.createTime ? this.queryFormData.createTime[0] : '',
          endTime: this.queryFormData.createTime ? this.queryFormData.createTime[1] : ''
        }
      }
      const { createTime, ...rest } = obj
      let res = await getTenantAccountChangePage(rest, { ...page })
      this.tableData = res.data.list
      console.log(res)
      return res
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
        businessType: '',
        changeType: '',
        createTime: [todayStr, nowStr]
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
