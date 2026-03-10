<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="商户订单号" prop="merchant_order_no">
          <el-input
            v-model="queryFormData.merchant_order_no"
            placeholder="请输入商户订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户用户名" prop="merchant_user_name">
          <el-input
            v-model="queryFormData.merchant_user_name"
            placeholder="请输入商户用户名"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户名称" prop="merchant_name">
          <el-input
            v-model="queryFormData.merchant_name"
            placeholder="请输入商户名称"
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
      <!-- <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button> -->

      <my-table
        class="mt-10"
        :loadData="mockData"
        :tableData="tableData"
        :total="50"
        ref="my-table"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="商户订单号" align="center" prop="merchant_order_no" />
        <el-table-column label="商户号" align="center" prop="merchant_num" />
        <el-table-column label="商户用户名" align="center" prop="merchant_user_name" />
        <el-table-column label="商户名称" align="center" prop="merchant_name" />
        <el-table-column label="通道名称" align="center" prop="channel_name" />
        <el-table-column label="订单金额" align="center" prop="order_money" />
        <el-table-column label="异常说明" align="center" prop="expect_info" />

        <el-table-column label="创建时间" align="center" prop="create_time">
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '编辑条目' : '新增条目'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="商户订单号" prop="merchant_order_no">
          <el-input
            v-model="formData.merchant_order_no"
            placeholder="请输入商户订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户号" prop="merchant_num">
          <el-input v-model="formData.merchant_num" placeholder="请输入商户号" size="small" />
        </el-form-item>

        <el-form-item label="商户用户名" prop="merchant_user_name">
          <el-input
            v-model="formData.merchant_user_name"
            placeholder="请输入商户用户名"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户名称" prop="merchant_name">
          <el-input v-model="formData.merchant_name" placeholder="请输入商户名称" size="small" />
        </el-form-item>

        <el-form-item label="通道名称" prop="channel_name">
          <el-input v-model="formData.channel_name" placeholder="请输入通道名称" size="small" />
        </el-form-item>

        <el-form-item label="订单金额" prop="order_money">
          <el-input v-model="formData.order_money" placeholder="请输入订单金额" size="small" />
        </el-form-item>

        <el-form-item label="异常说明" prop="expect_info">
          <el-input v-model="formData.expect_info" placeholder="请输入异常说明" size="small" />
        </el-form-item>

        <el-form-item label="创建时间" prop="create_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.create_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
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
export default {
  name: 'gCodePreview',
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
      dialogVisible: false,
      formData: {
        index: '',
        merchant_order_no: '',
        merchant_num: '',
        merchant_user_name: '',
        merchant_name: '',
        channel_name: '',
        order_money: '',
        expect_info: '',
        create_time: ''
      },
      queryFormData: {
        merchant_order_no: '',
        merchant_user_name: '',
        merchant_name: '',
        create_time: ''
      },
      isEdit: false // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除 【 ${row} 】 吗？`)
        this.tableData = this.tableData.filter((item) => {
          return item.id !== row.id
        })
        //todo 调用接口删除
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        index: '',
        merchant_order_no: '',
        merchant_num: '',
        merchant_user_name: '',
        merchant_name: '',
        channel_name: '',
        order_money: '',
        expect_info: '',
        create_time: ''
      }
    },
    onDialogBtnOk() {
      this.dialogVisible = false
      if (this.isEdit) {
        // 编辑
        this.tableData = this.tableData.map((item) => {
          if (item.id === this.formData.id) {
            return this.formData
          }
          return item
        })
      } else {
        // 新增
        this.formData.id = Date.now()
        this.tableData.push(this.formData)
      }
    },
    resetQueryForm() {
      this.queryFormData = {
        merchant_order_no: '',
        merchant_user_name: '',
        merchant_name: '',
        create_time: ''
      }
      this.mockData()
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()

      if (this.queryFormData.merchant_order_no != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.merchant_order_no == this.queryFormData.merchant_order_no
        })
      }

      if (this.queryFormData.merchant_user_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.merchant_user_name == this.queryFormData.merchant_user_name
        })
      }

      if (this.queryFormData.merchant_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.merchant_name == this.queryFormData.merchant_name
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
        { title: '序号', type: 'index', key: 'index', isSearch: false, id: 1000 },
        { title: '商户订单号', type: 'string', key: 'merchant_order_no', isSearch: true, id: 1001 },
        { title: '商户号', type: 'string', key: 'merchant_num', isSearch: false, id: 1002 },
        {
          title: '商户用户名',
          type: 'string',
          key: 'merchant_user_name',
          isSearch: true,
          id: 1003
        },
        { title: '商户名称', type: 'string', key: 'merchant_name', isSearch: true, id: 1004 },
        { title: '通道名称', type: 'string', key: 'channel_name', isSearch: false, id: 1005 },
        { title: '订单金额', type: 'number', key: 'order_money', isSearch: false, id: 1006 },
        { title: '异常说明', type: 'string', key: 'expect_info', isSearch: false, id: 1007 },
        { title: '创建时间', type: 'date', key: 'create_time', isSearch: true, id: 1008 }
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
