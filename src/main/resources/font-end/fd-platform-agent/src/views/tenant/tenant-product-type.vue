<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="产品类型名称" prop="productTypeId">
          <el-input
            v-model="queryFormData.productTypeId"
            placeholder="请输入产品类型名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="交易类型" prop="tradeType">
          <el-select filterable  v-model="queryFormData.tradeType" placeholder="请选择交易类型" size="small">
            <el-option
              v-for="item in tradeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <!-- <el-switch v-model="queryFormData.isActive" /> -->
          <el-select filterable  v-model="queryFormData.isActive" placeholder="请选择" size="small">
            <el-option label="全部" :value="undefined"></el-option>
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
        ref="my-table"
        :loadData="mockData"
        :total="50"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="产品类型名称" align="center" prop="productTypeName" />

        <el-table-column label="交易类型" align="center">
          <template slot-scope="{ row }">
            {{  row.tradeType}}
          </template>
        </el-table-column>
        <el-table-column label="收银台模板" align="center" prop="cashTempleId" />

        <el-table-column label="是否为静态支付信息" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isPaymentInfoStatic" />
          </template>
        </el-table-column>

        <el-table-column label="是否为自动确认订单" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isAutoConfirmOrder" />
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" />
          </template>
        </el-table-column>

        <el-table-column label="备注信息" align="center" prop="remark" />

        <el-table-column label="创建时间" align="center"  prop="createTime">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>

        <el-table-column label="更新时间" align="center"  prop="updateTime">
          <template slot-scope="{ row }">
            {{ row.updateTime }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <!-- <el-button type="success" size="small" @click="showEditDialog(row)">
              <i class="el-icon-edit" />编辑
            </el-button>
            <el-button type="primary" size="small" @click="showConfirmDelete(row)">
              <i class="el-icon-delete" />删除
            </el-button> -->

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
      :title="isEdit ? '修改' : '新增产品类型'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="myRules"
        label-position="right"
        label-width="160px"
        style="margin-right: 100px"
      >
        <el-form-item label="产品类型名称" prop="productTypeName">
          <el-input
            v-model="formData.productTypeName"
            placeholder="请输入产品类型名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="交易类型" prop="tradeType">
          <el-select filterable  v-model="formData.tradeType" placeholder="请选择交易类型" size="small">
            <el-option label="代收" value="0"></el-option>
            <el-option label="代付" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收银台模板" prop="cash_page_template"  v-if="formData.tradeType=='0'"  >
          <el-select filterable 
            v-model="formData.cash_page_template"
            placeholder="请选择收银台模板"
            size="small"
          >
            <el-option
              v-for="item in 3"
              :key="item"
              :label="'模板' + item"
              :value="'模板' + item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收款信息类型" prop="incomeType"  v-if="formData.tradeType=='1'"  >
          <el-select filterable 
            v-model="formData.incomeType"
            placeholder="请选择收款信息类型"
            size="small"
          >
            <el-option label="收款链接" :value="0" ></el-option>
            <el-option label="图片base64" :value="1" ></el-option>
            <el-option label="文本信息json" :value="2" ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="是否为静态支付信息" prop="isPaymentInfoStatic">
          <el-switch v-model="formData.isPaymentInfoStatic" />
        </el-form-item>

        <el-form-item label="是否为自动确认订单" prop="isAutoConfirmOrder">
          <el-switch v-model="formData.isAutoConfirmOrder" />
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>

        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item>

        <!-- <el-form-item label="创建时间" prop="create_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.create_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="更新时间" prop="update_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.update_time"
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
      code: '',
      tableData: [],
      dialogVisible: false,
      formData: {
        productTypeId: '',
        tradeType: '',
        cash_page_template: '',
        isPaymentInfoStatic: false,
        isAutoConfirmOrder: false,
        isActive: false,
        remark: '',
        incomeType:0, // 收款信息类型
        create_time: '',
        update_time: '',
        newColumn: ''
      },
      queryFormData: {
        productTypeId: '',
        tradeType: '',
        isActive: false
      },
      isEdit: false, // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
      tradeTypeOptions: [
        { label: '全部', value: '' },
        { label: '代收', value: '0' },
        { label: '代付', value: '1' }
      ]
    }
  },
  methods: {
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除产品类型 【 ${row.productTypeId} 】吗？`)
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
        productTypeId: '',
        tradeType: '',
        cash_page_template: '',
        is_payment_info_static: '',
        is_auto_confirm_order: '',
        incomeType:0, // 收款信息类型
        is_active: '',
        isPaymentInfoStatic: '',
        isAutoConfirmOrder: '',
        isActive: '',
        remark: '',
        create_time: '',
        update_time: '',
        newColumn: ''
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
        let now = new Date()
        this.formData.create_time = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
        this.formData.update_time = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
        this.tableData.push(this.formData)
      }
    },
    resetQueryForm() {
      this.queryFormData = {
        productTypeId: '',
        tradeType: '',
        isActive: true
      }
      this.mockData()
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()

      if (this.queryFormData.productTypeId != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.name == this.queryFormData.productTypeId
        })
      }
      if (this.queryFormData.tradeType != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.tradeType == this.queryFormData.tradeType
        })
      }
      if (this.queryFormData.isActive != undefined) {
        // 是否启用
        this.tableData = this.tableData.filter((item) => {
          return item.isActive == this.queryFormData.isActive
        })
      }

      console.log('this.tableData.length : ' + this.tableData.length)
    },
    mockData() {
      // 模拟数据
      let columnList = [
        { title: '序号', type: 'index', key: 'index', isSearch: false, id: 1000 },
        {
          title: '产品类型名称',
          type: 'string',
          key: 'productTypeName',
          isSearch: true,
          id: 1001
        },
        {
          title: '交易类型',
          type: 'select',
          key: 'tradeType',
          isSearch: true,
          id: 1002,
          options: [
            { label: '代收', value: '0' },
            { label: '代付', value: '1' }
          ],
          optionsName: 'tradeTypeOptions'
        },
        {
          title: '收银台模板',
          type: 'string',
          key: 'cashTempleId',
          isSearch: false,
          id: 1003
        },
        {
          title: '是否为静态支付信息',
          type: 'boolean',
          key: 'isPaymentInfoStatic',
          isSearch: false,
          id: 1004
        },
        {
          title: '是否为自动确认订单',
          type: 'boolean',
          key: 'isAutoConfirmOrder',
          isSearch: false,
          id: 1005
        },
        { title: '是否启用', type: 'boolean', key: 'isActive', isSearch: true, id: 1006 },
        { title: '备注信息', type: 'string', key: 'remark', isSearch: false, id: 1007 },
        { title: '创建时间', type: 'date', key: 'createTime', isSearch: false, id: 1008 },
        { title: '更新时间', type: 'date', key: 'updateTime', isSearch: false, id: 1009 },
        { id: 1010, title: '操作', type: 'operate', key: 'newColumn', isSearch: false }
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
            ele[column.key] = 'abc' + this.tableData.length
          }

          // 根据 列表添加值
          if (column.title == '产品类型名称') {
            ele[column.key] = ele[column.key] = '产品类型名称' + this.tableData.length
          }else if(column.title == '交易类型') {
            ele[column.key] = ele[column.key] = '交易类型' + this.tableData.length
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
