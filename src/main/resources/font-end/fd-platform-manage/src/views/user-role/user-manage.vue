<template>
  <div class="container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-search" @click="handleRefresh" size="small">
        刷新
      </el-button>
      <el-button
        style="margin-left: 10px"
        type="success"
        size="small"
        icon="el-icon-plus"
        @click="handleAddUser"
      >
        添加管理员
      </el-button>
    </div>
    <el-table ref="infoTable" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录名">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色" min-width="120px">
        <template slot-scope="{ row }">
          <el-tag v-for="(item, id) of row.roles" :key="id" style="margin-left: 10px">
            {{ item.roleName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="{ row }">
          <el-tag :type="row.status == '1' ? 'success' : 'info'">
            {{ row.status == '1' ? '启用中' : '未启用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="绑定Google验证码" width="200px">
        <template slot-scope="{ row }">
          <el-checkbox
            :checked="row.isBindGoogleCode == '1' ? true : false"
            style="margin-left: 15px"
          >
            {{ row.isBindGoogleCode == '1' ? '已绑定' : '未绑定' }}
          </el-checkbox>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="备注" width="200px">
        <template slot-scope="{ row }">
          {{ row.comment }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建人">
        <template slot-scope="{ row }">
          {{ row.createBy }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="{ row }">
          {{ row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="190px">
        <template>
          <el-button type="success" size="small" icon="el-icon-user-solid"> 角色 </el-button>
          <el-button type="primary" size="small" icon="el-icon-edit">修改 </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审计">
        <template>
          <el-button type="danger" size="small" icon="el-icon-document-checked"> 审计 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageCon">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getUserList"
        :layout="layout"
      />
    </div>
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form
        ref="userForm"
        :rules="rules"
        :model="userForm"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="用户名：" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入用户名" size="small" />
        </el-form-item>
        <el-form-item label="选择用户类型：" prop="userType">
          <el-select
            v-model="userForm.userType"
            placeholder="请选择"
            @change="selectChange"
            size="small"
          >
            <el-option label="平台用户" value="platformUser" />
            <el-option label="普通商户" value="normalUser" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码：" prop="password" v-if="whichUser == 'normalUser'">
          <el-input v-model="userForm.password" placeholder="请输入密码" size="small" />
        </el-form-item>
        <el-form-item label="再次输入密码：" prop="passwordAgain" v-if="whichUser == 'normalUser'">
          <el-input v-model="userForm.passwordAgain" placeholder="请再次输入密码" size="small" />
        </el-form-item>
        <el-form-item label="备注：" prop="remark" v-if="whichUser == 'normalUser'">
          <el-input v-model="userForm.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item>
        <el-form-item label="二级域名：" prop="secondDomain" v-if="whichUser == 'platformUser'">
          <el-input v-model="userForm.secondDomain" placeholder="请输入二级域名" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="handleSubmit('userForm')" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList } from '@/api/user'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validateUsertype = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择用户类型'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validatePasswordagain = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请再次输入密码'))
      } else {
        callback()
      }
    }
    const validateRemark = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入备注信息'))
      } else {
        callback()
      }
    }
    const validateSeconddomain = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入备注信息'))
      } else {
        callback()
      }
    }
    return {
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      userForm: {
        userName: '',
        userType: 'platformUser',
        password: '',
        passwordAgain: '',
        remark: '',
        secondDomain: ''
      },
      layout: 'total, sizes, prev, pager, next',
      dialogFormVisible: false,
      rules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        userType: [{ required: true, trigger: 'blur', validator: validateUsertype }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        passwordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordagain }],
        remark: [{ required: true, trigger: 'blur', validator: validateRemark }],
        secondDomain: [{ required: true, trigger: 'blur', validator: validateSeconddomain }]
      },
      whichUser: 'platformUser'
    }
  },
  methods: {
    async getUserList() {
      let ret = await getUserList()
      this.list = ret.data
      this.total = ret.data.length
    },
    handleAddUser() {
      this.dialogFormVisible = true
    },
    selectChange(e) {
      this.whichUser = e
    },
    handleRefresh() {
      this.showLoading('刷新中，请稍候..')
      this.getUserList()
    },
    handleSubmit(userForm) {
      this.$refs[userForm].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    }
  },
  mounted() {
    this.getUserList()
  }
}
</script>

<style lang="scss" scoped>
.container {
  .pageCon {
    display: flex;
    justify-content: center;
  }
  ::v-deep .el-dialog {
    width: 30% !important;
  }
}
</style>
