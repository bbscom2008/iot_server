<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="商户账号" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入商户账号" size="small" />
        </el-form-item>

        <el-form-item label="商户名称" prop="userNickName">
          <el-input
            v-model="queryFormData.userNickName"
            placeholder="请输入商户名称"
            size="small"
          />
        </el-form-item>
        <el-form-item style="margin-right: 0px">
          <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
            >搜索</el-button
          >
          <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm()">重置</el-button>
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
        <el-table-column label="商户账号" align="center" prop="userName" />
        <el-table-column label="商户名称" align="center" prop="userNickName" />
        <el-table-column label="商户费率(%)" align="center">
          <template slot-scope="{ row }">
            {{ row.merchantRate }}
          </template>
        </el-table-column>
        <el-table-column label="代理分润比例(%)" align="center">
          <template slot-scope="{ row }">
            {{ row.merchantAgentProfitRate }}
          </template>
        </el-table-column>
        <el-table-column label="单笔费用(元)" align="center">
          <template slot-scope="{ row }">
            {{ row.merchantPerTransactionFee }}
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center" width="90px">
          <template slot-scope="{ row }">
            <el-tag v-if="row.isActive">{{ row.isActive ? '开启' : '关闭' }}</el-tag>
            <el-tag v-else style="color: red">{{ row.isActive ? '开启' : '关闭' }}</el-tag>
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
            <el-button type="text" size="small" @click="showRateHistoryDialog(row)">
              <i class="el-icon-edit" />费率记录
            </el-button>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      @close="onDialogBtnClose()"
      :title="isEdit ? '修改商户' : '新增商户'"
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
        <el-form-item label="通道名称" prop="">
          <el-input
            v-model="currItem.channelName"
            disabled
            placeholder="请输入通道名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户名称" :prop="isEdit ? '' : 'merchantIds'">
          <el-input
            v-if="isEdit"
            disabled
            v-model="formData.userNickName"
            placeholder="请输入商户名称"
            size="small"
          />
          <el-select
            filterable
            :multiple="true"
            v-else
            v-model="formData.merchantIds"
            placeholder="请选择"
            @change="merchantChange"
          >
          <el-option v-if="allMerchantList.length!=0" label="全部" value=""></el-option>
            <el-option
              v-for="item in allMerchantList"
              :key="item.merchantId"
              :label="item.userNickName"
              :value="item.merchantId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商户费率" prop="merchantRate">
          <el-input
            v-number-input
            type="number"
            v-model="formData.merchantRate"
            placeholder="请输入商户费率"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
          <div class="help-tip">如 3% 表示每成交1笔订单，平台抽取订单金额的3%</div>
        </el-form-item>

        <el-form-item label="代理分润比例" prop="merchantAgentProfitRate">
          <el-input
            v-number-input
            type="number"
            v-model="formData.merchantAgentProfitRate"
            placeholder="请输入代理分润比例"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
          <div class="help-tip">如 3% 表示每成交100元，商户代理抽取3元</div>
        </el-form-item>

        <el-form-item label="单笔费用" prop="merchantPerTransactionFee">
          <el-input
            v-number-input
            type="number"
            v-model="formData.merchantPerTransactionFee"
            placeholder="请输入费用金额"
            size="small"
          >
            <template slot="append"> 元 </template>
          </el-input>
          <div class="help-tip">如 2元 表示每成交1笔订单，平台抽取2元</div>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
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
      @close="onPatchBtnCancel()"
      width="600px"
    >
      <el-form
        ref="formPatchRef"
        :model="formPatch"
        :rules="setRules"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="修改费率" prop="isUpdateMerchantRate">
          <el-switch v-model="formPatch.isUpdateMerchantRate"></el-switch>
        </el-form-item>

        <el-form-item v-if="formPatch.isUpdateMerchantRate" label="商户费率" prop="merchantRate">
          <el-input
            v-number-input
            type="number"
            v-model="formPatch.merchantRate"
            placeholder="请输入商户费率"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
        </el-form-item>

        <el-form-item v-if="formPatch.isUpdateMerchantRate" label="调整类型" prop="type">
          <el-radio-group v-model="formPatch.merchantRateAdjustType">
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

        <el-form-item label="修改单笔费用" prop="isUpdateTransactionFee">
          <el-switch v-model="formPatch.isUpdateTransactionFee"></el-switch>
        </el-form-item>

        <el-form-item
          label="单笔费用"
          prop="merchantPerTransactionFee"
          v-if="formPatch.isUpdateTransactionFee"
        >
          <el-input
            v-number-input-positive
            type="number"
            v-model="formPatch.merchantPerTransactionFee"
            placeholder="请输入费用金额"
            size="small"
          >
            <template slot="append"> 元 </template>
          </el-input>
          <div class="help-tip">如 2元 表示每成交1笔订单，平台抽取2元</div>
        </el-form-item>

        <el-form-item label="修改分润比例" prop="isUpdateProfitRate">
          <el-switch v-model="formPatch.isUpdateProfitRate"></el-switch>
        </el-form-item>

        <el-form-item
          label="代理分润比例"
          prop="merchantAgentProfitRate"
          v-if="formPatch.isUpdateProfitRate"
        >
          <el-input
            v-number-input
            type="number"
            v-model="formPatch.merchantAgentProfitRate"
            placeholder="请输入比例"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
          <div class="help-tip"></div>
        </el-form-item>

        <el-form-item v-if="formPatch.isUpdateProfitRate" label="调整类型" prop="type">
          <el-radio-group v-model="formPatch.profitRateAdjustType">
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

        <el-form-item label="是否启用" prop="isActive">
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

    <MerchantRateHistoryDialog  ref="rateHistoryRef"></MerchantRateHistoryDialog>

  </div>
</template>

<script>
import {
  getMerchantPageByChannelId,
  createChannelMerchantRelation,
  updateMerchantChannelRelation,
  deleteMerchantChannelRelation,
  updateAllChannelMerchantRelationByChannelId,
  updateMerchantChannelRelationBatch,
  deleteMerchantChannelRelationBatch,
  getExcludeMerchantListByChannelId
} from '@/api/merchant-info.js'

import { getChannelByTenantId } from '@/api/merchant.js'
import MerchantRateHistoryDialog from './merchant-rate-history-dialog.vue'

import { merchantRules, merchantSettingRules } from './rules.js'
export default {
  name: 'gCodePreview',
  components: {
    MerchantRateHistoryDialog
  },
  props: {
    currItem: {
      type: Object,
      default: {}
    },
    parentV: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    parentV(val) {
      console.log('-------parent  visital----', val)
      // 每次重新加载页面时，重置表单数据和表格数据
      // if (!val) {
      //   this.dialogVisible = false
      //   this.isPatchDialogVisible = false
      //   this.feeDialogVisible = false
      //   this.selectionRows = []
      //   this.queryFormData = this.getQueryForm()
      //   this.$refs.tableRef.clearSelection()
      // }
    }
  },
  data() {
    return {
      setRules: merchantSettingRules,
      rules: merchantRules,
      code: '',
      tableData: [],
      dialogVisible: false,
      feeDialogVisible: false,
      formData: {},
      feeFormData: {},
      queryFormData: this.getQueryForm(),
      isEdit: false, // 是否是编辑状态
      selectionRows: [], // 选中的行数据
      // 添加扩展数据，如 options 所需要的数据
      isPatchDialogVisible: false, // 是否是批量修改
      isModAll: false, // 是否修改全部
      // 添加扩展数据，如 options 所需要的数据
      formPatch: {},
      allMerchantList: [],
    }
  },
  methods: {
    showRateHistoryDialog(row) {
      this.$refs.rateHistoryRef.showRateHistoryDialog(row)
    },
    merchantChange(e) {
      if (e.indexOf('') != -1 && e.length > 1) {
        this.formData.merchantIds = ['']
        this.$message.error('您已选择全部，无须选择其他！')
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
        isUpdateMerchantRate: 0, // 是否修改商户费率
        // merchantRate: '', // 商户费率
        merchantRateAdjustType: 1, //1设置为当前值，2全部增加当前值，3全部减少当前

        isUpdateTransactionFee: 0, // 是否修改单笔费用
        // merchantPerTransactionFee: '', // 单笔费用

        isUpdateProfitRate: 0, // 是否修改分润比例
        // merchantAgentProfitRate: '', // 分润比例
        profitRateAdjustType: 1, // 1设置为当前值，2全部增加当前值，3全部减少当前

        isActive: null // 是否启用：0-禁用，1-启用,示例值(1)
      }
    },
    onPatchBtnCancel() {
      this.$refs.formPatchRef.resetFields()
      this.isPatchDialogVisible = false
    },
    onPatchBtnOk() {
      this.$refs.formPatchRef.validate(async (valid) => {
        if (valid) {
          if (this.isModAll) {
            // 全部
            await updateAllChannelMerchantRelationByChannelId({
              channelId: this.currItem.channelId, // 通道id
              ...this.formPatch,
              merchantRate: this.formPatch.isUpdateMerchantRate
                ? +this.formPatch.merchantRate
                : null, // 商户费率
              isUpdateMerchantRate: this.formPatch.isUpdateMerchantRate == 1, // 是否修改商户费率
              isUpdateProfitRate: this.formPatch.isUpdateProfitRate == 1, // 是否修改分润比例
              isUpdateTransactionFee: this.formPatch.isUpdateTransactionFee == 1, // 是否修改单笔费用
              merchantPerTransactionFee: this.formPatch.isUpdateTransactionFee
                ? Number(this.formPatch.merchantPerTransactionFee)
                : null, // 单笔费用
              merchantAgentProfitRate: this.formPatch.isUpdateProfitRate
                ? Number(this.formPatch.merchantAgentProfitRate)
                : null // 分润比例
            })
          } else {
            await updateMerchantChannelRelationBatch({
              idList: this.selectionRows.map((item) => item.id), // 选中的id数组
              merchantId: this.currItem.merchantId, // 商户id
              ...this.formPatch,
              merchantRate: this.formPatch.isUpdateMerchantRate
                ? +this.formPatch.merchantRate
                : null, // 商户费率
              isUpdateMerchantRate: this.formPatch.isUpdateMerchantRate == 1, // 是否修改商户费率
              isUpdateProfitRate: this.formPatch.isUpdateProfitRate == 1, // 是否修改分润比例
              isUpdateTransactionFee: this.formPatch.isUpdateTransactionFee == 1, // 是否修改单笔费用
              merchantPerTransactionFee: this.formPatch.isUpdateTransactionFee
                ? Number(this.formPatch.merchantPerTransactionFee)
                : null, // 单笔费用
              merchantAgentProfitRate: this.formPatch.isUpdateProfitRate
                ? Number(this.formPatch.merchantAgentProfitRate)
                : null // 分润比例
            })
          }
          this.$message.success('更新完成')
          this.onPatchBtnCancel()
          this.flushPage()
        }
      })
    },

    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确定解绑名称为 【${row.userNickName}】的商户 吗？`)
        console.log(row)
        await deleteMerchantChannelRelation(row.id)
        this.$message.success('解绑成功')
        this.flushPage()
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
        merchantIds: [],
        merchantPerTransactionFee: '0', // 单笔费用
        merchantAgentProfitRate: 0, // 商户代理分润比例
        merchantRate: '',
        isActive: 1,
        operation: ''
      }
    },
    optAll(flag) {
      this.tableData = this.tableData.map((item) => {
        item.isActive = flag
        return item
      })
    },
    onDialogBtnClose() {
      this.$refs.formData.resetFields()
      this.dialogVisible = false
    },
    onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            await updateMerchantChannelRelation({
              id: this.formData.id,
              merchantRate: this.formData.merchantRate,
              merchantAgentProfitRate: this.formData.merchantAgentProfitRate,
              merchantPerTransactionFee: this.formData.merchantPerTransactionFee,
              isActive: this.formData.isActive
            })
            this.$message.success('修改成功')
          } else {
            let merchantIdsFlag = this.formData.merchantIds
            const isAllmerchant = this.formData.merchantIds.indexOf('') != -1
            if (isAllmerchant) {
              merchantIdsFlag = []
            }

            await createChannelMerchantRelation({
              merchantIds: merchantIdsFlag,
              channelId: this.currItem.channelId,
              merchantRate: this.formData.merchantRate,
              merchantAgentProfitRate: this.formData.merchantAgentProfitRate,
              merchantPerTransactionFee: this.formData.merchantPerTransactionFee,
              isActive: this.formData.isActive
            })
            this.$message.success('添加成功')
          }

          this.onDialogBtnClose()
          this.flushPage()
        }
      })
      return
    },

    handleSelectionChange(val) {
      this.selectionRows = val
    },
    async deleteSelectRows() {
      try {
        await this.$confirm('确定删除选中的行吗？')
        // 删除选中的行
        await deleteMerchantChannelRelationBatch(this.selectionRows.map((item) => item.id))
        //todo 调用接口删除
        this.$message.success('解绑成功')
        this.flushPage()
      } catch (e) {
        console.log('取消删除')
      }
    },

    async loadTableData(page) {
      let params = {
        channelId: this.currItem.channelId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await getMerchantPageByChannelId(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    queryTableData() {
      // 刷新表格
      this.$refs.tableRef.getTableData(1)
    },

    flushPage() {
      this.queryTableData()
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
    },
    getQueryForm() {
      return {
        userName: '',
        userNickName: ''
      }
    }
  },
  mounted() {
    getExcludeMerchantListByChannelId(this.currItem.channelId).then((res) => {
      if (res.data && res.data.length > 0) {
        this.allMerchantList = res.data
        this.$store.state.order.allMerchantList = res.data
      }
    })
  }
}
</script>

<style lang="scss" scoped>
::v-deep .my-table .el-input-group__append {
  padding: 0 10px;
}
</style>
