<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="账号" prop="username">
          <el-input v-model="queryFormData.username" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="代理名称" prop="userNickName">
          <el-input
            v-model="queryFormData.userNickName"
            placeholder="请输入代理名称"
            size="small"
          />
        </el-form-item>

        <!-- <el-form-item label="租户名称" prop="tenant_name">
          <el-input v-model="queryFormData.tenant_name" placeholder="请输入租户名称" size="small" />
        </el-form-item> -->

        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryFormData.createTime"
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

      <el-button type="primary" plain icon="el-icon-plus" @click="showCopyDialog()">复制</el-button>

      <my-table
        class="mt-10"
        ref="my-table"
        :loadData="mockData"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="账号" align="center" prop="username" />
        <el-table-column label="代理名称" align="center" prop="userNickName" />
        <el-table-column label="分润比例(%)" align="center">
          <template slot-scope="{ row }">
            {{ row.tenantProfitRate }}
            <!-- <el-tag effect="plain"  size="small" >%</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column label="租户信息" align="center" prop="tenant_info">
          <template slot-scope="{ row }">
            {{ row.tenant_info }}
            <el-button type="text" @click="look_tenent_info(row)">查看</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="租户管理员账号" align="center" prop="tenant_admin_username" />
        <el-table-column label="租户可用余额" align="center" prop="available_balance" sortable />
        <el-table-column label="租户冻结金额" align="center" prop="freeze_balance" sortable /> -->
        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>

        <!-- <el-table-column label="过期时间" align="center" sortable prop="expire_time">
          <template slot-scope="{ row }">
            {{ row.expire_time }}
          </template>
        </el-table-column> -->

        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showUserInfo(row)">
                <i class="el-icon-user" />开户信息
              </div>
              <div type="success" class="btn" @click="showResetPassword(row)">
                <i class="el-icon-brush" />重置密码
              </div>

              <el-dropdown trigger="click">
                <div type="success" class="btn">更多 <i class="el-icon-caret-bottom" /></div>
                <!-- <span class="el-dropdown-link">
                  下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </span> -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showEditDialog(row)">
                      <i class="el-icon-edit" />修改
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div type="primary" class="btn mt-5 red" @click="showConfirmDelete(row)">
                      <i class="el-icon-delete" />删除
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
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
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="formData.username"
            :disabled="isEdit"
            placeholder="账号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="代理名称" prop="userNickName">
          <el-input v-model="formData.userNickName" placeholder="请输入代理名称" size="small" />
        </el-form-item>
        <el-form-item label="分润比例" prop="tenantProfitRate">
          <el-input
            v-model="formData.tenantProfitRate"
            placeholder="请输入分润比例"
            size="small"
            @input="formData.tenantProfitRate = formData.tenantProfitRate.replace(/[^0-9]/g, '')"
          >
            <template slot="append"> % </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="tenent_info_dialog" title="租户信息" width="700px">
      <my-table
        class="mt-10"
        :tableData="tableData"
        :loadData="mockData"
        :total="50"
        style="width: 100%"
        border
        
      >
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column label="租户名称" align="center" width="180">
          <template slot-scope="{ row }">
            <div>{{ row.tenant_name }}</div>
          </template>
        </el-table-column>

        <!-- <el-table-column label="租户管理员账号" align="center" width="120">
          <template slot-scope="{ row }">{{ row.tenant_admin_username }} </template>
        </el-table-column> -->

        <el-table-column label="租户可用余额" align="center">
          <template slot-scope="{ row }">{{ row.available_balance }} </template>
        </el-table-column>

        <el-table-column label="租户冻结金额" align="center">
          <template slot-scope="{ row }">
            {{ row.freeze_balance }}
          </template>
        </el-table-column>
      </my-table>

      <div slot="footer">
        <el-button @click="tenent_info_dialog = false" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="user_info_dialog" title="开户信息" width="500px">
      <div style="margin-left: 50px">
        <p><span class="label">登录地址:</span><span class="text">https://112.254.236.3</span></p>
        <p>
          <span class="label">账号:</span><span class="text">{{ user_info.username }}</span>
        </p>
        <p><span class="label">登录密码:</span><span class="text">rxy12547896587</span></p>
        <span class="remark red">说明：登录密码为初始密码请及时登录修改</span>
        <p><el-button size="small">复制</el-button></p>
      </div>

      <div slot="footer">
        <el-button @click="user_info_dialog = false" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="reset_password_dialog" title="重置密码" width="600px">
      <el-form
        ref="form"
        :model="formDataPassword"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="登录密码" prop="login_code">
          <div class="line">
            <el-input
              v-model="formDataPassword.login_code"
              placeholder="请输入登录密码"
              size="small"
              disabled
            />
            <el-button size="small" class="el_btn">重置</el-button>
          </div>
        </el-form-item>
        <el-form-item label="谷歌密钥" prop="google_key">
          <div class="line">
            <el-input
              v-model="formDataPassword.google_key"
              placeholder="请输入谷歌密钥"
              size="small"
              disabled
            />
            <el-button size="small" class="el_btn">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="reset_password_dialog = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="closeResetPassword()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showCopyDialogVisable" title="复制租户代理" width="500px">
      <el-form
        ref="form"
        :model="copyFormData"
        :rules="myRules"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号" prop="tenant_number">
          <el-input v-model="copyFormData.tenant_number" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="代理名称" prop="tenant_name">
          <el-input v-model="copyFormData.tenant_name" placeholder="请输入代理名称" size="small" />
        </el-form-item>

        <el-form-item label="代理模板" prop="tenant_template">
          <el-select filterable  v-model="copyFormData.tenant_template" placeholder="请选择" size="small">
            <!-- <el-option :label="item.tenant_name" :value="item.id" v-for="item in tableData" :key="item.id"  ></el-option> -->
            <el-option
              v-for="i in 10"
              v-bind:key="i"
              :label="'abc' + i"
              :value="'abc' + i"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showCopyDialogVisable = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="showCopyDialogVisable = false" size="small">
          确定
        </el-button>
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
      tenent_info_tableData: [],
      dialogVisible: false,
      tenent_info_dialog: false,
      user_info_dialog: false,
      reset_password_dialog: false,
      formData: {
        user: '',
        username: '',
        tenantProfitRate: '',
        userNickName: ''
      },
      formDataPassword: {
        login_code: '',
        google_key: ''
      },
      queryFormData: {
        username: '',
        userNickName: '',
        tenant_name: '',
        createTime: ''
      },
      user_info: [],
      isEdit: false, // 是否是编辑状态
      showCopyDialogVisable: false,
      copyFormData: {
        tenant_number: '',
        tenant_name: '',
        tenant_template: ''
      }
      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    showCopyDialog() {
      this.showCopyDialogVisable = true
    },
    showUserInfo(row) {
      console.log('开户信息')
      this.user_info_dialog = true
      this.user_info = row
    },
    showResetPassword(row) {
      console.log('重置密码')
      ;(this.formDataPassword = {
        login_code: '********',
        google_key: '**********'
      }),
        (this.reset_password_dialog = true)
    },
    closeResetPassword() {
      this.reset_password_dialog = false
    },
    look_tenent_info() {
      this.tenent_info_dialog = true
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定解绑当前绑定的租户【 ${row.tenant_name} 】吗？`)
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
        user: '',
        username: '',
        tenantProfitRate: '',
        userNickName: ''
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
        username: '',
        userNickName: '',
        tenant_name: '',
        createTime: ''
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
        { title: '账号', type: 'string', key: 'username', isSearch: true, id: 1001 },
        { title: '代理名称', type: 'string', key: 'userNickName', isSearch: true, id: 1002 },
        { title: '租户信息', type: 'string', key: 'tenant_info', isSearch: true, id: 1003 },
        { title: '分润比例', type: 'string', key: 'tenantProfitRate', isSearch: true, id: 1003 },
        { title: '租户名称', type: 'string', key: 'tenant_name', isSearch: true, id: 1003 },
        {
          title: '租户管理员账号',
          type: 'string',
          key: 'tenant_admin_username',
          isSearch: false,
          id: 1004
        },
        {
          title: '租户可用余额',
          type: 'number',
          key: 'available_balance',
          isSearch: false,
          id: 1005
        },
        { title: '租户冻结金额', type: 'number', key: 'freeze_balance', isSearch: false, id: 1006 },
        { title: '是否启用', type: 'boolean', key: 'isActive', isSearch: true, id: 1012 },
        { title: '创建时间', type: 'date', key: 'createTime', isSearch: true, id: 1007 },
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
            ele[column.key] = 'abc' + this.tableData.length
          }

          // 根据 列表添加值
          if (column.title == '租户信息') {
            ele[column.key] = Math.floor(Math.random() * 40) + 10
          } else if (column.title == '代理名称') {
            ele[column.key] = '代理名称' + this.tableData.length
          } else if (column.title == '租户名称') {
            ele[column.key] = '租户名称' + this.tableData.length
          } else if (column.title == '分润比例') {
            ele[column.key] = Math.floor(Math.random() * 20) + 10
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
.red {
  color: red;
}
.label {
  font-size: 18px;
  margin-right: 10px;
  line-height: 20px;
}
.text {
  font-size: 16px;
  // color: green;
  line-height: 20px;
}
.remark {
  font-size: 12px;
}
</style>
