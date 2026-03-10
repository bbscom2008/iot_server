<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="用户名称" prop="user_name">
          <el-input v-model="queryFormData.user_name" placeholder="请输入用户名称" size="small" />
        </el-form-item>

        <el-form-item label="用户昵称" prop="user_nick_name">
          <el-input
            v-model="queryFormData.user_nick_name"
            placeholder="请输入用户昵称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="是否启用" prop="is_active">
          <el-select v-model="queryFormData.is_active" placeholder="请选择是否启用" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色" prop="roles">
          <el-select v-model="queryFormData.roles" placeholder="请选择角色" size="small">
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
        <el-table-column label="支付宝账号" align="center" prop="ali_user_name" />
        <el-table-column label="支付宝名称" align="center" prop="ali_pay_name" />
        <el-table-column label="APPID" align="center" prop="app_id" />
        <el-table-column label="应用名称" align="center" prop="app_name" />

        <!-- <el-table-column label="应用名称" align="center" prop="user_name" /> -->
        <!-- <el-table-column label="支付宝公钥" align="center" prop="user_name" /> -->

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.is_active" active-text="开启" inactive-text="关闭" />
          </template>
        </el-table-column>

        <!-- <el-table-column label="密钥" align="center" prop="user_nick_name" />
        <el-table-column label="证书" align="center" prop="user_nick_name" />

        <el-table-column label="角色" align="center">
          <template slot-scope="{ row }">
            <el-tag :style="{margin:'5px'}" v-for="item in rolesOptions.filter((item) => row.roles.indexOf(item.value) != -1  )" :key="item.value" >{{ item.label }}</el-tag>
          </template>
        </el-table-column> -->

        <el-table-column label="备注" align="center" prop="remark" />

        <el-table-column label="创建时间" align="center"  prop="create_time">
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
              <div type="primary" class="btn mt-5" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '编辑支付宝码商' : '新增支付宝码商'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="支付宝账号" prop="ali_user_name">
          <el-input v-model="formData.ali_user_name" placeholder="请输入码商名称" size="small" />
        </el-form-item>

        <el-form-item label="支付宝名称" prop="ali_pay_name">
          <el-input v-model="formData.ali_pay_name" placeholder="请输入码商昵称" size="small" />
        </el-form-item>

        <el-form-item label="APPID" prop="app_id">
          <el-input v-model="formData.app_id" placeholder="请输入码商昵称" size="small" />
        </el-form-item>

        <el-form-item label="应用名称" prop="app_name">
          <el-input v-model="formData.app_name" placeholder="请输入码商昵称" size="small" />
        </el-form-item>
        <el-form-item label="应用私钥" prop="app_s_key">
          <el-input v-model="formData.app_s_key" placeholder="请输入码商昵称" size="small" />
        </el-form-item>

        <el-form-item label="认证类型" prop="key_type">
          <!-- 0 - 密钥   -- 输入支付宝公钥        1- 证书   上传：  应用证书， 支付宝公钥证书   支付宝根证书       -->
          <!-- <el-input v-model="formData.user_nick_name" placeholder="请输入码商昵称" size="small" /> -->

          <el-radio-group v-model="formData.key_type">
            <el-radio label="0">密钥</el-radio>
            <el-radio label="1">证书</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.key_type == 0" label="支付宝公钥" prop="ali_p_key">
          <el-input v-model="formData.ali_p_key" placeholder="请输入支付宝公钥" size="small" />
        </el-form-item>

        <el-form-item v-if="formData.key_type == 1" label="应用证书" prop="app_p_key_cert">
          <el-upload class="upload-demo" action="#" :auto-upload="false">
            <!-- :on-preview="handlePreview" -->
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item v-if="formData.key_type == 1" label="支付宝公钥证书" prop="app_s_key">
          <el-upload class="upload-demo" action="#" :auto-upload="false">
            <!-- :on-preview="handlePreview" -->
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="formData.key_type == 1" label="支付宝根证书" prop="app_s_key">
          <el-upload class="upload-demo" action="#" :auto-upload="false">
            <!-- :on-preview="handlePreview" -->
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="是否启用" prop="is_active">
          <el-switch v-model="formData.is_active" />
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
        user_name: '',
        user_nick_name: '',
        is_active: '',
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
      this.formData = Object.assign({}, row)
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
        { title: '支付宝账号', type: 'string', key: 'ali_user_name', isSearch: true, id: 1002 },
        { title: '支付宝名称', type: 'string', key: 'ali_pay_name', isSearch: true, id: 1003 },
        { title: 'APPID', type: 'string', key: 'app_id', isSearch: true, id: 1004 },
        { title: '应用名称', type: 'string', key: 'app_name', isSearch: true, id: 1005 },
        { title: '应用私钥', type: 'string', key: 'app_s_key', isSearch: true, id: 10601 },
        { title: '认证类型', type: 'string', key: 'key_type', isSearch: true, id: 10702 },
        { title: '支付宝公钥', type: 'string', key: 'ali_p_key', isSearch: true, id: 10802 },
        { title: '应用公钥证书', type: 'string', key: 'app_p_key_cert', isSearch: true, id: 10902 },
        {
          title: '支付宝公钥证书',
          type: 'string',
          key: 'ali_p_key_cert',
          isSearch: true,
          id: 101102
        },
        { title: '支付宝根证书', type: 'string', key: 'ali_root_cert', isSearch: true, id: 101202 },

        { title: '是否启用', type: 'boolean', key: 'is_active', isSearch: true, id: 101303 },

        { title: '备注', type: 'string', key: 'remark', isSearch: false, id: 101405 },
        { title: '创建时间', type: 'date', key: 'create_time', isSearch: true, id: 101506 },
        { title: '操作', type: 'operate', key: 'opt', isSearch: false, id: 101607 }
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
            ele[column.key] = this.rolesOptions
              .filter((ele) => {
                return Math.floor(Math.random() * 5) > 2
              })
              .map((ele) => {
                return ele.value
              })
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
