<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        ref="queryFormDataRef"
        :rules="queryRules"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="账号" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="码商名称" prop="userNickName">
          <el-input
            v-model="queryFormData.userNickName"
            placeholder="请输入码商名称"
            size="small"
          />
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
      <el-button type="success" plain icon="el-icon-download" @click="exportReport()"
        >导出</el-button
      >
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        @click="showPatchDialog(false)"
        :disabled="selectionRows.length == 0"
        >批量修改</el-button
      >
      <el-button type="primary" plain icon="el-icon-plus" @click="showPatchDialog(true)"
        >全部修改</el-button
      >

      <my-table
        class="mt-20"
        :loadData="loadTableData"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column label="账号" align="center" prop="userName" />
        <el-table-column label="码商名称" align="center" prop="userNickName" />

        <!-- <el-table-column label="开启代收" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.isCollectEnable"> 开启</span>
            <el-tag v-else type="danger">关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开启代付" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.isPaymentEnable"> 开启</span>
            <el-tag v-else type="danger">关闭</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="码商权限" align="center">
          <el-table-column label="修改接单金额" align="center">
            <template slot-scope="{ row }">
              <el-tag type="success" v-if="row.isAllowModifyAcceptAmount"> 开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="代付批量接单" align="center">
            <template slot-scope="{ row }">
              <el-tag stype="success" v-if="row.isPaymentBatchAccept"> 开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="一键拉黑" align="center">
            <template slot-scope="{ row }">
              <el-tag stype="success" v-if="row.isOneKeyBlacklist"> 开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="取消订单" align="center">
            <template slot-scope="{ row }">
              <el-tag stype="success" v-if="row.isCancelOrder"> 开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>


          <el-table-column label="余额划拨" align="center">
            <template slot-scope="{ row }">
              <el-tag stype="success" v-if="row.isBalanceTransfer"> 开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="是否需要审核" align="center">
            <template slot-scope="{ row }">
              <el-tag stype="success" v-if="row.isAuditRequired"> 开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="是否延时回款" align="center">
            <template slot-scope="{ row }">
              <el-tag stype="success" v-if="row.isDelayedPayment"> 开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="延时回款时间(仅代付生效)" align="center" width="120">
            <template slot-scope="{ row }">
              <el-tag stype="success" v-if="row.isDelayedPayment">
                {{
                  delay_payment_time_options.find((ele) => ele.value == row.delayedPaymentTime)
                    .label
                }}
              </el-tag>
              <el-tag v-else type="danger" > 实时回款 </el-tag>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="团队权限" align="center">
          <el-table-column label="查看全部下级订单" align="center" width="100">
            <template slot-scope="{ row }">
              <el-tag stype="success" v-if="row.isViewAllSubOrders"> 开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作全部下级订单" align="center" width="100">
            <template slot-scope="{ row }">
              <el-tag stype="success" v-if="row.isOperateAllSubOrders"> 开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="查看直接下级订单" align="center" width="100">
            <template slot-scope="{ row }">
              <el-tag stype="success" v-if="row.isViewDirectSubOrders"> 开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作直接下级订单" align="center" width="100">
            <template slot-scope="{ row }">
              <el-tag stype="success" v-if="row.isOperateDirectSubOrders"> 开启</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100" fixed="right">
          <template slot-scope="{ row }">
            <div class="opt">
              <div type="primary" class="btn mt-5 editBtn" @click="showEdit(row)">
                <i class="el-icon-edit" />修改
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      @close="onDialogBtnCancel()"
      :visible.sync="editDialogVisible"
      title="修改权限"
      width="700px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="right"
        label-width="150px"
        style="margin-left: 50px"
        inline
      >
        <!-- <el-form-item label="开启代收：" prop="isCollectEnable">
          <el-switch v-model="formData.isCollectEnable" />
        </el-form-item>
        <el-form-item label="开启代付：" prop="isPaymentEnable">
          <el-switch v-model="formData.isPaymentEnable" />
        </el-form-item> -->
        <div>
          <p class="labelText">码商权限：</p>

          <el-form-item label="修改接单金额：" prop="isAllowModifyAcceptAmount">
            <el-switch v-model="formData.isAllowModifyAcceptAmount" />
          </el-form-item>

          <el-form-item label="代付批量接单：" prop="isPaymentBatchAccept">
            <el-switch v-model="formData.isPaymentBatchAccept" />
          </el-form-item>

          <el-form-item label="一键拉黑：" prop="isOneKeyBlacklist">
            <el-switch v-model="formData.isOneKeyBlacklist" />
          </el-form-item>

          <el-form-item label="取消订单：" prop="isCancelOrder">
            <el-switch v-model="formData.isCancelOrder" />
          </el-form-item>


          <el-form-item label="余额划拨：" prop="isBalanceTransfer">
            <el-switch v-model="formData.isBalanceTransfer" />
          </el-form-item>
          <el-form-item label="是否需要审核：" prop="isAuditRequired">
            <el-switch v-model="formData.isAuditRequired" />
          </el-form-item>
          <el-form-item label="是否延时回款：" prop="isDelayedPayment">
            <el-switch v-model="formData.isDelayedPayment" />
          </el-form-item>
          <el-form-item
            v-if="formData.isDelayedPayment"
            label="选择延时回款时间："
            prop="delayedPaymentTime"
          >
            <el-select
              filterable
              v-model="formData.delayedPaymentTime"
              placeholder="请选择延时回款时间"
              required
              size="small"
            >
              <el-option
                v-for="item in delay_payment_time_options"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <p class="labelText">团队权限：</p>
          <div>
            <el-form-item label="查看全部下级订单：" prop="isViewAllSubOrders">
              <el-switch v-model="formData.isViewAllSubOrders" />
            </el-form-item>
            <el-form-item
              label="操作全部下级订单："
              v-if="formData.isViewAllSubOrders"
              prop="isOperateAllSubOrders"
            >
              <el-switch v-model="formData.isOperateAllSubOrders" />
            </el-form-item>
          </div>
          <el-form-item label="查看直接下级订单：" prop="isViewDirectSubOrders">
            <el-switch v-model="formData.isViewDirectSubOrders" />
          </el-form-item>
          <el-form-item
            label="操作直接下级订单："
            v-if="formData.isViewDirectSubOrders"
            prop="isOperateDirectSubOrders"
          >
            <el-switch v-model="formData.isOperateDirectSubOrders" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showPatchDialogVisable"
      :title="isModAll ? '全部修改' : '批量修改'"
      @close="onPatchDialogBtnCancel()"
      width="950px"
    >
      <el-form
        :model="formPatchData"
        ref="patchFormRef"
        label-position="right"
        label-width="150px"
        style="margin-left: 50px"
        :rules="formRules"
        inline
      >
        <!-- <el-form-item label="开启代收：" prop="isCollectEnable">
          <el-radio-group v-model="formPatchData.isCollectEnable" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开启代付：" prop="isPaymentEnable">
          <el-radio-group v-model="formPatchData.isPaymentEnable" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <p class="labelText">码商权限：</p>

        <el-form-item label="修改接单金额：" prop="isAllowModifyAcceptAmount">
          <el-radio-group v-model="formPatchData.isAllowModifyAcceptAmount" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="代付批量接单：" prop="isPaymentBatchAccept">
          <el-radio-group v-model="formPatchData.isPaymentBatchAccept" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>


        <el-form-item label="一键拉黑：" prop="isOneKeyBlacklist">
          <el-radio-group v-model="formPatchData.isOneKeyBlacklist" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="取消订单：" prop="isCancelOrder">
          <el-radio-group v-model="formPatchData.isCancelOrder" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="余额划拨：" prop="isBalanceTransfer">
          <el-radio-group v-model="formPatchData.isBalanceTransfer" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否需要审核：" prop="isAuditRequired">
          <el-radio-group v-model="formPatchData.isAuditRequired" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否延时回款：" prop="isDelayedPayment">
          <el-radio-group v-model="formPatchData.isDelayedPayment" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="formPatchData.isDelayedPayment"
          label="选择延时回款时间："
          prop="delayedPaymentTime"
        >
          <el-select
            filterable
            v-model="formPatchData.delayedPaymentTime"
            placeholder="请选择延时回款时间"
            size="small"
          >
            <el-option
              v-for="item in delay_payment_time_options"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <p class="labelText">团队权限：</p>
        <div>
          <el-form-item label="查看全部下级订单：" prop="isViewAllSubOrders">
            <el-radio-group v-model="formPatchData.isViewAllSubOrders" size="small">
              <el-radio :label="null">保持不变</el-radio>
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="formPatchData.isViewAllSubOrders"
            label="操作全部下级订单："
            prop="isOperateAllSubOrders"
          >
            <el-radio-group v-model="formPatchData.isOperateAllSubOrders" size="small">
              <el-radio :label="null">保持不变</el-radio>
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="查看直接下级订单：" prop="isViewDirectSubOrders">
          <el-radio-group v-model="formPatchData.isViewDirectSubOrders" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="formPatchData.isViewDirectSubOrders"
          label="操作直接下级订单："
          prop="isOperateDirectSubOrders"
        >
          <el-radio-group v-model="formPatchData.isOperateDirectSubOrders" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onPatchDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onPatchDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAuthList, updateAuth, updateAllAuth, updateBatchAuth ,exportProviderPermissionList} from '@/api/service-auth.js'

import { queryRules } from './rules'
import FileSaver from 'file-saver'
export default {
  name: 'ServiceAuth',
  data() {
    return {
      queryRules: queryRules,
      formPatchData: {},
      tableData: [],
      dialogVisible: false,
      editDialogVisible: false,
      showPatchDialogVisable: false, // 批量修改
      formData: {},
      formRules: {
        delayedPaymentTime: [{ required: true, message: '请选择延时回款时间', trigger: 'change' }]
      },
      queryFormData: {},
      delay_payment_time_options: [
        // {
        //   value: 0,
        //   label: '实时回款'
        // },
        {
          value: 1,
          label: '1分钟'
        },
        {
          value: 6,
          label: '2分钟'
        },
        {
          value: 9,
          label: '5分钟'
        },
        {
          value: 14,
          label: '10分钟'
        },
        {
          value: 16,
          label: '30分钟'
        },
        {
          value: 17,
          label: '1小时'
        },
        {
          value: 18,
          label: '2小时'
        }
      ],
      merchant_key: '',
      selectionRows: [], // 选中的行数据
      isModAll: false // 是否是全部修改
      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    async exportReport() {
      let params = {
        tenantId: this.$store.state.tenant.currTenantId
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
      let res = await exportProviderPermissionList(params)
      FileSaver.saveAs(res, '码商权限列表.xlsx')
    },
    async loadTableData(page) {
      let params = {
        tenantId: this.$store.state.tenant.currTenantId
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

      let res = await getAuthList(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    flushPage() {
      this.queryTableData()
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
      this.$refs.queryFormDataRef.resetFields()
    },
    getQueryForm() {
      return {}
    },

    queryTableData() {
      this.$refs.queryFormDataRef.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    },

    onPatchDialogBtnCancel() {
      this.$refs.patchFormRef.resetFields()
      this.showPatchDialogVisable = false
    },
    onPatchDialogBtnOk() {
      this.$refs.patchFormRef.validate(async (valid) => {
        if (valid) {
          // 提交表单数据
          const tenantId = this.$store.state.tenant.currTenantId
          this.formPatchData.isOperateAllSubOrders = this.formPatchData.isViewAllSubOrders
            ? this.formPatchData.isOperateAllSubOrders
            : 0
          this.formPatchData.isOperateDirectSubOrders = this.formPatchData.isViewDirectSubOrders
            ? this.formPatchData.isOperateDirectSubOrders
            : 0

          if (this.isModAll) {
            await updateAllAuth({ ...this.formPatchData, tenantId })
          } else {
            // 批量修改
            let providerIdList = this.selectionRows.map((item) => item.providerId)
            await updateBatchAuth({
              providerIdList,
              ...this.formPatchData,
              tenantId
            })
          }

          this.$message.success('修改成功')

          this.onPatchDialogBtnCancel()
          this.flushPage()
        }
      })
    },
    showPatchDialog(isModAll) {
      this.isModAll = isModAll // 是否是全部修改

      this.formPatchData = {
        isCollectEnable: null, //'' 保持不变  1  开启   0  关闭
        isPaymentEnable: null, //'' 保持不变  1  开启   0  关闭
        isPaymentBatchAccept: null, //'' 保持不变  1  开启   0  关闭
        isAllowModifyAcceptAmount: null, //'' 保持不变  1  开启   0  关闭
        isOneKeyBlacklist: null, //'' 保持不变  1  开启   0  关闭
        isCancelOrder: null, //'' 保持不变  1  开启   0  关闭
        isBalanceTransfer: null, //'' 保持不变  1  开启   0  关闭
        isAuditRequired: null, //'' 保持不变  1  开启   0  关闭
        isDelayedPayment: null, //'' 保持不变  1  开启   0  关闭
        isViewAllSubOrders: null, //'' 保持不变  1  开启   0  关闭
        isOperateAllSubOrders: null, //'' 保持不变  1  开启   0  关闭
        isViewDirectSubOrders: null, //'' 保持不变  1  开启   0  关闭
        isOperateDirectSubOrders: null, //'' 保持不变  1  开启   0  关闭
        delayedPaymentTime: '' //'' 保持不变  1  开启   0  关闭
      }

      this.showPatchDialogVisable = true
    },
    showEdit(row) {
      this.editDialogVisible = true
      console.log(JSON.stringify(row))
      this.providerId = row.providerId
      this.formData = {
        isCollectEnable: row.isCollectEnable,
        isPaymentEnable: row.isPaymentEnable,
        isBalanceTransfer: row.isBalanceTransfer,
        isOneKeyBlacklist: row.isOneKeyBlacklist,
        isCancelOrder: row.isCancelOrder,
        isPaymentBatchAccept: row.isPaymentBatchAccept,
        isAllowModifyAcceptAmount: row.isAllowModifyAcceptAmount,
        delayedPaymentTime: row.delayedPaymentTime,
        isAuditRequired: row.isAuditRequired,
        isDelayedPayment: row.isDelayedPayment,

        isViewAllSubOrders: row.isViewAllSubOrders,
        isOperateAllSubOrders: row.isOperateAllSubOrders,

        isViewDirectSubOrders: row.isViewDirectSubOrders,
        isOperateDirectSubOrders: row.isOperateDirectSubOrders,
        tenantId: row.tenantId
      }
    },
    handleSelectionChange(val) {
      console.log(JSON.stringify(val))
      this.selectionRows = val
    },

    onDialogBtnCancel() {
      this.$refs.formRef.resetFields()
      this.editDialogVisible = false
    },
    onDialogBtnOk() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          // 提交表单数据
          console.log('表单数据：', this.formData)

          this.formData.isOperateAllSubOrders = this.formData.isViewAllSubOrders
            ? this.formData.isOperateAllSubOrders
            : '0'
          this.formData.isOperateDirectSubOrders = this.formData.isViewDirectSubOrders
            ? this.formData.isOperateDirectSubOrders
            : '0'

          await updateAuth({ ...this.formData, providerIdList: [this.providerId] })

          this.$message.success('修改成功')

          this.onDialogBtnCancel()
          this.flushPage()
        }
      })
    }
  },
  mounted() {
    // this.mockData()
  }
}
</script>

<style lang="scss" scoped>
::v-deep td.balance {
  .cell {
    // background-color: pink;
    height: 85px;
  }
}
.line {
  display: flex;
  flex-direction: row;
  align-items: center;
  .el_btn {
    margin-left: 5px;
    width: 40px;
    padding: 6px;
  }
}
.red {
  color: red;
}
.tag-pink {
  cursor: pointer;
  margin-left: 5px;
  color: #eb2f96;
  background: #fff0f6;
  border-color: #ffadd2;
}
.label {
  font-size: 18px;
  margin-right: 10px;
  line-height: 20px;
}
.text {
  font-size: 16px;
  // color: green;
  line-height: 20px;
}
.remark {
  font-size: 12px;
}
.editBtn {
  cursor: pointer;
}
.labelText {
  // font-size: 18px;
  line-height: 18px;
  font-weight: bold;
}
</style>
