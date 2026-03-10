<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="queryFormData.role_name" placeholder="请输入角色名称" size="small" />
        </el-form-item>

        <el-form-item label="角色编码" prop="role_code">
          <el-input v-model="queryFormData.role_code" placeholder="请输入角色编码" size="small" />
        </el-form-item>

        <el-form-item label="是否启用" prop="is_active">
          <el-select v-model="queryFormData.is_active" placeholder="请选择是否启用" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
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
        :loadData="mockData"
        :total="50"
        ref="my-table"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="角色名称" align="center" prop="role_name" />
        <el-table-column label="角色编码" align="center" prop="role_code" />

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.is_active" />
          </template>
        </el-table-column>

        <el-table-column label="创建人" align="center" prop="create_by" />
        <el-table-column label="创建时间" align="center" prop="create_time" />
        <el-table-column label="更新人" align="center" prop="update_by" />
        <el-table-column label="更新时间" align="center" prop="update_time" />
        <el-table-column label="备注信息" align="center" prop="remark" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <!-- <div class="btn" @click="showPermissionDialog(row)">
                <i class="el-icon-lock" />权限
              </div> -->
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
      :title="isEdit ? '修改' : '新增'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="formData.role_name" placeholder="请输入角色名称" size="small" />
        </el-form-item>

        <el-form-item label="角色编码" prop="role_code">
          <el-input v-model="formData.role_code" placeholder="请输入角色编码" size="small" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注" size="small" />
        </el-form-item>

        <el-form-item label="是否启用" prop="is_active">
          <el-switch v-model="formData.is_active" />
        </el-form-item>

        <!-- <el-form-item label="分配权限">
          <el-tree
            :data="treeData"
            show-checkbox
            class="tree-box"
            node-key="permission"
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.meta.title }}</span>
            </span>
          </el-tree>
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="show_handle_role"
      title="分配权限"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >

        <el-form-item label="分配权限：">
          <el-radio-group v-model="checkList"   @change="roleTreeChange">
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
          >
            <span class="custom-tree-node" slot-scope="{  data }">
              <span>{{ data.meta.title }}</span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="show_handle_role = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onHandleRoleOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'gCodePreview',
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
  },
  
  data() {
    return {
      code: '',
      tableData: [],
      dialogVisible: false,
      show_handle_role: false,
      formData: {
        remark: '',
        role_name: '',
        role_code: '',
        is_active: '',
        
      },
      checkList:'select_no',
      queryFormData: {
        role_name: '',
        role_code: '',
        is_active: ''
      },
      isEdit: false, // 是否是编辑状态
      treeData: [],

      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    ...mapMutations({
      updateRole:'gcode-state/setRoleList'
    }),
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除角色 【 ${row.role_name} 】 吗？`)
        this.tableData = this.tableData.filter((item) => {
          return item.id !== row.id
        })
        //todo 调用接口删除
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },
    roleTreeChange(e){
      if(e=='select_all'){
        this.$refs.roletree.setCheckedNodes(this.treeData)
      }else{
        this.$refs.roletree.setCheckedNodes([])
      }
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    showHandleRole(row) {
      this.show_handle_role = true
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        index: '',
        role_name: '',
        role_code: '',
        is_active: '',
        opt: '',
        permission: [],
        checkList: []
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
        role_name: '',
        role_code: '',
        is_active: ''
      }
      this.mockData()
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()

      if (this.queryFormData.role_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.role_name == this.queryFormData.role_name
        })
      }

      if (this.queryFormData.role_code != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.role_code == this.queryFormData.role_code
        })
      }

      if (this.queryFormData.is_active != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.is_active == this.queryFormData.is_active
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
        { title: '角色名称', type: 'string', key: 'role_name', isSearch: true, id: 1001 },
        { title: '角色编码', type: 'string', key: 'role_code', isSearch: true, id: 1002 },

        { title: '创建人', type: 'string', key: 'create_by', isSearch: true, id: 10012 },
        { title: '创建时间', type: 'date', key: 'create_time', isSearch: true, id: 10022 },
        { title: '更新人', type: 'string', key: 'update_by', isSearch: true, id: 10302 },
        { title: '更新时间', type: 'date', key: 'update_time', isSearch: true, id: 10402 },
        { title: '备注信息', type: 'string', key: 'remark', isSearch: true, id: 10402 },

        { title: '是否启用', type: 'boolean', key: 'is_active', isSearch: true, id: 1003 },
        { title: '操作', type: 'operate', key: 'opt', isSearch: false, id: 1004 }
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
          if (column.title == '角色名称') {
            ele[column.key] = '角色' + this.tableData.length
          }
        })
        ele.permission= []
        ele.checkList= []

        this.tableData.push(ele)
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

      

        item.is_active = true

        let pp = item.path
        if (pp && pp.startsWith('/')) {
          pp = pp.substring(1)
        }

        item.permission = permission ? permission + ':' + pp : pp

        if (item.children && item.children.length > 0) {
          this.prepareData(item.children, item.permission)
        }
      })
    }
  },
  mounted() {
    this.mockData()

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

    console.log(this.treeData)
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

.tree-box{
  max-height: 300px;
  overflow: auto;
}
</style>
