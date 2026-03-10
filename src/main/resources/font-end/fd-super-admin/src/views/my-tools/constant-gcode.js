export const ColumnType = {
  index: 'index',
  string: 'string',
  number: 'number',
  select: 'select', // 下拉框
  selection: 'selection', // 多选框
  date: 'date',
  boolean: 'boolean',
  checkbox: 'checkbox',
  image: 'image',
  operate: 'operate'
}

const isHaveSelectionColumn = (columns) => {
  return columns.find((item) => {
    return item.type === ColumnType.selection
  })
}
/**
 * 是否需要 选择时间段
 * @param {} columns
 * @returns
 */
const isNeedPickerOptions = (columns) => {
  return columns.find((item) => {
    return item.type === ColumnType.date && item.isSearch
  })
}

const generateIndexColumn = (row) => {
  return `<el-table-column label="${row.title}" align="center" type="index" width="${
    row.width ? row.width : 60
  }" />
    `
}

const generateStringColumn = (row) => {
  return `<el-table-column label="${row.title}" align="center" prop="${row.key}" ${
    row.width ? 'width="' + row.width + '"' : ''
  } />
    `
}

const generateNumberColumn = (row) => {
  return `<el-table-column label="${row.title}" align="center" prop="${row.key}" ${
    row.width ? 'width="' + row.width + '"' : ''
  }   />
    `
}

const generateSelectColumn = (item) => {
  return `
    <el-table-column label="${item.title}" align="center"  >
      <template slot-scope="{ row }">
        {{ ${item.optionsName}.find((item) => item.value === row.${item.key}).label }}
      </template>
    </el-table-column>
`
}

const generateDateColumn = (row) => {
  return `
        <el-table-column label="${row.title}" align="center" ${
  row.width ? 'width="' + row.width + '"' : ''
}  prop="${row.key}" >
          <template slot-scope="{ row }">
            {{ row.${row.key} }}
          </template>
        </el-table-column>
  `
}

const generateOperateColumn = (row) => {
  // <el-button type="success" size="small" @click="showEditDialog(row)" > <i class="el-icon-edit" />编辑 </el-button>
  // <el-button type="primary" size="small" @click="showConfirmDelete(row)">
  // <i class="el-icon-delete" />删除
  // </el-button>
/*
 <el-button type="text" size="mini" @click="showEditDialog(row)"> <i class="el-icon-edit" />修改 </el-button>
              <el-button type="text" size="mini"  @click="showConfirmDelete(row)"> <i class="el-icon-delete" />删除 </el-button>
*/
  return `
      <el-table-column align="center" label="${row.title}">
        <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn"  @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
              <div type="primary" class="btn mt-5"   @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
             
            </div>

        </template>
      </el-table-column>
    `
}

const generateBooleanColumn = (row) => {
  const code = `
    <el-table-column label="${row.title}" align="center" ${row.width ? 'width="' + row.width + '"' : ''}>
      <template slot-scope="{ row }">
        <el-switch v-model="row.${row.key}" />
      </template>
    </el-table-column>

    `
  return code
}

const generateColunmnCode = (config) => {
  let code = ''
  config.forEach((item) => {
    switch (item.type) {
      case ColumnType.index:
        code += generateIndexColumn(item)
        break
      case ColumnType.string:
        code += generateStringColumn(item)
        break
      case ColumnType.number:
        code += generateNumberColumn(item)
        break
      case ColumnType.select:
        code += generateSelectColumn(item)
        break
      case ColumnType.date:
        code += generateDateColumn(item)
        break
      case ColumnType.boolean:
        code += generateBooleanColumn(item)
        break
      case ColumnType.operate:
        code += generateOperateColumn(item)
        break
      case ColumnType.selection:
        code += `
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        `
        break
    }
  })

  return code
}

export const generateTableCode = (config) => {
  const colunmCode = generateColunmnCode(config)
  const code =
`
  <my-table class="mt-10" :loadData="mockData" :tableData="tableData"  :total="50" ref="my-table" style="width: 100%" border  ${isHaveSelectionColumn(config) ? `@selection-change="handleSelectionChange"` : ''}  >
    ${colunmCode}    
  </my-table>
`

  return code
}

/**
 *
 * @param {Array} config 列的配置
 * @param {String} formName formData 或者 queryFormData 的名称
 * @returns
 */
const generateFormItems = (config, formName) => {
  let code = ''
  config.forEach((item) => {
    if (formName === 'queryFormData' && !item.isSearch) {
      return
    }

    switch (item.type) {
      case ColumnType.string:
        code += `
    <el-form-item label="${item.title}" prop="${item.key}">
      <el-input v-model="${formName}.${item.key}" placeholder="请输入${item.title}" size="small" />
    </el-form-item>
  `
        break
      case ColumnType.number:
        code += `
    <el-form-item label="${item.title}" prop="${item.key}">
      <el-input v-model="${formName}.${item.key}" placeholder="请输入${item.title}" size="small" />
    </el-form-item>
        `
        break
      case ColumnType.select:
        // 此处不能把每一个 option 都生成一个 el-option 标签，而是使用 v-for 循环生成
        // 生成的代码如下：

        let selectAll = ''
        if(formName == 'queryFormData'){ // 搜索栏 添加 全部
          selectAll = `<el-option  label="全部" value=""></el-option>`
        }

        code += `
      <el-form-item label="${item.title}" prop="${item.key}">
        <el-select filterable  v-model="${formName}.${item.key}" placeholder="请选择${item.title}" size="small">
          ${selectAll}
          <el-option v-for="item in ${item.optionsName}" :key="item.value"  :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
          `
        break
      case ColumnType.boolean:
        if (formName === 'formData') {
          code += `
        <el-form-item label="${item.title}" prop="${item.key}">
          <el-switch v-model="${formName}.${item.key}" />
        </el-form-item>
            `
        } else {
          // queryFormData
          code += `
          <el-form-item label="${item.title}" prop="${item.key}">
            <el-select filterable  v-model="${formName}.${item.key}" placeholder="请选择${item.title}" size="small">
              <el-option label="全部" value=""></el-option>  
              <el-option label="启用" :value="true"></el-option>
              <el-option label="禁用" :value="false"></el-option>
            </el-select>
          </el-form-item>
          `
        }
        break
      case ColumnType.date:
        if (formName === 'formData') {
          code += `
          <el-form-item label="${item.title}" prop="${item.key}">
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="${formName}.${item.key}" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
              `
        } else {
          code += `
          <el-form-item label="${item.title}" prop="${item.key}">
            <el-date-picker
              v-model="${formName}.${item.key}"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="myPickerOptions"
            >
            </el-date-picker>
          </el-form-item>
    `
        }

        break
    }
  })
  return code
}

const generateDialogCode = (config) => {
  const code =
`
    <el-dialog :visible.sync="dialogVisible" :title="isEdit ? '编辑条目' : '新增条目'" width="600px">
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        ${generateFormItems(config, 'formData')}
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
`

  return code
}

const resetFilterForm = (configFilter) => {
  const code = configFilter.map((item) => {
    // if(item.type == 'boolean'){
    //   return `${item.key} : true,`
    // }else{
    return `${item.key} : '',`
    // }
  }).join('\n')

  return code
}

const resetQueryForm = (config) => {
  const configFilter = config.filter((item) => item.isSearch && item.key)
  return resetFilterForm(configFilter)
}

const resetFormData = (config) => {
  const configFilter = config.filter((item) => item.key)
  return resetFilterForm(configFilter)
}

const generatequeryTableData = (config) => {
  const queryColumn = config.filter((item) => item.isSearch && item.key)

  return queryColumn.map(item => {
    return `if (this.queryFormData.${item.key} != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.${item.key} == this.queryFormData.${item.key}
        })
      }
    `
  }).join('\n')
}

export const generateVueCode = (config) => {
  const code =
  `
<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        ${generateFormItems(config, 'queryFormData')}
        <el-form-item>
          <el-button type="primary"  size="small" icon="el-icon-search" @click="queryTableData" >搜索</el-button>
          <el-button  size="small" icon="el-icon-refresh" @click="resetQueryForm"  >重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-10">
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>
      ${
  isHaveSelectionColumn(config) ? `
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
        ` : ''
}
      ${generateTableCode(config)}
    </el-card>

    ${generateDialogCode(config)}
  </div>
</template>

<script>

export default {
  name: 'gCodePreview',
  data() {
    return {
    ${
  isNeedPickerOptions(config) ? `pickerOptions: {
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
      },` : ``
}
      code: '',
      tableData: [],
      dialogVisible: false,
      formData: {
        ${resetFormData(config)}
      },
      queryFormData: {
        ${resetQueryForm(config)}
      },
      isEdit: false, // 是否是编辑状态
      ${isHaveSelectionColumn(config) ? `selectionRows: [], // 选中的行数据` : ''}
      // 添加扩展数据，如 options 所需要的数据
      ${
  config.filter((item) => {
    return item.type == 'select'
  }).map((item) => {
    if (!item.optionsName) {
      return ''
    } else {
      return `            ${item.optionsName}: ${JSON.stringify(item.options)},`
    }
  }).join('\n')
}
    }
  },
  methods: {
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(\`确定删除 【 \${ row } 】 吗？\`)
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
    ${isHaveSelectionColumn(config) ? `
      if (!row) {
        row = this.selectionRows[0]
      }` : ''}
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        ${
  config.map((item) => {
    if (!item.key) {
      return ''
    } else {
      return `            ${item.key} : '',`
    }
  }).join('\n')
}
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
      }else{
        // 新增
        this.formData.id = Date.now() 
        this.tableData.push(this.formData)
      }
    },
    resetQueryForm(){
      this.queryFormData = {
        ${resetQueryForm(config)}
      }
      this.mockData()
    },
    ${isHaveSelectionColumn(config) ? `
      
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
      ` : ''}
    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()
      
      ${generatequeryTableData(config)}

      if (this.queryFormData.name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.name == this.queryFormData.name
        })
      }
      if (this.queryFormData.gender != '') {
        this.tableData = this.tableData.filter((item) => {
          return (
            item.gender == this.queryFormData.gender
          )
        })
      }
      // 是否启用
      this.tableData = this.tableData.filter((item) => {
        return (
          item.isEnable == this.queryFormData.isEnable
        )
      })
    },
    mockData(){
      // 模拟数据
      let columnList = ${JSON.stringify(config)}
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
            const date = new Date();
            date.setTime(date.getTime() -  Math.floor(Math.random() * 10000) * 3600 * 1000 * 24);
            ele[column.key] = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          } else if (column.type == 'boolean') {
            ele[column.key] = Math.floor(Math.random() * 2) == 0 ? false : true
          } else if (column.type == 'index' || column.type == 'operate' || column.type == 'selection') {
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

<style lang="scss" scoped></style>

  `

  return code
}
