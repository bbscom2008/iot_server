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
      <el-tabs v-model="activeTab">
        <el-tab-pane label="订单信息" name="orderInfo">
          <div class="info-con" v-loading="$store.state.app.loading">
            <p class="info-line">
              <span class="line-label">平台订单号：</span>
              <!-- <el-tag class="tag-purple">{{ orderInfoData.systemOrderNo }}</el-tag> -->
              <span class="line-content">{{ orderInfoData.systemOrderNo }}</span>
              <!-- <el-button
                class="el_btn"
                size="mini"
                type="primary"
                @click="
                  (e) => {
                    copyInfo(e)
                  }
                "
                >复制</el-button
              > -->
            </p>
            <p class="info-line">
              <span class="line-label">商户订单号：</span>
              <span class="line-content">{{ orderInfoData.merchantOrderNo }}</span>
            </p>
            <p class="info-line">
              <span class="line-label">订单金额 (元)：</span>
              <span class="line-content">{{ orderInfoData.orderAmount }}</span>
            </p>
            <p class="info-line2" v-if="payType == 'collect'">
              <span class="line-label">订单地址：</span>
              <span class="line-content">{{ orderInfoData.cashPageUrl }}</span>
            </p>

            <!-- <p class="info-line">
              <span class="line-label">手续费(元)：</span>
              <el-tag class="tag-pink"> orderFeeData.systemCost ？？ </el-tag>
            </p> -->
            <p class="info-line">
              <span class="line-label">订单状态：</span>
              <span class="line-content" style="border: none">
                <!-- {{orderInfoData.orderStatus}} -->
                <el-tag
                  v-if="orderInfoData.orderStatus != undefined"
                  :type="
                    orderStateOptions.find((item) => item.value === orderInfoData.orderStatus).type
                  "
                  >{{
                    orderStateOptions.find((item) => item.value === orderInfoData.orderStatus).label
                  }}</el-tag
                >
              </span>
            </p>

            <p class="info-line">
              <span class="line-label">创建时间：</span>
              <span class="line-content">{{ orderInfoData.createTime }}</span>
            </p>

            <template v-if="payType == 'collect'">
              <p class="info-line">
                <span class="line-label">实付金额 (元)：</span>
                <span class="line-content">{{ orderInfoData.payAmount }}</span>
              </p>

              <p class="info-line">
                <span class="line-label">转账备注：</span>
                <span class="line-content">{{ orderInfoData.transferRemark }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">订单过期时间：</span>
                <span class="line-content">{{ orderInfoData.expiredTime }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">接单时间：</span>
                <span class="line-content">{{ orderInfoData.receiveTime }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">通知状态：</span>
                <span class="line-content" style="border: none">
                  <!-- {{ orderInfoData.notifyStatus }} -->

                  <el-tag
                    v-if="orderInfoData.notifyStatus != undefined"
                    :type="
                      noticeStateOptions.find((item) => item.value === orderInfoData.notifyStatus)
                        .type
                    "
                  >
                    {{
                      noticeStateOptions.find((item) => item.value === orderInfoData.notifyStatus)
                        .label
                    }}</el-tag
                  >
                </span>
              </p>
              <p class="info-line">
                <span class="line-label">通知时间：</span>
                <span class="line-content">{{ orderInfoData.notifyTime }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">确认订单时间：</span>
                <span class="line-content">{{ orderInfoData.confirmOrderTime }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">通道名称：</span>
                <span class="line-content">{{ orderInfoData.channelName }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">产品名称：</span>
                <span class="line-content">{{ orderInfoData.productName }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">商户Id：</span>
                <span class="line-content">{{ orderInfoData.merchantId }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">商户用户名：</span>
                <span class="line-content">{{ orderInfoData.merchantUserName }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">码商Id：</span>
                <span class="line-content">{{ orderInfoData.providerId }}</span>
              </p>
              <p class="info-line">
                <span class="line-label"> 码商用户名：</span>
                <span class="line-content">{{ orderInfoData.providerUserName }}</span>
              </p>
              <p class="info-line">
                <span class="line-label"> 确认订单操作用户名：</span>
                <span class="line-content">{{ orderInfoData.confirmOrderUserName }}</span>
              </p>
              <p class="info-line">
                <span class="line-label"> 收款信息Id：</span>
                <span class="line-content">{{ orderInfoData.collectInfoId }}</span>
              </p>
              <p class="info-line">
                <span class="line-label"> 收款码名称：</span>
                <span class="line-content">{{ orderInfoData.collectInfoName }}</span>
              </p>
              <p class="info-line">
                <span class="line-label"> 付款人姓名：</span>
                <span class="line-content">{{ orderInfoData.payerName }}</span>
              </p>
              <p class="info-line">
                <span class="line-label"> 付款人IP：</span>
                <span class="line-content">{{ orderInfoData.payerIp }}</span>
              </p>
            </template>
            <template v-if="payType == 'agent-pay'">
              <p class="info-line">
                <span class="line-label">收款信息类型：</span>
                <!-- 0 -收款链接，1-图片base64，2-文本信息 -->
                <span class="line-content">
                  {{
                    orderInfoData.paymentDataType == 0
                      ? '收款链接'
                      : orderInfoData.paymentDataType == 1
                      ? '图片base64'
                      : '文本信息'
                  }}
                </span>
              </p>
              <p class="info-line">
                <span class="line-label">收款信息：</span>
                <span class="line-content" v-if="orderInfoData.paymentDataType == 2">{{
                  orderInfoData.paymentData
                }}</span>
                <el-image
                  v-else
                  class="img"
                  style="width: 100px; height: 100px"
                  :src="orderInfoData.paymentData"
                >
                </el-image>
              </p>
              <p class="info-line">
                <span class="line-label">付款说明：</span>
                <span class="line-content">{{ orderInfoData.paymentDesc }}</span>
              </p>
              <p class="info-line" style="width: 100%">
                <span class="line-label">转账凭证：</span>
                <span
                  class="line-content"
                  v-if="orderInfoData.transferVoucher && orderInfoData.fileList.length > 0"
                >
                  <!-- {{ orderInfoData.transferVoucher }} -->
                  <el-image
                    v-for="(item, index) in orderInfoData.fileList"
                    :key="index"
                    style="width: 100px; height: 100px; margin-right: 15px"
                    :src="item.url"
                    :preview-src-list="orderInfoData.fileList.map((ele) => ele.url)"
                  >
                  </el-image>
                </span>
              </p>
              <p class="info-line">
                <span class="line-label">转账说明：</span>
                <span class="line-content">{{ orderInfoData.transferDesc }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">接单时间：</span>
                <span class="line-content">{{ orderInfoData.receiveTime }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">通知状态：</span>
                <span class="line-content" style="border: none">
                  <!-- {{ orderInfoData.notifyStatus }} -->

                  <el-tag
                    v-if="orderInfoData.notifyStatus != undefined"
                    :type="
                      noticeStateOptions.find((item) => item.value === orderInfoData.notifyStatus)
                        .type
                    "
                  >
                    {{
                      noticeStateOptions.find((item) => item.value === orderInfoData.notifyStatus)
                        .label
                    }}</el-tag
                  >
                </span>
              </p>
              <p class="info-line">
                <span class="line-label">通知时间：</span>
                <span class="line-content">{{ orderInfoData.notifyTime }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">确认订单时间：</span>
                <span class="line-content">{{ orderInfoData.confirmOrderTime }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">通道名称：</span>
                <span class="line-content">{{ orderInfoData.channelName }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">产品名称：</span>
                <span class="line-content">{{ orderInfoData.productName }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">商户Id：</span>
                <span class="line-content">{{ orderInfoData.merchantId }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">商户用户名：</span>
                <span class="line-content">{{ orderInfoData.merchantUserName }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">码商Id：</span>
                <span class="line-content">{{ orderInfoData.providerId }}</span>
              </p>
              <p class="info-line">
                <span class="line-label"> 码商用户名：</span>
                <span class="line-content">{{ orderInfoData.providerUserName }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">审核时间：</span>
                <span class="line-content">{{ orderInfoData.auditTime }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">审核结果说明：</span>
                <span class="line-content">{{ orderInfoData.auditResultRemark }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">确认订单操作用户名：</span>
                <span class="line-content">{{ orderInfoData.confirmOrderUserName }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">回款状态：</span>
                <!-- （0-待回款、1-已回款） -->
                <span class="line-content" style="border: none">
                  <!-- {{ orderInfoData.repaymentStatus == 0 ? '待回款' : '已回款' }} -->

                  <el-tag type="success" v-if="orderInfoData.repaymentStatus">已回款</el-tag>
                  <el-tag type="warnning" v-else>待回款</el-tag>
                </span>
              </p>
              <p class="info-line">
                <span class="line-label">被接单次数：</span>
                <span class="line-content">{{ orderInfoData.acceptCount }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">回款时间：</span>
                <span class="line-content">{{ orderInfoData.repaymentTime }}</span>
              </p>
              <p class="info-line">
                <span class="line-label">审核状态：</span>
                <!-- （0-驳回，1-通过） -->
                <span class="line-content" style="border: none">
                  <!-- {{ orderInfoData.auditStatus }} -->
                  <!-- <el-tag type="success" v-if="orderInfoData.auditStatus">通过</el-tag>
                  <el-tag type="error" v-else>驳回</el-tag> -->

                  <el-tag v-if="orderInfoData.auditStatus == 0">无需审核</el-tag>
                  <el-tag v-if="orderInfoData.auditStatus == 1" type="info">待审核</el-tag>
                  <el-tag v-if="orderInfoData.auditStatus == 2" type="success">通过</el-tag>
                  <el-tag v-if="orderInfoData.auditStatus == 3" type="danger">驳回</el-tag>
                </span>
              </p>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="费用详情" name="payInfo" v-if="orderItem.orderStatus == 3">
          <div style="padding-bottom: 50px" class="fee_detail" v-loading="$store.state.app.loading" >
            <div class="title" >平台：</div>
            <el-card>
              <div class="info-con" >
                <p class="info-line">
                  <span class="line-label">订单金额（元）：</span>
                  <span class="line-content">{{ orderFeeData.orderAmount }}</span>
                </p>
                <p class="info-line">
                  <span class="line-label">平台利润（元）：</span>
                  <span class="line-content">{{ orderFeeData.platformProfit }}</span>
                </p>
                <p class="info-line">
                  <span class="line-label">系统费率：</span>
                  <span class="line-content">{{ orderFeeData.systemRate }}%</span>
                </p>
                <p class="info-line">
                  <span class="line-label">系统费用（元）：</span>
                  <span class="line-content">{{ orderFeeData.systemCost }}</span>
                </p>
              </div>
            </el-card>
            <div class="title" >商户代理：</div>
            <el-card  >
              <div class="info-con" v-loading="$store.state.app.loading">

                <p class="info-line">
                  <span class="line-label">商户代理费率：</span>
                  <span class="line-content">{{ orderFeeData.merchantAgentRate }}%</span>
                </p>

                <p class="info-line">
                  <span class="line-label">商户代理费用（元）：</span>
                  <span class="line-content">{{ orderFeeData.merchantAgentCost }}</span>
                </p>

              </div>
            </el-card>

            <div class="title" >商户：</div>
            <el-card  >
              <div class="info-con" >

                <p class="info-line">
                  <span class="line-label">商户费率：</span>
                  <span class="line-content">{{ orderFeeData.merchantRate }}%</span>
                </p>

                <p class="info-line">
                  <span class="line-label">商户总费用（元）：</span>
                  <span class="line-content">{{ orderFeeData.merchantCost }}</span>
                </p>

                <p class="info-line">
                  <span class="line-label">商户费用（元）：</span>
                  <span class="line-content">{{ (orderFeeData.merchantCost - orderFeeData.merchantTransactionFee).toFixed(2) }}</span>
                </p>

                <p class="info-line">
                  <span class="line-label">商户单笔费用（元）：</span>
                  <span class="line-content">{{ orderFeeData.merchantTransactionFee }}</span>
                </p>

              </div>
            </el-card>

            <div class="title" >码商：</div>
            <el-card  >
              <div class="info-con" v-loading="$store.state.app.loading">

                <p class="info-line">
                  <span class="line-label">码商费率：</span>
                  <span class="line-content">{{ orderFeeData.providerRate }}%</span>
                </p>

                <p class="info-line">
                  <span class="line-label">码商总费用（元）：</span>
                  <span class="line-content">{{ orderFeeData.providerCost }}</span>
                </p>

                <p class="info-line">
                  <span class="line-label">码商费用（元）：</span>
                  <span class="line-content">{{ (orderFeeData.providerCost - orderFeeData.providerTransactionFee).toFixed(2) }}</span>
                </p>

                <p class="info-line">
                  <span class="line-label">码商单笔费用（元）：</span>
                  <span class="line-content">{{ orderFeeData.providerTransactionFee }}</span>
                </p>
              </div>
            </el-card>


          </div>
        </el-tab-pane>
        <el-tab-pane v-if="payType == 'collect'" label="收银台访问记录" name="viewRecord" lazy>
          <my-table
            class="mt-10"
            ref="infoTable"
            :tableData="visitList"
            :loadData="getVisitList"
            style="width: 100%"
          >

            <el-table-column label="序号" align="center" type="index" width="60" />

            <el-table-column align="center" label="访问收银台时间" sortable>
              <template slot-scope="{ row }">
                <span>{{ row.visitTime }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="设备信息">
              <template slot-scope="{ row }">
                <span v-if="row.deviceType == 0"> <svg-icon icon-class="weizhi" /> &nbsp;未知</span>
                <span v-if="row.deviceType == 1">
                  <svg-icon icon-class="windows" />&nbsp;Windows</span
                >
                <span v-if="row.deviceType == 2"><svg-icon icon-class="MACOS" />&nbsp;macOS</span>
                <span v-if="row.deviceType == 3"><svg-icon icon-class="linux" />&nbsp;linux</span>
                <span v-if="row.deviceType == 4"><svg-icon icon-class="iphone" />&nbsp;iPhone</span>
                <span v-if="row.deviceType == 5"><svg-icon icon-class="ipad" />&nbsp;iPad</span>
                <span v-if="row.deviceType == 6"
                  ><svg-icon icon-class="android" />&nbsp;Android</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="IP地址">
              <template slot-scope="{ row }">
                {{ row.ip }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="访问地址">
              <template slot-scope="{ row}"> {{ row.cashPageUrl }} </template>
            </el-table-column>
          </my-table>
        </el-tab-pane>
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
        <el-tab-pane label="通知记录" name="notifyRecord" lazy>
          <div class="request" v-loading="$store.state.app.loading">
            <p class="req-line">
              <span class="req-label">通知地址：</span>
              <span class="req-value">{{ notifyInfoData.notifyUrl }}</span>
            </p>

            <p class="req-line">
              <span class="req-label">通知时间：</span>
              <span class="req-value">{{ notifyInfoData.notifyTime }}</span>
            </p>

            <p class="req-line line2">
              <span class="req-label">通知内容：</span>
              <!-- <span class="req-value">{{ notifyInfoData.notifyContent }}</span> -->
              <span class="req-value">
                <!-- {{ notifyInfoData.notifyContent }} -->
                <pre>{{ formatJson(notifyInfoData.notifyContent) }}</pre>
              </span>
            </p>
            <p class="req-line">
              <span class="req-label">通知状态:</span>
              <span class="req-value" style="border: none">
                <el-tag type="info" v-if="notifyInfoData.notifyStatus == 0"> 待发送 </el-tag>
                <el-tag type="success" v-else-if="notifyInfoData.notifyStatus == 1">
                  发送成功
                </el-tag>
                <el-tag type="danger" v-else-if="notifyInfoData.notifyStatus == 2">
                  发送失败
                </el-tag>
                <el-tag type="success" v-else-if="notifyInfoData.notifyStatus == 3">
                  响应成功
                </el-tag>
                <el-tag type="danger" v-else-if="notifyInfoData.notifyStatus == 4">
                  响应失败
                </el-tag>
              </span>
            </p>
            <p class="req-line">
              <span class="req-label">响应时间：</span>
              <span class="req-value">{{ notifyInfoData.responseTime }}</span>
            </p>
            <p class="req-line line2">
              <span class="req-label">响应内容：</span>
              <!-- <span class="req-value">{{ notifyInfoData.responseContent }}</span> -->
              <span class="req-value">
                <!-- {{ notifyInfoData.responseContent }} -->
                <pre>{{ formatJson(notifyInfoData.responseContent) }}</pre>
              </span>
            </p>
          </div>
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
        <el-tab-pane v-if="payType == 'collect'" label="聊天记录" name="chatRecord" lazy>
          <div class="chat-box">
            <chatHistory  :orderId="orderItem.orderId"  ></chatHistory>
          </div>
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
      activeTab: 'orderInfo',
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
