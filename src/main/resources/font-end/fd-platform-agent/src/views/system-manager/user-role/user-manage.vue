<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="账号" prop="user_name">
          <el-input v-model="queryFormData.user_name" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="用户名称" prop="user_nick_name">
          <el-input
            v-model="queryFormData.user_nick_name"
            placeholder="请输入用户名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="是否启用" prop="is_active">
          <el-select filterable  v-model="queryFormData.is_active" placeholder="请选择是否启用" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色名称" prop="roles">
          <el-select filterable  v-model="queryFormData.roles" placeholder="请选择角色" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in rolesOptions"
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
        <el-table-column label="账号" align="center" prop="user_name" />
        <el-table-column label="用户名称" align="center" prop="user_nick_name" />
        <el-table-column label="用户类型" align="center" prop="user_nick_name" >
          <template slot-scope="{ row, $index }">
            <el-tag>类型 {{ $index+1 }} </el-tag>
          </template>


        </el-table-column>

        <el-table-column label="角色名称" align="center">
          <template slot-scope="{ row }">
            <!-- {{ rolesOptions.filter((item) => row.roles.indexOf(item.value) != -1  ).map(ele=>ele.label).join(' ') }} -->
            <!-- <el-tag :style="{margin:'5px'}" v-for="item in rolesOptions.filter((item) => row.roles.indexOf(item.value) != -1  )" :key="item.value" >{{ item.label }}</el-tag> -->
            <el-tag> {{ rolesOptions.find((item) => item.value == row.roles).label }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.is_active" />
          </template>
        </el-table-column>

        <!-- <el-table-column label="创建时间" align="center" sortable prop="create_time">
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column> -->

        <el-table-column label="创建人" align="center" prop="create_by" />
        <el-table-column label="创建时间" align="center" prop="create_time" />
        <el-table-column label="更新人" align="center" prop="update_by" />
        <el-table-column label="更新时间" align="center" prop="update_time" />


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

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改用户' : '新增用户'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号" prop="user_name">
          <el-input v-model="formData.user_name"  :disabled="isEdit"  placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="用户名称" prop="user_nick_name">
          <el-input v-model="formData.user_nick_name" placeholder="请输入用户名称" size="small" />
        </el-form-item>

        <el-form-item label="角色" prop="roles">
          <el-select filterable  v-model="formData.roles" placeholder="请选择角色" size="small">
            <!-- <el-option label="全部" value=""></el-option> -->
            <el-option
              v-for="item in rolesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注" size="small" />
        </el-form-item>

        <!-- <el-form-item label="创建时间" prop="create_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.create_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item> -->

        <el-form-item label="是否启用" prop="is_active">
          <el-switch v-model="formData.is_active" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
        <el-dialog :visible.sync="user_info_dialog" title="开户信息" width="500px">
      <div style="margin-left:50px">
        <p><span class="label">登录地址:</span><span class="text">https://112.254.236.3</span></p>
        <p>
          <span class="label">账号:</span><span class="text">{{ user_info.user_name }}</span>
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
      user_info_dialog: false,
      reset_password_dialog: false,
      formDataPassword: {
        login_code: '',
        google_key: ''
      },
      user_info: [],
      formData: {
        index: '',
        user_name: '',
        user_nick_name: '',
        is_active: '',
        login_code: '',
        google_key: '',
        roles: [],
        remark: '',
        create_time: '',
        opt: ''
      },
      queryFormData: {
        user_name: '',
        user_nick_name: '',
        is_active: '',
        roles: [],
        create_time: ''
      },
      isEdit: false // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
      // rolesOptions: [
      //   { label: '角色1', value: '1' },
      //   { label: '角色2', value: '2' },
      //   { label: '角色3', value: '3' }
      // ]
    }
  },
  computed: {
    rolesOptions() {
      return this.$store.state['gcode-state'].roleList.map((item) => {
        return {
          label: item.role_name,
          value: item.id
        }
      })
    }
  },
  methods: {
    showUserInfo(row) {
      console.log('开户信息')
      this.user_info_dialog = true
      this.user_info = row
    },
    closeResetPassword() {
      this.reset_password_dialog = false
    },
    showResetPassword(row) {
      console.log('重置密码')
      this.formDataPassword={
        login_code: '********',
        google_key: '**********'
      },
      this.reset_password_dialog = true
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除 【 ${row.user_nick_name}】 吗？`)
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
        is_active: '',
        roles: '',
        remark: '',
        create_time: '',
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
        is_active: '',
        roles: '',
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

      if (this.queryFormData.is_active != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.is_active == this.queryFormData.is_active
        })
      }

      if (this.queryFormData.roles != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.roles == this.queryFormData.roles
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
        { title: '账号', type: 'string', key: 'user_name', isSearch: true, id: 1001 },
        { title: '用户名称', type: 'string', key: 'user_nick_name', isSearch: true, id: 1002 },
        { title: '是否启用', type: 'boolean', key: 'is_active', isSearch: true, id: 1003 },
        {
          title: '角色',
          type: 'select',
          key: 'roles',
          isSearch: true,
          id: 1004,
          options: [
            { label: '角色1', value: '1' },
            { label: '角色2', value: '2' },
            { label: '角色3', value: '3' }
          ],
          optionsName: 'rolesOptions'
        },
        { title: '备注', type: 'string', key: 'remark', isSearch: false, id: 1005 },
        { title: '创建人', type: 'string', key: 'create_by', isSearch: true, id: 10012 },
        { title: '创建时间', type: 'date', key: 'create_time', isSearch: true, id: 10022 },
        { title: '更新人', type: 'string', key: 'update_by', isSearch: true, id: 10302 },
        { title: '更新时间', type: 'date', key: 'update_time', isSearch: true, id: 10042 },
        { title: '操作', type: 'operate', key: 'opt', isSearch: false, id: 1007 }
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
          if (column.title == '角色') {
            // 多选
            // ele[column.key] = this.rolesOptions.filter(ele=>{
            //   return Math.floor(Math.random() * 5) > 2
            // }).map(ele=>{
            //   return ele.value
            // })

            // 单选
            ele[column.key] =
              this.rolesOptions[Math.floor(Math.random() * this.rolesOptions.length)].value
          }else if(column.title=='用户名称'){
            ele[column.key]  = '用户名称' + this.tableData.length
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
