<template>
  <div class="container">
    <el-dialog :visible.sync="serviceDialogVisible" title="指定码商" width="900px" @close="onDialogClose()" >
      <div style="max-height: 600px; overflow: auto" v-if="serviceDialogVisible">
        <el-card>
          <el-form :inline="true"  :rules="queryRules" :model="queryFormData" class="demo-form-inline">
            <el-form-item label="码商账号：" prop="providerUserName">
              <el-input
                v-model="queryFormData.providerUserName"
                placeholder="请输入码商用户名"
                size="small"
              />
            </el-form-item>
            <el-form-item style="margin-right: 0px">
              <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
                >搜索</el-button
              >
              <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="mt-10">
          <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()"
            >新增</el-button
          >
          <el-button
            type="primary"
            :disabled="selectionRows.length == 0"
            plain
            icon="el-icon-delete"
            @click="showPatchDialog(false)"
            >批量解绑</el-button
          >
          <el-button type="primary" plain icon="el-icon-delete" @click="showPatchDialog(true)"
            >全部解绑</el-button
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
            <!-- @selection-change="handleSelectionChange" -->
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column align="center" type="index" label="序号" width="55"></el-table-column>
            <el-table-column label="码商账号" align="center" prop="productName">
              <template slot-scope="{ row }">
                {{ row.providerUserName }}
              </template>
            </el-table-column>

            <el-table-column label="码商名称" align="center">
              <template slot-scope="{ row }">
                {{ row.providerUserNickName }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
              <template slot-scope="{ row }">
                <el-button type="text" plain size="small" @click="showConfirmDelete(row)">
                  <i class="el-icon-delete" /> 解绑
                </el-button>
              </template>
            </el-table-column>
          </my-table>
        </el-card>
      </div>
      <div class="footer">
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" title="绑定码商" width="500px">
      <el-form
        ref="formRef"
        :model="formData"
        label-position="right"
        label-width="120px"
        :rules="rules"
        style="margin-right: 100px"
      >
        <el-form-item label="选择码商" prop="providerId">
          <el-select filterable v-model="formData.providerId" placeholder="请选择" size="small">
            <el-option
              v-for="item in serviceList"
              :key="item.providerId"
              :label="item.userNickName"
              :value="item.providerId"
            ></el-option>
          </el-select>
          <div class="help-tip">
            指定可以接收订单的码商
          </div>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button type="primary" @click="onBintBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMerchantListByTenantId,
  addMerchantProviderRelation,
  deleteMerchantProviderRelation,
  deleteMerchantProviderRelationBatch,
  deleteMerchantProviderRelationAll
} from '@/api/merchant-info.js'

import { getServiceListByTenantId } from '@/api/service-list.js'

import { merchantRules, queryRules } from './rules'

export default {
  props: {
    currItem: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      queryRules: queryRules,
      rules: merchantRules,
      queryFormData: this.getQueryForm(),
      filterText: '',
      serviceDialogVisible: false,
      selectionRows: [],
      tableData: [],
      formData: {},

      dialogVisible: false,
      serviceList: [],
      isAll: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    onDialogClose(){
      this.serviceDialogVisible = false
      this.$emit('close')
    },
    showPatchDialog(isAll) {
      this.$confirm(`确定要解绑${isAll ? '全部' : '选中的'}的码商吗?`, '提示', {
        type: 'warning'
      }).then(async () => {
        if (isAll) {
          await deleteMerchantProviderRelationAll(this.currItem.merchantId)
        } else {
          await deleteMerchantProviderRelationBatch(this.selectionRows.map((el) => el.id))
        }

        this.$message.success('解绑成功')
        this.flushPage()
      })
    },
    handleSelectionChange(val) {
      this.selectionRows = val
    },

    showConfirmDelete(row) {
      this.$confirm('此操作将解绑该码商, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteMerchantProviderRelation(row.id).then((res) => {
          this.$message.success('解绑成功')
          this.flushPage()
        })
      })
    },
    onBintBtnOk() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          await addMerchantProviderRelation({
            providerId: this.formData.providerId,
            merchantId: this.currItem.merchantId
          })

          this.$message.success('绑定成功')
          this.dialogVisible = false
          this.$refs.formRef.resetFields()
          this.flushPage()
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    showAddDialog() {
      this.dialogVisible = true
    },
    onDialogBtnOk() {
      console.log(this.selectionRows, 'this.selectionRows', '提交')
      this.serviceDialogVisible = false
    },

    async loadTableData(page) {
      let res = await getMerchantListByTenantId(page, {
        merchantId: this.currItem.merchantId,
        providerUserName: this.queryFormData.providerUserName
      })
      this.tableData = res.data.list
      console.log(res)

      // 获取码商列表
      if (this.serviceList.length == 0) {
        getServiceListByTenantId(this.$store.state.tenant.selectTenantId).then((res) => {
          this.serviceList = res.data
        })
      }

      return res
    },

    flushPage() {
      this.queryTableData()
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
    },
    getQueryForm() {
      return {}
    },

    queryTableData() {
      // 刷新表格
      this.$refs.tableRef.getTableData(1)
    }
  },
  mounted() {
    this.serviceDialogVisible = true
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 20px;
  display: flex;
  justify-content: right;
}
</style>
