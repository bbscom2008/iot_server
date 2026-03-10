<template>
  <div class="container">
    <div>vue 代码生成 工具</div>
    <div class="main">
      <div class="left-tool mr-10">
        <div class="tool-box mb-20">
          <el-button type="primary" @click="generateCode()">生成代码</el-button>
          <el-button type="primary" @click="addRow()">添加列</el-button>
        </div>

        <el-table :data="columnList" border fit highlight-current-row style="width: 100%">
          <el-table-column label="序号" align="center" type="index" width="60" />
          <el-table-column label="开启搜索" align="center">
            <template #default="{ row }">
              <el-switch
                :disabled="!row.key"
                v-model="row.isSearch"
                @change="(e) => onSwitchChange(e, row)"
              />
            </template>
          </el-table-column>

          <el-table-column align="center" label="列名">
            <template #default="{ row }">
              <el-input v-model="row.title"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="类型">
            <template #default="{ row }">
              <!-- <span>{{ row.type }}</span> -->
              <el-select v-model="row.type" placeholder="请选择">
                <el-option
                  v-for="item in Object.values(ColumnType)"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="字段名">
            <template #default="{ row }">
              <el-input v-model="row.key"></el-input>
            </template>
          </el-table-column>
          <el-table-column width="110" align="center" label="opt">
            <template #default="{ row }">
              <i class="el-icon-plus" @click="addRow(row)" style="padding: 5px" />
              <i class="el-icon-delete" @click="deleteRow(row)" style="padding: 5px" />
              <i
                v-if="row.type == 'select'"
                class="el-icon-edit"
                @click="editSelectRow(row)"
                style="padding: 5px"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="right-panel">
        <el-tabs v-model="activeName" type="card" @tab-click="tabsChange">
          <el-tab-pane label="vue文件" name="first">
            <!-- <pre class="code">{{ vueCode }}</pre> -->
            <el-input type="textarea" v-model="vueCode" style="width: 100%; height: 100%">
            </el-input>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      title="添加下拉框的options选项"
      width="600px"
      custom-class="option-dialog"
    >
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="变量名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入" size="small" />
        </el-form-item>
        <el-form-item label="选项数组" prop="name">
          <!-- <el-input type="textarea" v-model="formData.options" rows="10" /> -->

          <el-table
            :data="formData.options"
            border
            fit
            highlight-current-row
            style="width: 100%; line-height: 10px"
          >
            <el-table-column align="center" label="label">
              <template #default="{ row }">
                <el-input v-model="row.label"></el-input>
              </template>
            </el-table-column>

            <el-table-column align="center" label="value">
              <template #default="{ row }">
                <el-input v-model="row.value"></el-input>
              </template>
            </el-table-column>

            <el-table-column width="90" align="center" label="opt">
              <template #default="{ row }">
                <i class="el-icon-delete" @click="deleteOptionsRow(row)" style="padding: 5px" />
                <i class="el-icon-plus" @click="addOptionsRow(row)" style="padding: 5px" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ColumnType, generateVueCode } from './constant-gcode'
import { mapState } from 'vuex'
export default {
  name: 'VueTemplateTools',
  computed: {
    ...mapState({
      columnList: (state) => state['gcode-state'].columnList
    }),
    ColumnType() {
      return ColumnType
    }
  },
  data() {
    return {
      activeName: 'first',
      vueCode: '',
      dialogVisible: false,
      editRow: {}, // 编辑的行
      formData: {
        name: '',
        options: [
          {
            label: '',
            value: ''
          }
        ]
      }
    }
  },
  methods: {
    onSwitchChange(e, row) {
      console.log(e)
      console.log(JSON.stringify(row))
    },
    tabsChange(tab, event) {
      console.log(tab, event)
    },
    generateCode() {
      const code = generateVueCode(this.columnList)
      this.$store.state['gcode-state'].columnList = this.columnList
      
      this.vueCode = code
    },
    deleteRow(row) {
      let index = this.columnList.findIndex((item) => item.id === row.id)
      this.columnList.splice(index, 1)
    },
    addRow(item) {
      let index = 0
      if (item) {
        index = this.columnList.findIndex((row) => item.id === row.id)
      } else {
        index = this.columnList.length - 1
      }
      this.columnList.splice(index + 1, 0, {
        id: this.columnList[this.columnList.length - 1].id + 1,
        title: '新列',
        type: ColumnType.string,
        key: 'newColumn',
        isSearch: true
      })
    },
    deleteOptionsRow(row) {
      let index = this.formData.options.findIndex((item) => item.value === row.value)
      if (index !== -1) {
        this.formData.options.splice(index, 1)
      } else {
        console.error('未找到该元素')
      }
    },
    addOptionsRow() {
      this.formData.options.push({
        label: '',
        value: ''
      })
    },
    editSelectRow(row) {
      this.dialogVisible = true
      this.editRow = row
      this.formData = {
        name: row.key + 'Options',
        options: row.options ?? [{ label: '', value: '' }]
      }
      console.log(JSON.stringify(row))
    },
    onBtnOk() {
      this.dialogVisible = false
      this.editRow.options = this.formData.options
      this.editRow.optionsName = this.formData.name
    }
  },
  mounted() {
    // 由 my-table 组件自己加载数据
    // this.getDataList()
    // 为 column 添加ID
    this.columnList.forEach((item, index) => {
      item.id = 1000 + index
    })
  }
}
</script>

<style lang="scss">
.option-dialog {
  .el-table--medium td {
    padding: 0 0;
  }

  .el-table__row {
    .cell {
      padding: 0 !important;
    }
  }

  .el-icon-plus:hover,
  .el-icon-delete:hover {
    color: red;
    cursor: pointer;
  }
}
</style>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: calc(100vh - 130px);
}
.main {
  display: flex;
  height: 100%;
  .left-tool {
    width: 800px;
    height: 100%;
    background: #ccc;
    padding: 10px;

    .el-icon-edit:hover,
    .el-icon-plus:hover,
    .el-icon-delete:hover {
      color: red;
      cursor: pointer;
    }
  }
  .right-panel {
    flex: 1;
    height: 100%;
    background: #ccc;

    ::v-deep .el-textarea__inner {
      height: 100%;
      background-color: #1f1f1f;
      color: #fff;
    }
  }
  ::v-deep .el-tab-pane {
    height: calc(100vh - 200px);
    padding: 0 20px;
  }
}
</style>
