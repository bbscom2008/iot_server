<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="商户名称" prop="merchantName">
          <el-input
            v-model="queryFormData.merchantName"
            placeholder="请输入商户名称"
            size="small"
          />
        </el-form-item>

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
            :picker-options="pickerOptions"
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
      <el-button type="warning" plain icon="el-icon-download">导出</el-button>
      <el-button type="success" plain icon="el-icon-folder-add" @click="showCreateDialog()"
        >生成</el-button
      >

      <div class="tips mt-10">
        汇总信息：
        <span class="mr-10">订单数量: {{ summaryData.orderCount }} </span>
        <span class="mr-10">订单金额: {{ summaryData.orderAmount }} </span>
        <span class="mr-10">成功订单数: {{ summaryData.successfulOrderCount }} </span>
        <span class="mr-10">成功订金额: {{ summaryData.successfulOrderAmount }} </span>
        <span class="mr-10">成功率(%): {{ summaryData.successRate }}% </span>
        <span class="mr-10">商户费用: {{ summaryData.merchantFee }} </span>
      </div>

      <my-table
        class="mt-10"
        ref="my-table"
        :loadData="mockData"
        :tableData="tableData"
        :total="50"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column label="统计日期" align="center" prop="statisticDate" />
        <el-table-column label="商户名称" align="center" prop="merchantName" />
        <el-table-column label="订单数量" align="center" prop="orderCount" />
        <el-table-column label="订单金额" align="center" prop="orderAmount" />
        <el-table-column label="成功订单数" align="center" prop="successfulOrderCount" />
        <el-table-column label="成功订单金额" align="center" prop="successfulOrderAmount" />
     
        <el-table-column label="成功率" align="center" prop="successRate" />
        <el-table-column label="系统费用" align="center" prop="systemFee" />
        <el-table-column label="商户费用" align="center" prop="merchantFee" />
        
        <el-table-column label="日终余额(元)" align="center" prop="endOfDayBalance" />
      </my-table>
    </el-card>

    <el-dialog :visible.sync="dialogVisible" title="生成" width="350px">
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MerchantDailyReport',
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      tableData: [
        {
          statisticDate: 89, //	统计日期	string
          merchantName: 89, //	商户名称	string
          orderCount: 89, //	订单数量	integer
          orderAmount: 89, //	订单金额(元)	number
          successfulOrderCount: 89, //	成功订单数	integer
          successfulOrderAmount: 89, //	成功订单金额(元)	number
          successRate: 89, //	成功率(%)	number
          systemFee: 89, //	系统费用(元)	number
          merchantFee: 89, //	商户费用(元)	number
          endOfDayBalance: 89 //	日终余额(元)
        }
      ],
      dialogVisible: false,
      date: '', // 生成日期
      queryFormData: {
        merchantName: '',
        statisticDate: ''
      },
      summaryData: {
        statisticDate: 88, //	统计日期	string(date)
        merchantName: 88, //	商户名称	string
        orderCount: 88, //	订单数量	integer(int32)
        orderAmount: 88, //	订单金额(元)	number
        successfulOrderCount: 88, //	成功订单数	integer(int32)
        successfulOrderAmount: 88, //	成功订单金额(元)	number
        successRate: 88, //	成功率(%)	number
        systemFee: 88, //	系统费用(元)	number
        merchantFee: 88, //	商户费用(元)	number
        endOfDayBalance: 88 //	日终余额(元)
      }
      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    showCreateDialog() {
      this.dialogVisible = true
    },
    onDialogBtnOk() {
      this.dialogVisible = false
      console.log(this.date, '生成！')
    },
    resetQueryForm() {
      this.queryFormData = {
        merchantName: '',
        statisticDate: ''
      }
      this.mockData()
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()

      if (this.queryFormData.name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.name == this.queryFormData.name
        })
      }
      if (this.queryFormData.gender != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.gender == this.queryFormData.gender
        })
      }
      // 是否启用
      this.tableData = this.tableData.filter((item) => {
        return item.isEnable == this.queryFormData.isEnable
      })
    },
    mockData() {
      // 模拟数据
      let columnList = [
        { title: '序号', type: 'index', key: 'index', isSearch: false, id: 1000 },
        { title: '商户名称', type: 'string', key: 'merchantName', isSearch: true, id: 1001 },
        { title: '统计日期', type: 'date', key: 'statisticDate', isSearch: true, id: 1002 },
        { title: '订单数量', type: 'number', key: 'orderCount', isSearch: false, id: 1003 },
        { title: '订单金额', type: 'number', key: 'orderAmount', isSearch: false, id: 1004 },
        { title: '成功订单数', type: 'number', key: 'successfulOrderCount', isSearch: false, id: 1005 },
        {
          title: '成功订单金额',
          type: 'number',
          key: 'successfulOrderAmount',
          isSearch: false,
          id: 1006
        },
        { title: '成功率', type: 'number', key: 'successRate', isSearch: false, id: 1008 },
        { title: '系统费用', type: 'number', key: 'systemFee', isSearch: false, id: 1009 },
        { title: '商户费用', type: 'number', key: 'merchantFee', isSearch: false, id: 1010 },
        // { title: '码商费用', type: 'number', key: 'provider_cost', isSearch: false, id: 1011 },
        // { title: '平台利润', type: 'number', key: 'platform_lirun', isSearch: false, id: 1012 },
        // { title: '充值金额', type: 'number', key: 'zhongzhi_money', isSearch: false, id: 1013 },
        // { title: '提现金额', type: 'number', key: 'tixian_money', isSearch: false, id: 1014 },
        // { title: '冻结金额', type: 'number', key: 'dongjie_money', isSearch: false, id: 1015 },
        // { title: '代收押金', type: 'number', key: 'income_yajin', isSearch: false, id: 1016 },
        { title: '日终余额', type: 'number', key: 'endOfDayBalance', isSearch: false, id: 1018 }
      ]
      this.tableData = []
      new Array(10).fill(0).forEach((_, index) => {
        let ele = {}
        ele.id = Date.now() + index
        columnList.forEach((column) => {
          if (column.type == 'select') {
            ele[column.key] =
              column.options[Math.floor(Math.random() * column.options.length)].value
          } else if (column.type == 'number') {
            ele[column.key] = Math.floor(Math.random() * 40) + 10
          } else if (column.type == 'date') {
            const date = new Date()
            date.setTime(date.getTime() - Math.floor(Math.random() * 10000) * 3600 * 1000 * 24)
            ele[column.key] =
              date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          } else if (column.type == 'boolean') {
            ele[column.key] = Math.floor(Math.random() * 2) == 0 ? false : true
          } else if (
            column.type == 'index' ||
            column.type == 'operate' ||
            column.type == 'selection'
          ) {
            // 啥也不加
          } else {
            ele[column.key] = 'abc' + this.tableData.length
          }

          //
          if (column.title == '商户名称') {
            ele[column.key] = '商户' + this.tableData.length
          }
        })
        this.tableData.push(ele)
      })
    }
  },
  mounted() {
    this.mockData()
  }
}
</script>

<style lang="scss" scoped></style>
