<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="产品名称" prop="merchant_name">
          <el-input
            v-model="queryFormData.merchant_name"
            placeholder="请输入商户名称"
            size="small"
          />
        </el-form-item>

        <!-- <el-form-item label="通道名称" prop="channel_name">
          <el-input
            v-model="queryFormData.channel_name"
            placeholder="请输入通道名称"
            size="small"
          />
        </el-form-item> -->

        <el-form-item label="是否启用" prop="is_active">
          <el-select filterable  v-model="queryFormData.is_active" placeholder="请选择" size="small">
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

      <el-button
        type="danger"
        :disabled="selectionRows.length == 0"
        plain
        icon="el-icon-delete"
        @click="deleteSelectRows()"
        >删除</el-button
      >

      <!-- :disabled="selectionRows.length == 0" -->
      <el-button
        type="success"
        plain
        icon="el-icon-edit-outline"
        @click="optAll(true)"
        >全部开启</el-button
      >
      <!-- :disabled="selectionRows.length == 0" -->
      <el-button
        type="success"
        plain
        icon="el-icon-edit-outline"
        @click="optAll(false)"
        >全部关闭</el-button
      >

      <my-table
        class="mt-10"
        ref="my-table"
        :tableData="tableData"
        :loadData="mockData"
        :totle="50"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>

        <!-- <el-table-column label="通道名称" align="center" prop="channel_name" >
            <template>
            {{ currItem.channel_name }}
          </template>
        </el-table-column> -->
        <el-table-column label="产品名称" align="center" prop="merchant_name"></el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.is_active" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <!-- <el-button type="success" size="small" @click="showEditDialog(row)" > <i class="el-icon-edit" />编辑 </el-button> -->
            <el-button type="text"  size="small" @click="showConfirmDelete(row)">
              <i class="el-icon-delete" />解绑
            </el-button>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改' : '新增'"
      :modal="false"
      width="600px"
    >
      <el-form
        ref="form"
        :rules="myRules"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="通道名称" prop="channelId">
          <!-- <el-input v-model="formData.channel_name" placeholder="请输入产品类型名称" size="small" /> -->
          <el-select filterable  v-model="formData.channelId" placeholder="请选择" disabled>
            <el-option
              v-for="item in [
                { label: '通道1', value: '1' },
                { label: '通道2', value: '2' }
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="productId">
          <!-- <el-input v-model="formData.merchant_name" placeholder="请输入租户名称" size="small" /> -->

          <el-select filterable  v-model="formData.productId" placeholder="请选择">
            <el-option
              v-for="item in [
                { label: '商户1', value: '1' },
                { label: '商户2', value: '2' }
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
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
  props: {
    currItem: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      code: '',
      tableData: [],
      dialogVisible: false,
      formData: {
        selection: '',
        merchant_name: '',
        channel_name: '',
        is_active: '',
        operation: ''
      },
      feeFormData: {
        value: '',
        type: 1 // 1 增加 2 减少 3 设置为
      },
      queryFormData: {
        merchant_name: '',
        // channel_name: '',
        is_active: ''
      },
      isEdit: false, // 是否是编辑状态
      selectionRows: [] // 选中的行数据
      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定解绑产品【${row.merchant_name}】吗？`)
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
      if (!row) {
        row = this.selectionRows[0]
      }
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        selection: '',
        merchant_name: '',
        channelId: this.currItem.channelName,
        is_active: '',
        operation: ''
      }
    },
    optAll(flag) {
      this.tableData = this.tableData.map((item) => {
        item.is_active = flag
        return item
      })
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
        merchant_name: '',
        // channel_name: '',
        is_active: false
      }
      this.mockData()
    },

    handleSelectionChange(val) {
      console.log(JSON.stringify(val))
      this.selectionRows = val
    },
    async deleteSelectRows() {
      try {
        await this.$confirm('确定删除选中的行吗？')
        // 删除选中的行
        this.tableData = this.tableData.filter((item1) => {
          return !this.selectionRows.find((item) => item1.id === item.id)
        })
        //todo 调用接口删除
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
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
        { title: '多选框', type: 'selection', key: 'selection', isSearch: false, id: 1000 },
        { title: '产品名称', type: 'string', key: 'merchant_name', isSearch: true, id: 1001 },
        { title: '通道名称', type: 'string', key: 'channel_name', isSearch: true, id: 1002 },
        { title: '是否启用', type: 'boolean', key: 'is_active', isSearch: true, id: 1004 },
        { title: '操作', type: 'operate', key: 'operation', isSearch: false, id: 1005 }
      ]
      this.tableData = []
      new Array(10).fill(0).forEach((_, index) => {
        let ele = {}
        ele.id = Date.now() + index
        columnList.forEach((column) => {
          // 根据类型添加值
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
          if ('产品名称' == column.title) {
            ele[column.key] = '产品名称' + this.tableData.length
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
