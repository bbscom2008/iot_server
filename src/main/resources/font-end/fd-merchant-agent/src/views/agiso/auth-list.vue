<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="收款信息名称" prop="name">
          <el-input v-model="queryFormData.name" placeholder="请输入收款信息名称" size="small" />
        </el-form-item>

        <el-form-item label="商户UID" prop="merchant_uid">
          <el-input v-model="queryFormData.merchant_uid" placeholder="请输入商户UID" size="small" />
        </el-form-item>

        <el-form-item label="授权状态" prop="status">
          <el-select v-model="queryFormData.status" placeholder="请选择授权状态" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
        <el-table-column label="码商账号" align="center" prop="account" />
        <el-table-column label="收款信息名称" align="center" prop="name" />
        <el-table-column label="支付宝码商账号" align="center" prop="alipay_account" />
        <el-table-column label="APPID" align="center" prop="appid" />
        <el-table-column label="商户UID" align="center" prop="merchant_uid" />

        <el-table-column label="授权状态" align="center">
          <template slot-scope="{ row }">
            {{ statusOptions.find((item) => item.value === row.status).label }}
          </template>
        </el-table-column>
        <el-table-column label="授权token" align="center" prop="token" />

        <el-table-column label="创建时间" align="center" prop="create_time">
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column>

        <el-table-column label="更新时间" align="center" prop="update_time">
          <template slot-scope="{ row }">
            {{ row.update_time }}
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
        <el-form-item label="码商账号" prop="account">
          <el-input v-model="formData.account" placeholder="请输入码商账号" size="small" />
        </el-form-item>

        <el-form-item label="收款信息名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入收款信息名称" size="small" />
        </el-form-item>

        <el-form-item label="支付宝码商账号" prop="alipay_account">
          <el-input
            v-model="formData.alipay_account"
            placeholder="请输入支付宝码商账号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="APPID" prop="appid">
          <el-input v-model="formData.appid" placeholder="请输入APPID" size="small" />
        </el-form-item>

        <el-form-item label="商户UID" prop="merchant_uid">
          <el-input v-model="formData.merchant_uid" placeholder="请输入商户UID" size="small" />
        </el-form-item>

        <el-form-item label="授权状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择授权状态" size="small">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="授权token" prop="token">
          <el-input v-model="formData.token" placeholder="请输入授权token" size="small" />
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

        <el-form-item label="更新时间" prop="update_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.update_time"
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
        account: '',
        name: '',
        alipay_account: '',
        appid: '',
        merchant_uid: '',
        status: '',
        token: '',
        create_time: '',
        update_time: ''
      },
      queryFormData: {
        name: '',
        merchant_uid: '',
        status: '',
        create_time: ''
      },
      isEdit: false, // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
      statusOptions: [
        { label: '成功', value: '0' },
        { label: '失败', value: '1' }
      ]
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
        account: '',
        name: '',
        alipay_account: '',
        appid: '',
        merchant_uid: '',
        status: '',
        token: '',
        create_time: '',
        update_time: ''
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
        name: '',
        merchant_uid: '',
        status: '',
        create_time: ''
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

      if (this.queryFormData.merchant_uid != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.merchant_uid == this.queryFormData.merchant_uid
        })
      }

      if (this.queryFormData.status != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.status == this.queryFormData.status
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
        { title: '码商账号', type: 'string', key: 'account', isSearch: false, id: 1001 },
        { title: '收款信息名称', type: 'string', key: 'name', isSearch: true, id: 1002 },
        {
          title: '支付宝码商账号',
          type: 'string',
          key: 'alipay_account',
          isSearch: false,
          id: 1003
        },
        { title: 'APPID', type: 'string', key: 'appid', isSearch: false, id: 1004 },
        { title: '商户UID', type: 'string', key: 'merchant_uid', isSearch: true, id: 1005 },
        {
          title: '授权状态',
          type: 'select',
          key: 'status',
          isSearch: true,
          id: 1006,
          options: [
            { label: '成功', value: '0' },
            { label: '失败', value: '1' }
          ],
          optionsName: 'statusOptions'
        },
        { title: '授权token', type: 'string', key: 'token', isSearch: false, id: 1007 },
        { title: '创建时间', type: 'date', key: 'create_time', isSearch: true, id: 1008 },
        { title: '更新时间', type: 'date', key: 'update_time', isSearch: false, id: 1009 }
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
