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
        v-if="parentVisible"
        class="mt-10"
        ref="tableRef"
        :tableData="tableData"
        :loadData="getProductProviderRel"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>

        <el-table-column label="产品名称" align="center" prop="productName" />
        <el-table-column label="交易类型" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.tradeType == 0 ? 'primary' : 'success'">{{
              row.tradeType == 0 ? '代收' : '代付'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="码商费率" align="center">
          <template slot-scope="{ row }">
            {{ row.providerRate }}
          </template>
        </el-table-column>
        <el-table-column label="单笔费用" align="center">
          <template slot-scope="{ row }">
            {{ row.providerPerTransactionFee }}
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
        style="margin-right: 50px"
      >
        <el-form-item label="码商名称" prop="">
          <el-input
            disabled
            v-model="currItem.userNickName"
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
            placeholder="请输入产品类型名称"
            size="small"
          />
          <el-select
            v-else
            filterable
            :multiple="true"
            v-model="formData.productIds"
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
          <div class="help-tip mt-10">如3%，每完成一笔订单，码商可得3%的利润</div>
        </el-form-item>

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
          <div class="help-tip mt-10">如2元，每完成一笔订单，码商可得2元的利润</div>
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
      width="600px"
    >
      <el-form
        ref="formPatch"
        :rules="rules"
        :model="formPatch"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="修改费率" prop="isModifiedProviderRate">
          <el-switch v-model="formPatch.isModifiedProviderRate"></el-switch>
        </el-form-item>

        <el-form-item
          v-if="formPatch.isModifiedProviderRate"
          label="码商费率"
          prop="providerRate"
        >
          <el-input
            v-number-input
            type="number"
            v-model="formPatch.providerRate"
            placeholder="请输入码商费率"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
        </el-form-item>

        <el-form-item v-if="formPatch.isModifiedProviderRate" label="调整类型" prop="type">
          <el-radio-group v-model="formPatch.providerRateAdjustType">
            <el-radio class="mt-10" :label="1"
              >设置为当前值
              <div class="red_tip">例如：输入2 ，无论之前费率是多少，都会调整为 2%</div></el-radio
            >

            <el-radio class="mt-10" :label="2"
              >全部增加当前值
              <div class="red_tip">例如：输入2 ，之前的费率是 5%，会调整为 7%</div></el-radio
            >

            <el-radio class="mt-10" :label="3"
              >全部减少当前值
              <div class="red_tip">例如：输入2 ，之前的费率是 5%，会调整为 3%</div></el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="修改费用" prop="isProviderPerTransactionFee">
          <el-switch v-model="formPatch.isProviderPerTransactionFee"></el-switch>
        </el-form-item>

        <el-form-item
          v-if="formPatch.isProviderPerTransactionFee"
          label="单笔费用"
          prop="providerPerTransactionFee"
        >
          <el-input
            v-number-input-positive
            type="number"
            v-model="formPatch.providerPerTransactionFee"
            placeholder="请输入费用金额"
            size="small"
          >
            <template slot="append"> 元 </template>
          </el-input>
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
        <el-button @click="isPatchDialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onPatchBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProductProviderRel,
  createProviderProductRelation,
  batchDeleteProductProviderRelRelation,
  deleteProductProviderRelRelation,
  updateProductProviderRelationByProviderId,
  batchUpdateProductProviderRelation,
  UpdateProductProviderRelationById,
  getProductOptionsByProviderIdForProviderPage
} from '@/api/report-center'

import {
  getProductListByUserId,
  getProductListByProviderIdWhenConfigProduct
} from '@/api/service-product-mananger.js'

import { serviceRules } from './rules.js'
export default {
  name: 'ServiceListSetting',
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
  computed: {
    productListFilter() {
      return this.allParentIdList.filter((ele) => ele.tradeType == this.formData.tradeType)
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
  data() {
    return {
      rules: serviceRules,
      tableData: [],
      dialogVisible: false,
      formData: {},
      queryFormData: {
        productId: '',
        isActive: '',
        tradeType: ''
      },
      isEdit: false, // 是否是编辑状态
      selectionRows: [], // 选中的行数据
      // 添加扩展数据，如 options 所需要的数据
      formPatch: {
        isModifiedProviderRate: 0,
        providerRate: '',
        providerRateAdjustType: 1,
        isProviderPerTransactionFee: 0,
        providerPerTransactionFee: '',
        isActive: null
      },
      isPatchDialogVisible: false, // 是否是批量修改
      allProductList: [], // 产品名称
      isModAll: false, // 是否修改全部
      allParentIdList: [],
    }
  },

  methods: {
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
    // async getProductListByProviderId() {
    //   let res = await getProductListByProviderId(this.currItem.parentId)
    async getCurrentProductList() {
      console.log('--getProductListByProviderIdWhenConfigProduct-----')

      let res = await getProductListByProviderIdWhenConfigProduct(this.currItem.providerId)
      this.allProductList = res.data
      console.log(res, 'res')
    },

    async getProductProviderRel(page) {
      let res = await getProductProviderRel(
        { ...this.queryFormData, providerId: this.currItem.providerId },
        page
      )
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async getProductListByParentId(tradeType) {
      let res = await getProductOptionsByProviderIdForProviderPage(this.currItem.providerId,{tradeType:tradeType})
      this.allParentIdList = res.data
      console.log(res, 'res')
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm('确定解绑当前行吗？')
        let res = await deleteProductProviderRelRelation(row.id)
        console.log(res, 'res')
        this.$refs.tableRef.getTableData()
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },
    showEditDialog(row) {
      // this.getProductListByProviderId()
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
      this.id = row.id
    },

    /**
     * 批量修改
     */
    showPatchEditDialog(isModAll) {
      this.isModAll = isModAll
      this.isPatchDialogVisible = true

      this.formPatch = {
        // 批量修改
        isModifiedProviderRate: 0,
        providerRate: '',
        providerRateAdjustType: 1,
        isProviderPerTransactionFee: 0,
        providerPerTransactionFee: '',
        isActive: null
      }
      this.$nextTick(() => {
        this.$refs.formPatch.resetFields()
        this.$refs.formPatch.clearValidate()
      })
    },
    async onPatchBtnOk() {
      this.$refs.formPatch.validate(async (valid) => {
        if (valid) {
          if (!this.isModAll) {
            // 批量
            let arr = []
            this.selectionRows.forEach((row) => {
              arr.push(row.id)
            })
            console.log({ idList: arr, ...this.formPatch }, '{ idList: arr, ...this.formPatch }')
            let res = await batchUpdateProductProviderRelation({ idList: arr, ...this.formPatch })
            console.log(res, 'res')
          } else {
            // 全部修改
            let res = await updateProductProviderRelationByProviderId({
              providerId: this.currItem.providerId,
              ...this.formPatch
            })
            console.log(res, 'res')
          }

          this.dialogVisible = false
          this.$refs.tableRef.getTableData(1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    showAddDialog() {
      // this.getProductListByProviderId()
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        merchant_name: this.currItem.userNickName,
        productIds: [],
        providerRate: '',
        providerPerTransactionFee: '',
        tradeType: 0,
        isActive: 1
      }
      this.$nextTick(() => {
        this.$refs.formData.resetFields()
        this.$refs.formData.clearValidate()
      })
    },
    onDialogBtnCancel() {
      this.$refs.formData.resetFields()
      this.dialogVisible = false
    },
    onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            //修改
            let res = await UpdateProductProviderRelationById({
              id: this.id,
              isActive: this.formData.isActive,
              productId: this.formData.productId,
              providerPerTransactionFee: +this.formData.providerPerTransactionFee,
              providerRate: this.formData.providerRate,
              providerId: this.currItem.providerId
            })
            this.$message.success('修改成功')
            console.log(res, 'res')
          } else {
            let productIdsFlag = this.formData.productIds
            const isAllProduct = this.formData.productIds.indexOf('') != -1
            if (isAllProduct) {
              productIdsFlag = []
            }

            let res = await createProviderProductRelation({
              isActive: this.formData.isActive,
              productIds: productIdsFlag,
              providerPerTransactionFee: +this.formData.providerPerTransactionFee,
              providerRate: this.formData.providerRate,
              tradeType: this.formData.tradeType,
              providerId: this.currItem.providerId
            })
            console.log(res, 'res')
            this.$message.success('新增成功')
          }
          this.onDialogBtnCancel()
          this.$refs.tableRef.getTableData(1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetQueryForm() {
      this.queryFormData = {
        productId: '',
        isActive: '',
        tradeType: ''
      }
      this.$refs.tableRef.getTableData(1)
    },

    handleSelectionChange(val) {
      this.selectionRows = val
    },
    async deleteSelectRows() {
      let array = this.selectionRows.map((item) => item.id)

      try {
        await this.$confirm('确定解绑选中的行吗？')
        let res = await batchDeleteProductProviderRelRelation(array)
        console.log(res, 'res')
        this.$refs.tableRef.getTableData(1)
        //todo 调用接口删除
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.$refs.tableRef.getTableData(1)
    }
  },
  mounted() {
    this.getCurrentProductList()
    this.getProductListByParentId(0)
  }
}
</script>

<style lang="scss" scoped></style>
