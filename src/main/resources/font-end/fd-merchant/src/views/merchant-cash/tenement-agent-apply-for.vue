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
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>

      <my-table
        class="mt-10"
        :loadData="mockData"
        :tableData="tableData"
        :total="50"
        ref="my-table"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" />

        <el-table-column label="交易编号" align="center" prop="deal_number" />
        <el-table-column label="账号" align="center" prop="user_name" />
        <el-table-column label="代理名称" align="center" prop="user_nick_name" />
        <el-table-column label="提现金额" align="center" prop="withdrawal_apply_amount"  />
        <el-table-column label="提现收款信息" align="center" prop="payee_info" />
        <el-table-column label="提现说明" align="center" prop="withdrawal_apply_desc" />
        <el-table-column label="审核状态" align="center" prop="audit_status">
          <template slot-scope="{ row }">
            <el-tag v-if="row.audit_status == '审核中'" type="primary"
              >{{ row.audit_status }}
            </el-tag>
            <el-tag v-if="row.audit_status == '审核成功'" type="success"
              >{{ row.audit_status }}
            </el-tag>
            <el-tag v-if="row.audit_status == '驳回'" type="danger">{{ row.audit_status }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核说明" align="center" prop="audit_desc" />
        <el-table-column label="备注信息" align="center" prop="remark" />

        <el-table-column label="创建时间" align="center"  prop="create_time">
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column>

        <el-table-column label="更新时间" align="center"  prop="update_time">
          <template slot-scope="{ row }">
            {{ row.update_time }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" prop="action">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" icon="el-icon-edit" @click="showShenHeDialog(row)">
              审核
            </el-button>
          </template>
        </el-table-column>



      </my-table>
    </el-card>

    <el-dialog :visible.sync="dialogVisible" :title="isEdit ? '修改' : '新增'" width="600px">
      <el-form
        ref="form"
        :model="formData"
        :rules="myRules"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号" prop="user_name">
          <el-input v-model="formData.user_name" placeholder="请输入账号" size="small" disabled/>
        </el-form-item>

        <el-form-item label="可用余额(元)" prop="can_use_money">
          <el-input v-model="formData.can_use_money" placeholder="请输入可用余额" size="small" disabled/>
        </el-form-item>

        <el-form-item label="提现金额(元)" prop="withdrawal_apply_amount">
          <el-input
            v-model="formData.withdrawal_apply_amount"
            placeholder="请输入提现金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="提现收款信息" prop="payee_info">
          <el-input v-model="formData.payee_info" placeholder="请输入提现收款信息" size="small" />
        </el-form-item>

        <el-form-item label="提现说明" prop="withdrawal_apply_desc">
          <el-input
            v-model="formData.withdrawal_apply_desc"
            placeholder="请输入提现说明"
            size="small"
          />
        </el-form-item>
        <el-form-item label="交易密码" prop="pay_password">
          <el-input v-model="formData.pay_password" placeholder="请输入交易密码" size="small" />
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="google_key">
          <el-input v-model="formData.google_key" placeholder="请输入谷歌验证码" size="small" />
        </el-form-item>

        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showShenHeDialogVisual" title="提现审核" width="600px">
      <el-form
        ref="form"
        :model="formData"
        :rules="myRules"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="交易编号" prop="user_name">
          <el-input v-model="formData.user_name" placeholder="请输入交易编号" size="small" disabled />
        </el-form-item>

        <el-form-item label="用户类型" prop="payee_info">
          <el-input v-model="formData.payee_info" placeholder="请输入用户类型" disabled size="small" />
        </el-form-item>

        <el-form-item label="账号" prop="can_use_money">
          <el-input
            v-model="formData.can_use_money"
            placeholder="请输入账号"
            size="small"
            disabled
          />
        </el-form-item>

        <el-form-item label="提现金额(元)" prop="withdrawal_apply_amount">
          <el-input
            v-model="formData.withdrawal_apply_amount"
            placeholder="请输入提现金额"
            size="small"
            disabled
          />
        </el-form-item>

        

        <el-form-item label="审核说明" prop="withdrawal_apply_desc">
          <el-input
            v-model="formData.withdrawal_apply_desc"
            placeholder="请输入审核说明"
            size="small"
          />
        </el-form-item>

        <el-form-item label="交易密码" prop="pay_password">
          <el-input v-model="formData.pay_password" placeholder="请输入交易密码" size="small" />
        </el-form-item>

        <!-- <el-form-item label="谷歌验证码" prop="google_key">
          <el-input v-model="formData.google_key" placeholder="请输入谷歌验证码" size="small" />
        </el-form-item>

        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item> -->

      </el-form>
      <div slot="footer" style="text-align: center;" >
        <el-button @click="showShenHeDialogVisual = false" size="small"> 审核通过 </el-button>
        <el-button  style="margin:0 20px;"  type="primary" @click="showShenHeDialogVisual = false" size="small"> 审核驳回 </el-button>
        <el-button  @click="showShenHeDialogVisual = false" size="small"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CashApplyFor',
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
        user_name: '',
        can_use_money: '',
        withdrawal_apply_amount: '',
        payee_info: '',
        remark: '',
        pay_password: '',
        google_key: ''
      },
      queryFormData: {
        user_name: '',
        user_nick_name: '',
        deal_number: '',
        create_time: ''
      },
      isEdit: false, // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据

      showShenHeDialogVisual: false,
    }
  },
  methods: {
    showShenHeDialog(row){
      this.showShenHeDialogVisual = true
      this.formData = Object.assign({}, row)
    },
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
        user_name: 'Super Admin',
        can_use_money: '888',
        withdrawal_apply_amount: '',
        payee_info: '',
        remark: '',
        pay_password: '',
        google_key: ''
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
        user_name: '',
        user_nick_name: '',
        deal_number: '',
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

      if (this.queryFormData.user_nick_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.user_nick_name == this.queryFormData.user_nick_name
        })
      }
      if (this.queryFormData.deal_number != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.deal_number == this.queryFormData.deal_number
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
         { title: '交易编号', type: 'string', key: 'deal_number', isSearch: true, id: 1000 },
        { title: '账号', type: 'string', key: 'user_name', isSearch: true, id: 1000 },
        { title: '代理名称', type: 'string', key: 'user_nick_name', isSearch: true, id: 1001 },
        {
          title: '提现金额',
          type: 'number',
          key: 'withdrawal_apply_amount',
          isSearch: false,
          id: 1002
        },
        { title: '提现收款信息', type: 'string', key: 'payee_info', isSearch: false, id: 1003 },
        {
          title: '提现状态',
          type: 'string',
          key: 'withdrawal_apply_status',
          isSearch: false,
          id: 1004
        },
        {
          title: '提现说明',
          type: 'string',
          key: 'withdrawal_apply_desc',
          isSearch: false,
          id: 1005
        },
        { title: '审核状态', type: 'string', key: 'audit_status', isSearch: false, id: 1006 },
        { title: '审核说明', type: 'string', key: 'audit_desc', isSearch: false, id: 1007 },
        { title: '备注信息', type: 'string', key: 'remark', isSearch: false, id: 1008 },
        { title: '创建时间', type: 'date', key: 'create_time', isSearch: true, id: 1009 },
        { title: '更新时间', type: 'date', key: 'update_time', isSearch: false, id: 1010 }
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

          if (column.title == '审核状态') {
            let arr = ['审核中', '审核成功', '驳回']
            ele[column.key] = arr[Math.floor(Math.random() * 3)]
          }else if (column.title == '交易编号') {
            ele[column.key] = Math.floor(Math.random() * 9000000000000) + 1000000000000
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
