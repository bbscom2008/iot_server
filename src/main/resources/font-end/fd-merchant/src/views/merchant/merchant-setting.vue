<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <!-- <el-form-item label="商户名称" prop="merchant_name">
          <el-input v-model="queryFormData.merchant_name" placeholder="请输入商户名称" size="small" />
        </el-form-item> -->

        <el-form-item label="通道名称" prop="channel_name">
          <el-input
            v-model="queryFormData.channel_name"
            placeholder="请输入通道名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="是否启用" prop="is_active">
          <el-select v-model="queryFormData.is_active" placeholder="请选择" size="small">
            <el-option  label="全部" value=""></el-option>
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

      <!-- :disabled="selectionRows.length == 0" -->
      <el-button
        type="success"
        plain
        icon="el-icon-edit-outline"
        @click="optFee()"
        >费率调整</el-button
      >

      <my-table
        class="mt-10 my-table "
        ref="my-table"
        :tableData="tableData"
        :loadData="mockData"
        :totle="50"
        :data="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <!-- <el-table-column label="商户名称" align="center" prop="merchant_name" >
          <template>
            {{ currItem.merchant_nickname  }}
          </template>

        </el-table-column> -->

        <el-table-column label="通道名称" align="center" prop="channel_name" />
        <el-table-column label="商户费率" align="center">
          <template slot-scope="{ row }">
            <el-input v-model="row.system_fee" >
              <template slot="append"> % </template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="单笔费用" align="center">
          <template slot-scope="{ row }">
            <el-input v-model="row.single_fee" >
              <template slot="append"> 元 </template>
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="代理分润比例" align="center">
          <template slot-scope="{ row }">
            <el-input v-model="row.agent_fee_lv" >
              <template slot="append"> % </template>
            </el-input>
          </template>
        </el-table-column>

        <!-- <el-form-item label="代理费率" prop="agent_fee_lv">
          <el-input v-model="formData.agent_fee_lv" placeholder="请输入费率" size="small" >
            <template slot="append"> % </template>
          </el-input>
        </el-form-item> -->

        <el-table-column label="是否启用" align="center" width="90px" >
          <template slot-scope="{ row }">
            <el-switch v-model="row.is_active" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <!-- <el-button type="success" size="small" @click="showEditDialog(row)" > <i class="el-icon-edit" />编辑 </el-button> -->
            <el-button type="text" size="small" @click="showConfirmDelete(row)">
              <i class="el-icon-delete" />删除
            </el-button>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改通道' : '配置通道'"
      :modal="false"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="商户名称" prop="merchant_name">
          <!-- <el-input v-model="formData.merchant_name" placeholder="请输入租户名称" size="small" /> -->

          <el-select v-model="formData.merchant_name" placeholder="请选择" disabled>
            <el-option
              v-for="item in [{label: '商户1', value: '1'}, {label: '商户2', value: '2'}]"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通道名称" prop="channel_name">
          <!-- <el-input v-model="formData.channel_name" placeholder="请输入产品类型名称" size="small" /> -->
          <el-select v-model="formData.channel_name" placeholder="请选择">
            <el-option
              v-for="item in [{label: '通道1', value: '1'}, {label: '通道2', value: '2'}]"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商户费率" prop="system_fee">
          <el-input v-model="formData.system_fee" placeholder="请输入商户费率" size="small" >
            <template slot="append"> % </template>
          </el-input>
        </el-form-item>

        <el-form-item label="代理分润比例" prop="system_fee">
          <el-input v-model="formData.system_fee" placeholder="请输入代理分润比例" size="small" >
            <template slot="append"> % </template>
          </el-input>
        </el-form-item>

        <el-form-item label="单笔费用" prop="single_fee">
          <el-input v-model="formData.single_fee" placeholder="请输入费用金额" size="small" >
          </el-input>
        </el-form-item>

        <!-- <el-form-item label="代理费率" prop="agent_fee_lv">
          <el-input v-model="formData.agent_fee_lv" placeholder="请输入费率" size="small" >
            <template slot="append"> % </template>
          </el-input>
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

    <el-dialog :visible.sync="feeDialogVisible" :modal="false" title="调整费率" width="400px">
      <el-form
        ref="form"
        :model="feeFormData"
        label-position="right"
        label-width="80px"
       
      >
        <el-form-item label="调整值" prop="value" style="margin-right: 110px;" >
          <el-input v-model="feeFormData.value" placeholder="请输入费率" size="small" >
            <template slot="append"> % </template>
          </el-input>
        </el-form-item>

        <el-form-item label="调整类型" prop="type">
          

          <el-radio-group v-model="feeFormData.type">
            <el-radio class="mt-10" :label="3">设置为当前值 <div class="red_tip" >例如：输入2 ，无论之前费率是多少，都会调整为 2%</div></el-radio>
            
            <el-radio class="mt-10" :label="1">全部增加当前值 <div class="red_tip" >例如：输入2 ，之前的费率是 5%，会调整为 7%</div></el-radio>
            
            <el-radio class="mt-10" :label="2">全部减少当前值 <div class="red_tip" >例如：输入2 ，之前的费率是 5%，会调整为 3%</div></el-radio>
            
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="feeDialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="optFeeBtnOk()" size="small"> 确定 </el-button>
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
      feeDialogVisible: false,
      formData: {
        selection: '',
        merchant_name: '',
        channel_name: '',
        system_fee: '',
        single_fee: '', // 单笔费率
        is_active: '',
        operation: ''
      },
      feeFormData: {
        value: '',
        type: 1 // 1 增加 2 减少 3 设置为
      },
      queryFormData: {
        // merchant_name: '',
        channel_name: '',
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
        console.log(this.currItem,"---------------")
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        selection: '',
        merchant_name: this.currItem.merchant_nickname,
        channel_name: '',
        system_fee: '',
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
    optFee() {
      this.feeDialogVisible = true
    },
    optFeeBtnOk() {
      this.tableData = this.tableData.map((item) => {
        if (feeFormData.type == 1) {
          item.system_fee += feeFormData.value
        } else if (feeFormData.type == 2) {
          item.system_fee -= feeFormData.value
        } else {
          item.system_fee = feeFormData.value
        }
        item.system_fee = item.system_fee < 0 ? 0 : item.system_fee
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
        // merchant_name: '',
        channel_name: '',
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
        { title: '商户名称', type: 'string', key: 'merchant_name', isSearch: true, id: 1001 },
        { title: '通道名称', type: 'string', key: 'channel_name', isSearch: true, id: 1002 },
        { title: '商户费率', type: 'string', key: 'system_fee', isSearch: false, id: 1003 },
        { title: '代理费率', type: 'number', key: 'agent_fee_lv', isSearch: false, id: 10013 },
        { title: '单笔费用', type: 'number', key: 'single_fee', isSearch: false, id: 1003 },
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
          if (column.title == '商户费率') {
            ele[column.key] = ele[column.key] = Math.floor(Math.random() * 3) + 2 
          }else if('单笔费用' == column.title){
            ele[column.key] = ele[column.key] = Math.floor(Math.random() * 200)+30 
          }else if('商户名称' ==column.title ){
            ele[column.key]  ="商户名称"+this.tableData.length
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

::v-deep .my-table .el-input-group__append{
  padding: 0 10px;
}

</style>
