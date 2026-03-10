<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        :rules="queryRules"
        ref="queryFormDataRef"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="订单号" prop="acceptanceId">
          <el-input
            v-model="queryFormData.acceptanceId"
            placeholder="请输入订单号"
            size="small"
          />
        </el-form-item>

        <!-- <el-form-item label="账号" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="名称" prop="merchantName">
          <el-input v-model="queryFormData.merchantName" placeholder="请输入名称" size="small" />
        </el-form-item> -->

        <el-form-item label="订单金额" prop="orderAmount">
          <el-input
            v-model="queryFormData.orderAmount"
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="订单状态" prop="acceptanceApplyStatus">
          <el-select
            v-model="queryFormData.acceptanceApplyStatus"
            placeholder="请选择订单状态"
            size="small"
          >
            <!-- 兑付状态(0-待支付、1-已支付、2-审核通过、3-审核驳回、4-已取消) -->
            <el-option label="全部" value=""></el-option>
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in acceptOrderOptions"
              :key="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="queryFormData.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item>

        <el-form-item label="创建时间" prop="">
          <el-date-picker
            v-model="queryFormData.createTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="myPickerOptionsAll"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
            >搜索</el-button
          >
          <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-10" v-loading="$store.state.app.loading">
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>

      <el-button type="warning" plain icon="el-icon-download" @click="exportReport()"
        >导出</el-button
      >

      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="loadTableData"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="订单号" align="center" prop="acceptanceId" />
        <!-- <el-table-column label="账号" align="center" prop="userName" /> -->

        <!-- <el-table-column label="付款人信息" align="center" width="150"  >
          <template slot-scope="{ row }">
           <div class="ta-l" >
            <div>
              <el-tag>账号</el-tag>{{row.userName}}
            </div>
            <div class="mt-5" >
              <el-tag>名称</el-tag>{{row.userNickName}}
            </div>
           </div>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="商户信息" align="center" prop="">
          <template slot-scope="{ row }">
            {{ row.merchantCount }}
            <el-button type="text" @click="look_item_nfo(row)">查看</el-button>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="订单金额(元)" align="center" prop="orderAmount">
          <template slot-scope="{ row }">
            {{ row.orderAmount }}
          </template>
        </el-table-column>

        <el-table-column label="实付金额(元)" align="center" prop="payAmount">
          <template slot-scope="{ row }">
            {{ row.payAmount }}
          </template>
        </el-table-column> -->

        <el-table-column label="金额" align="center" min-width="150">
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div><el-tag>订单（元）</el-tag> {{ row.orderAmount }}</div>
              <div class="mt-5"><el-tag>实付（ U ）</el-tag> {{ row.payAmount }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="U价汇率" align="center">
          <template slot-scope="{ row }">
            {{ row.usdRate }}
          </template>
        </el-table-column>

        <el-table-column label="收款信息" align="center" min-width="100" >
          <template slot-scope="{ row }">
            <span
              style="cursor: pointer; color: #1890ff"
              @click="
                (e) => {
                  clipboard(row.paymentData, e)
                }
              "
              >{{ row.paymentData }}</span
            >
          </template>
        </el-table-column>

        <el-table-column label="订单状态" align="center">
          <template slot-scope="{ row }">
            <!-- (0-待支付、1-已支付、2-审核通过、3-审核驳回、4-已取消) -->

            <el-tag
              :type="
                acceptOrderOptions.find((item) => item.value === row.acceptanceApplyStatus).type
              "
            >
              {{
                acceptOrderOptions.find((item) => item.value === row.acceptanceApplyStatus).label
              }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="审核人" align="center">
          <template slot-scope="{ row }">
            {{ row.auditUserName }}
          </template>
        </el-table-column>

        <el-table-column label="审核说明" align="center">
          <template slot-scope="{ row }">
            {{ row.auditResultRemark }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="审核时间" align="center">
          <template slot-scope="{ row }">
            {{ row.auditTime }}
          </template>
        </el-table-column> -->

       

        <el-table-column label="时间" align="center" min-width="200">
          <template slot-scope="{ row }">
            <div class="ta-l" >
              <div><el-tag>创建时间</el-tag>{{ row.createTime }}</div>
              <div><el-tag>确认时间</el-tag>{{ row.confirmOrderTime }}</div>
              <div><el-tag>过期时间</el-tag>{{ row.expiredTime }}</div>
              <div><el-tag>审核时间</el-tag>{{ row.auditTime }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center">
          <template slot-scope="{ row }">
            {{ row.remark }}
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="操作" width="100" fixed="right" >
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="confirmAcceptenceOrder(row)">
                <i class="el-icon-check" />确认支付
              </div>

              <div type="success" class="btn" @click="cancelmAcceptenceOrder(row)">
                <i class="el-icon-close" />取消
              </div>

              <!-- <div type="success" class="btn" @click="auditAcceptenceOrder(row)">
                <i class="el-icon-s-check" />审核
              </div> -->
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      @close="onDialogBtnCancel()"
      :visible.sync="dialogVisible"
      title="新增"
      width="600px"
    >
      <el-form
        ref="formRef"
        :rules="rules"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <!-- <el-form-item label="码商名称" prop="">
          <el-select v-model="formData.userId" filterable placeholder="请选择码商" size="small">
            <el-option
              v-for="item in providerList"
              :key="item.providerId"
              :label="item.userNickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item> -->

        <el-form-item
          label="金额"
          prop="orderAmount"
          :rules="[{ required: true, message: '请输入订单金额', trigger: 'blur' }]"
        >
          <el-input v-model="formData.orderAmount" placeholder="请输入订单金额" size="small" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      class="order-info-dlg"
      :visible.sync="orderInfoVisible"
      title="订单信息"
      width="450px"
    >
      <AcceptOrderInfo :order-info="orderInfo"></AcceptOrderInfo>
      <div class="tips">支付完成以后，点击确认支付</div>
      <div slot="footer" style="text-align: center; margin-top: 15px">
        <el-button @click="closeOrderInfoDlg()" size="small"> 随后支付 </el-button>
        <el-button
          type="primary"
          @click="confirmAcceptenceOrder()"
          size="small"
          style="margin-left: 40px"
        >
          确认支付
        </el-button>
      </div>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog
      @close="onCommonBtnCancel()"
      :visible.sync="showChuliDialogVisual"
      title="审核订单"
      width="600px"
    >
      <el-form
        ref="commonFormRef"
        :model="chuliFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="订单号">
          <el-input disabled v-model="chuliFormData.acceptanceId" size="small" />
        </el-form-item>

        <!-- <el-form-item label="商户订单号" prop="merchantOrderNo">
          <el-input
            disabled
            v-model="chuliFormData.merchantOrderNo"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item> -->

        <el-form-item label="订单金额(元)" prop="orderAmount">
          <el-input disabled v-model="chuliFormData.orderAmount" size="small" />
        </el-form-item>

        <el-form-item label="U价汇率" prop="usdRate">
          <el-input disabled v-model="chuliFormData.usdRate" size="small" />
        </el-form-item>

        <el-form-item label="实付金额(U)" prop="payAmount">
          <el-input disabled v-model="chuliFormData.payAmount" size="small" />
        </el-form-item>

        <el-form-item label="审核" prop="acceptanceApplyStatus">
          <el-select
            filterable
            v-model="chuliFormData.acceptanceApplyStatus"
            placeholder="请选择操作类型"
            size="small"
          >
            <el-option label="审核通过" :value="2"></el-option>
            <el-option label="审核驳回" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="chuliFormData.acceptanceApplyStatus == 3"
          label="驳回原因"
          prop="auditResultRemark"
          :rules="[{ required: true, message: '请输入驳回原因, 最大255个字', trigger: 'blur' }]"
        >
          <el-input
            type="textarea"
            :rows="3"
            v-model="chuliFormData.auditResultRemark"
            placeholder="请输入驳回原因"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCommonBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onCommonBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'

import { getProviderOptionList } from '@/api/service-list.js'
import AcceptOrderInfo from './acceptence/accept-order-info.vue'
import {
  getAcceptenceOrderPage,
  createAcceptenceOrder,
  confirmAcceptenceOrder,
  auditAcceptenceOrder,
  cancelAcceptenceOrder,
  exportAcceptenceOrderList
} from '@/api/acceptence-order.js'

import { merchantRules, queryRules } from './rules'

import { userNameValidate, userNickNameRules } from '@/utils/validate'

import { formatDateTime } from '@/utils'
import FileSaver from 'file-saver'
import { patchUnlockUser } from '@/api/service-list.js'
import MyQrCode from '@/components/MyQrCode/MyQrCode.vue'

export default {
  components: { MyQrCode },
  name: 'AcceptenceOrderList',
  components: {
    AcceptOrderInfo
  },
  data() {
    return {
      // providerList: [],
      rules: merchantRules,
      queryRules: queryRules,
      // userNameRules: [
      //   { required: true, message: '请输入账号', trigger: 'blur' },
      //   ...userNameValidate,
      //   {
      //     validator: async (rule, value, callback) => {
      //       console.log(value)
      //       let ret = await isExistMerchantAgentAccount(value)
      //       if (ret.data) {
      //         callback(new Error('账号已存在'))
      //       } else {
      //         callback()
      //       }
      //     },
      //     trigger: 'blur'
      //   }
      // ],

      acceptOrderOptions: [
        { label: '待支付', value: 0, type: 'info' },
        { label: '已支付', value: 1, type: 'success' },
        { label: '审核通过', value: 2, type: 'primary' },
        { label: '审核驳回', value: 3, type: 'danger' },
        { label: '已取消', value: 4, type: 'warning' }
      ],

      orderInfo: {}, // 创建兑付订单的信息
      orderInfoVisible: false, // 创建兑付订单的信息是否可见
      tableData: [],
      dialogVisible: false,
      formData: {},
      queryFormData: this.getDefaultQueryValue(),
      showChuliDialogVisual: false, // 处理订单，审核订单
      chuliFormData: {}
    }
  },
  watch: {
    '$store.state.tenant.selectTenantId'(newV, oldV) {
      this.flushPage()
    }
  },
  methods: {
    onCommonBtnCancel() {
      this.showChuliDialogVisual = false
      this.flushPage()
    },
    onCommonBtnOk() {
      this.$refs.commonFormRef.validate(async (valid) => {
        if (valid) {
          let ret = await auditAcceptenceOrder({
            acceptanceId: this.chuliFormData.acceptanceId,
            acceptanceApplyStatus: this.chuliFormData.acceptanceApplyStatus,
            orderAmount: this.chuliFormData.orderAmount,
            auditResultRemark: this.chuliFormData.auditResultRemark
          })
          this.$message({
            type: 'success',
            message: '已审核'
          })
          this.onCommonBtnCancel()
        }
      })
    },

    auditAcceptenceOrder(row) {
      this.showChuliDialogVisual = true
      this.chuliFormData = {
        ...row,
        acceptanceApplyStatus: 2,
      }
    },

    async exportReport() {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime' && this.queryFormData['createTime']) {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })
      let res = await exportAcceptenceOrderList(params)
      console.log(res, 'res')
      FileSaver.saveAs(res, '承兑订单列表.xlsx')
    },

    closeOrderInfoDlg() {
      this.orderInfoVisible = false
      this.flushPage()
    },

    confirmAcceptenceOrder(row) {
      if (!row) {
        row = this.orderInfo
      }
      // 弹出确认框
      this.$confirm('确认支付吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let ret = await confirmAcceptenceOrder({
          acceptanceId: row.acceptanceId
        })
        this.$message({
          type: 'success',
          message: '已确认'
        })
        this.orderInfoVisible = false
        this.flushPage()
      })
    },
    cancelmAcceptenceOrder(row) {
      // 弹出确认框
      this.$confirm('确认取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let ret = await cancelAcceptenceOrder({
          acceptanceId: row.acceptanceId
        })
        this.$message({
          type: 'success',
          message: '已取消'
        })
        this.flushPage()
      })
    },

    flushPage() {
      this.$refs.tableRef.getTableData()
    },

    async loadTableData(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId,
        userName: this.$store.state.user.userName
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime' && this.queryFormData['createTime']) {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await getAcceptenceOrderPage(page, params)
      this.tableData = res.data.list

      // this.tableData = [this.getMockData()]

      console.log(res)
      return res
    },

    queryTableData() {
      this.$refs.queryFormDataRef.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    },

    resetQueryForm() {
      this.queryFormData = this.getDefaultQueryValue()
      this.$refs.tableRef.getTableData(1)
      this.$refs.queryFormDataRef.resetFields()
    },
    getDefaultQueryValue() {
      let now = new Date()
      const today = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      )
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      // let todayStr = formatDateTime(today)
      return {
        isActive: '',
        createTime: [today, nowStr],
        acceptanceApplyStatus: ''
        // createTime: []
      }
    },

    clipboard,

    showAddDialog() {
      this.dialogVisible = true
      this.formData = {
        userName: '', //	账号,示例值(zhangsan)
        userNickName: '', //
        // userId: this.providerList[0].userId
        userId: this.$store.state.user.userInfo.userId
      }

      // ----
      // this.orderInfo = {
      //   acceptanceId: '4530937079652422421',
      //   tenantId: 1006,
      //   userId: '193266881427779584',
      //   userName: 'provideYase01',
      //   orderAmount: 111,
      //   payAmount: 15.88,
      //   usdRate: 6.99,
      //   paymentData: 'TXp88A9h2yM93bfei6jmWbNYTvgW7sNgCH',
      //   expiredTime: '2025-12-10 04:33:49',
      //   remark: null
      // }
      // this.orderInfoVisible = true
    },
    onDialogBtnCancel() {
      this.$refs.formRef.resetFields()
      this.dialogVisible = false
      this.flushPage()
    },
    onDialogBtnOk() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          // 新增
          let ret = await createAcceptenceOrder({
            userId: this.$store.state.user.userInfo.userId,
            orderAmount: +this.formData.orderAmount,
            remark: this.formData.remark
          })

          this.orderInfo = ret.data

          this.onDialogBtnCancel()
          this.orderInfoVisible = true
        }
      })
    },
    getMockData() {
      return {
        acceptanceId: '54875412',
        acceptanceId: 1231231231,
        userName: 'userName',
        orderAmount: 712, // 订单金额
        payAmount: 100, // 实付金额
        usdRate: 7.12, // U 率
        paymentData: 'asdjfnuiqwer8762346uwerfb',
        expiredTime: '2023-12-31 23:59:59',
        remark: '备注信息',
        acceptanceApplyStatus: 0, //  (0-待支付、1-已支付、2-审核通过、3-审核驳回、4-已取消)
        auditResultRemark: '',
        confirmOrderUserName: '',
        auditTime: '',
        createTime: '2023-12-31 12:00:00'
      }
    }
  },
  mounted() {
    // getProviderOptionList(this.$store.state.tenant.selectTenantId).then((res) => {
    //   console.log(res)
    //   this.providerList = res.data
    // })
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
.label {
  font-size: 18px;
  margin-right: 10px;
  line-height: 20px;
}
.text {
  font-size: 16px;
  line-height: 20px;
}
.remark {
  font-size: 12px;
}

::v-deep .order-info-dlg {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}

::v-deep .el-tag--small {
  padding: 0 3px;
}
</style>
