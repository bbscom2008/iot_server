<template>
  <div class="container" :class="isShowUi ? 'isShowUi' : 'noUi'">
    <el-card>
      <el-form
        :inline="true"
        ref="queryFormData"
        :rules="queryRules"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="商户名称" prop="merchantName">
          <el-input
            v-model="queryFormData.merchantName"
            placeholder="请输入商户名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="统计日期" prop="">
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
    </el-card>

    <div v-if="isShowUi" class="report-summary">
      <div class="tool-box">
        <div class="btns">
          <el-button type="primary" plain icon="el-icon-download" @click="exportReport()"
            >导出</el-button
          >
          <el-button type="success" plain icon="el-icon-folder-add" @click="showCreateDialog()"
            >生成</el-button
          >
        </div>

        <div class="item-box">
          <div class="item s3">
            订单数量(单) <span class="value">{{ summaryData.orderCount }}</span>
          </div>
          <div class="item s3">
            订单金额(元) <span class="value">{{ summaryData.orderAmount | amountFormat }}</span>
          </div>
          <div class="item s3">
            实付金额(元) <span class="value">{{ summaryData.payAmount | amountFormat }}</span>
          </div>



          <div class="item s5">
            成功订单数(单)
            <span class="value">{{ summaryData.successfulOrderCount }}</span>
          </div>
          <div class="item s5">
            成功订单金额(元)
            <span class="value">{{ summaryData.successfulOrderAmount | amountFormat }}</span>
          </div>
          <div class="item s5">
            成功实付金额(元) <span class="value">{{ summaryData.successfulPayAmount | amountFormat }}</span>
          </div>


          <div class="item s6">
            成功率(%)
            <span class="value"
              >{{ summaryData.successfulRate
              }}<i v-if="summaryData.successfulRate != null">%</i></span
            >
          </div>

          <div class="item s9">
            商户费用(元)
            <span class="value">{{ summaryData.merchantCost | amountFormat }}</span>
          </div>

           <div class="item s8">
            商户代理费用(元)
            <span class="value">{{ summaryData.merchantAgentCost | amountFormat }}</span>
          </div>

        </div>
      </div>
    </div>

    <el-card class="mt-10">
      <!-- <div v-if="!isShowUi">
        <el-button type="warning" plain icon="el-icon-download" @click="exportReport()"
          >导出</el-button
        >
        <el-button type="success" plain icon="el-icon-folder-add" @click="showCreateDialog()"
          >生成</el-button
        >

        <div class="tips mt-10">
          汇总信息：
          <span class="mr-10"
            >订单数量: {{ summaryData.orderCount ? summaryData.orderCount : 0 }}
          </span>
          <span class="mr-10"
            >订单金额: {{ summaryData.orderAmount ? summaryData.orderAmount : 0 }}
          </span>
          <span class="mr-10"
            >成功订单数:
            {{ summaryData.successfulOrderCount ? summaryData.successfulOrderCount : 0 }}
          </span>
          <span class="mr-10"
            >成功订单金额:
            {{ summaryData.successfulOrderAmount ? summaryData.successfulOrderAmount : 0 }}
          </span>
          <span class="mr-10"
            >成功率(%): {{ summaryData.successfulRate ? summaryData.successfulRate : 0 }}%
          </span>
          <span class="mr-10"
            >商户费用: {{ summaryData.merchantCost ? summaryData.merchantCost : 0 }}
          </span>
        </div>
      </div> -->

      <TradeTypeSwitch v-model="tradeType" @input="onTradeTypeChange"> </TradeTypeSwitch>

      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="getMerchantReportPage"
        :tableData="tableData"
        style="width: 100%"
        border
        row-key="rowKey"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
         <el-table-column label="" align="center" width="50">
          <template>
          </template>
        </el-table-column>

        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="{ row, $index }">
            {{ getRowIndex(row, $index) }}
          </template>
        </el-table-column>
        <el-table-column label="统计日期" align="center" prop="statisticsDate" />
        <el-table-column label="商户名称" align="center" prop="merchantName" :show-overflow-tooltip="true" />

        <el-table-column label="总订单" align="center" >
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
          >
            <template slot-scope="{ row }">
              {{ row.orderAmount ? parseFloat(row.orderAmount).toFixed(2) : 0 }}
            </template>
          </el-table-column>
          <el-table-column
            label="实付金额(元)"
            align="center"
            sortable
            :sort-method="(a, b) => a.payAmount - b.payAmount"
            prop="payAmount"
          >
            <template slot-scope="{ row }">
              {{ row.payAmount ? parseFloat(row.payAmount).toFixed(2) : 0 }}
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="成功订单" align="center" prop="orderCount">
          <el-table-column
            label="成功订单数量"
            align="center"
            sortable
            :sort-method="(a, b) => a.successfulOrderCount - b.successfulOrderCount"
            prop="successfulOrderCount"
            min-width="90px"
          >
            <template slot-scope="{ row }">
              <div style="color: green; font-weight: 600">{{ row.successfulOrderCount }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="成功订单金额(元)"
            align="center"
            sortable
            :sort-method="(a, b) => a.successfulOrderAmount - b.successfulOrderAmount"
            prop="successfulOrderAmount"
            min-width="90px"
          >
            <template slot-scope="{ row }">
              <div style="color: green; font-weight: 600">{{ row.successfulOrderAmount ? parseFloat(row.successfulOrderAmount).toFixed(2) : 0 }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="成功实付金额(元)"
            align="center"
            sortable
            :sort-method="(a, b) => a.successfulPayAmount - b.successfulPayAmount"
            prop="successfulPayAmount"
            min-width="90px"
          >
            <template slot-scope="{ row }">
              <div style="color: green; font-weight: 600">{{ row.successfulPayAmount ? parseFloat(row.successfulPayAmount).toFixed(2) : 0 }}</div>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column
          label="成功率"
          align="center"
          sortable
          :sort-method="(a, b) => a.successfulRate - b.successfulRate"
          prop="successfulRate"
        />
        <el-table-column
          label="系统费用(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.systemCost - b.systemCost"
          prop="systemCost"
        >
          <template slot-scope="{ row }">
            {{ row.systemCost ? parseFloat(row.systemCost).toFixed(2) : 0 }}
          </template>
        </el-table-column>
        <el-table-column
          label="商户费用"
          align="center"
          sortable
          :sort-method="(a, b) => a.merchantCost - b.merchantCost"
          prop="merchantCost"
        >
          <template slot-scope="{ row }">
            {{ row.merchantCost ? parseFloat(row.merchantCost).toFixed(2) : 0 }}
          </template>
        </el-table-column>
        <el-table-column
          label="日终余额(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.dailyAvailableBalance - b.dailyAvailableBalance"
          prop="dailyAvailableBalance"
        >
          <template slot-scope="{ row }">
            {{ row.dailyAvailableBalance ? parseFloat(row.dailyAvailableBalance).toFixed(2) : 0 }}
          </template>
        </el-table-column>
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
            :picker-options="shengchengPickerOptions"
          >
          </el-date-picker>
          <div class="help-tip mt-10">报表由系统自动生成，如有遗漏，可选择日期，手动生成报表!</div>
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
import TradeTypeSwitch from '@/components/TradeTypeSwitch'

import {
  getMerchantReportPage,
  merchantDailyReportSummary,
  merchantDailyReportExport,
  merchantDailyReportGenerate
} from '@/api/report-center'
import { formatDateDate } from '@/utils'
import { queryRules } from './rules.js'
import FileSaver from 'file-saver'
export default {
  name: 'MerchantDailyReport',
  components: {
    TradeTypeSwitch
  },
  data() {
    return {
      queryRules: queryRules,
      tableData: [],
      dialogVisible: false,
      createdTime: '', // 生成日期
      queryFormData: this.getQueryForm(),
      summaryData: {},
      tradeType: 0
    }
  },
  computed: {
    selectTenantId() {
      return this.$store.state.tenant.selectTenantId
    }
  },

  // watch: {
  //   selectTenantId(newVal, oldVal) {
  //     console.log(newVal, oldVal)
  //     if (this.$route.name == 'MerchantDailyReport') {
  //       this.merchantDailyReportSummary()
  //       this.$refs.tableRef.getTableData(1)
  //     }
  //   }
  // },

  methods: {
    getQueryDateText(queryObj) {
      const { startDate, endDate } = queryObj || {}
      const formatMonthDay = (dateStr) => {
        if (!dateStr) return ''
        const parts = String(dateStr).split('-')
        if (parts.length >= 3) {
          return `${parts[1]}-${parts[2]}`
        }
        return String(dateStr)
      }

      if (!startDate && !endDate) return ''
      if (startDate && endDate) return `${formatMonthDay(startDate)} 至 ${formatMonthDay(endDate)}`
      return formatMonthDay(startDate || endDate)
    },

    // 获取行序号，父行和子行分别计数
    getRowIndex(row, index) {
      // 如果是父行（rowKey 以 'parent_' 开头），使用父行的索引+1
      if (row.rowKey && row.rowKey.startsWith('parent_')) {
        return this.tableData.findIndex(item => item.rowKey === row.rowKey) + 1
      }
      // 如果是子行，在其父行的 children 中的索引+1
      if (row.rowKey && row.rowKey.startsWith('child_')) {
        const parentRow = this.tableData.find(item => row.rowKey.includes(item.rowKey.replace('parent_', '')))
        if (parentRow && parentRow.children) {
          return parentRow.children.findIndex(child => child.rowKey === row.rowKey) + 1
        }
      }
      return index + 1
    },

    onTradeTypeChange(e) {
      this.tradeType = e
       this.merchantDailyReportSummary()
        this.$refs.tableRef.getTableData(1)
    },

    async getMerchantReportPage(page) {
      let obj = {
        tenantId: this.selectTenantId,
        tradeType: this.tradeType
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'statisticDate') {
            obj['startDate'] = this.queryFormData['statisticDate'][0]
            obj['endDate'] = this.queryFormData['statisticDate'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await getMerchantReportPage(obj, {pageNum: 1, pageSize: 10000})
      this.tableData = this.processTableData(res.data.list, obj)
      console.log(res)
      return { ...res, data: { ...res.data, list: this.tableData, total: 0 } }
    },

    // 处理表格数据，当日期范围大于1天时进行合并
    processTableData(data, queryObj) {
      // 判断日期范围是否大于1天
      if (!queryObj.startDate || !queryObj.endDate) {
        return data
      }
      const queryDateText = this.getQueryDateText(queryObj)

      const startDate = new Date(queryObj.startDate)
      const endDate = new Date(queryObj.endDate)
      const dayDifference = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))

      // 如果日期范围小于等于1天，直接返回原数据
      if (dayDifference <= 1) {
        return data
      }

      // 日期范围大于1天，按商户名称分组进行树形合并
      const groupedByMerchant = {}

      // 按商户名称分组
      data.forEach((item) => {
        const merchantName = item.merchantName
        if (!groupedByMerchant[merchantName]) {
          groupedByMerchant[merchantName] = {
            rowKey: 'parent_' + merchantName,
            statisticsDate: queryDateText,
            merchantName: merchantName,
            orderCount: 0,
            orderAmount: 0,
            payAmount: 0,
            successfulOrderCount: 0,
            successfulOrderAmount: 0,
            successfulPayAmount: 0,
            successfulRate: 0,
            systemCost: 0,
            merchantCost: 0,
            merchantAgentCost: 0,
            dailyAvailableBalance: 0,
            children: []
          }
        }
        groupedByMerchant[merchantName].children.push(item)
      })

      // 计算每个商户的合计数据
      const result = Object.keys(groupedByMerchant)
        .sort()
        .map((merchantName) => {
          const group = groupedByMerchant[merchantName]
          let totalOrderCount = 0
          let totalOrderAmount = 0
          let totalPayAmount = 0
          let totalSuccessfulOrderCount = 0
          let totalSuccessfulOrderAmount = 0
          let totalSuccessfulPayAmount = 0
          let totalSystemCost = 0
          let totalMerchantCost = 0
          let totalMerchantAgentCost = 0
          let totalDailyAvailableBalance = 0

          // 对子行按日期倒序排列
          group.children.sort((a, b) => {
            return new Date(b.statisticsDate) - new Date(a.statisticsDate)
          })

          // 为子行添加唯一的 rowKey
          group.children = group.children.map((child, index) => {
            return {
              ...child,
              rowKey: 'child_' + merchantName + '_' + child.statisticsDate + '_' + index
            }
          })

          group.children.forEach((child) => {
            totalOrderCount += child.orderCount || 0
            totalOrderAmount += child.orderAmount || 0
            totalPayAmount += child.payAmount || 0
            totalSuccessfulOrderCount += child.successfulOrderCount || 0
            totalSuccessfulOrderAmount += child.successfulOrderAmount || 0
            totalSuccessfulPayAmount += child.successfulPayAmount || 0
            totalSystemCost += child.systemCost || 0
            totalMerchantCost += child.merchantCost || 0
            totalMerchantAgentCost += child.merchantAgentCost || 0
            totalDailyAvailableBalance += child.dailyAvailableBalance || 0
          })

          // 计算成功率
          const successRate =
            totalOrderCount > 0
              ? ((totalSuccessfulOrderCount / totalOrderCount) * 100).toFixed(2)
              : 0

          return {
            rowKey: 'parent_' + merchantName,
            statisticsDate: queryDateText,
            merchantName: merchantName,
            orderCount: totalOrderCount,
            orderAmount: totalOrderAmount,
            payAmount: totalPayAmount,
            successfulOrderCount: totalSuccessfulOrderCount,
            successfulOrderAmount: totalSuccessfulOrderAmount,
            successfulPayAmount: totalSuccessfulPayAmount,
            successfulRate: successRate,
            systemCost: totalSystemCost,
            merchantCost: totalMerchantCost,
            merchantAgentCost: totalMerchantAgentCost,
            dailyAvailableBalance: totalDailyAvailableBalance,
            children: group.children && group.children.length > 0 ? group.children : []
          }
        })
        .filter(item => item.children && item.children.length > 0)

      return result
    },
    async merchantDailyReportSummary() {
      let obj = {
        tenantId: this.selectTenantId,
        tradeType: this.tradeType
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'statisticDate') {
            obj['startDate'] = this.queryFormData['statisticDate'][0]
            obj['endDate'] = this.queryFormData['statisticDate'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await merchantDailyReportSummary(obj)
      this.summaryData = res.data
      console.log(res)
    },
    async exportReport() {
      let obj = {
        tenantId: this.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'statisticDate') {
            obj['startDate'] = this.queryFormData['statisticDate'][0]
            obj['endDate'] = this.queryFormData['statisticDate'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await merchantDailyReportExport(obj)
      console.log(res, 'res')
      FileSaver.saveAs(res, '商户日报表.xlsx')
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
      let res = await merchantDailyReportGenerate({
        date: this.createdTime,
        tenantId: this.selectTenantId
      })
      this.createdTime = ''
      console.log(res, 'res')
      this.dialogVisible = false
      this.$refs.tableRef.getTableData(1)
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
      this.merchantDailyReportSummary()
      this.$refs.queryFormData.resetFields()
    },
    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      let sevenStr = formatDateDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
      let todayStr = formatDateDate(today)
      return {
        statisticDate: [sevenStr, todayStr]
        //statisticDate: []
      }
    },

    queryTableData() {
      this.$refs.queryFormData.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
          this.merchantDailyReportSummary()
        }
      })
    }
  },
  mounted() {
    this.merchantDailyReportSummary()
  }
}
</script>

<style lang="scss" scoped>
// 树形表格子行背景色
::v-deep .el-table__body tr.el-table__row--level-1 td {
  background-color: #e6f7ff !important;
}
</style>
