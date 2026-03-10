<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="产品名称" prop="product_name">
          <el-input
            v-model="queryFormData.product_name"
            placeholder="请输入产品名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="产品类型" prop="product_type_id">
          <el-select
            v-model="queryFormData.product_type_id"
            placeholder="请选择产品类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="产品类型1" value="1"></el-option>
            <el-option label="产品类型2" value="2"></el-option>
            <el-option label="产品类型3" value="3"></el-option>
            <el-option label="产品类型4" value="4"></el-option>
          </el-select>
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
        :loadData="mockData"
        :tableData="tableData"
        :total="50"
        ref="my-table"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column label="产品名称" align="center" prop="product_name" />

        <el-table-column label="产品类型" align="center">
          <template slot-scope="{ row }">
            {{ row.product_type_id }}
          </template>
        </el-table-column>

        <el-table-column label="收银台页面模板" align="center" width="140">
          <template slot-scope="{ row }">
            {{ row.cash_page_templ_id }}
          </template>
        </el-table-column>

        <el-table-column label="浮动金额设置" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" @click="showFloatDialog(row)">设置</el-button>
          </template>
        </el-table-column>

        <!-- <el-table-column label="是否开启浮动" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.is_float_enable"  />
          </template>
        </el-table-column>

        <el-table-column label="浮动最大值" align="center" sortable>
          <template slot-scope="{ row }">
            {{ row.is_float_enable ? row.float_max : '---' }}
          </template>
        </el-table-column>
        <el-table-column label="浮动最小值" align="center" sortable>
          <template slot-scope="{ row }">
            {{ row.is_float_enable ? row.float_min : '---' }}
          </template>
        </el-table-column>
        <el-table-column label="浮动排除值" align="center" sortable>
          <template slot-scope="{ row }">
            {{ row.is_float_enable ? row.float_exclude : '---' }}
          </template>
        </el-table-column>

        <el-table-column label="是否允许浮动重复" align="center" width="140">
          <template slot-scope="{ row }">
            <el-switch v-if="row.is_float_enable" v-model="row.float_allow_duplicate" />
            <el-switch v-if="!row.is_float_enable" :v-model="'false'" />
          </template>
        </el-table-column> -->

        <el-table-column label="订单超时时间" align="center">
          <template slot-scope="{ row }">
            <!-- {{ row.order_expire_time }} -->
            <el-tag type="success"> {{ row.order_expire_time }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="备注类型" align="center">
          <template slot-scope="{ row }">
            {{ row.transfer_remark_type }}
          </template>
        </el-table-column>

        <el-table-column label="自动类型" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.auto_type == true ? '自动' : '手动' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.is_active" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="{ row }">
            <div class="opt">
              <div type="success" class="btn" style="margin: 5px 0" @click="showEditDialog(row)">
                <i class="el-icon-edit" /> 修改
              </div>
              <div type="primary" class="btn" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" /> 删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改产品' : '新增产品'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="myRules"
        label-position="right"
        label-width="150px"
        style="margin-right: 100px"
      >
        <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="formData.product_name" placeholder="请输入产品名称" size="small" />
        </el-form-item>

        <el-form-item label="产品类型" prop="product_type_id">
          <el-select v-model="formData.product_type_id" placeholder="请选择产品类型" size="small">
            <el-option label="产品类型1" value="1"></el-option>
            <el-option label="产品类型2" value="2"></el-option>
            <el-option label="产品类型3" value="3"></el-option>
            <el-option label="产品类型4" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收银台页面模板" prop="cash_page_templ_id">
          <el-select
            v-model="formData.cash_page_templ_id"
            placeholder="请选择收银台页面模板"
            size="small"
          >
            <el-option label="收银台页面模板1" value="1"></el-option>
            <el-option label="收银台页面模板2" value="2"></el-option>
            <el-option label="收银台页面模板3" value="3"></el-option>
            <el-option label="收银台页面模板4" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否开启浮动" prop="is_float_enable">
          <el-switch v-model="formData.is_float_enable" @change="floatChange" />
        </el-form-item>

        <el-form-item label="浮动最大值" prop="float_max" v-if="isNotEnable">
          <el-input v-model="formData.float_max" placeholder="请输入浮动最大值" size="small" />
        </el-form-item>

        <el-form-item label="浮动最小值" prop="float_min" v-if="isNotEnable">
          <el-input v-model="formData.float_min" placeholder="请输入浮动最小值" size="small" />
        </el-form-item>
        <el-form-item label="浮动排除值" prop="float_exclude" v-if="isNotEnable">
          <el-input v-model="formData.float_exclude" placeholder="请输入浮动排除值" size="small" />
        </el-form-item>
        <el-form-item label="是否允许浮动重复" prop="float_allow_duplicate" v-if="isNotEnable">
          <el-switch v-model="formData.float_allow_duplicate" />
        </el-form-item>

        <el-form-item label="订单超时时间" prop="order_expire_time">
          <el-select
            v-model="formData.order_expire_time"
            placeholder="请选择订单超时时间"
            size="small"
          >
            <el-option label="1分钟" value="1"></el-option>
            <el-option label="2分钟" value="6"></el-option>
            <el-option label="5分钟" value="9"></el-option>
            <el-option label="10分钟" value="14"></el-option>
            <el-option label="30分钟" value="16"></el-option>
            <el-option label="1小时" value="17"></el-option>
            <el-option label="2小时" value="18"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="转账备注类型"   prop="remark_type">
          <el-select
            clearable
            v-model="formData.remark_type"
            placeholder="请选择备注类型"
            size="small"
          >
                  <el-option label="无" value="0"></el-option>
                  <el-option label="随机6位数字" value="1"></el-option>
                  <el-option label="随机字符串" value="2"></el-option>
                  <el-option label="随机邮箱" value="3"></el-option>
                  <el-option label="随机手机号" value="4"></el-option>
                  <el-option label="随机QQ号" value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="is_active">
          <el-switch v-model="formData.is_active" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- 金额浮动动话框 -->
    <el-dialog
      :visible.sync="floatDdialogVisible"
      :title="`设置产品【 ${formData.product_name} 】的浮动金额`"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="myRules"
        label-position="right"
        label-width="130px"
        style="margin-right: 100px"
      >
        <el-form-item label="产品名称" prop="product_name">
          <el-input
            v-model="formData.product_name"
            :disabled="true"
            placeholder="请输入产品名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="是否开启浮动" prop="is_float_enable">
          <el-switch v-model="formData.is_float_enable" @change="floatChange" />
        </el-form-item>

        <el-form-item label="浮动最大值" prop="float_max" v-if="isNotEnable">
          <el-input v-model="formData.float_max" placeholder="请输入浮动最大值" size="small" />
        </el-form-item>

        <el-form-item label="浮动最小值" prop="float_min" v-if="isNotEnable">
          <el-input v-model="formData.float_min" placeholder="请输入浮动最小值" size="small" />
        </el-form-item>
        <el-form-item label="浮动排除值" prop="float_exclude" v-if="isNotEnable">
          <el-input v-model="formData.float_exclude" placeholder="请输入浮动排除值" size="small" />
        </el-form-item>
        <el-form-item label="是否允许浮动重复" prop="float_allow_duplicate" label-width="140px" v-if="isNotEnable">
          <el-switch v-model="formData.float_allow_duplicate" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="floatDdialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="floatDdialogVisible = false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ServiceTeam',
  data() {
    return {
      code: '',
      tableData: [],
      dialogVisible: false,
      isNotEnable: '',
      formData: {
        product_name: '',
        product_type_id: '',
        cash_page_templ_id: '',
        is_float_enable: false,
        float_max: '',
        float_min: '',
        float_allow_duplicate: false,
        float_exclude: '',
        order_expire_time: '',
        remark_type: 0,
        is_active: false
      },
      queryFormData: {
        product_name: '',
        product_type_id: '',
        is_active: ''
      },
      isEdit: false, // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
      floatDdialogVisible: false
    }
  },
  methods: {
    showFloatDialog(row) {
      this.floatDdialogVisible = true
      // this.formData = Object.assign({}, row)
      this.formData = row
    },
    floatChange(e) {
      this.isNotEnable = e
      this.formData.float_max = ''
      this.formData.float_min = ''
      this.formData.float_allow_duplicate = false
      this.formData.float_exclude = ''
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除产品【 ${row.product_name} 】 吗？`)
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
      this.isNotEnable = row.is_float_enable
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        product_name: '',
        product_type_id: '',
        cash_page_templ_id: '',
        is_float_enable: false,
        float_max: '',
        float_min: '',
        float_allow_duplicate: false,
        float_exclude: '',
        order_expire_time: '',
        transfer_remark_type: '',
        is_active: false
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
        product_name: '',
        product_type_id: '',
        is_active: ''
      }
      this.mockData()
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()

      if (this.queryFormData.product_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.product_name == this.queryFormData.product_name
        })
      }

      if (this.queryFormData.product_type_id != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.product_type_id == this.queryFormData.product_type_id
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
        { title: '产品名称', type: 'string', key: 'product_name', isSearch: true, id: 1000 },
        { title: '产品类型', type: 'string', key: 'product_type_id', isSearch: true, id: 1001 },
        {
          title: '收银台页面模板',
          type: 'string',
          key: 'cash_page_templ_id',
          isSearch: false,
          id: 1002
        },
        {
          title: '是否开启浮动',
          type: 'boolean',
          key: 'is_float_enable',
          isSearch: false,
          id: 1003
        },
        { title: '浮动最大值', type: 'number', key: 'float_max', isSearch: false, id: 1004 },
        { title: '浮动最小值', type: 'number', key: 'float_min', isSearch: false, id: 1005 },
        {
          title: '是否允许浮动重复',
          type: 'boolean',
          key: 'float_allow_duplicate',
          isSearch: false,
          id: 1006
        },
        { title: '浮动排除值', type: 'number', key: 'float_exclude', isSearch: false, id: 1007 },
        {
          title: '订单超时时间',
          type: 'string',
          key: 'order_expire_time',
          isSearch: false,
          id: 1008
        },
        {
          title: '备注类型',
          type: 'string',
          key: 'transfer_remark_type',
          isSearch: false,
          id: 1009
        },
        {
          title: '自动类型',
          type: 'boolean',
          key: 'auto_type',
          isSearch: false,
          id: 1009
        },
        { title: '是否启用', type: 'boolean', key: 'is_active', isSearch: true, id: 1010 }
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
          if (column.title == 'abc') {
            ele[column.key] = 'abc' + this.tableData.length
          }

          if (column.title == '产品名称') {
            ele[column.key] = '产品名称' + this.tableData.length
          } else if (column.title == '浮动排除值') {
            ele[column.key] =
              Math.floor(Math.random() * 40) + 10 + ',' + (Math.floor(Math.random() * 40) + 10)
          } else if (column.title == '订单超时时间') {
            let arr = ['2分钟', '5分钟', '10分钟', '30分钟', '1小时', '2小时']
            ele[column.key] = arr[Math.floor(Math.random() * 6)]
          } else if (column.title == '自动类型') {
            let arr = [true, false]
            ele[column.key] = arr[Math.floor(Math.random() * 2)]
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
