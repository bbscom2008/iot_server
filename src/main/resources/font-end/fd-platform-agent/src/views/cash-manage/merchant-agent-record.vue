<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="交易编号" prop="deal_number">
          <el-input v-model="queryFormData.deal_number" placeholder="请输入交易编号" size="small" />
        </el-form-item>
        <el-form-item label="账号" prop="user_name">
          <el-input v-model="queryFormData.user_name" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="代理名称" prop="user_nick_name">
          <el-input
            v-model="queryFormData.user_nick_name"
            placeholder="请输入代理名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="业务类型" prop="business_type">
          <el-select filterable 
            v-model="queryFormData.business_type"
            placeholder="请选择业务类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="订单类" value="0"></el-option>
            <el-option label="业务类" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="账变类型" prop="change_type">
          <el-select filterable  v-model="queryFormData.change_type" placeholder="请选择账变类型" size="small">
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
        <el-form-item label="账变金额" prop="change_amount">
          <el-input
            v-model="queryFormData.change_amount"
            placeholder="请输入账变金额"
            size="small"
          />
        </el-form-item>
        <el-form-item label="系统订单号" prop="system_order_no">
          <el-input
            v-model="queryFormData.system_order_no"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="商户订单号" prop="merchant_order_no">
          <el-input
            v-model="queryFormData.merchant_order_no"
            placeholder="请输入商户订单号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="create_time">
          <el-date-picker
            v-model="queryFormData.create_time"
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
      <my-table
        class="mt-10"
        :loadData="mockData"
        :tableData="tableData"
        :total="50"
        ref="my-table"
        style="width: 100%"
        border
      >
        <el-table-column label="交易编号" align="center" prop="deal_number" />
        <el-table-column label="账号" align="center" prop="user_name" />
        <el-table-column label="代理名称" align="center" prop="user_nick_name" />

        <el-table-column label="业务类型" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.business_type == '业务类'" type="success">{{
              row.business_type
            }}</el-tag>
            <el-tag v-if="row.business_type == '订单类'" type="primary">{{
              row.business_type
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="账变类型" align="center">
          <template slot-scope="{ row }">
            {{ row.change_type }}
          </template>
        </el-table-column>
        <el-table-column label="账变金额" align="center" prop="change_amount"  />
        <el-table-column
          label="账变后账户余额"
          align="center"
          prop="balance_after_change"
        />
        <el-table-column label="系统订单号" align="center" prop="system_order_no" />
        <el-table-column label="商户订单号" align="center" prop="merchant_order_no" />
        <el-table-column label="备注信息" align="center" prop="remark" />

        <el-table-column label="创建时间" align="center"  prop="create_time">
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column>
      </my-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'merchantAgenteRecord',
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
      code: '',
      tableData: [],
      queryFormData: {
        user_name: '',
        deal_number: '',
        user_nick_name: '',
        system_order_no: '',
        merchant_order_no: '',
        change_amount: '',
        business_type: '',
        change_type: '',
        create_time: ''
      }

      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    resetQueryForm() {
      this.queryFormData = {
        user_name: '',
        deal_number: '',
        user_nick_name: '',
        system_order_no: '',
        merchant_order_no: '',
        change_amount: '',
        business_type: '',
        change_type: '',
        create_time: ''
      }
      this.mockData()
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()

      if (this.queryFormData.user_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.user_name == this.queryFormData.user_name
        })
      }
      if (this.queryFormData.deal_number != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.deal_number == this.queryFormData.deal_number
        })
      }

      if (this.queryFormData.user_nick_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.user_nick_name == this.queryFormData.user_nick_name
        })
      }

      if (this.queryFormData.business_type != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.business_type == this.queryFormData.business_type
        })
      }

      if (this.queryFormData.change_type != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.change_type == this.queryFormData.change_type
        })
      }

      if (this.queryFormData.create_time != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.create_time == this.queryFormData.create_time
        })
      }

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
        { title: '账号', type: 'string', key: 'user_name', isSearch: true, id: 1000 },
        { title: '交易编号', type: 'string', key: 'deal_number', isSearch: true, id: 1000 },
        { title: '代理名称', type: 'string', key: 'user_nick_name', isSearch: true, id: 1001 },
        { title: '业务类型', type: 'string', key: 'business_type', isSearch: true, id: 1002 },
        { title: '账变类型', type: 'string', key: 'change_type', isSearch: true, id: 1003 },
        { title: '账变金额', type: 'number', key: 'change_amount', isSearch: false, id: 1004 },
        {
          title: '账变后账户余额',
          type: 'number',
          key: 'balance_after_change',
          isSearch: false,
          id: 1005
        },
        { title: '系统订单号', type: 'string', key: 'system_order_no', isSearch: false, id: 1006 },
        {
          title: '商户订单号',
          type: 'string',
          key: 'merchant_order_no',
          isSearch: false,
          id: 1007
        },
        { title: '备注信息', type: 'string', key: 'remark', isSearch: false, id: 1008 },
        { title: '创建时间', type: 'date', key: 'create_time', isSearch: true, id: 1009 }
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
            ele[column.key] = column.title + this.tableData.length
          }

          // 根据 列表添加值
          if (column.title == 'abc') {
            ele[column.key] = 'abc' + this.tableData.length
          }
          if (column.title == '商户订单号') {
            ele[column.key] = Math.floor(Math.random() * 90000000000000) + 100000000000000
          } else if (column.title == '系统订单号') {
            ele[column.key] = Math.floor(Math.random() * 90000000000000) + 100000000000000
          } else if (column.title == '业务类型') {
            let arr = ['业务类', '订单类']
            ele[column.key] = arr[Math.floor(Math.random() * 2)]
          } else if (column.title == '账变类型') {
            let arr = [
              '充值',
              '扣款',
              '提现',
              '冲正',
              '余额划拨',
              '结算',
              '押金',
              '订单交易',
              '订单手续费',
              '下级分佣',
              '冻结',
              '解冻'
            ]
            ele[column.key] = arr[Math.floor(Math.random() * 12)]
          } else if (column.title == '账变金额') {
            ele[column.key] = Math.floor(Math.random() * 200) - 100
          } else if (column.title == '交易编号') {
            ele[column.key] = Math.floor(Math.random() * 9000000000000) +1000000000000
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
