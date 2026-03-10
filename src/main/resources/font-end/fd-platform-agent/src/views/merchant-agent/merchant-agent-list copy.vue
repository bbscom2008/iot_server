<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="代理账号" prop="user_name">
          <el-input v-model="queryFormData.user_name" placeholder="请输入代理账号" size="small" />
        </el-form-item>

        <el-form-item label="代理名称" prop="user_nick_name">
          <el-input
            v-model="queryFormData.user_nick_name"
            placeholder="请输入代理名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户账号" prop="tenant_name">
          <el-input v-model="queryFormData.tenant_name" placeholder="请输入商户账号" size="small" />
        </el-form-item>

        <el-form-item label="商户名称" prop="tenant_admin_user_name">
          <el-input
            v-model="queryFormData.tenant_admin_user_name"
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
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="代理账号" align="center" prop="user_name" />
        <el-table-column label="代理名称" align="center" prop="user_nick_name" />
        <el-table-column label="商户账号" align="center" prop="tenant_name" />
        <el-table-column label="商户名称" align="center" prop="tenant_admin_user_name" />
        <el-table-column label="商户可用余额" align="center" prop="available_balance" sortable />
        <el-table-column label="商户冻结金额" align="center" prop="freeze_balance" sortable />

        <el-table-column label="创建时间" align="center" sortable prop="create_time">
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column>

        <el-table-column label="过期时间" align="center" sortable prop="expire_time">
          <template slot-scope="{ row }">
            {{ row.expire_time }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
              <div type="primary" class="btn mt-5" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />解绑
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '编辑商户' : '新增商户'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="代理账号" prop="user_name">
          <el-input v-model="formData.user_name" :disabled="isEdit" placeholder="请输入代理账号" size="small" />
        </el-form-item>

        <el-form-item label="代理名称" prop="user_nick_name">
          <el-input v-model="formData.user_nick_name" :disabled="isEdit" placeholder="请输入代理名称" size="small" />
        </el-form-item>

        <el-form-item label="商户账号" prop="tenant_name">
          <!-- <el-input v-model="formData.tenant_name" placeholder="请输入商户账号" size="small" /> -->

          <el-select filterable 
            v-model="formData.tenant_name"
            placeholder="请选择商户"
            size="small"
          >
            <el-option
              v-for="item in tenantList"
              :key="item.id"
              :label="item.tenant_name"
              :value="item.tenant_name"
            ></el-option
          ></el-select>
        </el-form-item>


        <el-form-item label="登录密码" prop="login_code" v-if="isEdit">
          <div class="line">
            <el-input
              v-model="formData.login_code"
              placeholder="请输入登录密码"
              size="small"
              disabled
            />
            <el-button size="small" class="el_btn">重置</el-button>
          </div>
        </el-form-item>
        <el-form-item label="谷歌密钥" prop="google_key" v-if="isEdit">
          <div class="line">
            <el-input
              v-model="formData.google_key"
              placeholder="请输入谷歌密钥"
              size="small"
              disabled
            />
            <el-button size="small" class="el_btn">重置</el-button>
          </div>
        </el-form-item>
        
        <!-- <el-form-item label="商户名称" prop="tenant_admin_user_name">
          <el-input
            v-model="formData.tenant_admin_user_name"
            placeholder="请输入商户名称"
            size="small"
          />
        </el-form-item> -->

        <!-- <el-form-item v-if="isEdit" label="商户可用余额" prop="available_balance">
          <el-input
            v-model="formData.available_balance"
            disabled
            placeholder="请输入商户可用余额"
            size="small"
          />
        </el-form-item>

        <el-form-item v-if="isEdit" label="商户冻结金额" prop="freeze_balance">
          <el-input
            disabled
            v-model="formData.freeze_balance"
            placeholder="请输入商户冻结金额"
            size="small"
          />
        </el-form-item> -->

        <!-- <el-form-item label="创建时间" prop="create_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.create_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="过期时间" prop="expire_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.expire_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item> -->
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
  computed: {
    tenantList() {
      return this.tableData.map((item) => {
        return {
          id: item.id,
          tenant_name: item.tenant_name
        } 
      })
    }

  },
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
        user_name: '',
        user_nick_name: '',
        tenant_name: '',
        tenant_admin_user_name: '',
        available_balance: '',
        freeze_balance: '',
        login_code: '',
        google_key: '',
        create_time: '',
        expire_time: '',
        opt: ''
      },
      queryFormData: {
        user_name: '',
        user_nick_name: '',
        tenant_name: '',
        tenant_admin_user_name: '',
        create_time: ''
      },
      isEdit: false // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定解绑 【 ${row.tenant_name} 】 吗？`)
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
      
      let linshi = {
        ...row,
        merchant_key: '********',
        login_code: '********',
        google_key: '********'
      }

      this.formData = Object.assign({}, linshi)

    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        index: '',
        user_name: '',
        user_nick_name: '',
        tenant_name: '',
        tenant_admin_user_name: '',
        available_balance: '',
        freeze_balance: '',
        create_time: '',
        expire_time: '',
        opt: ''
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
        tenant_name: '',
        tenant_admin_user_name: '',
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

      if (this.queryFormData.tenant_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.tenant_name == this.queryFormData.tenant_name
        })
      }

      if (this.queryFormData.tenant_admin_user_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.tenant_admin_user_name == this.queryFormData.tenant_admin_user_name
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
        { title: '代理账号', type: 'string', key: 'user_name', isSearch: true, id: 1001 },
        { title: '代理名称', type: 'string', key: 'user_nick_name', isSearch: true, id: 1002 },
        { title: '商户账号', type: 'string', key: 'tenant_name', isSearch: true, id: 1003 },
        {
          title: '商户名称',
          type: 'string',
          key: 'tenant_admin_user_name',
          isSearch: true,
          id: 1004
        },
        {
          title: '商户可用余额',
          type: 'number',
          key: 'available_balance',
          isSearch: false,
          id: 1005
        },
        { title: '商户冻结金额', type: 'number', key: 'freeze_balance', isSearch: false, id: 1006 },
        { title: '创建时间', type: 'date', key: 'create_time', isSearch: true, id: 1007 },
        { title: '过期时间', type: 'date', key: 'expire_time', isSearch: false, id: 1008 },
        { title: '操作', type: 'operate', key: 'opt', isSearch: false, id: 1009 }
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

<style lang="scss" scoped>

.line {
  display: flex;
  flex-direction: row;
  align-items: center;
  .el_btn {
    margin-left: 5px;
    width: 40px;
    padding: 6px;
  }
}

</style>
