<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="产品类型" prop="productTypeId">
          <el-select
            filterable
            v-model="queryFormData.productTypeId"
            placeholder="请选择产品类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in allProductType"
              :key="item.id"
              :label="item.productTypeName"
              :value="item.productTypeId"
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
        :loadData="loadTableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>

        <el-table-column label="产品类型名称" align="center" prop="productTypeName" />
        <el-table-column label="系统费率" align="center">
          <template slot-scope="{ row }"> {{ row.systemRate }}% </template>
        </el-table-column>
        <el-table-column label="交易类型" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.tradeType == 0 ? 'primary' : 'success'">{{
              row.tradeType == 0 ? '代收' : '代付'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.isActive">{{ row.isActive ? '开启' : '关闭' }}</el-tag>
            <el-tag v-else style="color: red">{{ row.isActive ? '开启' : '关闭' }}</el-tag>
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
      :title="isEdit ? '修改产品类型' : '新增产品类型'"
      :modal="false"
      @close="onDialogBtnCancel()"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="平台名称" prop="tenantName">
          <el-input
            disabled
            v-model="formData.tenantName"
            placeholder="请输入平台名称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="交易类型" :prop="isEdit ? '' : 'tradeType'">
          <el-select
            filterable
            v-model="formData.tradeType"
            placeholder="请选择交易类型"
            @change="onTradeTypeChange()"
            :disabled="isEdit"
            size="small"
          >
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" :prop="isEdit ? '' : 'productTypeIds'">
          <el-input
            v-if="isEdit"
            disabled
            v-model="formData.productTypeName"
            placeholder="请输入产品类型名称"
            size="small"
          />
          <el-select
            v-else
            filterable
            :multiple="true"
            v-model="formData.productTypeIds"
            placeholder="请选择产品类型"
            @change="productChange"
            size="small"
          >
            <el-option v-if="productTypeListFilter.length != 0" label="全部" value=""></el-option>
            <el-option
              v-for="item in productTypeListFilter"
              :key="item.productTypeId"
              :label="item.productTypeName"
              :value="item.productTypeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="产品类型名称" :prop="isEdit ? '' : 'productTypeIds'">
          <el-input
            v-if="isEdit"
            disabled
            v-model="formData.productTypeName"
            placeholder="请输入产品类型名称"
            size="small"
          />
          <el-select
            v-else
            filterable
            v-model="formData.productTypeIds"
            :multiple="true"
            placeholder="请选择"
            @change="productChange"
          >
            <el-option v-if="allProductType.length != 0" label="全部" value=""></el-option>
            <el-option
              v-for="item in allProductType"
              :key="'' + item.productTypeId"
              :label="item.productTypeName"
              :value="'' + item.productTypeId"
            ></el-option>
          </el-select>
        </el-form-item> -->
        
        <el-form-item label="系统费率" prop="systemRate" v-if="isShowSystemrate" >
          <el-input
            v-number-input
            type="number"
            v-model="formData.systemRate"
            placeholder="请输入码商费率"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
          <div class="help-tip">如：3% 表示每完成一笔订单，系统收取 3%</div>
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
      @close="onPatchBtnCancel()"
    >
      <el-form
        ref="formPatchRef"
        :model="formPatch"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="是否调整费率" prop="isAdjustRate">
          <el-switch v-model="formPatch.isAdjustRate"></el-switch>
        </el-form-item>

        <el-form-item v-if="formPatch.isAdjustRate" label="系统费率" prop="systemRate">
          <el-input
            v-number-input
            type="number"
            v-model="formPatch.systemRate"
            placeholder="请输入费率"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
          <div class="help-tip">要调整的费率值</div>
        </el-form-item>

        <el-form-item v-if="formPatch.isAdjustRate" label="调整类型" prop="type">
          <el-radio-group v-model="formPatch.systemRateType">
            <el-radio class="mt-10" :label="1"
              >设置为当前值
              <div class="help-tip">例如：输入2 ，无论之前费率是多少，都会调整为 2%</div></el-radio
            >

            <el-radio class="mt-10" :label="2"
              >全部增加当前值
              <div class="help-tip">例如：输入2 ，之前的费率是 5%，会调整为 7%</div></el-radio
            >

            <el-radio class="mt-10" :label="3"
              >全部减少当前值
              <div class="help-tip">例如：输入2 ，之前的费率是 5%，会调整为 3%</div></el-radio
            >
          </el-radio-group>
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

    <!-- <el-dialog :visible.sync="feeDialogVisible" :modal="false" title="调整费率" width="500px">
      <el-form
        ref="form"
        :model="feeFormData"
        label-position="right"
        label-width="90px"
        style="margin-right: 100px"
      >
        <el-form-item label="调整值" prop="value">
          <el-input v-model="feeFormData.value" placeholder="请输入费率" size="small">
            <template slot="append"> % </template>
          </el-input>
        </el-form-item>

        <el-form-item label="调整类型" prop="type">
          <el-radio-group v-model="feeFormData.type">
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
      </el-form>
      <div slot="footer">
        <el-button @click="feeDialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="optFeeBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  getProductTypePage,
  addProductType,
  getProductTypeList,
  deleteProductType,
  deleteProductTypeById,
  updateProductType,
  updateProductTypeList,
  updateProductTypeAll
} from '@/api/tenant-manager.js'

import { tenantRules } from './rules'

export default {
  name: 'gCodePreview',
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
    parentVisible(val) {
      if (!val) {
        this.dialogVisible = false
        // this.feeDialogVisible = false
        this.isPatchDialogVisible = false
      }
      if (val) {
        this.queryAllProductType()
      }
    }
  },
  computed: {
    productTypeListFilter() {
      return this.allProductType.filter((ele) => ele.tradeType == this.formData.tradeType)
    }
  },

  data() {
    return {
      rules: tenantRules,
      // code: '',
      tableData: [],
      dialogVisible: false,
      isShowSystemrate: true,
      // feeDialogVisible: false,
      formData: {},
      feeFormData: {
        value: '',
        type: 1 // 1 增加 2 减少 3 设置为
      },
      queryFormData: this.getQueryForm(),

      isEdit: false, // 是否是编辑状态
      selectionRows: [], // 选中的行数据
      // 添加扩展数据，如 options 所需要的数据
      formPatch: {},
      isPatchDialogVisible: false, // 是否是批量修改
      isModAll: false, // 是否修改全部
      allProductType: [] // 全部产品类型
    }
  },
  methods: {
    onTradeTypeChange() {
      this.formData.productTypeIds = []
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate()
      })
    },
    productChange(e) {
      if (e.indexOf('') != -1 && e.length == 1) {
        this.isShowSystemrate = false
      } else if (e.indexOf('') != -1 && e.length > 1) {
        this.formData.productTypeIds = ['']
        this.isShowSystemrate = false
        this.$message.error('您已选择全部，无须选择其他！')
      } else {
        this.isShowSystemrate = true
        this.filterProductType(e)
      }
    },
    filterProductType(e) {
      if (e.length == 0) {
        return
      }
      let filterProductType = []
      e.forEach((item) => {
        filterProductType.push(this.productTypeListFilter.find((ele) => ele.productTypeId == item))
      })

      const maxValue = filterProductType.reduce((max, obj) => {
        return obj.systemRate > max ? obj.systemRate : max
      }, filterProductType[0].systemRate)
      this.formData.systemRate = maxValue
    },
    async loadTableData(page) {
      let res = await getProductTypePage(
        {
          ...this.queryFormData,
          tenantId: this.currItem.tenantId
        },
        { ...page }
      )
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
        productTypeId: '',
        isActive: ''
      }
    },

    queryTableData() {
      this.$refs.tableRef.getTableData(1)
    },

    async showConfirmDelete(row) {
      try {
        await this.$confirm('确定解绑当前行吗？')

        let res = await deleteProductTypeById(row.id)

        if (res.code == '00000') {
          this.$message.success('解绑成功')
        } else {
          this.$message.error(res.message)
        }

        this.flushPage()
      } catch (e) {
        console.log('取消删除')
      }
    },

    /**
     * 批量修改
     */
    showPatchEditDialog(isModAll) {
      this.isModAll = isModAll
      this.isPatchDialogVisible = true

      this.formPatch = {
        // 批量修改
        isAdjustRate: 0, //1.是，0.否
        systemRate: '',
        systemRateType: 1, // 1 增加 2 减少 3 设置为
        isActive: null // 是否启用(null.保持不表，1.是，0.否)
      }
    },
    onPatchBtnCancel() {
      this.$refs.formPatchRef.resetFields()
      this.isPatchDialogVisible = false
    },
    async onPatchBtnOk() {
      this.$refs.formPatchRef.validate(async (valid) => {
        if (!valid) {
          return false
        }

        if (!this.isModAll) {
          let idList = this.selectionRows.map((ele) => ele.id)

          // 批量
          let res = await updateProductTypeList({
            idList: idList,
            tenantId: this.currItem.tenantId,
            systemRate: +this.formPatch.systemRate,
            isAdjustRate: this.formPatch.isAdjustRate,
            systemRateType: this.formPatch.systemRateType,
            isActive: this.formPatch.isActive
          })

          if (res.code == '00000') {
            this.$message.success('修改成功')
          }
        } else {
          // 全部修改
          // 批量
          let res = await updateProductTypeAll({
            tenantId: this.currItem.tenantId,
            systemRate: +this.formPatch.systemRate,
            isAdjustRate: this.formPatch.isAdjustRate,
            systemRateType: this.formPatch.systemRateType,
            isActive: this.formPatch.isActive
          })

          if (res.code == '00000') {
            this.$message.success('修改成功')
          }
        }

        this.onPatchBtnCancel()
        this.flushPage()
      })
    },

    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.isShowSystemrate = true
      this.formData = {
        tenantName: this.currItem.tenantName,
        productTypeIds: [],
        systemRate: '0.1',
        tradeType: 0,
        isActive: 1
      }
      this.queryAllProductType()
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
      this.formData.tenantName = this.currItem.tenantName
      this.queryAllProductType()
    },

    // optFee() {
    //   this.feeDialogVisible = true
    // },
    // optFeeBtnOk() {
    //   this.tableData = this.tableData.map((item) => {
    //     if (feeFormData.type == 1) {
    //       item.systemRate += feeFormData.value
    //     } else if (feeFormData.type == 2) {
    //       item.systemRate -= feeFormData.value
    //     } else {
    //       item.systemRate = feeFormData.value
    //     }
    //     item.systemRate = item.systemRate < 0 ? 0 : item.systemRate
    //     return item
    //   })
    // },
    onDialogBtnCancel() {
      this.dialogVisible = false
      this.$refs.formRef.resetFields()
    },
    onDialogBtnOk() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) {
          return false
        }

        if (this.isEdit) {
          // 编辑

          let res = await updateProductType({
            id: this.formData.id,
            // tenantId: this.currItem.tenantId,
            systemRate: +this.formData.systemRate,
            isActive: this.formData.isActive
          })
          this.$message.success('修改成功')
          console.log(res)
        } else {
          let productTypeIdsFlag = this.formData.productTypeIds
          const isAllProduct = this.formData.productTypeIds.indexOf('') != -1

          let obj = {
            tenantId: this.currItem.tenantId,
            productTypeIds: isAllProduct ? [] : productTypeIdsFlag,
            systemRate: +this.formData.systemRate,
            isActive: this.formData.isActive
          }
          let params = obj
          if (isAllProduct) {
            const { systemRate, ...rest } = obj
            params = rest
          }

          let res = await addProductType(params)
          this.$message.success('添加成功')
          console.log(res)
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

        console.log(this.selectionRows, 'this.selectionRows')
        let idList = []
        this.selectionRows.forEach((item) => {
          idList.push(item.id)
        })
        let res = await deleteProductType({ idList })
        if (res.code == '00000') {
          this.$message.success('解绑成功')
        } else {
          this.$message.error(res.message)
        }

        this.flushPage()
        //todo 调用接口删除
        console.log('绑选成功')
      } catch (e) {
        console.log('取消删除')
      }
    },

    async queryAllProductType() {
      let res = await getProductTypeList()
      console.log(res)
      this.allProductType = res.data
    }
  },
  mounted() {
    this.queryAllProductType()
  }
}
</script>

<style lang="scss" scoped></style>
