<template>
  <div class="container">
    <!-- 分页查询 -->
    <el-card>
      <el-form
        ref="queryFormDataRef"
        :inline="true"
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
            v-number-input-positive
            placeholder="订单金额"
            size="small"
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
            v-number-input-positive
            placeholder="订单金额"
            size="small"
            type="number"
            style="width: 180px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="至" prop="maxOrderAmount" :rules="maxOrderAmountRules" class="zhi">
          <el-input
            v-model="queryFormData.maxOrderAmount"
            v-number-input-positive
            placeholder="订单金额"
            type="number"
            size="small"
            style="width: 180px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item> -->

        <el-form-item label="通道名称" prop="channelId">
          <el-select v-model="queryFormData.channelId" placeholder="请选择通道名称" size="small">
            <el-option label="全部" value="" />
            <el-option
              v-for="item in allChannelList"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="queryFormData.orderStatus" placeholder="请选择订单状态" size="small">
            <el-option label="全部" value="" />
            <el-option
              v-for="item in orderStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="通知状态" prop="notifyStatus">
          <el-select v-model="queryFormData.notifyStatus" placeholder="请选择通知状态" size="small">
            <el-option label="全部" value="" />
            <el-option
              v-for="item in noticeStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
      <el-button type="primary" plain icon="el-icon-plus" @click="handleDownload"
        >批量导出</el-button
      >
      <!-- 来不及上线  先屏蔽掉 -->
      <el-button  type="success" plain icon="el-icon-plus" @click="handleCreate"
        >手动创建</el-button
      >

      <my-table
        ref="tableRef"
        class="mt-10"
        :load-data="loadTableData"
        :table-data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column label="订单号" align="center" width="240">
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div><el-tag>系统</el-tag> {{ row.systemOrderNo }}</div>
              <div class="mt-5"><el-tag>商户</el-tag> {{ row.merchantOrderNo }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="金额(元)" align="center">
          <template slot-scope="{ row }">
            <div>
              <div><el-tag>订单</el-tag> {{ row.orderAmount }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="通道名称" align="center">
          <template slot-scope="{ row }">
            <el-tag>{{ row.channelName }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="收款信息" align="center" prop="paymentData" width="200">
          <template slot-scope="{ row }">
            <!-- 0 -收款链接，1-图片base64，2-文本信息 -->
            <div v-if="row.paymentDataType == 2">
              <div
                v-if="row.paymentData"
                style="display: flex; flex-direction: column; align-items: flex-start"
              >
                <div>
                  <el-tag>收款人</el-tag>
                  {{ JSON.parse(row.paymentData).payee }}
                </div>
                <div class="mt-5">
                  <el-tag>账号</el-tag>
                  {{ JSON.parse(row.paymentData).payeeNo }}
                </div>
                <div class="mt-5">
                  <el-tag>地址</el-tag>
                  {{ JSON.parse(row.paymentData).payeeAddress }}
                </div>
              </div>
            </div>
             <el-image
              v-else
              class="img"
              style="width: 100px; height: 100px"
              :src="row.paymentData"
              :preview-src-list="row.paymentData"
            >
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="付款说明" align="center" prop="auditResultRemark">
          <template slot-scope="{ row }"> {{ row.paymentDesc }} </template>
        </el-table-column>

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

        <el-table-column label="转账说明" align="center" prop="transferDesc">
          <template slot-scope="{ row }"> {{ row.transferDesc }} </template>
        </el-table-column>

        <el-table-column label="转账凭证" align="center" prop="submit_info">
          <template slot-scope="{ row }">
            <el-button
              v-if="row.transferVoucher && row.transferVoucher.length > 0"
              type="text"
              @click="look_submit_info(row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog :visible.sync="submit_info_dialog_visible" title="查看转账凭证" width="500px">
      <span>共计 {{ pingImgShowList.length }} 张图片</span>
      <div class="img-box">
        <el-image
          v-for="(item, i) in pingImgShowList"
          :key="i"
          class="img"
          style="width: 200px; height: 200px"
          :src="item.url"
          :preview-src-list="pingImgShowList.map((item) => item.url)"
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
import {
  getMerchantPaymentOrderListPage,
  exportMerchantPaymentOrderDetail
} from '@/api/agent-pay.js'

import { formatDateTime } from '@/utils'
import { getMerchantInfo } from '@/api/merchant-info.js'
import FileSaver from 'file-saver'

import { getFileById } from '@/api/upload'

import { orderRules, queryRules } from './rules.js'

import { getChannelByTenantId } from '@/api/merchant.js'
// import { getProductListByTenantId } from '@/api/service-product-mananger.js'
import { getMerchantList } from '@/api/merchant-info.js'
import { getProviderOptionList } from '@/api/service-list.js'

import { amountCheck } from '@/utils/validate.js'
import { isEmpty } from '@/utils'

export default {
  name: 'CollectOrder',
  data() {
    return {
      rules: orderRules,
      queryRules,
      tableData: [],

      queryFormData: this.getQueryForm(),

      // 添加扩展数据，如 options 所需要的数据

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

      allChannelList: [],

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

      submit_info_dialog_visible: false, // 查看转账凭证
      pingImgShowList: [], // 转账凭证图片
      isManualCreateOrderEnable:0,//0-不允许   1-允许
    }
  },
  async mounted() {
    let res = await getMerchantInfo()
    this.isManualCreateOrderEnable=res.data.isManualCreateOrderEnable
    // console.log(res,'res')
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
  },
  methods: {
    handleCreate(){
      if(this.isManualCreateOrderEnable==0){
        this.$message.error('无手动创建代付订单权限！！')
        return
      }
       this.$router.push('/merchant-order/handle-create-order')
    },
    look_submit_info(row) {
      this.pingImgShowList = row.transferVoucher.split(',').map((ele) => {
        const item = {
          fileId: ele,
          url: '',
          name: ''
        }
        return item
      })
      this.submit_info_dialog_visible = true

      this.pingImgShowList.forEach((ele) => {
        getFileById(ele.fileId).then((res, index) => {
          ele.url = res.data.fileUrl
          ele.name = res.data.originalName
        })
      })
    },

    async loadTableData(page) {
      const params = {
        // tenantId: this.$store.state.tenant.currTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      const res = await getMerchantPaymentOrderListPage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    flushPage() {
      this.$refs.tableRef.getTableData(1)
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormDataRef.resetFields()
      this.$refs.tableRef.getTableData(1)
    },

    getQueryForm() {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      const nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      const todayStr = formatDateTime(today)
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
      this.$refs.queryFormDataRef.validate(async (valid) => {
        if (!valid) {
          return false
        }
        this.$refs.tableRef.getTableData(1)
      })
    },

    async handleDownload() {
      const params = {
        // tenantId: this.$store.state.tenant.currTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      const res = await exportMerchantPaymentOrderDetail(params)
      FileSaver.saveAs(res, '代付订单.xlsx')
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
.img-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  .img {
    margin: 10px;
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
