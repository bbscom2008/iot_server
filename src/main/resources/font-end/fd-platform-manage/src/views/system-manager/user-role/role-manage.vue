<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        :rules="queryRules"
        ref="queryFormData"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryFormData.roleName" placeholder="请输入角色名称" size="small" />
        </el-form-item>

        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="queryFormData.roleCode" placeholder="请输入角色编码" size="small" />
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select v-model="queryFormData.isActive" placeholder="请选择是否启用" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
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
        :tableData="tableData"
        :loadData="getRolePage"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="角色名称" align="center" prop="roleName" />
        <el-table-column label="角色编码" align="center" prop="roleCode" />

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" @change="enableChange(row)" />
          </template>
        </el-table-column>

        <el-table-column label="创建人" align="center" prop="createBy" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="更新人" align="center" prop="updateBy" />
        <el-table-column label="更新时间" align="center" prop="updateTime" />
        <el-table-column label="备注信息" align="center" prop="remark" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div class="btn mt-5" @click="showHandleRole(row)">
                <i class="el-icon-s-help" />分配权限
              </div>
              <div class="btn" @click="showEditDialog(row)"><i class="el-icon-edit" />修改</div>
              <div class="btn mt-5" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      @close="btnCancel"
      :title="isEdit ? '修改角色' : '新增角色'"
      width="600px"
    >
      <el-form
        ref="formData"
        :model="formData"
        label-position="right"
        :rules="rules"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" size="small" />
        </el-form-item>

        <el-form-item label="角色编码" prop="roleCode" :rules="roleCodeRules">
          <el-input v-model="formData.roleCode" placeholder="请输入角色编码" size="small" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="btnCancel" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="show_handle_role" title="分配权限" width="600px">
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="分配权限：">
          <el-radio-group v-model="checkList" @change="roleTreeChange">
            <el-radio label="select_all">全选</el-radio>
            <el-radio label="select_no">全不选</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="">
          <el-tree
            ref="roletree"
            :data="treeData"
            show-checkbox
            class="tree-box"
            node-key="permission"
            :expand-on-click-node="false"
            :default-checked-keys="selectTreeNode"
            @check="check"
          >
            <span class="custom-tree-node" slot-scope="{ data }">
              <span>{{ data.meta.title }}</span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onHandleRoleClose" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onHandleRoleOk" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import {
  getRolePage,
  systemRoleAdd,
  systemRoleUpdate,
  systemRoleDelete,
  assignPermissions,
  systemRoleEnable,
  checkRoleCode,
  getRolePermissionCode,
  deleteRolePermission
} from '@/api/system-manager'
import { sysMangerRules, queryRules } from '../rules.js'
import { codeRule } from '@/utils/validate'
export default {
  name: 'RoleManage',
  computed: {
    ...mapGetters(['permission_routes'])
  },
  watch: {
    tableData: {
      handler(val) {
        this.updateRole(val)
      },
      deep: true,
      immediate: true
    },
    show_handle_role(newValue, oldValue) {
      if (!newValue) {
        this.$refs.roletree.setCheckedNodes([])
        this.checkList = ''
      }
    }
  },

  data() {
    return {
      queryRules: queryRules,
      rules: sysMangerRules,
      roleCodeRules: [
        { required: true, message: '请输入角色编码', trigger: 'blur' },
        codeRule,
        {
          validator: async (rule, value, callback) => {
            console.log(value)
            if (this.roleCodeFlag == value) {
              return
            }
            let res = await checkRoleCode(value, { tenantId: this.tenantId })
            if (res.data) {
              callback(new Error('角色编码已存在'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      tableData: [],
      dialogVisible: false,
      show_handle_role: false,
      formData: {
        roleName: '',
        roleCode: '',
        isActive: ''
      },
      checkList: '',
      queryFormData: {
        roleName: '',
        roleCode: '',
        isActive: ''
      },
      roleCodeFlag: '',
      roleId: '',
      isEdit: false, // 是否是编辑状态
      treeData: [],
      permissionCodeList: [],
      selectPermissionId: [], //保存返回的节点--保存ID----方便删除
      selectTreeNode: [], //选择的节点
      selectAllNode: [], //全部节点
      selectFlag: false
      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    check(checkedNodes, checkedKeys) {
      this.checkList = ''
      this.selectFlag = true
      console.log(checkedNodes, '-------checkedNodes---------')
      console.log(JSON.stringify(checkedKeys.checkedKeys), '-------checkedKeys---------')
      this.permissionCodeList = checkedKeys.checkedKeys
    },
    async getRolePage(page) {
      let res = await getRolePage({ ...this.queryFormData, tenantId: this.tenantId }, { ...page })
      console.log(res)
      this.tableData = res.data.list
      return res
    },
    async enableChange(row) {
      try {
        let res = await systemRoleEnable(row.roleId, {
          isActive: row.isActive,
          tenantId: this.tenantId
        })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.$refs.tableRef.getTableData()
    },
    btnCancel() {
      console.log('----btnCancel----')
      this.dialogVisible = false
      this.$refs.formData.resetFields()
    },
    ...mapMutations({
      updateRole: 'gcode-state/setRoleList'
    }),
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除角色 【 ${row.roleName} 】 吗？`)
        let res = await systemRoleDelete(row.roleId)
        console.log(res, '删除成功')
        this.$refs.tableRef.getTableData(1)
      } catch (e) {
        console.log('取消删除')
      }
    },
    roleTreeChange(e) {
      this.selectFlag = false
      if (e == 'select_all') {
        this.$refs.roletree.setCheckedNodes(this.treeData)
        this.permissionCodeList = this.selectAllNode
      } else {
        this.$refs.roletree.setCheckedNodes([])
        this.permissionCodeList = []
      }
    },
    async onHandleRoleOk() {
      let permissionCodeList = []
      if (!this.selectFlag && this.checkList == 'select_all') {
        this.permissionCodeList = this.selectAllNode
      } else if (!this.selectFlag && this.checkList == 'select_no') {
        this.permissionCodeList = []
      } else if (!this.selectFlag) {
        this.permissionCodeList = this.selectTreeNode
      }
      this.permissionCodeList.forEach((item) => {
        if (item == 'https://github.com/PanJiaChen/vue-element-admin') {
          return
        }
        let obj = {}

        obj.rolePermissionId = ''
        this.selectPermissionId.forEach((ele) => {
          if (item == ele.permissionCode) {
            obj.rolePermissionId = ele.rolePermissionId
          }
        })
        // obj.roleId = this.roleId
        obj.permissionCode = item
        // obj.rolePermissionId = ''
        permissionCodeList.push(obj)
      })
      let res = await assignPermissions({ roleId: this.roleId, permissionCodeList })
      // if (res.data) {
      //   let ret = await deleteRolePermission({ rolePermissionIdList: this.selectPermissionId })
      // }
      this.show_handle_role = false
      this.selectFlag = false
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
      this.roleCodeFlag = this.formData.roleCode
    },
    onHandleRoleClose() {
      this.show_handle_role = false
      this.selectFlag = false
      this.selectTreeNode = []
    },
    async showHandleRole(row) {
      this.show_handle_role = true
      this.roleId = row.roleId
      let res = await getRolePermissionCode(this.roleId)
      this.selectPermissionId = res.data
      this.selectTreeNode = res.data.map((item) => item.permissionCode)
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        roleName: '',
        roleCode: '',
        isActive: 1
      }
    },
    onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            //修改
            const { roleName, roleCode, roleId, isActive } = this.formData
            let res = await systemRoleUpdate({
              roleName,
              roleCode,
              roleId,
              isActive,
              tenantId: this.tenantId
            })
            console.log(res, '编辑')
          } else {
            //新增
            let res = await systemRoleAdd({ ...this.formData, tenantId: this.tenantId })
            console.log(res, '添加')
          }
          this.btnCancel()
          this.$refs.tableRef.getTableData(1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetQueryForm() {
      this.queryFormData = {
        roleName: '',
        roleCode: '',
        isActive: ''
      }
      this.$refs.tableRef.getTableData(1)
      this.$refs.queryFormData.resetFields()
    },
    queryTableData() {
      this.$refs.queryFormData.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    },

    prepareData(data, per) {
      let index = 1
      let permission = ''
      if (per && per != '/') {
        permission = per
      }

      data.forEach((item) => {
        // 添加 isShowMenu 字段, 判断是否显示当前菜单
        item.isHideMenu = false
        item.index = index++

        item.isActive = 1

        let pp = item.path
        if (pp && pp.startsWith('/')) {
          pp = pp.substring(1)
        }

        item.permission = permission ? pp : pp
        if (pp) {
          this.selectAllNode.push(pp)
        }

        if (item.children && item.children.length > 0) {
          this.prepareData(item.children, item.permission)
        }
      })
    }
  },
  mounted() {
    console.log('---------this.permission_routes')
    this.treeData = this.permission_routes.filter((item) => !item.hidden)

    // 预处理treeData
    this.prepareData(this.treeData)

    this.treeData = this.treeData.map((item) => {
      if (item.children && item.children.length == 1) {
        return item.children[0]
      } else {
        return item
      }
    })

    console.log(this.treeData, 'this.treeData')
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.tree-box {
  max-height: 300px;
  overflow: auto;
}
</style>
