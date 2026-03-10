<template>
  <div class="container">
    <el-card>
      <el-form
        ref="queryFormRef"
        :rules="queryRules"
        :inline="true"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            v-model="queryFormData.systemOrderNo"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户订单号" prop="merchantOrderNo">
          <el-input
            v-model="queryFormData.merchantOrderNo"
            placeholder="请输入商户订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item
          label="订单金额"
          prop="minOrderAmount"
          :rules="minOrderAmountRules"
          style="margin-right: 5px"
        >
          <el-input
            v-model="queryFormData.minOrderAmount"
            v-number-input-positive
            type="number"
            placeholder="最小金额"
            size="small"
            style="width: 180px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="至" prop="maxOrderAmount" :rules="maxOrderAmountRules" class="zhi">
          <el-input
            v-model="queryFormData.maxOrderAmount"
            v-number-input-positive
            type="number"
            placeholder="最大金额"
            size="small"
            style="width: 180px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="产品名称" prop="">
          <el-select
            v-model="queryFormData.productId"
            filterable
            placeholder="请选择产品名称"
            size="small"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in productList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="订单状态" prop="">
          <el-select
            v-model="queryFormData.orderStatus"
            filterable
            placeholder="请选择订单状态"
            size="small"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in orderStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="通知状态" prop="">
          <el-select
            v-model="queryFormData.notifyStatus"
            filterable
            placeholder="请选择通知状态"
            size="small"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in notifyStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->

        <el-form-item label="创建时间" prop="createTime">
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
            :picker-options="myPickerOptions"
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
      <div class="auto-flush">
        <span class="mr-10">自动刷新</span>
        <el-checkbox-group v-model="autoCheckList" @change="checkGroupChange">
          <el-checkbox :label="10">10秒</el-checkbox>
          <el-checkbox :label="30">30秒</el-checkbox>
          <el-checkbox :label="60">60秒</el-checkbox>
        </el-checkbox-group>
        <span class="flush-tips ml-10">{{ flushTips }}</span>
      </div>

      <el-button type="primary" icon="el-icon-check" @click="batchReceiveOrders">批量接单</el-button>
      <!-- <el-button type="primary" icon="el-icon-dish" @click="allNotify()">批量通知</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleDownload"
        >批量导出</el-button
      > -->

      <my-table
        ref="tableRef"
        class="mt-10"
        :load-data="loadTableData"
        :defaultPageSize="30"
        :table-data="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="选择" align="center" type="selection" width="60" />
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column label="系统订单号" align="center" width="220">
          <template slot-scope="{ row }">
            <!-- <div style="display: flex; flex-direction: column; align-items: flex-start">
              <div><el-tag>系统</el-tag> {{ row.systemOrderNo }}</div>
              <div class="mt-5"><el-tag>商户</el-tag> {{ row.merchantOrderNo }}</div>
            </div> -->
            <span
              @dblclick="
                (e) => {
                  clipboard(row.systemOrderNo, e)
                }
              "
            >
              {{ row.systemOrderNo }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="商户订单号" align="center" width="220">
          <template slot-scope="{ row }">
            <!-- <div style="display: flex; flex-direction: column; align-items: flex-start">
              <div><el-tag>系统</el-tag> {{ row.systemOrderNo }}</div>
              <div class="mt-5"><el-tag>商户</el-tag> {{ row.merchantOrderNo }}</div>
            </div> -->
            <span
              @dblclick="
                (e) => {
                  clipboard(row.merchantOrderNo, e)
                }
              "
            >
              {{ row.merchantOrderNo }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="产品信息" align="center" width="100">
          <template slot-scope="{ row }">
            {{ row.productName }}
          </template>
        </el-table-column>

        <el-table-column label="订单金额(元)" align="center" width="100">
          <template slot-scope="{ row }">
            {{ row.orderAmount }}
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" width="200">
          <template slot-scope="{ row }"> {{ row.createTime }} <br /> </template>
        </el-table-column>

        <el-table-column label="订单状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="orderStateOptions.find((item) => item.value === row.orderStatus).type">
              {{ orderStateOptions.find((item) => item.value === row.orderStatus).label }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="接单注意事项" align="center" width="200">
          <template slot-scope="{ row }"> {{ row.paymentDesc }}</template>
        </el-table-column>

        <el-table-column label="被接单次数" align="center">
          <template slot-scope="{ row }"> {{ row.acceptCount }} </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="110" fixed="right">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="primary" class="btn mt-5" @click="showConfirmReceive(row)">接单</div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog v-loading="loading" :visible.sync="dialogVisible" title="接单" width="600px">
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="产品信息" disabled prop="">
          <el-input v-model="formData.productName" disabled size="small" />
        </el-form-item>

        <el-form-item label="订单金额" disabled prop="">
          <el-input
            v-model="formData.orderAmount"
            disabled
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="创建时间" prop="create_time">
          <el-date-picker
            v-model="formData.createTime"
            disabled
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            type="datetime"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="接单注意事项" prop="">
          <el-input
            v-model="formData.paymentDesc"
            type="textarea"
            :row="4"
            disabled
            placeholder="请输入注意事项"
            size="small"
          />
        </el-form-item>

        <el-form-item label="被接单次数" prop="">
          <el-input v-model="formData.acceptCount" disabled size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="dialogVisible = false"> 取消 </el-button>
        <el-button type="primary" size="small" @click="onDialogBtnOk()"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- <incomeOrder ref="incomeOrderInfo" pay-type="agent-pay" /> -->

    <!-- <el-dialog :visible.sync="trans_product_visual" title="交易者信息" width="600px">
      <el-table class="mt-10" :data="tableData" style="width: 100%" border>
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column label="当前层级" align="center" width="180">
          <template slot-scope="{ row, $index }">
            <div>层级{{ $index }}</div>
          </template>
        </el-table-column>

        <el-table-column label="用户名" align="center">
          <template slot-scope="{ row, $index }"> abc-{{ $index }} </template>
        </el-table-column>

        <el-table-column label="码商名称" align="center">
          <template slot-scope="{ row }">
            {{ row.trans_product_no }}
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer">
        <el-button size="small" @click="trans_product_visual = false"> 确定 </el-button>
      </div>
    </el-dialog> -->

    <el-dialog :visible.sync="commonDialogVisible" :title="commonDialogTitle" width="600px">
      <el-form
        ref="form"
        :model="commonFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            v-model="commonFormData.systemOrderNo"
            disabled
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="订单金额" prop="merchant_order_money">
          <el-input
            v-model="commonFormData.merchant_order_money"
            disabled
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item>

        <!-- <el-form-item label="实付金额" v-if="commonDialogType != 3" prop="pay_order_money"> -->
        <el-form-item label="实付金额" prop="pay_order_money">
          <el-input
            v-model="commonFormData.pay_order_money"
            disabled
            placeholder="请输入实付金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="交易密码" prop="password" required>
          <el-input
            v-model="commonFormData.password"
            type="password"
            placeholder="请输入交易密码"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="commonDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" size="small" @click="commonDialogVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="submit_info_dialog_visible" title="查看转账凭证" width="500px">
      <span>共计 {{ pingImgShowList.length }} 张图片</span>
      <div class="img-box">
        <el-image
          v-for="(url, i) in pingImgShowList"
          :key="i"
          class="img"
          style="width: 200px; height: 200px"
          :src="url"
          :preview-src-list="pingImgShowList"
        />
      </div>

      <div style="text-align: center">
        <el-button type="primary" size="small" @click="submit_info_dialog_visible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import incomeOrder from './components/order-detail.vue'

import clipboard from '@/utils/clipboard'

import { formatDateTime } from '@/utils'
import FileSaver from 'file-saver'

import { orderRules, queryRules } from './rules.js'
import { getProductListByUserId } from '@/api/service-product-mananger.js'
import { imageUploadServer } from '@/settings'
import { amountCheck } from '@/utils/validate.js'
import { isEmpty } from '@/utils'

import {
  paymentOrderReceiveOrderId,
  getUnreceivedPaymentOrderListPage,
  batchReceivePaymentOrder
} from '@/api/order-manage/agent-pay.js'

export default {
  name: 'PaymentAcceptOrder',
  // components: { incomeOrder },
  data() {
    return {
      queryRules,
      rules: orderRules,
      imageUploadServer: imageUploadServer,

      loading: false,

      tableData: [],
      dialogVisible: false,
      formData: {},
      queryFormData: this.getQueryForm(),

      minOrderAmountRules: [
        { validator: amountCheck, trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (
              isEmpty(this.queryFormData.minOrderAmount) ||
              isEmpty(this.queryFormData.maxOrderAmount)
            ) {
              return callback()
            }

            if (
              Number(this.queryFormData.minOrderAmount) > Number(this.queryFormData.maxOrderAmount)
            ) {
              return callback(new Error('必须小于最大金额'))
            }
            callback()
          },
          trigger: 'blur'
        }
      ],
      maxOrderAmountRules: [
        { validator: amountCheck, trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (
              isEmpty(this.queryFormData.minOrderAmount) ||
              isEmpty(this.queryFormData.maxOrderAmount)
            ) {
              return callback()
            }

            if (
              Number(this.queryFormData.minOrderAmount) > Number(this.queryFormData.maxOrderAmount)
            ) {
              return callback(new Error('必须大于最小金额'))
            }
            callback()
          },
          trigger: 'blur'
        }
      ],
      isEdit: false, // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
      channel_nameOptions: [
        { label: '通道1', value: 1 },
        { label: '通道2', value: 2 },
        { label: '通道3', value: 3 }
      ],
      product_nameOptions: [
        { label: '产品1', value: 1 },
        { label: '产品2', value: 2 },
        { label: '产品3', value: 3 }
      ],
      orderStateOptions: [
        { label: '已生成', value: 0, type: 'info' },
        { label: '待接单', value: 1, type: 'info' },
        { label: '已接单', value: 2, type: '' },
        { label: '已成功', value: 3, type: 'success' },
        { label: '已取消', value: 4, type: 'warning' },
        { label: '已超时', value: 5, type: 'warning' },
        { label: '恶意拉单', value: 6, type: 'danger' },
        { label: '未出码', value: 7, type: 'danger' },
        { label: '无码订单', value: 8, type: 'danger' },
        { label: '冲正', value: 9, type: 'danger' },
        { label: '未访问', value: 10, type: 'danger' }
      ],
      notifyStatusOptions: [
        { label: '未通知', value: 0, type: 'info' },
        { label: '通知成功', value: 1, type: 'success' },
        { label: '通知失败', value: 2, type: 'danger' }
        // { label: '响应成功', value: 3, type: 'success' },
        // { label: '响应失败', value: 4, type: 'warning' }
      ],

      huikuan_stateOptions: [
        { label: '待回款', value: '0', type: 'warning' },
        { label: '已回款', value: '1', type: 'success' }
      ],
      autoCheckList: [],
      flushTips: '',
      currFlushSecond: 0,
      autoFlushFlag: '',

      // trans_product_visual: false, // 交易者信息 弹窗
      commonFormData: {},
      commonDialogVisible: false,
      productList: [],
      commonDialogTitle: '',
      commonDialogType: 0,
      // 提交信息弹框
      submit_info_dialog_visible: false,
      submit_info_formData: {
        password: '',
        isShow: false,
        systemOrderNo: ''
      },
      pingImgShowList: [],
      selectedOrders: [] // 选中的订单
    }
  },
  mounted() {
    getProductListByUserId().then((res) => {
      if (res.data && res.data.length > 0) {
        this.productList = res.data
      }
    })
  },
  methods: {
    async loadTableData(page) {
      const params = {
        // tenantId: this.$store.state.user.tenantId
        orderStatus: 1 // 待接单
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

      const res = await getUnreceivedPaymentOrderListPage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    flushPage() {
      this.queryTableData()
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormRef.resetFields()
      this.$refs.tableRef.getTableData(1)
    },
    getQueryForm() {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      const todayStr = formatDateTime(today)
      return {
        channelId: '',
        productId: '',
        merchantId: '',
        providerId: '',
        // orderStatus: '',
        // notifyStatus: '',
        createTime: [todayStr, nowStr]
      }
    },

    queryTableData() {
      this.$refs.queryFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        // 刷新表格
        this.$refs.tableRef.getTableData(1)
      })
    },

    handleDownload() {},

    clipboard,
    look_submit_info(row) {
      this.pingImgShowList = row.transferVoucher.split(',')
      this.submit_info_dialog_visible = true
    },

    showCommonDialog(row, type) {
      this.commonDialogType = type
      this.commonDialogTitle =
        type == 0
          ? '取消订单'
          : type == 1
          ? '确认订单'
          : type == 2
          ? '驳回订单'
          : type == 3
          ? '审核订单'
          : '补单'
      this.commonDialogVisible = true
      // this.commonFormData = Object.assign({}, row)
      this.commonFormData = {
        systemOrderNo: row.systemOrderNo,
        merchant_order_money: row.merchant_order_money,
        pay_order_money: row.pay_order_money,
        new_pay_order_money: '',
        password: ''
      }
    },
    checkGroupChange(ele) {
      if (ele.length > 0) {
        this.currFlushSecond = ele[ele.length - 1]
        this.flushTips = `${this.currFlushSecond} 秒后自动刷新`
        this.autoCheckList = [ele[ele.length - 1]]
        clearInterval(this.autoFlushFlag)
        this.autoFlushFlag = setInterval(() => {
          this.currFlushSecond--
          if (this.currFlushSecond == 0) {
            this.currFlushSecond = ele[ele.length - 1]

            this.flushPage()
          }
          this.flushTips = `${this.currFlushSecond} 秒后自动刷新`
        }, 1000)
      } else {
        clearInterval(this.autoFlushFlag)
        this.flushTips = ''
      }
    },

    async showConfirmReceive(row) {
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },

    onDialogBtnOk() {
      this.loading = true
      paymentOrderReceiveOrderId(this.formData.orderId)
        .then((res) => {
          this.loading = false
          console.log(res)
          this.$message.success('接单成功')
          this.$refs.tableRef.getTableData()
          this.dialogVisible = false
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
          // this.$message.error(err.message + ', 请稍后重试')
        })
    },

    // 批量接单
    async batchReceiveOrders() {
      if (!this.selectedOrders || this.selectedOrders.length === 0) {
        this.$message.warning('请先选择要接单的订单')
        return
      }

      try {
        await this.$confirm(`确定要批量接单 ${this.selectedOrders.length} 个订单吗？`, '批量接单确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        this.loading = true
        
        const orderIds = this.selectedOrders.map(row => row.orderId)
        const result = await batchReceivePaymentOrder({ orderIds })
        
        this.loading = false
        
        if (result.data) {
          this.$message.success(`批量接单成功，共处理 ${orderIds.length} 个订单`)
          this.$refs.tableRef.getTableData()
          this.selectedOrders = []
        } else {
          this.$message.error('批量接单失败，请稍后重试')
        }
      } catch (error) {
        this.loading = false
        if (error !== 'cancel') {
          console.error('批量接单失败:', error)
          this.$message.error('批量接单失败，请稍后重试')
        }
      }
    },

    // 处理选择变化
    handleSelectionChange(val) {
      this.selectedOrders = val
    }
  }
}
</script>

<style lang="scss" scoped>
.gongji {
  margin-bottom: 20px;
  .box {
    display: flex;
    justify-content: space-between;
  }
  .item-card {
    margin: 0 10px;
  }
  .title {
    margin-bottom: 20px;
  }
  .item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1;
    height: 100px;
    //  border: 1px solid red;

    .txt {
      display: flex;
      justify-content: center;
      padding: 0 10px;
      width: 30%;
      height: 20px;
      line-height: 20px;
      .label {
        // width: 120px;
        text-align: right;
        margin-right: 20px;
      }
      .money {
        color: green;
      }
    }
  }
}

.auto-flush {
  display: flex;
  padding: 10px;
}

.flush-tips {
  font-size: 14px;
  color: red;
}

.container {
  .filter-container {
    padding: 10px;
  }
}
::v-deep .el-drawer__body {
  padding: 0 30px !important;
}
.info-con {
  display: flex;
  flex-wrap: wrap;
}
.line-label {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
}
.line-content {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5;
}

.img-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  .img {
    margin: 10px;
  }
}
.info-line {
  width: 50%;
}
.tag-purple {
  color: #722ed1;
  background: #f9f0ff;
  border-color: #d3adf7;
}
.tag-pink {
  color: #eb2f96;
  background: #fff0f6;
  border-color: #ffadd2;
}

.demo-form-inline {
  .zhi {
    ::v-deep .el-form-item__label {
      padding-right: 5px;
    }
  }
}
</style>
