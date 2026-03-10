<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="平台名称" prop="platform_name">
          <el-input
            v-model="queryFormData.platform_name"
            placeholder="请输入平台名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="统计日期" prop="tongji_date">
          <el-date-picker
            v-model="queryFormData.tongji_date"
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
        <span class="mr-10">订单数量: {{summaryData.orderCount}} </span>
        <span class="mr-10">订单金额: {{summaryData.orderCount}} </span>
        <span class="mr-10">成功订单数: {{summaryData.orderCount}} </span>
        <span class="mr-10">成功订金额: {{summaryData.orderCount}} </span>
        <span class="mr-10">成功率(%): {{summaryData.orderCount}}% </span>
        <span class="mr-10">系统费用: {{summaryData.orderCount}}0 </span>
        <span class="mr-10">分润: {{summaryData.orderCount}} </span>
      </div>

      <my-table
        class="mt-10"
        ref="my-table"
        :loadData="mockData"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="统计日期" align="center" prop="tongji_date">
          <template slot-scope="{ row }">
            {{ row.tongji_date }}
          </template>
        </el-table-column>
        <el-table-column label="租户代理名称" align="center" prop="platform_name" />

        <el-table-column label="订单数量" align="center" prop="order_number" />
        <el-table-column label="订单金额(元)" align="center" prop="order_money" width="130px" />
        <el-table-column label="成功订单数" align="center" prop="succ_order_count" />
        <el-table-column
          label="成功订单金额(元)"
          align="center"
          prop="succ_order_money"
          width="160px"
        />
        <!-- <el-table-column
          label="实付金额(元)"
          align="center"
          prop="shifu_money"
          sortable
          width="130px"
        /> -->
        <el-table-column label="成功率(%)" align="center" prop="succ_lv" />
        <el-table-column label="系统费用(元)" align="center" prop="system_cost" width="130px" />
        <!-- <el-table-column
          label="商户费用(元)"
          align="center"
          prop="merchant_cost"
          sortable
          width="130px"
        />
        <el-table-column
          label="码商费用(元)"
          align="center"
          prop="provider_cost"
          sortable
          width="140px"
        /> -->

        <el-table-column label="分润比例(%)" align="center" prop="platform_lirun" width="130px" />
        <el-table-column label="分润(元)" align="center" prop="platform_lirun" width="130px" />
      </my-table>
    </el-card>

    <el-dialog :visible.sync="dialogVisible" title="生成" width="350px">
      <el-date-picker
        v-model="createdTime"
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
  name: 'PlatformDailyReport',
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
      tableData: [],
      dialogVisible: false,
      createdTime: '',
      queryFormData: {
        platform_name: '',
        tongji_date: ''
      },
      summaryData: {
        statisticDate: 99, //	统计日期	string(date)
        merchantName: 99, //	商户名称	string
        orderCount: 99, //	订单数量	integer(int32)
        orderAmount: 99, //	订单金额(元)	number
        successfulOrderCount: 99, //	成功订单数	integer(int32)
        successfulOrderAmount: 99, //	成功订单金额(元)	number
        successRate: 99, //	成功率(%)	number
        systemFee: 99, //	系统费用(元)	number
        merchantFee: 99, //	商户费用(元)	number
        endOfDayBalance: 99 //	日终余额(元)	number
      }
    }
  },
  methods: {
    showCreateDialog() {
      this.dialogVisible = true
    },
    onDialogBtnOk() {
      this.dialogVisible = false
      console.log(this.createdTime, '生成！')
    },
    resetQueryForm() {
      this.queryFormData = {
        platform_name: '',
        tongji_date: ''
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
        { title: '平台名称', type: 'string', key: 'platform_name', isSearch: true, id: 1001 },
        { title: '统计日期', type: 'date', key: 'tongji_date', isSearch: true, id: 1002 },
        { title: '订单数量', type: 'number', key: 'order_number', isSearch: false, id: 1003 },
        { title: '订单金额', type: 'number', key: 'order_money', isSearch: false, id: 1004 },
        { title: '成功订单数', type: 'number', key: 'succ_order_count', isSearch: false, id: 1005 },
        {
          title: '成功订单金额',
          type: 'number',
          key: 'succ_order_money',
          isSearch: false,
          id: 1006
        },
        { title: '实付金额', type: 'number', key: 'shifu_money', isSearch: false, id: 1007 },
        { title: '成功率', type: 'number', key: 'succ_lv', isSearch: false, id: 1008 },
        { title: '系统费用', type: 'number', key: 'system_cost', isSearch: false, id: 1009 },
        { title: '商户费用', type: 'number', key: 'merchant_cost', isSearch: false, id: 1010 },
        { title: '码商费用', type: 'number', key: 'provider_cost', isSearch: false, id: 1011 },
        { title: '平台利润', type: 'number', key: 'platform_lirun', isSearch: false, id: 1012 }
      ]
      this.tableData = []
      new Array(10).fill(0).forEach((_, index) => {
        let ele = {}
        ele.id = Date.now() + index
        columnList.forEach((column, index) => {
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
          if (column.title == '平台名称') {
            ele[column.key] = '平台' + this.tableData.length
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
