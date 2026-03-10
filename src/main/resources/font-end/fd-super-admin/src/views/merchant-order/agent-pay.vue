<template>
  <div class="container" :class="isShowUi ? 'isShowUi' : 'noUi'">
    <div class="gongji">
      <div class="box">
        <el-card class="item-card">
          <div class="title">实时统计：</div>
          <div class="item">
            <div class="c1 txt">
              <span class="label">订单数量(单)</span>
              <span class="money">{{ realtimeData.totalOrders }}</span>
            </div>
            <div class="c2 txt">
              <span class="label">成交数量(单)</span>
              <span class="money">{{ realtimeData.successfulOrders }}</span>
            </div>
            <div class="c3 txt">
              <span class="label">成功率</span>
              <span class="money">{{ realtimeData.successfulRate }} % </span>
            </div>
            <div class="c1 txt">
              <span class="label">订单金额(元)</span>
              <span class="money">{{ realtimeData.totalOrderAmount }} </span>
            </div>
            <div class="c2 txt">
              <span class="label">成交金额(元)</span>
              <span class="money">{{ realtimeData.totalSuccessfulAmount }}</span>
            </div>
            <div class="c3 txt">
              <span class="label">实付金额(元)</span>
              <span class="money">{{ realtimeData.totalSuccessfulActualPaidAmount }}</span>
            </div>
            <div class="c1 txt">
              <span class="label">空单数量(单)</span>
              <span class="money">{{ realtimeData.emptyOrderCount }}</span>
            </div>
            <div class="c2 txt">
              <span class="label">空单金额(元)</span>
              <span class="money">{{ realtimeData.totalEmptyAmount }}</span>
            </div>
            <div class="c3 txt">
              <span class="label">空单占比</span>
              <span class="money">{{ realtimeData.emptyOrderRate }} % </span>
            </div>
          </div>
        </el-card>
        <el-card class="item-card card2">
          <div class="title title2">今日统计：</div>
          <div class="item">
            <div class="c1 txt">
              <span class="label">订单数量(单)</span>
              <span class="money">{{ todayData.totalOrders }}</span>
            </div>
            <div class="c2 txt">
              <span class="label">成交数量(单)</span>
              <span class="money">{{ todayData.successfulOrders }}</span>
            </div>
            <div class="c3 txt">
              <span class="label">成功率</span>
              <span class="money">{{ todayData.successfulRate }} % </span>
            </div>
            <div class="c1 txt">
              <span class="label">订单金额(元)</span>
              <span class="money">{{ todayData.totalOrderAmount }}</span>
            </div>
            <div class="c2 txt">
              <span class="label">成交金额(元)</span>
              <span class="money">{{ todayData.totalSuccessfulAmount }}</span>
            </div>
            <div class="c3 txt">
              <span class="label">实付金额(元)</span>
              <span class="money">{{ todayData.totalSuccessfulActualPaidAmount }}</span>
            </div>
            <div class="c1 txt">
              <span class="label">空单数量(单)</span>
              <span class="money">{{ todayData.emptyOrderCount }}</span>
            </div>
            <div class="c2 txt">
              <span class="label">空单金额(元)</span>
              <span class="money">{{ todayData.totalEmptyAmount }}</span>
            </div>
            <div class="c3 txt">
              <span class="label">空单占比</span>
              <span class="money">{{ todayData.emptyOrderRate }} % </span>
            </div>
          </div>
        </el-card>
        <el-card class="item-card card3">
          <div class="title title3">昨日统计：</div>
          <div class="item">
            <div class="c1 txt">
              <span class="label">订单数量(单)</span>
              <span class="money">{{ yesterdayData.totalOrders }}</span>
            </div>
            <div class="c2 txt">
              <span class="label">成交数量(单)</span>
              <span class="money">{{ yesterdayData.successfulOrders }}</span>
            </div>
            <div class="c3 txt">
              <span class="label">成功率</span>
              <span class="money">{{ yesterdayData.successfulRate }} % </span>
            </div>
            <div class="c1 txt">
              <span class="label">订单金额(元)</span>
              <span class="money">{{ yesterdayData.totalOrderAmount }}</span>
            </div>
            <div class="c2 txt">
              <span class="label">成交金额(元)</span>
              <span class="money">{{ yesterdayData.totalSuccessfulAmount }}</span>
            </div>
            <div class="c3 txt">
              <span class="label">实付金额(元)</span>
              <span class="money">{{ yesterdayData.totalSuccessfulActualPaidAmount }}</span>
            </div>
            <div class="c1 txt">
              <span class="label">空单数量(单)</span>
              <span class="money">{{ yesterdayData.emptyOrderCount }}</span>
            </div>
            <div class="c2 txt">
              <span class="label">空单金额(元)</span>
              <span class="money">{{ yesterdayData.totalEmptyAmount }}</span>
            </div>
            <div class="c3 txt">
              <span class="label">空单占比</span>
              <span class="money">{{ yesterdayData.emptyOrderRate }} % </span>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <el-card>
      <el-form
        :rules="queryRules"
        ref="queryFormRef"
        :inline="true"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            v-model="queryFormData.systemOrderNo"
            placeholder="请输入系统订单号"
            size="small"
            clearable
          />
        </el-form-item>

        <el-form-item label="商户订单号" prop="merchantOrderNo">
          <el-input
            v-model="queryFormData.merchantOrderNo"
            placeholder="请输入商户订单号"
            size="small"
            clearable
          />
        </el-form-item>

        <el-form-item label="订单金额" prop="orderAmount" :rules="minOrderAmountRules">
          <el-input
            v-model="queryFormData.orderAmount"
            v-number-input-positive
            placeholder="订单金额"
            type="number"
            clearable
            size="small"
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
            placeholder="最小金额"
            v-number-input-positive
            type="number"
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

        <el-form-item label="产品名称" prop="">
          <el-select
            filterable
            v-model="queryFormData.productId"
            placeholder="请选择产品名称"
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

        <el-form-item label="商户" prop="">
          <el-select
            filterable
            v-model="queryFormData.merchantId"
            clearable
            placeholder="请选择商户"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in allMerchantList"
              :key="item.merchantId"
              :label="item.userNickName"
              :value="item.merchantId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="码商" prop="">
          <el-select
            v-model="queryFormData.providerId"
            clearable
            filterable
            placeholder="请选择码商"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in providerList"
              :key="item.providerId"
              :label="item.userNickName"
              :value="item.providerId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="订单状态" prop="">
          <el-select
            filterable
            v-model="queryFormData.orderStatus"
            placeholder="请选择订单状态"
            size="small"
          >
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
          <el-select
            filterable
            v-model="queryFormData.notifyStatus"
            placeholder="请选择通知状态"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in notifyStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核状态" prop="">
          <el-select
            filterable
            v-model="queryFormData.auditStatus"
            placeholder="请选择通知状态"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="无需审核" :value="0" ></el-option>
            <el-option label="待审核" :value="1" ></el-option>
            <el-option label="通过" :value="2" ></el-option>
            <el-option label="驳回" :value="3" ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="审核用户名" prop="confirmOrderUserName">
          <el-input
            v-model="queryFormData.confirmOrderUserName"
            placeholder="请输入审核用户名"
            size="small"
            clearable
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

    <el-card class="mt-10 my-card">
      <div class="tool-box">
        <div class="auto-flush">
          <span class="mr-10">自动刷新</span>
          <el-checkbox-group v-model="autoCheckList" @change="checkGroupChange">
            <el-checkbox :label="10">10秒</el-checkbox>
            <el-checkbox :label="30">30秒</el-checkbox>
            <el-checkbox :label="60">60秒</el-checkbox>
          </el-checkbox-group>
          <span class="flush-tips ml-10">{{ flushTips }}</span>

          <el-dropdown trigger="click" style="margin-left: 10px; cursor: pointer">
            <span
              class="el-dropdown-link"
              style="display: flex; height: 100%; align-items: center; font-size: 24px"
            >
              <i class="el-icon-s-grid"></i>
            </span>
            <el-dropdown-menu slot="dropdown" style="padding: 10px; width: 200px">
              <el-checkbox
                v-model="allSelected"
                @change="handleAllSelectChange"
                style="display: block; margin-bottom: 8px"
                >全选</el-checkbox
              >
              <el-checkbox-group v-model="selectedItems" @change="handleItemChange">
                <el-checkbox
                  :key="item"
                  v-for="item in allItems"
                  style="display: block"
                  :label="item"
                  >{{ item }}</el-checkbox
                >
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div class="btns">
          <el-button type="primary" icon="el-icon-dish" @click="allNotify()">一键通知</el-button>

          <el-button type="primary" plain icon="el-icon-plus" @click="handleDownload"
            >批量导出</el-button
          >
        </div>
      </div>

      <my-table
        class="mt-10"
        :loadData="loadTableData"
        :tableData="tableData"
        :defaultPageSize="30"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="40"
          v-if="selectedItems.includes('序号')"
        />

        <el-table-column
          label="订单号"
          align="center"
          width="220"
          v-if="selectedItems.includes('订单号')"
        >
          <template slot-scope="{ row }">
            <div style="display: flex; flex-direction: column; align-items: flex-start">
              <div>
                <el-tag>系统</el-tag>
                <span
                  style="cursor: pointer"
                  @click="
                    (e) => {
                      clipboard(row.systemOrderNo, e)
                    }
                  "
                  >{{ row.systemOrderNo }}</span
                >
              </div>
              <div class="mt-5">
                <el-tag>商户</el-tag>
                <span
                  style="cursor: pointer"
                  @click="
                    (e) => {
                      clipboard(row.merchantOrderNo, e)
                    }
                  "
                  >{{ row.merchantOrderNo }}</span
                >
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="商户订单号" align="center" prop="merchantOrderNo" /> -->

        <!-- <el-table-column label="订单金额(元)" align="center" prop="orderAmount" sortable />
        <el-table-column label="实付金额" align="center" prop="pay_order_money" sortable /> -->

        <el-table-column
          label="产品信息"
          align="center"
          width="140"
          v-if="selectedItems.includes('产品信息')"
        >
          <template slot-scope="{ row }">
            <div style="display: flex; flex-direction: column; align-items: flex-start">
              <div style="display: flex; align-items: center">
                <el-tag>通道</el-tag>
                <span
                  style="cursor: pointer"
                  @click="
                    (e) => {
                      clipboard(row.channelName, e)
                    }
                  "
                  >{{ row.channelName }}</span
                >
              </div>

              <div class="mt-5">
                <el-tag>产品</el-tag>
                <span
                  style="cursor: pointer"
                  @click="
                    (e) => {
                      clipboard(row.productName, e)
                    }
                  "
                  >{{ row.productName }}</span
                >
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="交易者信息"
          align="center"
          v-if="selectedItems.includes('交易者信息')"
        >
          <el-table-column label="商户信息" align="center" width="160">
            <template slot-scope="{ row }">
              <div style="display: flex; flex-direction: column; align-items: flex-start">
                <div>
                  <el-tag>用户名</el-tag>
                  <span
                    style="cursor: pointer"
                    @click="
                      (e) => {
                        clipboard(row.merchantUserName, e)
                      }
                    "
                    >{{ row.merchantUserName }}</span
                  >
                </div>
                <div class="mt-5">
                  <el-tag>昵称</el-tag>
                  <span
                    style="cursor: pointer"
                    @click="
                      (e) => {
                        clipboard(row.merchantUserNickName, e)
                      }
                    "
                    >{{ row.merchantUserNickName }}</span
                  >
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="码商信息" align="center" width="160">
            <template slot-scope="{ row }">
              <div style="display: flex; flex-direction: column; align-items: flex-start">
                <div>
                  <el-tag>用户名</el-tag>
                  <span
                    style="cursor: pointer"
                    @click="
                      (e) => {
                        clipboard(row.providerUserName, e)
                      }
                    "
                    >{{ row.providerUserName }}</span
                  >
                </div>
                <div class="mt-5">
                  <el-tag>昵称</el-tag>
                  <span
                    style="cursor: pointer"
                    @click="
                      (e) => {
                        clipboard(row.providerUserNickName, e)
                      }
                    "
                    >{{ row.providerUserNickName }}</span
                  >
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column
          label="订单金额(元)"
          align="center"
          width="120"
          v-if="selectedItems.includes('订单金额')"
        >
          <template slot-scope="{ row }">
            {{ row.orderAmount }}
          </template>
        </el-table-column>

        <el-table-column
          label="收款信息"
          align="center"
          prop="paymentData"
          width="150"
          v-if="selectedItems.includes('收款信息')"
        >
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

        <!-- <el-table-column label="收款码" align="center" prop="shoukuan_info">
          <template slot-scope="{ row }">
            <el-button type="text" @click="look_shoukuan_info(row)">查看</el-button>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="付款说明" align="center" prop="paymentDesc">
          <template slot-scope="{ row }">
            {{ row.paymentDesc }}
          </template>
        </el-table-column> -->

        <el-table-column
          label="订单时间"
          align="center"
          width="220px"
          v-if="selectedItems.includes('订单时间')"
        >
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div v-if="row.createTime"><el-tag>创建时间:</el-tag> {{ row.createTime }}</div>
              <div v-if="row.receiveTime"><el-tag>接单时间:</el-tag> {{ row.receiveTime }}</div>
              <div v-if="row.confirmOrderTime">
                <el-tag>确认时间:</el-tag> {{ row.confirmOrderTime }}
              </div>
              <div v-if="row.notifyTime"><el-tag>通知时间:</el-tag> {{ row.notifyTime }}</div>
              <div v-if="row.repaymentTime"><el-tag>回款时间:</el-tag> {{ row.repaymentTime }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          width="160"
          v-if="selectedItems.includes('状态')"
        >
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div>
                订单状态:
                <el-tag
                  v-if="row.orderStatus != null"
                  :type="orderStateOptions.find((item) => item.value === row.orderStatus).type"
                  >{{
                    orderStateOptions.find((item) => item.value === row.orderStatus).label
                  }}</el-tag
                >
              </div>
              <div>
                通知状态:
                <el-tag
                  v-if="row.notifyStatus != null"
                  :type="notifyStatusOptions.find((item) => item.value === row.notifyStatus).type"
                >
                  {{
                    notifyStatusOptions.find((item) => item.value === row.notifyStatus).label
                  }}</el-tag
                >
              </div>
              <div>
                <!-- 审核状态  (0-无斋审核，1-待审核，2-通过 3-驳回) -->
                审核状态:
                <el-tag v-if="row.auditStatus == 0">无需审核</el-tag>
                <el-tag v-if="row.auditStatus == 1" type="info">待审核</el-tag>
                <el-tag v-if="row.auditStatus == 2" type="success">通过</el-tag>
                <el-tag v-if="row.auditStatus == 3" type="danger">驳回</el-tag>
              </div>
              <div>
                回款状态:
                <el-tag type="danger" v-if="row.repaymentStatus == 0">待回款</el-tag>
                <el-tag type="success" v-if="row.repaymentStatus == 1">已回款</el-tag>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="归属地"
          align="center"
          prop="submit_info"
          v-if="selectedItems.includes('归属地')"
        >
          <template slot-scope="{ row }">
            <el-button type="text" @click="look_card_area(row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="转账凭证"
          align="center"
          prop="submit_info"
          v-if="selectedItems.includes('转账凭证')"
        >
          <template slot-scope="{ row }">
            <el-button
              v-if="row.transferVoucher && row.transferVoucher.length > 0"
              type="text"
              @click="look_submit_info(row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="审核用户名"
          align="center"
          prop="auditResultPeople"
          width="100"
          v-if="selectedItems.includes('审核用户名')"
        >
          <template slot-scope="{ row }">
            {{ row.confirmOrderUserName ? row.confirmOrderUserName : '' }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="200" fixtt="right">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="primary" class="btn mt-5" @click="showChuliDialog(row)">
                <i class="el-icon-s-help" />处理订单
              </div>
              <div type="primary" class="btn mt-5" @click="notice_merchant(row)">
                <i class="el-icon-message-solid" />通知商户
              </div>

              <div type="primary" class="btn mt-5" @click="showCommonDialog(row, 2)">
                <i class="el-icon-s-promotion" />驳回订单
              </div>

              <div type="primary" class="btn mt-5" @click="look_trans_product_info(row)">
                <i class="el-icon-s-custom" />团队长
              </div>
              <div type="primary" class="btn mt-5" @click="orderInfo(row)">
                <i class="el-icon-s-order" />详情
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <!-- <orderDetail ref="incomeOrderInfo" payType="agent-pay"></orderDetail> -->
    <orderDetail
      ref="incomeOrderInfo"
      :orderItem="currOrder"
      v-if="showOrderDetail"
      @close="showOrderDetail = false"
      payType="agent-pay"
    ></orderDetail>

    <el-dialog :visible.sync="trans_product_visual" title="码商信息" width="600px">
      <!-- <my-table
        class="mt-10"
        style="width: 100%"
        border
        :tableData="tableData"
        :loadData="() => {}"
        :total="50"
      >
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
      </my-table> -->

      <div>团队长：{{ rowTopProvider.userNickName }}</div>

      <div slot="footer">
        <el-button @click="trans_product_visual = false" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

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
        >
        </el-image>
      </div>

      <div style="text-align: center">
        <el-button type="primary" @click="submit_info_dialog_visible = false" size="small">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      @close="onCommonBtnCancel()"
      :visible.sync="showChuliDialogVisual"
      title="处理订单"
      width="600px"
    >
      <el-form
        ref="commonFormRef"
        :rules="rules"
        :model="chuliFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            disabled
            v-model="chuliFormData.systemOrderNo"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户订单号" prop="merchantOrderNo">
          <el-input
            disabled
            v-model="chuliFormData.merchantOrderNo"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="订单金额" prop="orderAmount">
          <el-input
            disabled
            v-model="chuliFormData.orderAmount"
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="操作类型" prop="commonDialogType">
          <el-select
            filterable
            v-model="chuliFormData.commonDialogType"
            placeholder="请选择操作类型"
            size="small"
          >
            <el-option label="审核通过" :value="1"></el-option>
            <el-option label="重新分配" :value="3"></el-option>
            <el-option label="审核驳回" :value="2"></el-option>
            <!-- <el-option label="补单" :value="4"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="chuliFormData.commonDialogType == 1"
          label="审核说明"
          prop="auditResultRemark"
        >
          <!-- 审核说明,最大长度255 -->
          <el-input
            type="textarea"
            :rows="5"
            v-model="chuliFormData.auditResultRemark"
            placeholder="请输入审核说明, 最大255个字符"
            size="small"
          />
        </el-form-item>
        <el-form-item
          label="选择码商"
          prop="targetProviderId"
          v-if="chuliFormData.commonDialogType == 3"
        >
          <el-select filterable v-model="chuliFormData.targetProviderId">
            <el-option
              v-for="item in resetProviderList"
              :key="item.providerId"
              :label="item.userNickName"
              :value="item.providerId"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          v-if="chuliFormData.commonDialogType == 2"
          label="审核说明"
          prop="checkReason"
        >
          <el-select
            filterable
            v-model="chuliFormData.checkReason"
            placeholder="请选择原因"
            size="small"
          >
            <el-option label="其他说明" :value="6"></el-option>
          </el-select>
        </el-form-item> -->

        <!-- v-if="chuliFormData.commonDialogType == 2 && chuliFormData.checkReason == 6" -->
        <el-form-item
          v-if="chuliFormData.commonDialogType == 2"
          label="驳回说明"
          prop="otherCheckReson"
        >
          <el-input
            type="textarea"
            :rows="5"
            v-model="chuliFormData.otherCheckReson"
            placeholder="请输入驳回说明, 最大255个字符"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCommonBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onCommonBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="fenpeiDialogVisual" title="分配订单" width="600px">
      <el-form
        ref="form"
        :model="fenpeiFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            disabled
            v-model="fenpeiFormData.systemOrderNo"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="订单金额" prop="orderAmount">
          <el-input
            disabled
            v-model="fenpeiFormData.orderAmount"
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="选择码商" prop="choose_service">
          <el-select filterable v-model="fenpeiFormData.choose_service">
            <el-option
              v-for="item in providerList"
              :key="item.providerId"
              :label="item.userNickName"
              :value="item.providerId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="交易密码" prop="password">
          <el-input
            v-model="chuliFormData.password"
             type="password"   show-password
            placeholder="请输入交易密码"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="fenpeiDialogVisual = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="fenpeiDialogVisual = false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog> -->

    <el-dialog :visible.sync="card_area_visible" title="查看归属地" width="500px">
      <div style="padding: 0px 30px 20px">
        <!-- {{ card_area_msg }} -->
        <div style="padding: 5px 10px">
          状态：{{ card_area_msg.status == 0 ? '查询成功' : '查询失败' }}
        </div>
        <template v-if="card_area_msg.status == 0">
          <div style="padding: 5px 10px">卡号：{{ card_area_msg.card }}</div>
          <div style="padding: 5px 10px">省份：{{ card_area_msg.province }}</div>
          <div style="padding: 5px 10px">城市：{{ card_area_msg.city }}</div>
          <div style="padding: 5px 10px">卡名：{{ card_area_msg.cardName }}</div>
          <div style="padding: 5px 10px">卡种：{{ card_area_msg.cardType }}</div>
        </template>
      </div>

      <div style="text-align: center">
        <el-button type="primary" @click="card_area_visible = false" size="small"> 关闭 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="commonDialogVisible"
      :title="commonDialogTitle"
      width="600px"
      @close="onCommonBtnCancel2()"
    >
      <el-form
        ref="formRef"
        :model="commonFormData"
        label-position="right"
        :rules="rules"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号" prop="">
          <el-input
            v-model="commonFormData.systemOrderNo"
            disabled
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item v-if="[0, 1, 2].includes(commonDialogType)" label="商户订单号" prop="">
          <el-input
            v-model="commonFormData.merchantOrderNo"
            disabled
            placeholder="请输入商户订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="订单金额" prop="">
          <el-input
            v-model="commonFormData.orderAmount"
            disabled
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="收款人" prop="" v-if="commonFormData.paymentDataType == 2">
          <el-input
            :value="JSON.parse(commonFormData.paymentData).payee"
            disabled
            placeholder=""
            size="small"
          />
        </el-form-item>
        <el-form-item label="账号" prop="" v-if="commonFormData.paymentDataType == 2">
          <el-input
            :value="JSON.parse(commonFormData.paymentData).payeeNo"
            disabled
            placeholder=""
            size="small"
          />
        </el-form-item>
        <el-form-item label="地址" prop="" v-if="commonFormData.paymentDataType == 2">
          <el-input
            :value="JSON.parse(commonFormData.paymentData).payeeAddress"
            disabled
            placeholder=""
            size="small"
          />
        </el-form-item>

        <el-form-item
          label="收款信息"
          prop="paymentData"
          v-if="commonFormData.paymentDataType != 2"
        >
          <el-image
            class="img"
            style="width: 100px; height: 100px"
            :src="commonFormData.paymentData"
          >
          </el-image>
        </el-form-item>

        <el-form-item v-if="commonDialogType == 2" label="驳回原因" prop="rejectReson">
          <el-select
            v-model="commonFormData.rejectReson"
            filterable
            placeholder="请选择原因"
            size="small"
          >
            <!-- <el-option v-for="i in 5" :key="i" :label="`原因` + i" :value="`原因` + i" /> -->

            <el-option label="信息不符" value="信息不符" />
            <el-option label="信用卡" value="信用卡" />
            <el-option label="银行卡退款" value="银行卡退款" />
            <el-option label="账号限制收款" value="账号限制收款" />
            <el-option label="会员账号设置隐私" value="会员账号设置隐私" />
            <el-option label="未实名" value="未实名" />
            <el-option label="账户风险" value="账户风险" />

            <el-option label="其他原因" :value="6" />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="commonDialogType == 2 && commonFormData.rejectReson == 6"
          label="其他原因"
          prop="auditResultRemark"
        >
          <el-input
            v-model="commonFormData.auditResultRemark"
            type="textarea"
            :rows="4"
            placeholder="请输入驳回原因"
            size="small"
          />
        </el-form-item>

        <el-form-item
          v-if="[1, 2].includes(commonDialogType)"
          label="凭证"
          :prop="commonDialogType == 2 ? '' : 'transferVoucher'"
        >
          <el-upload
            ref="upload"
            class="upload-demo"
            action="#"
            :on-remove="handleRemove"
            accept="image/*"
            :on-change="handleChange"
            :http-request="uploadImage"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :file-list="commonFormData.transferVoucher"
            :limit="3"
            multiple
            list-type="picture-card"
            :auto-upload="true"
          >
            <i class="el-icon-plus" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- <pasteImage @paste-image="handlePasteImage"></pasteImage> -->
      <div slot="footer">
        <el-button size="small" @click="onCommonBtnCancel2()"> 取消 </el-button>
        <el-button type="primary" size="small" @click="onCommonBtnOK2()"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderDetail from './components/order-detail.vue'

import clipboard from '@/utils/clipboard'

import { formatDateTime } from '@/utils'
import FileSaver from 'file-saver'

import { orderRules, queryRules } from './rules.js'

import { orderStateOptions } from "@/utils/constants";

import { getChannelByTenantId } from '@/api/merchant.js'
import { getProductListByTenantId } from '@/api/service-list-setting.js'
import { getMerchantList } from '@/api/merchant-info.js'
import { getProviderOptionList, getProviderOptionListByProductId } from '@/api/service-list.js'

import { amountCheck } from '@/utils/validate.js'
import { isEmpty } from '@/utils'

import { getProviderTop } from '@/api/service-list'

import { uploadFileToServer } from '@/api/upload'

import {
  getPaymentOrderListPage,
  repairPaymentOrder,
  getPaymentOrderDataAnalysis,
  exportPaymentOrderData,
  auditPaymentOrder,
  assignPaymentOrder,
  getYesterdayPaymentOrderDataAnalysis,
  rejectPaymentOrder,
  getTodayPaymentOrderDataAnalysis,
  paymentOrderReject,
  notifyMerchantByPaymentOrderId,
  queryCardAddr,
  batchNotifyPaymentMerchants
} from '@/api/agent-pay'

import { getFileById } from '@/api/upload'

import pasteImage from '@/components/paste-image.vue'

//------------------------------------------------------data---------------------------------------------------------------------------------------------
export default {
  name: 'AgentPay',
  components: { orderDetail, pasteImage },
  data() {
    return {
      selectedItems: [],
      allSelected: true,
      allItems: [
        '序号',
        '订单号',
        '产品信息',
        '交易者信息',
        '订单金额',
        '收款信息',
        '订单时间',
        '状态',
        '归属地',
        '转账凭证',
        '审核用户名'
      ],

      queryRules: queryRules,
      rules: orderRules,
      realtimeData: {}, //  实时数据
      todayData: {}, //  今日数据
      yesterdayData: {}, //  昨日数据

      tableData: [],
      dialogVisible: false,
      formData: {},
      cardItems: ['订单数量', '订单金额', '成交订单数量', '成交订单金额', '成功率', '实付金额'],
      queryFormData: this.getQueryForm(),
      isEdit: false, // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据

      minOrderAmountRules: [
        { validator: amountCheck, trigger: 'blur' }
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
        { validator: amountCheck, trigger: 'blur' }
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

      orderStateOptions,
      notifyStatusOptions: [
        { label: '未通知', value: 0, type: 'info' },
        { label: '通知成功', value: 1, type: 'success' },
        { label: '通知失败', value: 2, type: 'danger' }
        // { label: '响应成功', value: 3, type: 'success' },
        // { label: '响应失败', value: 4, type: 'warning' }
      ],

      autoCheckList: [],
      flushTips: '',
      currFlushSecond: 0,
      autoFlushFlag: '',
      trans_product_visual: false, // 交易者信息 弹窗
      chuliFormData: {},
      // 提交信息弹框
      submit_info_dialog_visible: false,
      submit_info_formData: {
        password: '',
        isShow: false,
        systemOrderNo: ''
      },
      pingImgShowList: [],

      fenpeiDialogVisual: false,
      fenpeiFormData: {
        choose_service: '',
        systemOrderNo: '',
        orderAmount: '',
        pay_order_money: ''
      },
      showChuliDialogVisual: false,
      imageUrl: '',
      showOrderDetail: false,
      currOrder: {},

      productList: [],
      allChannelList: [],
      providerList: [], // 码商列表
      resetProviderList: [], // 重新分配的码商列表
      allMerchantList: [], // 所有商户
      rowTopProvider: {},
      card_area_visible: false,
      card_area_msg: '',
      commonDialogType: '',
      commonDialogTitle: '',
      commonDialogVisible: false,
      commonFormData: ''
    }
  },
  watch: {
    '$store.state.tenant.selectTenantId'(newV, oldV) {
      console.log('------getTenantOrderInfo----------', newV)
      this.getTenantOrderInfo()
      this.queryTableData()
    },
    selectedItems(newV) {
      this.$store.commit('settings/SET_agentPayColumns', newV)
    }
  },
  methods: {
    // handlePasteImage(file) {
    //   console.log(file)
    //   this.commonFormData.transferVoucher.push({
    //     raw: file,
    //     url: URL.createObjectURL(file)
    //   })
    // },
    handleAllSelectChange(val) {
      if (val) {
        this.selectedItems = [...this.allItems]
      } else {
        this.selectedItems = []
      }
    },
    handleItemChange(val) {
      this.allSelected = val.length === this.allItems.length
    },
    handleExceed(file, fileList) {
      this.$message({
        message: '最多只能选择3张图片',
        type: 'error'
      })
    },
    async handleSuccess(response, file, fileList) {
      console.log('----handleSuccess------', response, file, fileList)

      //-------
      this.commonFormData.transferVoucher = fileList
      const index = this.commonFormData.transferVoucher.findIndex((ele) => ele.uid == file.uid)

      if (response && response.data) {
        let res = await getFileById(response.data)
        console.log(res)
        fileList[index].fileId = response.data
      } else {
        console.error('上传文件出错，data 为空')
        this.$message.error('上传文件出错， 请稍后重试')
        this.commonFormData.transferVoucher.splice(index, 1)
      }
    },
    handleRemove(file, fileList) {
      this.commonFormData.transferVoucher = fileList
    },

    async uploadImage(action) {
      try {
        console.log('----uploadImage------', action)
        let res = await uploadFileToServer(action.file)
        console.log('uploadImage - ', res)
        return res
      } catch (e) {
        console.log(e)
      }
    },

    handleChange(file, fileList) {
      // console.log('----handleChange------', fileList)
      // this.commonFormData.transferVoucher = fileList
      // 校验 上传
      this.$refs.formRef.validateField('transferVoucher')
    },
    onCommonBtnCancel2() {
      this.commonDialogVisible = false
      this.$refs.formRef.resetFields()
    },
    onCommonBtnOK2() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) {
          return
        }

        if (this.commonDialogType == 2) {
          // 订单驳回
          const remark =
            this.commonFormData.rejectReson == 6
              ? this.commonFormData.auditResultRemark
              : this.commonFormData.rejectReson

          const transferVoucher = this.commonFormData.transferVoucher
            .map((ele) => {
              // if (ele.response && ele.response.length > 0) {
              //   return ele.response[0].url
              // }
              return ele.fileId
            })
            .join(',')

          // 驳回订单
          await paymentOrderReject({
            orderId: this.commonFormData.orderId,
            transferVoucher: transferVoucher,
            auditResultRemark:
              this.commonDialogType == 2 && this.commonFormData.rejectReson == 6
                ? this.commonFormData.auditResultRemark
                : this.commonFormData.rejectReson
          })
          this.$message.success('驳回订单成功')
        }

        this.$message.success('处理成功')

        this.flushPage()
        this.onCommonBtnCancel2()
      })
    },

    showCommonDialog(row, type) {
      this.commonDialogType = type
      this.commonDialogTitle =
        type == 0 ? '取消订单' : type == 1 ? '确认订单' : type == 2 ? '驳回订单' : '出错了' + type
      this.commonDialogVisible = true

      // 转账说明

      this.commonFormData = {
        orderId: row.orderId,
        systemOrderNo: row.systemOrderNo, // 系统订单号
        merchantOrderNo: row.merchantOrderNo, //  商户订单号
        orderAmount: row.orderAmount, // 订单金额
        paymentData: row.paymentData, // 收款信息
        paymentDesc: row.paymentDesc, // 付款说明
        paymentDataType: row.paymentDataType, //收款信息类型
        transferDesc: '', // 转账说明
        transferVoucher: [], // 凭证
        rejectReson: '', // 驳回原因
        otherRejectReson: '' // 其他驳回原因
      }
    },

    async look_card_area(row) {
      this.card_area_visible = true

      const cardNum = JSON.parse(row.paymentData).payeeNo
      let ret = await queryCardAddr(cardNum)
      console.log(ret)

      this.card_area_msg = ret.data
    },
    async loadTableData(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
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

      let res = await getPaymentOrderListPage(page, params)
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
      // this.$refs.tableRef.getTableData(1)
      this.flushPage()
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
        auditStatus: '',
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

        // 获得实时数据统计
        let params = {
          tenantId: this.$store.state.tenant.selectTenantId
        }
        Object.keys(this.queryFormData).forEach((key) => {
          if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined) {
            if (key == 'createTime') {
              params['startTime'] = this.queryFormData['createTime'][0]
              params['endTime'] = this.queryFormData['createTime'][1]
            } else {
              params[key] = this.queryFormData[key]
            }
          }
        })

        getPaymentOrderDataAnalysis(params).then((res) => {
          this.realtimeData = res.data
        })

        // 获得今日统计
        getTodayPaymentOrderDataAnalysis(this.$store.state.tenant.selectTenantId).then((res) => {
          this.todayData = res.data
        })
      })
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type.includes('image')
      // file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 4

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 4MB!')
      }
      return isJPG && isLt2M
    },

    showChuliDialog(row) {
      this.showChuliDialogVisual = true
      this.chuliFormData = {
        orderId: row.orderId,
        systemOrderNo: row.systemOrderNo,
        merchantOrderNo: row.merchantOrderNo,
        orderAmount: row.orderAmount
      }
      this.getProviderOptionListByProductId(row.productId)
    },
    async getProviderOptionListByProductId(productId) {
      let res = await getProviderOptionListByProductId({
        tenantId: this.$store.state.tenant.selectTenantId,
        productId: productId
      })
      this.resetProviderList = res.data
    },

    onCommonBtnCancel() {
      this.$refs.commonFormRef.resetFields()
      this.showChuliDialogVisual = false
    },
    onCommonBtnOk() {
      this.$refs.commonFormRef.validate(async (valid) => {
        if (!valid) {
          return false
        }

        if (this.chuliFormData.commonDialogType == 1) {
          // 审核通过
          await auditPaymentOrder({
            orderId: this.chuliFormData.orderId,
            auditResultRemark: this.chuliFormData.auditResultRemark
          })
        } else if (this.chuliFormData.commonDialogType == 2) {
          //审核驳回
          this.chuliFormData.checkReason = 6
          await rejectPaymentOrder({
            orderId: this.chuliFormData.orderId,
            transferVoucher: this.chuliFormData.transferVoucher,
            auditResultRemark:
              this.chuliFormData.checkReason != 6
                ? this.chuliFormData.checkReason
                : this.chuliFormData.otherCheckReson
          })
        } else if (this.chuliFormData.commonDialogType == 3) {
          // 分配
          await assignPaymentOrder({
            orderId: this.chuliFormData.orderId,
            targetProviderId: this.chuliFormData.targetProviderId,
            targetProviderUserName: this.providerList.find(
              (item) => item.providerId == this.chuliFormData.targetProviderId
            ).userName
          })
        } else if (this.chuliFormData.commonDialogType == 4) {
          // 补单
          await repairPaymentOrder(this.chuliFormData.orderId)
        }

        this.$message.success('处理成功')

        this.onCommonBtnCancel()
        this.flushPage()
      })
    },

    // showFenpeiDialog(row) {
    //   this.fenpeiDialogVisual = true
    //   this.fenpeiFormData = {
    //     systemOrderNo: row.systemOrderNo,
    //     orderAmount: row.orderAmount,
    //     pay_order_money: row.pay_order_money,
    //     new_pay_order_money: '',
    //     password: ''
    //   }
    // },
    async handleDownload() {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await exportPaymentOrderData(params)
      FileSaver.saveAs(res, '代付订单列表.xlsx')
    },

    clipboard,
    look_submit_info(row) {
      this.pingImgShowList = row.transferVoucher.split(',').map((ele) => {
        let item = {
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
    async look_trans_product_info(row) {
      if (!row.providerId) {
        this.$message.error('当前订单暂无码商接单')
        return
      }
      this.trans_product_visual = true
      this.rowTopProvider = {}
      let ret = await getProviderTop(row.providerId)
      this.rowTopProvider = ret.data
    },
    look_shoukuan_info(row) {
      this.$alert(`查看${row.systemOrderNo} 的收款码`, {
        confirmButtonText: '确定',
        callback: (action) => {
          // this.$message({
          //   type: 'info',
          //   message: `action: ${ action }`
          // });
        }
      })
    },

    allNotify() {
      this.$confirm('确认要将全部未通知成功的订单重新通知吗？').then((_) => {
        batchNotifyPaymentMerchants(this.$store.state.tenant.selectTenantId).then((res) => {
          this.$message.success('全部通知成功')
          this.flushPage()
        })
      })
    },
    notice_merchant(row) {
      this.$confirm(`确认要通知商户 【 ${row.merchantUserName} 】 吗？`).then((_) => {
        notifyMerchantByPaymentOrderId(row.orderId).then((res) => {
          this.$message.success('通知成功')
          this.flushPage()
        })
      })
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除 【 ${row} 】 吗？`)
        this.tableData = this.tableData.filter((item) => {
          return item.id !== row.id
        })
        //todo 调用接口删除
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },

    orderInfo(row) {
      // this.$refs.incomeOrderInfo.drawer = true
      this.currOrder = row
      this.showOrderDetail = true
    },

    getTenantOrderInfo() {
      // 获得实时数据统计
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      getPaymentOrderDataAnalysis(params).then((res) => {
        this.realtimeData = res.data
      })

      getTodayPaymentOrderDataAnalysis(this.$store.state.tenant.selectTenantId).then((res) => {
        this.todayData = res.data
      })

      getYesterdayPaymentOrderDataAnalysis(this.$store.state.tenant.selectTenantId).then((res) => {
        this.yesterdayData = res.data
      })

      //  通道信息
      this.allChannelList = []
      getChannelByTenantId(this.$store.state.tenant.selectTenantId).then((res) => {
        if (res.data && res.data.length > 0) {
          this.allChannelList = res.data
        }
      })

      // 所有产品列表明
      this.productList = []
      getProductListByTenantId(this.$store.state.tenant.selectTenantId).then((res) => {
        if (res.data && res.data.length > 0) {
          this.productList = res.data
        }
      })

      // 获得所有商户信息
      getMerchantList({
        tenantId: this.$store.state.tenant.selectTenantId
      }).then((res) => {
        this.allMerchantList = res.data
      })

      // 获得所有码商  下拉框 ，
      getProviderOptionList(this.$store.state.tenant.selectTenantId).then((res) => {
        this.providerList = res.data
      })
    }
  },
  mounted() {
    this.getTenantOrderInfo()
    this.selectedItems = this.$store.state.settings.agentPayColumns
    this.allSelected = this.selectedItems.length == this.allItems.length
  }
}
</script>

<style lang="scss" scoped>
.noUi {
  .tool-box {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
  }
}

::v-deep .el-table .cell {
  padding-left: 5px;
  padding-right: 5px;
}

.isShowUi {
  .gongji {
    padding-top: 30px;
    color: #2b3674;
    .box {
      .item-card {
        position: relative;
        background-image: linear-gradient(to bottom, #cfffe0 0%, #fff 50%, #fff 100%);

        ::v-deep .el-card__body {
          padding: 10px;
        }

        .title {
          position: absolute;
          left: 0;
          top: -25px;
          color: #2b3674;
          font-weight: 600;
          font-size: 16px;
          padding-left: 20px;
        }
        .title::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          border-radius: 5px;
          background-color: #38b865;
        }

        .title2::after {
          background-color: #5258f4;
        }

        .title3::after {
          background-color: #faad14;
        }
        .item {
          .txt {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #2b3674;
            margin: 8px 0;
            .label {
              margin-right: 0;
            }
            .money {
              color: #2b3674;
              font-size: 18px;
              font-weight: 600;
            }
          }
          flex-wrap: wrap;
        }
      }
      .card2 {
        background-image: linear-gradient(to bottom, #d4d6ff 0%, #fff 50%, #fff 100%);
      }
      .card3 {
        background-image: linear-gradient(to bottom, #fff4ca 0%, #fff 50%, #fff 100%);
      }
    }
  }

  .my-card {
    position: relative;
    margin-top: 80px;
  }
  .tool-box {
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    top: -50px;
    left: 0;
    width: 100%;

    .auto-flush {
      .mr-10 {
        font-size: 16px;
        color: #2b3674;
        font-weight: 600;
      }
    }

    .btns {
      position: relative;
      padding-left: 130px;
    }
    .btns::after {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
      content: '信息列表';
      font-size: 18px;
      font-weight: 600;
      color: #2b3674;
      margin-left: 20px;
    }
    .btns::before {
      position: absolute;
      left: 0;
      top: 20%;
      content: '';
      background-color: #5258f4;
      width: 8px;
      height: 60%;
      border-radius: 4px;
    }
  }
}

.gongji {
  margin-bottom: 20px;
  .box {
    display: flex;
    justify-content: space-between;
    gap: 15px;
  }
  .item-card {
    // margin: 0 10px;
    flex: 1;
    ::v-deep .el-card__body {
      padding: 20px 10px;
    }
  }
  .title {
    margin-bottom: 10px;
  }
  .item {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    // flex: 1;
    // height: 70px;
    //  border: 1px solid red;

    // .c1 {
    //   width: 32%;
    //   min-width: 160px;
    //   .label {
    //     width: 80px;
    //   }
    // }
    // .c2 {
    //   // flex: 1;
    //   width: 32%;
    //   min-width: 160px;
    //   .label {
    //     width: 80px;
    //   }
    // }
    // .c3 {
    //   width: 32%;
    //   min-width: 160px;
    //   .label {
    //     width: 80px;
    //   }
    // }

    .c1,
    .c2,
    .c3 {
      width: 33%;
    }

    .txt {
      display: flex;
      justify-content: flex-start;
      // height: 20px;
      line-height: 20px;
      font-size: 14px;
      .label {
        // width: 100px;
        text-align: right;
        margin-right: 10px;
      }
      .money {
        color: green;
        white-space: nowrap;
      }
    }
  }
}
.flush-tips {
  font-size: 14px;
  color: red;
}
.auto-flush {
  display: flex;
  padding: 10px;
}
.line {
  text-align: center;
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
