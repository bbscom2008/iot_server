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
          prop="orderAmount"
          :rules="minOrderAmountRules"
        >
          <el-input
            v-model="queryFormData.orderAmount"
            placeholder="订单金额"
            size="small"
            v-number-input-positive
            type="number"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <!-- <el-form-item
          label="订单金额"
          prop="minOrderAmount"
          :rules="minOrderAmountRules"
          style="margin-right: 5px"
        >
          <el-input
            v-model="queryFormData.minOrderAmount"
            placeholder="订单金额"
            size="small"
            v-number-input-positive
            type="number"
            style="width: 180px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="至" prop="maxOrderAmount" :rules="maxOrderAmountRules" class="zhi">
          <el-input
            v-model="queryFormData.maxOrderAmount"
            placeholder="订单金额"
            size="small"
            v-number-input-positive
            type="number"
            style="width: 180px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item> -->

        <el-form-item
          label="实付金额"
          prop="payAmount"
          :rules="minPayAmountRules"
        >
          <el-input
            v-model="queryFormData.payAmount"
            placeholder="实付金额"
            size="small"
            v-number-input-positive
            type="number"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <!-- <el-form-item
          label="实付金额"
          prop="minPayAmount"
          :rules="minPayAmountRules"
          style="margin-right: 5px"
        >
          <el-input
            v-model="queryFormData.minPayAmount"
            placeholder="实付金额"
            size="small"
            v-number-input-positive
            type="number"
            style="width: 180px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="至" prop="maxPayAmount" :rules="maxPayAmountRules" class="zhi">
          <el-input
            v-model="queryFormData.maxPayAmount"
            placeholder="实付金额"
            size="small"
            v-number-input-positive
            type="number"
            style="width: 180px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item> -->

        <el-form-item label="通道名称" prop="">
          <el-select
            filterable
            v-model="queryFormData.channelId"
            placeholder="请选择通道名称"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in allChannelList"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单状态" prop="">
          <el-select v-model="queryFormData.orderStatus" placeholder="请选择订单状态" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in orderStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通知状态" prop="">
          <el-select v-model="queryFormData.notifyStatus" placeholder="请选择通知状态" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in noticeStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款人姓名" prop="payerName">
          <el-input v-model="queryFormData.payerName" placeholder="请输入付款人姓名" size="small" />
        </el-form-item>
        <el-form-item label="付款人ip" prop="payerIp">
          <el-input v-model="queryFormData.payerIp" placeholder="请输入付款人ip" size="small" />
        </el-form-item>
        <el-form-item label="转账备注" prop="transferRemark">
          <el-input
            v-model="queryFormData.transferRemark"
            placeholder="请输入转账备注"
            size="small"
          />
        </el-form-item>

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

    <el-card class="mt-10">
      <el-button type="primary" plain icon="el-icon-plus" @click="handleDownload"
        >批量导出</el-button
      >

      <my-table
        class="mt-10"
        :loadData="loadTableData"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column label="订单号" align="center" width="230">
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div><el-tag>系统</el-tag> {{ row.systemOrderNo }}</div>
              <div class="mt-5"><el-tag>商户</el-tag> {{ row.merchantOrderNo }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="金额(元)" align="center" width="110">
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div><el-tag>订单</el-tag> {{ row.orderAmount }}</div>
              <div class="mt-5"><el-tag>实付</el-tag> {{ row.payAmount }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="通道名称" align="center">
          <template slot-scope="{ row }">
            <el-tag>{{ row.channelName }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="近半小时流水" align="center" prop="shoukuan_info" width="120">
          <template slot-scope="{ row }">
            <el-button type="text" @click="look_bill_info(row)">查看</el-button>
          </template>
        </el-table-column> -->
        <el-table-column label="订单时间" align="center" width="210">
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div v-if="row.createTime"><el-tag>创建时间:</el-tag> {{ row.createTime }}</div>
              <div v-if="row.receiveTime"><el-tag>接单时间:</el-tag> {{ row.receiveTime }}</div>
              <div v-if="row.confirmOrderTime">
                <el-tag>确认时间:</el-tag> {{ row.confirmOrderTime }}
              </div>
              <div v-if="row.notifyTime"><el-tag>通知时间:</el-tag> {{ row.notifyTime }}</div>
              <div v-if="row.expiredTime"><el-tag>过期时间:</el-tag> {{ row.expiredTime }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="订单状态" align="center">
          <template slot-scope="{ row }">
            <el-tag
              v-if="row.orderStatus != null"
              :type="orderStateOptions.find((item) => item.value === row.orderStatus).type"
            >
              {{ orderStateOptions.find((item) => item.value === row.orderStatus).label }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="通知状态" align="center">
          <template slot-scope="{ row }">
            <el-tag
              v-if="row.notifyStatus != null"
              :type="noticeStateOptions.find((item) => item.value === row.notifyStatus).type"
            >
              {{ noticeStateOptions.find((item) => item.value === row.notifyStatus).label }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="付款信息" align="center">
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div v-if="row.payerName" ><el-tag>姓名</el-tag> {{ row.payerName  }}</div>
              <div v-if="row.payerIp" ><el-tag>IP</el-tag> {{ row.payerIp  }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="转账备注" align="center">
          <template slot-scope="{ row }">
            {{ row.transferRemark ? row.transferRemark : '' }}
          </template>
        </el-table-column>
      </my-table>
    </el-card>
    <halfHourBill
      ref="halfHourBill"
      v-if="showhalfHourBill"
      @close="showhalfHourBill = false"
      :orderItem="currOrder"
    ></halfHourBill>
  </div>
</template>

<script>
import {
  getMerchantCollectOrderListPage,
  exportMerchantCollectOrderDetail
} from '@/api/collect-order.js'
import halfHourBill from './components/halfHourBill.vue'
import { formatDateTime } from '@/utils'

import FileSaver from 'file-saver'

import { orderRules, queryRules } from './rules.js'

import { amountCheck } from '@/utils/validate.js'
import { isEmpty } from '@/utils'

// import { orderStateOptions } from "@/utils/constants";

import { getChannelByTenantId } from '@/api/merchant.js'
// import { getProductListByTenantId } from '@/api/service-product-mananger.js'
import { getMerchantList } from '@/api/merchant-info.js'
import { getProviderOptionList } from '@/api/service-list.js'

export default {
  name: 'CollectOrder',
  components: { halfHourBill },
  data() {
    return {
      rules: orderRules,
      queryRules,
      tableData: [],
      currOrder: {},
      queryFormData: this.getQueryForm(),

      // 添加扩展数据，如 options 所需要的数据
      channel_nameOptions: [
        { label: '通道1', value: '1' },
        { label: '通道2', value: '2' },
        { label: '通道3', value: '3' }
      ],
      // orderStateOptions,
      orderStateOptions: [
        { label: '已生成', value: 0, type: 'info' },
        { label: '待接单', value: 1, type: 'info' },
        { label: '已接单', value: 2, type: 'success' },
        { label: '已成功', value: 3, type: 'success' },
        { label: '已取消', value: 4, type: 'warning' },
        { label: '已超时', value: 5, type: 'warning' },
        { label: '恶意拉单', value: 6, type: 'danger' },
        { label: '渠道订单失败', value: 7, type: 'danger' },
        { label: '无码订单', value: 8, type: 'danger' },
        { label: '冲正', value: 9, type: 'danger' },
        { label: '无访问取消', value: 10, type: 'danger' }
      ],
      noticeStateOptions: [
        { label: '未通知', value: 0, type: 'info' },
        { label: '通知成功', value: 1, type: 'success' },
        { label: '通知失败', value: 2, type: 'danger' }
        // { label: '响应成功', value: 3, type: 'success' },
        // { label: '响应失败', value: 4, type: 'warning' }
      ],

      minOrderAmountRules: [
        { validator: amountCheck, trigger: 'blur' },
        // {
        //   validator: (rule, value, callback) => {
        //     if (
        //       isEmpty(this.queryFormData.minOrderAmount) ||
        //       isEmpty(this.queryFormData.maxOrderAmount)
        //     ) {
        //       return callback()
        //     }

        //     if (
        //       Number(this.queryFormData.minOrderAmount) > Number(this.queryFormData.maxOrderAmount)
        //     ) {
        //       return callback(new Error('必须小于最大金额'))
        //     }
        //     callback()
        //   },
        //   trigger: 'blur'
        // }
      ],
      maxOrderAmountRules: [
        { validator: amountCheck, trigger: 'blur' },
        // {
        //   validator: (rule, value, callback) => {
        //     if (
        //       isEmpty(this.queryFormData.minOrderAmount) ||
        //       isEmpty(this.queryFormData.maxOrderAmount)
        //     ) {
        //       return callback()
        //     }

        //     if (
        //       Number(this.queryFormData.minOrderAmount) > Number(this.queryFormData.maxOrderAmount)
        //     ) {
        //       return callback(new Error('必须大于最小金额'))
        //     }
        //     callback()
        //   },
        //   trigger: 'blur'
        // }
      ],

      minPayAmountRules: [
        { validator: amountCheck, trigger: 'blur' },
        // {
        //   validator: (rule, value, callback) => {
        //     if (
        //       isEmpty(this.queryFormData.minPayAmount) ||
        //       isEmpty(this.queryFormData.maxPayAmount)
        //     ) {
        //       return callback()
        //     }

        //     if (Number(this.queryFormData.minPayAmount) > Number(this.queryFormData.maxPayAmount)) {
        //       return callback(new Error('必须小于最大金额'))
        //     }
        //     callback()
        //   },
        //   trigger: 'blur'
        // }
      ],
      maxPayAmountRules: [
        { validator: amountCheck, trigger: 'blur' },
        // {
        //   validator: (rule, value, callback) => {
        //     if (
        //       isEmpty(this.queryFormData.minPayAmount) ||
        //       isEmpty(this.queryFormData.maxPayAmount)
        //     ) {
        //       return callback()
        //     }

        //     if (Number(this.queryFormData.minPayAmount) > Number(this.queryFormData.maxPayAmount)) {
        //       return callback(new Error('必须大于最小金额'))
        //     }
        //     callback()
        //   },
        //   trigger: 'blur'
        // }
      ],

      // productList: [],
      allChannelList: [],
      showhalfHourBill: false,
      providerList: [], // 码商列表
      allMerchantList: [] // 所有商户
    }
  },
  methods: {
    look_bill_info(row) {
      this.currOrder = row
      this.showhalfHourBill = true
    },
    async loadTableData(page) {
      let params = {
        // tenantId: this.$store.state.tenant.currTenantId
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

      let res = await getMerchantCollectOrderListPage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    flushPage() {
      // 刷新表格
      this.$refs.tableRef.getTableData(1)
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormDataRef.resetFields()
      this.$refs.tableRef.getTableData(1)
    },

    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let todayStr = formatDateTime(today)
      return {
        channelId: '',
        productId: '',
        merchantId: '',
        providerId: '',
        orderStatus: '',
        notifyStatus: '',
        createTime: [todayStr, nowStr]
      }
    },

    queryTableData() {
      this.$refs.queryFormDataRef.validate((valid) => {
        if (!valid) {
          return false
        }
        // 刷新表格
        this.$refs.tableRef.getTableData(1)
      })
    },

    async handleDownload() {
      let params = {
        // tenantId: this.$store.state.tenant.currTenantId
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

      let res = await exportMerchantCollectOrderDetail(params)
      FileSaver.saveAs(res, '代收订单列表.xlsx')
    }
  },
  mounted() {
    //  通道信息
    if (this.$store.state.order.allChannelList.length == 0) {
      getChannelByTenantId(this.$store.state.tenant.currTenantId).then((res) => {
        if (res.data && res.data.length > 0) {
          this.allChannelList = res.data
          this.$store.state.order.allChannelList = res.data
        }
      })
    } else {
      this.allChannelList = this.$store.state.order.allChannelList
    }

    // 所有产品列表明
    // if (this.$store.state.order.productList.length == 0) {
    //   getProductListByTenantId().then((res) => {
    //     if (res.data && res.data.length > 0) {
    //       this.productList = res.data
    //       this.$store.state.order.productList = res.data
    //     }
    //   })
    // } else {
    //   this.productList = this.$store.state.order.productList
    // }

    // 获得所有商户信息

    getMerchantList({}).then((res) => {
      console.log(res)
      this.allMerchantList = res.data
    })

    // 获得所有码商  下拉框 ，

    getProviderOptionList(this.$store.getters.tenantId).then((res) => {
      console.log(res)
      this.providerList = res.data
    })
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
    margin-bottom: 10px;
  }
  .item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1;
    height: 70px;
    //  border: 1px solid red;

    .txt {
      display: flex;
      justify-content: center;
      // padding: 0 10px;
      width: 30%;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      .label {
        // width: 120px;
        text-align: right;
        margin-right: 10px;
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
