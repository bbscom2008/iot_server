<template>
  <div class="container">
    <div class="filter-container">
      <el-button
        style="margin-left: 10px"
        type="success"
        icon="el-icon-plus"
        @click="handleAddUser"
        size="small"
      >
        添加角色
      </el-button>
    </div>
    <el-table ref="infoTable" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="角色名称">
        <template slot-scope="{ row }">
          <span>{{ row.rolename }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色描述">
        <template slot-scope="{ row }">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="{ row }">
          {{ row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template>
          <el-button type="success" size="small" icon="el-icon-unlock"> 权限 </el-button>
          <el-button type="primary" size="small" icon="el-icon-edit">修改 </el-button>
          <el-button type="danger" size="small" icon="el-icon-delete">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageCon">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getRoleList"
        :layout="layout"
      />
    </div>
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
      <el-form
        ref="userForm"
        :rules="rules"
        :model="userForm"
        label-position="right"
        label-width="120px"
        style="width: 450px; margin-left: 20px"
      >
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="userForm.roleName" placeholder="请输入角色名称" size="small" />
        </el-form-item>
        <el-form-item label="角色描述：" prop="description">
          <el-input
            type="textarea"
            v-model="userForm.description"
            placeholder="请输入角色描述"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="handleSubmit()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, addRole } from '@/api/user'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    const validateRolename = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入角色名称'))
      } else {
        callback()
      }
    }
    const validateDescription = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入角色描述'))
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
        roleName: '',
        description: ''
      },
      layout: 'total, sizes, prev, pager, next',
      dialogFormVisible: false,
      rules: {
        roleName: [{ required: true, trigger: 'blur', validator: validateRolename }],
        description: [{ required: true, trigger: 'blur', validator: validateDescription }]
      }
    }
  },
  methods: {
    async getRoleList() {
      let ret = await getRoleList()
      this.list = ret.data
      this.total = ret.data.length
    },
    handleAddUser() {
      this.dialogFormVisible = true
    },
    handleSubmit() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          addRole(this.userForm)
            .then((ret) => {
              this.getRoleList()
              this.dialogFormVisible = false
            })
            .catch((err) => {
              console.error(err)
            })
        } else {
          return false
        }
      })
    }
  },
  mounted() {
    this.getRoleList()
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
