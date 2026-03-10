<template>
  <div class="container">
    <!-- <el-card>
      <el-form
        :inline="true"
        :rules="rules"
        ref="queryFormData"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="统计日期" prop="statisticDate">
          <el-date-picker
            v-model="queryFormData.statisticDate"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
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
    </el-card> -->

    <el-card class="mt-10">
      <!-- <el-button type="warning" plain icon="el-icon-download" @click="exportReport()"
        >导出</el-button
      >
      <el-button type="success" plain icon="el-icon-folder-add" @click="showCreateDialog()"
        >生成</el-button
      > -->

      <div class="tips mt-10">
        汇总信息：
        <span class="mr-10"
          >订单数量: {{ summaryData.orderCount ? summaryData.orderCount : 0 }}
        </span>
        <span class="mr-10"
          >订单金额: {{ summaryData.orderAmount ? summaryData.orderAmount : 0 }}
        </span>
        <span class="mr-10"
          >成功订单数: {{ summaryData.successfulOrderCount ? summaryData.successfulOrderCount : 0 }}
        </span>
        <span class="mr-10"
          >成功订金额:
          {{ summaryData.successfulOrderAmount ? summaryData.successfulOrderAmount : 0 }}
        </span>
        <span class="mr-10"
          >实付金额: {{ summaryData.payAmount ? summaryData.payAmount : 0 }}
        </span>
        <span class="mr-10"
          >成功率(%): {{ summaryData.successfulRate ? summaryData.successfulRate : 0 }}%
        </span>
        <span class="mr-10"
          >系统费用: {{ summaryData.systemCost ? summaryData.systemCost : 0 }}
        </span>
        <span class="mr-10"
          >码商费用: {{ summaryData.providerCost ? summaryData.providerCost : 0 }}
        </span>
        <span class="mr-10"
          >商户费用: {{ summaryData.merchantCost ? summaryData.merchantCost : 0 }}
        </span>
        <span class="mr-10"
          >平台利润: {{ summaryData.platformProfit ? summaryData.platformProfit : 0 }}
        </span>
      </div>

      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="getReportPage"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="统计日期" align="center" prop="statisticsDate">
          <template slot-scope="{ row }">
            {{ row.statisticsDate }}
          </template>
        </el-table-column>
        <el-table-column
          label="订单数量"
          align="center"
          sortable
          :sort-method="(a, b) => a.orderCount - b.orderCount"
          prop="orderCount"
        />
        <el-table-column
          label="订单金额(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.orderAmount - b.orderAmount"
          prop="orderAmount"
          width="130px"
        />
        <el-table-column
          label="成功订单数"
          align="center"
          sortable
          :sort-method="(a, b) => a.successfulOrderCount - b.successfulOrderCount"
          prop="successfulOrderCount"
        />
        <el-table-column
          label="成功订单金额(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.successfulOrderAmount - b.successfulOrderAmount"
          prop="successfulOrderAmount"
          width="130px"
        />
        <el-table-column
          label="实付金额(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.payAmount - b.payAmount"
          prop="payAmount"
        />
        <el-table-column
          label="成功实付金额(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.successfulPayAmount - b.successfulPayAmount"
          prop="successfulPayAmount"
          width="130"
        />
        <el-table-column
          label="成功率(%)"
          align="center"
          sortable
          :sort-method="(a, b) => a.successfulRate - b.successfulRate"
          prop="successfulRate"
        />
        <el-table-column
          label="商户费用(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.merchantCost - b.merchantCost"
          prop="merchantCost"
        />
        <el-table-column
          label="系统费用(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.systemCost - b.systemCost"
          prop="systemCost"
        />
        <el-table-column
          label="代理分润(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.tenantAgentCost - b.tenantAgentCost"
          prop="tenantAgentCost"
        />
        <el-table-column
          label="码商分润(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.providerCost - b.providerCost"
          prop="providerCost"
          width="140px"
        />
        <el-table-column
          label="平台利润(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.platformProfit - b.platformProfit"
          prop="platformProfit"
        />
        <el-table-column
          label="日终余额(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.dailyAvailableBalance - b.dailyAvailableBalance"
          prop="dailyAvailableBalance"
        />
        <!-- <el-table-column
          label="日终冻结金额(元)"
          align="center"
          prop="dailyFreezeBalance"
          width="130px"
        /> -->
      </my-table>
    </el-card>

    <el-dialog :visible.sync="dialogVisible" title="生成报表" width="350px">
      <el-form>
        <el-form-item label="生成日期" prop="createdTime">
          <el-date-picker
            v-model="createdTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <div class="help-tip  mt-10" >报表由系统自动生成，如有遗漏，可选择日期，手动生成报表!</div>
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
import {
  getReportPage,
  summary,
  platformDailyReportExport,
  platformDailyReportGenerate
} from '@/api/report-center.js'
import { queryRules } from './rules'
import { formatDateDate } from '@/utils'
import FileSaver from 'file-saver'
export default {
  name: 'PlatformDailyReport',
  data() {
    return {
      tableData: [],
      rules: queryRules,
      dialogVisible: false,
      createdTime: '', // 生成日期
      queryFormData: this.getQueryForm(),
      summaryData: {}
    }
  },
    methods: {
    async getReportPage(page) {
      let obj = {
        tenantId: this.tenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          if (key == 'statisticDate') {
            obj['startDate'] = this.queryFormData['statisticDate'][0]
            obj['endDate'] = this.queryFormData['statisticDate'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await getReportPage(obj, page)
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async summary() {
      let obj = {
        tenantId: this.tenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          if (key == 'statisticDate') {
            obj['startDate'] = this.queryFormData['statisticDate'][0]
            obj['endDate'] = this.queryFormData['statisticDate'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await summary(obj)
      this.summaryData = res.data
      console.log(res)
    },
    async exportReport() {
      let obj = {
        tenantId: this.tenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          if (key == 'statisticDate') {
            obj['startDate'] = this.queryFormData['statisticDate'][0]
            obj['endDate'] = this.queryFormData['statisticDate'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await platformDailyReportExport(obj)
      console.log(res, 'res')
            FileSaver.saveAs(res, '平台日报表.xlsx')
    },
    showCreateDialog() {
      this.dialogVisible = true
    },
    onDialogBtnCancel() {
      this.dialogVisible = false
      this.createdTime = ''
    },
    async onDialogBtnOk() {
      if (!this.createdTime) {
        this.$message.error('请先选择日期！')
        return
      }
      let res = await platformDailyReportGenerate({
        date: this.createdTime,
        tenantId: this.tenantId
      })
      this.createdTime = ''
      console.log(res, 'res')
      this.dialogVisible = false
      this.$refs.tableRef.getTableData(1)
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
      this.summary()
      this.$refs.queryFormData.resetFields()
    },
    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      let sevenStr = formatDateDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
      let todayStr = formatDateDate(today)
      return {
        statisticDate: [sevenStr, todayStr]
        // statisticDate: []
      }
    },

    queryTableData() {
      this.$refs.queryFormData.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
          this.summary()
        }
      })
    }
  },
  mounted() {
    this.summary()
  }
}
</script>

<style lang="scss" scoped></style>
