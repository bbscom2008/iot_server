<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="产品名称" prop="productId">
          <el-select
            filterable
            v-model="queryFormData.productId"
            placeholder="请选择产品名称"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in allProductList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select filterable v-model="queryFormData.isActive" placeholder="请选择" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易类型" prop="tradeType">
          <el-select v-model="queryFormData.tradeType" placeholder="请选择交易类型" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
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
        >批量解绑</el-button
      >

      <el-button
        :disabled="selectionRows.length == 0"
        type="primary"
        plain
        icon="el-icon-edit-outline"
        @click="showPatchEditDialog(false)"
        >批量修改</el-button
      >

      <el-button type="primary" plain icon="el-icon-edit-outline" @click="showPatchEditDialog(true)"
        >全部修改</el-button
      >
      <my-table
        class="mt-10"
        :loadData="loadTableData"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <!-- <el-table-column label="码商名称" align="center" prop="merchant_name" >
          <template>
            {{ currItem.merchant_nickname  }}
          </template>
        </el-table-column> -->

        <el-table-column label="产品名称" align="center" prop="productName" />
        <el-table-column label="交易类型" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.tradeType == 0 ? 'primary' : 'success'">{{
              row.tradeType == 0 ? '代收' : '代付'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="码商费率（%）" align="center">
          <template slot-scope="{ row }">
            {{ row.providerRate }}
          </template>
        </el-table-column>
        <el-table-column label="单笔费用（元）" align="center">
          <template slot-scope="{ row }">
            {{ row.providerPerTransactionFee }}
          </template>
        </el-table-column>

        <el-table-column label="权重" align="center">
          <template slot-scope="{ row }">
            {{ row.weight }}
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.isActive">{{ row.isActive ? '启用' : '关闭' }}</el-tag>
            <el-tag v-else style="color: red">{{ row.isActive ? '启用' : '关闭' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" plain size="small" @click="showEditDialog(row)">
              <i class="el-icon-edit" />修改
            </el-button>
            <el-button type="text" plain size="small" @click="showConfirmDelete(row)">
              <i class="el-icon-delete" /> 解绑
            </el-button>

            <el-button type="text" size="small" @click="showRateHistoryDialog(row)">
              <i class="el-icon-edit" />费率记录
            </el-button>

          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改产品' : '新增产品'"
      :modal="false"
      width="600px"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="码商名称" prop="providerNickName">
          <el-input
            disabled
            v-model="formData.providerNickName"
            placeholder="请输入码商名称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="交易类型" :prop="isEdit ? '' : 'tradeType'">
          <el-select
            filterable
            v-model="formData.tradeType"
            placeholder="请选择交易类型"
            :disabled="isEdit"
            @change="onTradeTypeChange"
            size="small"
          >
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" :prop="isEdit ? '' : 'productIds'">
          <el-input
            v-if="isEdit"
            disabled
            v-model="formData.productName"
            placeholder="请输入产品名称"
            size="small"
          />
          <el-select
            v-else
            filterable
            v-model="formData.productIds"
            :multiple="true"
            placeholder="请选择"
            @change="productChange"
          >
            <el-option v-if="productListFilter.length != 0" label="全部" value=""></el-option>
            <el-option
              v-for="item in productListFilter"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 0 -->
        <el-form-item label="码商费率" prop="providerRate">
          <el-input
            v-number-input
            type="number"
            v-model="formData.providerRate"
            placeholder="请输入码商费率"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
          <div class="help-tip">如 3%，每成交一笔订单，码商获得 3% 的利润</div>
        </el-form-item>
        <!-- 0 -->
        <el-form-item label="单笔费用" prop="providerPerTransactionFee">
          <el-input
            v-number-input
            type="number"
            v-model="formData.providerPerTransactionFee"
            placeholder="请输入费用金额"
            size="small"
          >
            <template slot="append"> 元 </template>
          </el-input>
          <div class="help-tip">如2元，每完成一笔订单，码商获得2元的利润</div>
        </el-form-item>
        <!-- 1 -->
        <el-form-item label="权重" prop="weight">
          <el-input
            type="number"
            v-model.number="formData.weight"
            placeholder="请输入权重"
            size="small"
          >
          </el-input>
          <div class="help-tip">1-10 的整数，值越大，接单概率越高</div>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="isPatchDialogVisible"
      :title="isModAll ? '全部修改' : '批量修改'"
      :modal="false"
      width="500px"
    >
      <el-form
        ref="formPatch"
        :model="formPatch"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 50px"
      >
        <el-form-item label="修改费率" prop="isModifiedProviderRate">
          <el-switch v-model="formPatch.isModifiedProviderRate"></el-switch>
        </el-form-item>

        <el-form-item
          style="width: 360px"
          v-if="formPatch.isModifiedProviderRate"
          label="码商费率"
          prop="providerRate"
        >
          <el-input
            type="number"
            v-model="formPatch.providerRate"
            placeholder="请输入码商费率"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
          <div class="help-tip">调整费率的值 如 2</div>
        </el-form-item>

        <el-form-item v-if="formPatch.isModifiedProviderRate" label="调整类型" prop="type">
          <el-radio-group v-model="formPatch.providerRateAdjustType">
            <el-radio class="mt-10" :label="1"
              >设置为当前值
              <div class="help-tip">例如：输入2 ，无论之前费率是多少，都会调整为 2%</div></el-radio
            >

            <el-radio class="mt-10" :label="2"
              >全部增加当前值
              <div class="help-tip">例如：输入2 ，之前的费率是 5%，调整后为 7%</div></el-radio
            >

            <el-radio class="mt-10" :label="3"
              >全部减少当前值
              <div class="help-tip">例如：输入2 ，之前的费率是 5%，调整后为 3%</div></el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="修改单笔费用" prop="isProviderPerTransactionFee">
          <el-switch v-model="formPatch.isProviderPerTransactionFee"></el-switch>
        </el-form-item>

        <el-form-item
          label="单笔费用"
          prop="providerPerTransactionFee"
          v-if="formPatch.isProviderPerTransactionFee"
        >
          <el-input
            v-number-input
            type="number"
            v-model="formPatch.providerPerTransactionFee"
            placeholder="请输入费用金额"
            size="small"
          >
            <template slot="append"> 元 </template>
          </el-input>
          <div class="help-tip">如2元，每完成一笔订单，码商获得2元的利润</div>
        </el-form-item>

        <el-form-item label="修改权重" prop="isModifiedWeight">
          <el-switch v-model="formPatch.isModifiedWeight"></el-switch>
        </el-form-item>

        <el-form-item label="权重" prop="weight" v-if="formPatch.isModifiedWeight">
          <el-input
            type="number"
            v-model.number="formPatch.weight"
            placeholder="请输入权重"
            size="small"
          >
          </el-input>
          <div class="help-tip">1-10 的整数，值越大，接单概率越高</div>
        </el-form-item>

        <el-form-item label="是否启用" prop="">
          <el-radio-group v-model="formPatch.isActive" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onPatchBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onPatchBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

     <ProductRateHistoryDialog ref="productRateHistoryDialogRef"></ProductRateHistoryDialog>

  </div>
</template>

<script>

import ProductRateHistoryDialog from '@/views/service-manager/product-rate-history-dialog.vue'

import {
  getProductProviderRel,
  batchUnbindProduct,
  unbindProduct,
  updateProduct,
  addProduct,
  batchUpdateProduct,
  allUpdateProduct,
  getProductListByProviderId,
  getProductOptionsByProviderIdForProviderPage,
  getProductListByParentId
} from '@/api/service-list-setting.js'

import { serviceRules } from './rules'

export default {
  name: 'gCodePreview',
  components:{
    ProductRateHistoryDialog,
  },
  props: {
    currItem: {
      type: Object,
      default: {}
    },
    parentVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    parentVisible(newVal) {
      if (!newVal) {
        // this.feeDialogVisible = false
        this.dialogVisible = false
        this.isPatchDialogVisible = false
      }
    }
  },
  computed: {
    productListFilter() {
      return this.allParentIdList.filter((ele) => ele.tradeType == this.formData.tradeType)
    }
  },
  data() {
    return {
      rules: serviceRules,
      tableData: [],
      dialogVisible: false,
      // feeDialogVisible: false,
      formData: {},
      feeFormData: {},
      queryFormData: this.getQueryForm(),
      isEdit: false, // 是否是编辑状态
      selectionRows: [], // 选中的行数据
      // 添加扩展数据，如 options 所需要的数据
      formPatch: {},
      isPatchDialogVisible: false, // 是否是批量修改
      isModAll: false,
      allProductList: [], // 产品名称
      allParentIdList: [], // 产品名称
    }
  },
  methods: {
    showRateHistoryDialog(row){
      this.$refs.productRateHistoryDialogRef.showRateHistoryDialog(row, this.currItem)
    },

    onTradeTypeChange(e) {
      this.formData.productIds = []
      this.$nextTick(() => {
        this.$refs.formData.clearValidate()
      })
      this.getProductListByParentId(e)
    },
    productChange(e) {
      if (e.indexOf('') != -1 && e.length > 1) {
        this.formData.productIds = ['']
        this.$message.error('您已选择全部，无须选择其他！')
      }
    },
    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确定解绑 【 ${row.productName} 】 吗？`)

        await unbindProduct(row.id)
        this.$message.success('解绑成功')
        this.flushPage()
      } catch (e) {
        console.log('取消删除')
      }
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign(
        {
          providerNickName: this.currItem.userNickName
        },
        row
      )
    },

    /**
     * 批量修改
     */
    showPatchEditDialog(isModAll) {
      this.isModAll = isModAll
      this.isPatchDialogVisible = true
      // this.formData = Object.assign({}, row)

      this.formPatch = {
        // 批量修改
        isModifiedProviderRate: 0,
        isProviderPerTransactionFee: 0,
        isModifiedWeight: 0,
        providerRate: '',
        providerRateAdjustType: 1, // 1 增加 2 减少 3 设置为
        providerPerTransactionFee: '0', // 单笔费率
        weight: 1,
        isActive: null // 是否启用(null.保持不表，1.是，0.否)
      }
    },
    onPatchBtnCancel() {
      this.$nextTick(() => {
        this.$refs.formPatch.resetFields()
      })

      this.isPatchDialogVisible = false
    },
    onPatchBtnOk() {
      this.$refs.formPatch.validate(async (valid) => {
        if (!valid) {
          return false
        }
        if (!this.isModAll) {
          // 批量
          let idList = this.selectionRows.map((item) => item.id)
          await batchUpdateProduct({
            idList: idList,
            isModifiedProviderRate: this.formPatch.isModifiedProviderRate,
            providerRateAdjustType: this.formPatch.providerRateAdjustType,
            providerRate: this.formPatch.providerRate,
            isProviderPerTransactionFee: +this.formPatch.isProviderPerTransactionFee,
            providerPerTransactionFee: this.formPatch.providerPerTransactionFee,
            isModifiedWeight: this.formPatch.isModifiedWeight,
            weight: this.formPatch.weight,
            isActive: this.formPatch.isActive
          })
        } else {
          // 全部修改
          await allUpdateProduct({
            providerId: this.currItem.providerId,
            isModifiedProviderRate: this.formPatch.isModifiedProviderRate,
            providerRateAdjustType: this.formPatch.providerRateAdjustType,
            providerRate: this.formPatch.providerRate,
            isProviderPerTransactionFee: +this.formPatch.isProviderPerTransactionFee,
            providerPerTransactionFee: this.formPatch.providerPerTransactionFee,
            isModifiedWeight: this.formPatch.isModifiedWeight,
            weight: this.formPatch.weight,
            isActive: this.formPatch.isActive
          })
        }

        this.$message.success('修改成功')
        this.onPatchBtnCancel()
        this.flushPage()
      })
    },

    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        weight: 1,
        providerNickName: this.currItem.userNickName,
        productIds: [],
        productName: '',
        providerPerTransactionFee: 0,
        tradeType: 0,
        isActive: 1
      }
    },
    onDialogBtnCancel() {
      this.$refs.formData.resetFields()
      this.dialogVisible = false
    },
    onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (!valid) {
          return false
        }

        if (this.isEdit) {
          await updateProduct({
            id: this.formData.id,
            providerRate: this.formData.providerRate,
            providerPerTransactionFee: this.formData.providerPerTransactionFee,
            weight: this.formData.weight,
            isActive: this.formData.isActive
          })
          this.$message.success('修改成功')
        } else {
          let productIdsFlag = this.formData.productIds
          const isAllProduct = this.formData.productIds.indexOf('') != -1
          if (isAllProduct) {
            productIdsFlag = []
          }

          await addProduct({
            providerId: this.currItem.providerId,
            productIds: productIdsFlag,
            providerRate: this.formData.providerRate,
            tradeType: this.formData.tradeType,
            providerPerTransactionFee: this.formData.providerPerTransactionFee,
            weight: this.formData.weight,
            isActive: this.formData.isActive
          })
          this.$message.success('新增成功')
        }

        this.onDialogBtnCancel()
        this.flushPage()
      })
    },

    handleSelectionChange(val) {
      this.selectionRows = val
    },
    async deleteSelectRows() {
      try {
        await this.$confirm('确定解绑选中的行吗？')

        let ids = this.selectionRows.map((item) => item.id)
        await batchUnbindProduct(ids)
        this.$message.success('解绑成功')

        this.flushPage()
      } catch (e) {
        console.log('取消删除')
      }
    },
    async getProductListByProviderId() {
      let res = await getProductListByProviderId(this.currItem.providerId)
      this.allProductList = res.data
      console.log(res, 'res')
    },
    async getProductListByParentId(tradeType) {
      let res = await getProductOptionsByProviderIdForProviderPage(this.currItem.providerId,{tradeType:tradeType})
      this.allParentIdList = res.data
      console.log(res, 'res')
    },

    async loadTableData(page) {
      let params = {
        providerId: this.currItem.providerId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          params[key] = this.queryFormData[key]
        }
      })

      let res = await getProductProviderRel(params, page)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    flushPage() {
      this.$refs.tableRef.getTableData(1)
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
    },
    getQueryForm() {
      return {
        productId: '',
        isActive: '',
        tradeType: ''
      }
    },

    queryTableData() {
      // 刷新表格
      this.$refs.tableRef.getTableData(1)
    }
  },
  mounted() {
    this.getProductListByProviderId(this.$store.state.tenant.selectTenantId)
    this.getProductListByParentId(0)
  }
}
</script>

<style lang="scss" scoped></style>
