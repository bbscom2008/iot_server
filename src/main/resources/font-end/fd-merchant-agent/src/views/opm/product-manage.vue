<template>
  <div class="container">
    <!-- <h3>产品管理</h3> -->
    <div class="tips">产品管理</div>
    <my-table
      class="mt-10"
      ref="infoTable"
      :tableData="list"
      :total="total"
      :loadData="getDataList"
      style="width: 100%"
    >
      <el-table-column label="序号" align="center" type="index" width="60" />

      <el-table-column align="center" label="产品类型">
        <template slot-scope="{ row }">
          <span>{{ row.productType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收银台模板">
        <template slot-scope="{ row }">
          <span>{{ row.cashTemplate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="转账备注类型">
        <template slot-scope="{ row }">
          <span>{{ row.transferType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否为静态支付信息">
        <template slot-scope="{ row }">
          <el-switch v-model="row.isNotStatic" active-color="#13ce66" inactive-color="#999">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否为自动确认订单">
        <template slot-scope="{ row }">
          <el-switch v-model="row.isNotAuto" active-color="#13ce66" inactive-color="#999">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否启用">
        <template slot-scope="{ row }">
          <el-switch v-model="row.isNotEnable" active-color="#13ce66" inactive-color="#999">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template>
          <el-button type="success" size="small" @click="editButton"
            ><svg-icon class="mr-5" icon-class="edit" />编辑</el-button
          >
        </template>
      </el-table-column>
    </my-table>
    <el-dialog :visible.sync="dialogVisible" title="编辑" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-width="160px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="产品类型名称:" prop="productType">
          <el-input v-model="dataForm.productType" placeholder="请输入产品类型名称" size="small" />
        </el-form-item>
        <el-form-item label="选择收银台模板:" prop="cashTemplate">
          <el-select v-model="dataForm.cashTemplate" placeholder="请选择模板" size="small">
            <el-option label="模板1" value="1"></el-option>
            <el-option label="模板2" value="2"></el-option>
            <el-option label="模板3" value="3"></el-option>
            <el-option label="模板4" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转账备注类型:" prop="transferType">
          <el-select v-model="dataForm.transferType" placeholder="请选择转账备注类型" size="small">
                  <el-option label="无" value="0"></el-option>
                  <el-option label="随机6位数字" value="1"></el-option>
                  <el-option label="随机字符串" value="2"></el-option>
                  <el-option label="随机邮箱" value="3"></el-option>
                  <el-option label="随机手机号" value="4"></el-option>
                  <el-option label="随机QQ号" value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否为静态支付信息:" prop="isNotStatic">
          <el-switch
            active-text="是"
            inactive-text="否"
            v-model="dataForm.isNotStatic"
            active-color="#13ce66"
            inactive-color="#999"
            size="small"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="是否为自动确认订单:" prop="isNotAuto">
          <el-switch
            active-text="是"
            inactive-text="否"
            v-model="dataForm.isNotAuto"
            active-color="#13ce66"
            inactive-color="#999"
            size="small"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="是否启用:" prop="isNotEnable">
          <el-switch
            active-text="是"
            inactive-text="否"
            v-model="dataForm.isNotEnable"
            active-color="#13ce66"
            inactive-color="#999"
            size="small"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="请输入备注" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="handleSubmit()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { productManageList } from '@/api/operate-manager'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  name: 'ProductList',
  data() {
    const validateProductType = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入产品类型名称'))
      } else {
        callback()
      }
    }
    const validateCashTemplate = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择收银台模板'))
      } else {
        callback()
      }
    }
    const validateTransferType = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择转账备注类型'))
      } else {
        callback()
      }
    }
    const validateIsNotStatic = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }
    const validateIsNotAuto = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }
    const validateIsNotEnable = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }
    const validateRemark = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入备注'))
      } else {
        callback()
      }
    }
    return {
      list: [],
      total: 0,
      dataForm: {
        productType: '',
        cashTemplate: '',
        transferType: '',
        isNotStatic: false,
        isNotAuto: false,
        isNotEnable: true,
        remark: ''
      },
      dialogVisible: false,
      rules: {
        productType: [{ required: true, trigger: 'blur', validator: validateProductType }],
        cashTemplate: [{ required: true, trigger: 'change', validator: validateCashTemplate }],
        transferType: [{ required: true, trigger: 'change', validator: validateTransferType }],
        isNotStatic: [{ required: true, trigger: 'change', validator: validateIsNotStatic }],
        isNotAuto: [{ required: true, trigger: 'change', validator: validateIsNotAuto }],
        isNotEnable: [{ required: true, trigger: 'change', validator: validateIsNotEnable }],
        remark: [{ required: true, trigger: 'blur', validator: validateRemark }]
      }
    }
  },
  methods: {
    async getDataList(currentPage, pageSize) {
      let ret = await productManageList()
      console.log('ret.total : ' + ret.total)
      this.list = ret.data
      this.total = ret.total
    },
    handleSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    editButton() {
      this.dialogVisible = true
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.tips {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border: 1px solid #eee;
  padding: 30px 20px;
  margin-bottom: 20px;
}
</style>
