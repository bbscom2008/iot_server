<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="queryFormData.name" placeholder="请输入姓名" size="small" />
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input v-model="queryFormData.age" placeholder="请输入年龄" size="small" />
        </el-form-item>

        <el-form-item label="姓别" prop="gender">
          <el-select filterable  v-model="queryFormData.gender" placeholder="请选择姓别" size="small">
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isEnable">
          <el-switch v-model="queryFormData.isEnable" />
        </el-form-item>

        <el-form-item label="出生日期" prop="date">
          <el-date-picker
            v-model="queryFormData.date"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-10">
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>

      <el-button
        type="success"
        :disabled="selectionRows.length !== 1"
        plain
        icon="el-icon-edit-outline"
        @click="showEditDialog()"
        >修改</el-button
      >
      <el-button
        type="danger"
        :disabled="selectionRows.length == 0"
        plain
        icon="el-icon-delete"
        @click="deleteSelectRows()"
        >删除</el-button
      >

      <el-table
        class="mt-10"
        ref="my-table"
        :data="tableData"
        style="width: 100%"
        border
        [object
        Object]
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="年龄" align="center" prop="age" />

        <el-table-column label="姓别" align="center">
          <template slot-scope="{ row }">
            {{ genderOptions.find((item) => item.value === row.gender).label }}
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isEnable" />
          </template>
        </el-table-column>

        <el-table-column label="出生日期" align="center">
          <template slot-scope="{ row }">
            {{ parseTime(row.date, '{y}-{m}-{d}') }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button type="success" size="small" @click="showEditDialog(row)">
              <i class="el-icon-edit" />编辑
            </el-button>
            <el-button type="primary" size="small" @click="showConfirmDelete(row)">
              <i class="el-icon-delete" />删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '编辑条目' : '新增条目'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" size="small" />
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input v-model="formData.age" placeholder="请输入年龄" size="small" />
        </el-form-item>

        <el-form-item label="姓别" prop="gender">
          <el-select filterable  v-model="formData.gender" placeholder="请选择姓别" size="small">
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isEnable">
          <el-switch v-model="formData.isEnable" />
        </el-form-item>

        <el-form-item label="出生日期" prop="date">
          <el-date-picker
            v-model="formData.date"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
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
import { deepClone, parseTime } from '@/utils'
export default {
  name: 'gCodePreview',
  data() {
    return {
      code: '',
      tableData: [],
      dialogVisible: false,
      formData: {
        name: '',
        age: '',
        gender: '',
        isEnable: false,
        date: ''
      },
      queryFormData: {
        name: '',
        age: '',
        gender: '',
        isEnable: false,
        date: ''
      },
      isEdit: false, // 是否是编辑状态
      selectionRows: [], // 选中的行数据
      // 添加扩展数据，如 options 所需要的数据
      genderOptions: [
        { label: '男', value: '1' },
        { label: '女', value: '2' }
      ]
    }
  },
  methods: {
    parseTime,
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm('确定删除当前行数据吗？')
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
        name: '',
        age: '',
        gender: '',
        isEnable: '',
        date: ''
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
        name: '',
        age: '',
        gender: '',
        isEnable: false,
        date: ''
      }
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

    mockData() {
      // 模拟数据
      let columnList = [
        { title: '多选框', type: 'selection', key: '', isSearch: false, width: '55', id: 1000 },
        { title: '序号', type: 'index', key: '', isSearch: false, width: '', id: 1001 },
        { title: '姓名', type: 'string', key: 'name', isSearch: true, width: '', id: 1002 },
        { title: '年龄', type: 'number', key: 'age', isSearch: true, width: '', id: 1003 },
        {
          title: '姓别',
          type: 'select',
          isSearch: true,
          key: 'gender',
          options: [
            { label: '男', value: '1' },
            { label: '女', value: '2' }
          ],
          optionsName: 'genderOptions',
          width: '',
          id: 1004
        },
        { title: '是否启用', isSearch: true, type: 'boolean', key: 'isEnable', id: 1005 },
        { title: '出生日期', type: 'date', isSearch: true, key: 'date', width: '', id: 1006 },
        { title: '操作', type: 'operate', isSearch: false, key: '', width: '', id: 1007 }
      ]
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
            ele[column.key] = date
          } else if (column.type == 'boolean') {
            ele[column.key] = Math.floor(Math.random() * 2) == 0 ? false : true
          } else if (column.type == 'index' || column.type == 'operate') {
            // 啥也不加
          } else {
            ele[column.key] = 'abc' + this.tableData.length
            console.log('column.key : ' + column.type)
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
