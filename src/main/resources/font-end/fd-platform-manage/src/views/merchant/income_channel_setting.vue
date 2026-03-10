<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="产品名称" prop="productId">
          <el-select
            filterable
            v-model="queryFormData.productId"
            placeholder="请选择产品"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in productList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select v-model="queryFormData.isActive" placeholder="请选择" size="small">
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

    <div class="tips mt-20" style="display: flex; justify-content: space-around;" >
      <div>
        通道名称：{{ currItem.channelName }} 
      </div>
      <div>
        通道编码： {{ currItem.channelCode }}
      </div>
      <div>
        金额限制类型： <span v-if="currItem.limitAmountType == 0">无限制</span>

        <span
          v-if="currItem.limitAmountType == 1 && currItem.fixedAmount"
        >
            <el-tag
              :key="index"
              v-for="(item, index) in currItem.fixedAmount.split(',')"
              size="small"
              style="margin-right: 10px;"
              >{{ item }}</el-tag
            > 
        </span>

        <span v-if="currItem.limitAmountType == 2">
          <el-tag size="small">{{ currItem.minAmount }}</el-tag> ~
          <el-tag size="small">{{ currItem.maxAmount }}</el-tag>
        </span>
      </div>
    </div>

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

      <el-checkbox style="margin-left: 20px;" v-model="isOwnFirst"
        @change="handleOwnFirstChange"
       >码商优先</el-checkbox>

      <my-table
        class="mt-10"
        ref="tableRef"
        :tableData="tableData"
        :loadData="getProductPageByChannelId"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column label="产品名称" align="center" prop="productName"></el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.isActive"> {{ row.isActive ? '开启' : '关闭' }} </el-tag>
            <el-tag v-else style="color: red"> {{ row.isActive ? '开启' : '关闭' }} </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="权重" align="center" prop="weight" width="80">
          <template slot-scope="{ row }">
            <el-input v-model.number="row.weight" @change="handleWeightChange(row)" size="small" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="showEditDialog(row)">
              <i class="el-icon-edit" />修改
            </el-button>
            <el-button type="text" size="small" @click="showConfirmDelete(row)">
              <i class="el-icon-delete" />解绑
            </el-button>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改' : '新增'"
      :modal="false"
      width="600px"
    >
      <el-form
        ref="formData"
        :rules="rules"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="通道名称：" prop="">
          <!-- <el-input :value="currItem.channelName" disabled size="small" /> -->
          {{ currItem.channelName }}
        </el-form-item>
        <el-form-item label="交易类型：" prop="">
          {{ currItem.tradeType == 0 ? '代收' : '代付' }}
        </el-form-item>
        <el-form-item label="产品名称：" :prop="isEdit?'':'productId'">
          <el-input v-if="isEdit" disabled :value="formData.productName" size="small" />
          <el-select v-else filterable v-model="formData.productId" placeholder="请选择产品">
            <el-option
              v-for="item in productListFilter"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用：" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model.number="formData.weight" size="small" />
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="onDialogBtnClose()" size="small"> 取消 </el-button>
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
        ref="form"
        :model="formPatch"
        d
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="是否启用" prop="isActive">
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
import { merchantRules } from './rules'
import {
  getProductPageByChannelId,
  createChannelProductRelation,
  updateChannelProductRelationActive,
  updateBatchChannelProductRelationActive,
  updateChannelProductRelationWeight,
  updateAllChannelProductRelationActiveByChannelId,
  updateIsOwnFirstById,
  deleteChannelProductRelationById,
  deleteBatchChannelProductRelation
} from '@/api/merchant'

import { getProductListByTenantId } from '@/api/service-product-mananger'

export default {
  name: 'gCodePreview',
  props: {
    currItem: {
      type: Object,
      default: {}
    }
  },
  computed: {
    productListFilter() {
      if (this.productList && this.productList.length == 0) {
        return []
      }
      if (typeof this.productList[0].tradeType == 'undefined') {
        console.warn('--productList--中没有 tradeType-')
        return this.productList
      }
      return this.productList.filter((ele) => ele.tradeType == this.currItem.tradeType)
    }
  },
  data() {
    return {
      rules: merchantRules,
      isOwnFirst: false,
      tableData: [],
      dialogVisible: false,
      formData: {
        selection: '',
        productId: '',
        channel_name: '',
        isActive: true,
        operation: ''
      },
      queryFormData: {
        productId: '',
        isActive: ''
      },
      isEdit: false, // 是否是编辑状态
      selectionRows: [], // 选中的行数据
      // 添加扩展数据，如 options 所需要的数据

      formPatch: {
        // 批量修改
        isActive: '' // 0 保持不变 1 开启 2 关闭
      },
      isPatchDialogVisible: false, // 是否是批量修改
      isModAll: false, // 是否修改全部
      productList: []
    }
  },
  methods: {
    handleWeightChange(row){

      updateChannelProductRelationWeight(row)
        .then(res=>{
          this.$message.success('修改成功')
        })
        .catch(err=>{
          this.$message.error(err.message)
        })
    },
    handleOwnFirstChange(e){
      console.log(e);
      updateIsOwnFirstById(this.currItem.channelId, e?1:0)
      .then(res=>{
        this.$message.success('修改成功')
      })
      .catch(err=>{
        this.$message.error(err.message)
      })
    },
    async getProductPageByChannelId(page) {
      let res = await getProductPageByChannelId(
        { channelId: this.currItem.channelId, ...this.queryFormData },
        page
      )

      if(res.data.list && res.data.list.length > 0){
        this.isOwnFirst = res.data.list[0].isOwnFirst == 1
      }

      this.tableData = res.data.list
      console.log(res, 'res')
      return res
    },
    showPatchEditDialog(isModAll) {
      this.isModAll = isModAll
      this.isPatchDialogVisible = true

      this.formPatch = {
        isActive: null // 0 保持不变 1 开启 2 关闭
      }
    },
    async onPatchBtnOk() {
      this.isPatchDialogVisible = false
      if (this.formPatch.isActive == null) {
        this.$message.success('保持不变')
        return
      }

      if (this.isModAll) {
        //全部修改
        let res = await updateAllChannelProductRelationActiveByChannelId({
          channelId: this.currItem.channelId,
          isActive: this.formPatch.isActive
        })
        console.log(res, 'res')
      } else {
        //批量修改
        let ids = this.selectionRows.map((ele) => ele.id)

        let res = await updateBatchChannelProductRelationActive({
          ids,
          isActive: this.formPatch.isActive
        })
        console.log(res, 'res')
      }
      this.$refs.tableRef.getTableData(1)
    },

    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定解绑产品【${row.productName}】吗？`)
        let res = await deleteChannelProductRelationById(row.id)
        this.$refs.tableRef.getTableData(1)
        console.log(res, '解绑成功')
      } catch (e) {
        console.log('取消解绑')
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
        channelName: this.currItem.channelName,
        productId: '',
        isActive: 1,
        weight: 1,
      }
    },
    onDialogBtnClose() {
      this.dialogVisible = false
      this.$refs.formData.resetFields()
    },
    onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            // 编辑
            await updateBatchChannelProductRelationActive({
              ids: [this.formData.id],
              isActive: this.formData.isActive,
              weight: this.formData.weight,
            })

            this.$message.success('修改成功')
          } else {
            // 新增
            let obj = { channelId: this.currItem.channelId, ...this.formData }
            const { channelName, ...rest } = obj
            let res = await createChannelProductRelation(rest)

            this.$message.success('新增成功')
          }

          this.onDialogBtnClose()
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
        isActive: ''
      }
      this.$refs.tableRef.getTableData(1)
    },

    handleSelectionChange(val) {
      console.log(JSON.stringify(val))
      this.selectionRows = val
    },
    async deleteSelectRows() {
      try {
        await this.$confirm('确定解绑选中的行吗？')
        let arr = []
        this.selectionRows.forEach((item) => {
          arr.push(item.id)
        })
        let res = await deleteBatchChannelProductRelation(arr)
        this.$message.success('解绑成功')
        this.$refs.tableRef.getTableData(1)
      } catch (e) {
        console.log('取消解绑')
      }
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.$refs.tableRef.getTableData(1)
    }
  },
  mounted() {
    // 所有产品列表明
      getProductListByTenantId(this.$store.state.tenant.currTenantId).then((res) => {
        if (res.data && res.data.length > 0) {
          this.productList = res.data
          this.$store.state.order.productList = res.data
        }
      })
  }
}
</script>

<style lang="scss" scoped></style>
