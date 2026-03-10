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

        <el-form-item label="统计月份" prop="monthDate">
          <el-date-picker
            v-model="queryFormData.monthDate"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择月份"
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
          <!-- <el-button type="primary" plain icon="el-icon-download" @click="exportReport()"
            >导出</el-button
          >
          <el-button type="success" plain icon="el-icon-folder-add" @click="showCreateDialog()"
            >生成</el-button
          > -->
        </div>
        <!-- <div class="item-box">
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

        </div> -->
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
      >
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column label="统计日期" align="center" prop="statisticsDate" >
          <template >
            {{ queryFormData.monthDate }}
          </template>
        </el-table-column>
        <el-table-column label="商户名称" align="center" prop="merchantName" />



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
              {{ parseFloat(row.orderAmount).toFixed(2) }}
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
              {{ parseFloat(row.payAmount).toFixed(2) }}
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
            min-width="100px"
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
            min-width="100px"
          >
            <template slot-scope="{ row }">
              <div style="color: green; font-weight: 600">{{ parseFloat(row.successfulOrderAmount).toFixed(2) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="成功实付金额(元)"
            align="center"
            sortable
            :sort-method="(a, b) => a.successfulPayAmount - b.successfulPayAmount"
            prop="successfulPayAmount"
            min-width="100px"
          >
            <template slot-scope="{ row }">
              <div style="color: green; font-weight: 600">{{ parseFloat(row.successfulPayAmount).toFixed(2) }}</div>
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
            {{ parseFloat(row.systemCost).toFixed(2) }}
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
            {{ parseFloat(row.merchantCost).toFixed(2) }}
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
            {{ parseFloat(row.dailyAvailableBalance).toFixed(2) }}
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
  dailyMerchantReportSummary,
  dailyMerchantReportExport,
  dailyMerchantReportGenerate
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

  watch: {
    selectTenantId(newVal, oldVal) {
      console.log(newVal, oldVal)
      if (this.$route.name == 'MerchantMonthlyReport') {
        this.$refs.tableRef.getTableData(1)
      }
    }
  },

  methods: {
    onTradeTypeChange(e) {
      this.tradeType = e
       this.dailyMerchantReportSummary()
        this.$refs.tableRef.getTableData(1)
    },

    async getMerchantReportPage(page) {
      let obj = {
        tenantId: this.selectTenantId,
        tradeType: this.tradeType,
        pageSize: 10000 // 获取所有数据
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'monthDate') {
            // 根据月份生成开始日期和结束日期
            const [year, month] = this.queryFormData['monthDate'].split('-')
            obj['startDate'] = `${year}-${month}-01`
            // 计算该月最后一天
            const lastDay = new Date(year, month, 0).getDate()
            obj['endDate'] = `${year}-${month}-${lastDay}`
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await getMerchantReportPage(obj, page)
      // 获取到所有数据后，根据商户名称进行聚合统计
      this.tableData = this.aggregateMerchantData(res.data.list)
      console.log('聚合后数据：', this.tableData)

      return { ...res, data: { ...res.data, list: this.tableData, total: this.tableData.length } }
    },
    async dailyMerchantReportSummary() {
      let obj = {
        tenantId: this.selectTenantId,
        tradeType: this.tradeType,
        pageSize: 10000
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'monthDate') {
            const [year, month] = this.queryFormData['monthDate'].split('-')
            obj['startDate'] = `${year}-${month}-01`
            const lastDay = new Date(year, month, 0).getDate()
            obj['endDate'] = `${year}-${month}-${lastDay}`
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await dailyMerchantReportSummary(obj)
      // 如果返回了数据，基于已聚合的数据计算汇总
      if (res.data) {
        this.summaryData = this.calculateSummary(this.tableData)
      }
      console.log('汇总数据：', this.summaryData)
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
          if (key == 'monthDate') {
            const [year, month] = this.queryFormData['monthDate'].split('-')
            obj['startDate'] = `${year}-${month}-01`
            const lastDay = new Date(year, month, 0).getDate()
            obj['endDate'] = `${year}-${month}-${lastDay}`
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await dailyMerchantReportExport(obj)
      console.log(res, 'res')
      FileSaver.saveAs(res, '商户月报表.xlsx')
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
      let res = await dailyMerchantReportGenerate({
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
      // this.dailyMerchantReportSummary()
      this.$refs.queryFormData.resetFields()
    },
    getQueryForm() {
      let now = new Date()
      // 默认当前月份
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      return {
        monthDate: `${year}-${month}`
      }
    },

    /**
     * 根据商户名称聚合数据
     * @param {Array} data 原始日报数据
     * @returns {Array} 聚合后的月度数据
     */
    aggregateMerchantData(data) {
      if (!data || !Array.isArray(data) || data.length === 0) {
        return []
      }

      const merchantMap = new Map()

      // 遍历所有日报数据，按商户名称汇总
      data.forEach((item) => {
        const merchantName = item.merchantName
        if (!merchantMap.has(merchantName)) {
          // 初始化该商户的数据
          merchantMap.set(merchantName, {
            merchantName: merchantName,
            orderCount: 0,
            orderAmount: 0,
            payAmount: 0,
            successfulOrderCount: 0,
            successfulOrderAmount: 0,
            successfulPayAmount: 0,
            systemCost: 0,
            merchantCost: 0,
            dailyAvailableBalance: item.dailyAvailableBalance || 0,
            dailyFreezeBalance: item.dailyFreezeBalance || 0
          })
        }

        const merchant = merchantMap.get(merchantName)
        // 累加数值字段
        merchant.orderCount += item.orderCount || 0
        merchant.orderAmount += item.orderAmount || 0
        merchant.payAmount += item.payAmount || 0
        merchant.successfulOrderCount += item.successfulOrderCount || 0
        merchant.successfulOrderAmount += item.successfulOrderAmount || 0
        merchant.successfulPayAmount += item.successfulPayAmount || 0
        merchant.systemCost += item.systemCost || 0
        merchant.merchantCost += item.merchantCost || 0
        // 日终余额和冻结金额取最后一条的值
        merchant.dailyAvailableBalance = item.dailyAvailableBalance || 0
        merchant.dailyFreezeBalance = item.dailyFreezeBalance || 0
      })

      // 计算成功率
      const result = Array.from(merchantMap.values()).map((merchant) => {
        const successfulRate =
          merchant.orderCount > 0
            ? parseFloat(
                ((merchant.successfulOrderCount / merchant.orderCount) * 100).toFixed(2)
              )
            : 0
        return {
          ...merchant,
          successfulRate: successfulRate
        }
      })

      return result
    },

    /**
     * 根据聚合数据计算汇总统计
     * @param {Array} tableData 聚合后的表格数据
     * @returns {Object} 汇总数据
     */
    calculateSummary(tableData) {
      if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
        return {
          orderCount: 0,
          orderAmount: 0,
          payAmount: 0,
          successfulOrderCount: 0,
          successfulOrderAmount: 0,
          successfulPayAmount: 0,
          successfulRate: 0,
          merchantCost: 0,
          merchantAgentCost: 0,
          systemCost: 0
        }
      }

      const summary = tableData.reduce(
        (acc, item) => ({
          orderCount: acc.orderCount + (item.orderCount || 0),
          orderAmount: acc.orderAmount + (item.orderAmount || 0),
          payAmount: acc.payAmount + (item.payAmount || 0),
          successfulOrderCount: acc.successfulOrderCount + (item.successfulOrderCount || 0),
          successfulOrderAmount: acc.successfulOrderAmount + (item.successfulOrderAmount || 0),
          successfulPayAmount: acc.successfulPayAmount + (item.successfulPayAmount || 0),
          systemCost: acc.systemCost + (item.systemCost || 0),
          merchantCost: acc.merchantCost + (item.merchantCost || 0)
        }),
        {
          orderCount: 0,
          orderAmount: 0,
          payAmount: 0,
          successfulOrderCount: 0,
          successfulOrderAmount: 0,
          successfulPayAmount: 0,
          systemCost: 0,
          merchantCost: 0
        }
      )

      // 计算整体成功率
      const successfulRate =
        summary.orderCount > 0
          ? parseFloat(((summary.successfulOrderCount / summary.orderCount) * 100).toFixed(2))
          : 0

      return {
        ...summary,
        successfulRate: successfulRate,
        merchantAgentCost: 0 // 如果需要，可以从tableData中的其他字段计算
      }
    },

    queryTableData() {
      this.$refs.queryFormData.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
          // this.dailyMerchantReportSummary()
        }
      })
    }
  },
  mounted() {
    // this.dailyMerchantReportSummary()
  }
}
</script>

<style lang="scss" scoped>

.isShowUi .tool-box .btns::after{
  content: '';
  display: block;
  clear: both;
}
</style>
