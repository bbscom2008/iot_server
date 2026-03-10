<template>
  <div class="app-container">
    <!-- :before-close="handleClose" -->
    <el-drawer
      title="订单详情"
      :visible.sync="drawer"
      direction="rtl"
      @closed="handleClosed"
      size="50%"
    >
      <el-tabs v-model="activeTab" style="padding: 20px;" >
        
        <el-tab-pane label="匹配记录" name="matchRecord" lazy>
          <my-table
            class="mt-10"
            :tableData="matchTableData"
            :loadData="loadMatchTableData"
            ref="my-table"
            style="width: 100%"
            border
          >
            <el-table-column label="序号" align="center" type="index" />
            <el-table-column label="码商名称" align="center" prop="providerUserName" />
            <el-table-column label="匹配结果" align="center" prop="matchStatus">
              <template slot-scope="{ row }">
                <el-tag type="success" v-if="row.matchStatus"> 匹配成功 </el-tag>
                <el-tag type="danger" v-else> 匹配失败 </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="结果说明" align="center" prop="matchDesc" />
            <el-table-column label="匹配时间" align="center" prop="matchTime" />
          </my-table>
        </el-tab-pane>
       
        <el-tab-pane label="操作记录" name="operateRecord" lazy>
          <!-- <div>操作记录</div> -->

          <my-table
            class="mt-10"
            :tableData="optTableData"
            :loadData="loadOperateTableData"
            ref="my-table"
            style="width: 100%"
            border
          >
            <el-table-column label="序号" align="center" type="index" />
            <el-table-column label="操作用户名" align="center" prop="userName" />
            <el-table-column label="操作结果" align="center" prop="operationStatus">
              <template slot-scope="{ row }">
                <el-tag type="success" v-if="row.operationStatus"> 成功 </el-tag>
                <el-tag type="danger" v-else> 失败 </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="结果说明" align="center" prop="operationDesc" />
            <el-table-column label="操作时间" align="center" prop="operationTime" />
          </my-table>
        </el-tab-pane>

        <el-tab-pane label="请求记录" name="requestRecord" lazy>
          <div class="request" v-loading="$store.state.app.loading">
            <p class="req-line line2">
              <span class="req-label">请求地址：</span>
              <span class="req-value">{{ requestInfoData.requestPath }}</span>
            </p>
            <p class="req-line">
              <span class="req-label">请求时间：</span>
              <span class="req-value">{{ requestInfoData.requestTime }}</span>
            </p>
            <p class="req-line line2">
              <span class="req-label">请求参数：</span>
              <span class="req-value">
                <pre>{{ formatJson(requestInfoData.requestParam) }}</pre>
              </span>
            </p>
            <p class="req-line">
              <span class="req-label">响应时间：</span>
              <span class="req-value">{{ requestInfoData.responseTime }}</span>
            </p>
            <p class="req-line line2">
              <span class="req-label">响应内容：</span>
              <span class="req-value">
                <pre>{{ formatJson(requestInfoData.responseContent) }}</pre>
              </span>
            </p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import {
  getCollectOrderFee,
  getCollectOrderVisitLog,
  getCollectOrderOperateLog,
  getCollectOrderNotifyLog,
  getCollectOrderMatchLog,
  getCollectOrderChatLog,
  getCollectOrderRequestLog
} from '@/api/order-detail.js'
import clipboard from '@/utils/clipboard'
import { getCollectOrderDetail } from '@/api/collect-order.js'

import chatHistory from '@/components/Chat/chat.vue'

import { orderStateOptions } from "@/utils/constants";

import { getPaymentOrderDetail } from '@/api/agent-pay.js'
import { getFileById } from '@/api/upload'

import { formatJson } from '@/utils'

export default {
  props: {
    payType: {
      type: String,
      default: () => 'default' // agent-pay  代付 // collect 代收
    },
    orderItem: {
      type: Object,
      default: () => {}
    }
  },
  components:{
    chatHistory
  },
  data() {
    return {
      drawer: false,
      activeTab: 'matchRecord',
      visitList: [],
      matchTableData: [],
      optTableData: [],
      chatContent: [
        '取消、  确认 、补单 、 修改金额 、 通知商户',
        '取消 确认  补单    弹窗 内容一样：',
        '系统订单号',
        '订单金额是多少',
        '实付金额要付多少，  交易密码',
        '交易密码',
        '修改金额要有个弹窗',
        '系统订单号',
        '订单金额',
        '原实付金额',
        '新实付金额',
        '交易密码'
      ],

      orderFeeData: {
        orderAmount: '',
        systemCost: ''
      },
      orderInfoData: {
        // 订单详情
      },
      notifyInfoData: {
        notifyUrl: '', // 	通知地址
        notifyTime: '',
        notifyStatus: -1, // 通知状态(0-待发送、1-发送成功、2-发送失败、3-响应成功、4-响应失败)
        notifyContent: '',
        responseTime: '',
        responseContent: ''
      },
      requestInfoData: {
        requestPath: '',
        requestTime: '',
        requestParam: '',
        responseTime: '',
        responseContent: ''
      },
      orderStateOptions,
      noticeStateOptions: [
        { label: '未通知', value: 0, type: 'info' },
        { label: '通知成功', value: 1, type: 'success' },
        { label: '通知失败', value: 2, type: 'danger' }
        // { label: '响应成功', value: 3, type: 'success' },
        // { label: '响应失败', value: 4, type: 'warning' }
      ]
    }
  },
  watch: {
    activeTab(val) {
      this.onTabChange(val)
    }
  },
  computed: {
    orderId() {
      return this.orderItem ? this.orderItem.orderId : 0
    }
  },

  methods: {
    copyInfo(e) {
      clipboard(`${this.orderInfoData.systemOrderNo}`, e)
    },
    formatJson,
    onTabChange() {
      console.log('-----onTabChange----', this.activeTab)
      if (
        'notifyRecord' == this.activeTab &&
        !(this.notifyInfoData.notifyUrl == '' ? false : this.notifyInfoData.notifyUrl)
      ) {
        // 加载通知记录
        this.loadNotifyData()
      }

      // 请求记录
      if (
        'requestRecord' == this.activeTab &&
        !(this.requestInfoData.requestPath == '' ? false : this.requestInfoData.requestPath)
      ) {
        this.loadRequestData()
      }
      if('payInfo'== this.activeTab&&(!this.orderFeeData.orderAmount)){
        this.getCollectOrderFee()
      }
    },
    /**
     * 加载操作记录
     * @param {*} page 页码
     */
    async loadOperateTableData(page) {
      let ret = await getCollectOrderOperateLog(this.orderId, page)
      this.optTableData = ret.data.list
      return ret
    },
    handleClosed() {
      this.drawer = false
      this.$emit('close')
    },
    /**
     * 加载请求记录
     */
    async loadRequestData() {
      let ret = await getCollectOrderRequestLog(this.orderId)
      if (ret.data.list.length !== 0) {
        this.requestInfoData = ret.data.list[0]
      }

      return ret
    },
    /**
     * 加载操作记录
     */
    async loadNotifyData() {
      let ret = await getCollectOrderNotifyLog(this.orderId)
      if (ret.data) {
        this.notifyInfoData = ret.data
      }
    },
    /**
     * 加载匹配记录
     */
    async loadMatchTableData(page) {
      let ret = await getCollectOrderMatchLog(this.orderId, page)
      this.matchTableData = ret.data.list
      return ret
    },
    /**
     * 收银台访问记录
     */
    async getVisitList(page) {
      let ret = await getCollectOrderVisitLog(this.orderId, page)
      this.visitList = ret.data.list
      return ret
    },

    /**
     * 获得订单费用
     */
    async getCollectOrderFee() {
      let ret = await getCollectOrderFee(this.orderId)
      if (ret.data) {
        this.orderFeeData = ret.data
      }
    }
  },
  mounted() {
    this.drawer = true

    // this.getCollectOrderFee()

    console.log('---mounted--orderItem---', this.orderItem)
    let createTime = this.orderItem.createTime
    let timestr = createTime.split(' ')
    let time = timestr.join('T')
    if (this.payType == 'collect') {
      // 代收订单详情
      getCollectOrderDetail(this.orderId, { createTime: time }).then((res) => {
        console.log(res, 'res代收详情')
        if (res.data) {
          this.orderInfoData = res.data
        }
      })
    } else {
      getPaymentOrderDetail(this.orderId, { createTime: time }).then((res) => {
        console.log(res, 'res 代付详情')
        if (res.data) {
          this.orderInfoData = res.data

          // 获得凭证图片
          if (this.orderInfoData.transferVoucher) {
            this.orderInfoData.fileList = []

            this.orderInfoData.transferVoucher.split(',').forEach((fileId) => {
              getFileById(fileId).then((res) => {
                this.orderInfoData.fileList.push({
                  url: res.data.fileUrl,
                  name: res.data.originalName
                })
                this.$forceUpdate()
              })
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer.rtl {
  overflow: auto;
  padding-bottom: 30px;
}

.table-box {
  padding-bottom: 50px;
}
::v-deep .el-pagination {
  bottom: 0 !important;
}

.info-con {
  display: flex;
  flex-wrap: wrap;
  p {
    margin: 0px;
  }
  .info-line2 {
    width: 100%;
    display: flex;
    align-items: flex-start;
    margin-top: 20px;

    .line-label {
      width: 120px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;
      margin-top: 7px;
      font-size: 14px;
      text-align: right;
      padding-right: 10px;
    }
    .line-content {
      flex: 1;
      width: calc(100% - 120px);
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      min-height: 33px;
      line-height: 1.5;
      padding: 5px 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-right: 20px;
      word-wrap: break-word;
    }
  }
  .info-line {
    width: 50%;
    display: flex;
    align-items: flex-start;
    margin-top: 20px;
    align-items: center;
    .line-label {
      width: 120px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;
      margin-top: 7px;
      font-size: 14px;
      text-align: right;
      padding-right: 10px;
    }
    .line-content {
      flex: 1;
      width: calc(100% - 120px);
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      min-height: 33px;
      line-height: 1.5;
      padding: 5px 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-right: 20px;
      word-wrap: break-word;
    }
  }
}

.fee_detail {
  .title{
    margin-top: 30px;
    margin-bottom: 10px;
    font-weight: 600;
  }
  ::v-deep .el-card__body{
    padding-top: 0px;
  }
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
::v-deep .svg-icon {
  width: 16px !important;
  font-size: 18px;
}
.notify {
  padding: 15px 20px;
  .item {
    display: flex;
    line-height: 40px;
    margin: 5px 0;

    .label {
      width: 120px;
      text-align: right;
      margin-right: 10px;
    }
    .value {
      width: 350px;
      // height: 80px;
      // background-color: skyblue;
    }
  }
}
.chat-box {
  height: 700px;
  padding: 0 100px;
  overflow: auto;
}


.request {
  padding: 15px 20px;
  font-size: 14px;
  p {
    margin: 0px;
  }
  .req-line {
    height: 30px;
    display: flex;
    align-items: center;
    margin: 15px 0;

    .req-label {
      width: 100px;
    }
    .req-value {
      width: 550px;
      height: 100%;
      display: flex;
      align-items: center;
      padding-left: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  }
  .line2 {
    height: auto;
    width: auto;
    display: flex;
    align-items: flex-start;
    .req-value {
      align-items: flex-start;
      padding: 10px;
      word-break: break-all;
    }
  }
  pre {
    white-space: pre-wrap; /* 保留空格和换行，允许长文本自动换行 */
    word-wrap: break-word; /* 长单词/URL 换行到下一行 */
    overflow: auto; /* 超出时显示滚动条（可选） */
    max-width: 100%; /* 限制最大宽度，避免超出父容器 */
  }
}
::v-deep .request .el-textarea {
  margin-top: 0px !important;
}

::v-deep .el-drawer__header span:focus-visible {
  outline: none;
}
.el_btn {
  width: 40px;
  padding: 6px;
}
</style>
<style lang="scss"  >
.dark {

  .info-con {

    .info-line,
    .info-line2 {

      .line-label {
        color: #A3AED0;
      }

      .line-content {
        color: #B3C0E7;
        border-color: #6F788D80;
      }
    }
  }

  .request{
    .req-line{
      .req-value{
         color: #B3C0E7;
        border-color: #6F788D80;
      }
    }
  }

}

</style>
