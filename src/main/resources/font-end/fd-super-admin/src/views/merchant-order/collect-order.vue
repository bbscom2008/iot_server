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
        :inline="true"
        ref="queryFormRef"
        :rules="queryRules"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <!-- <el-form-item  label="选择平台" prop="platform">
          <el-select filterable  v-model="queryFormData.platformName" placeholder="请选择是否启用" size="small">
            <el-option label="平台1" value="1"></el-option>
            <el-option label="平台2" value="2"></el-option>
            <el-option label="平台3" value="3"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            v-model="queryFormData.systemOrderNo"
            placeholder="请输入系统订单号"
            clearable
            size="small"
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
            placeholder="订单金额"
            size="small"
            type="number"
            clearable
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

        <el-form-item label="实付金额" prop="payAmount" :rules="minPayAmountRules">
          <el-input
            v-model="queryFormData.payAmount"
            placeholder="实付金额"
            size="small"
            type="number"
            clearable
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
        <el-form-item label="收款信息" prop="">
          <el-input
            v-model="queryFormData.collectInfoName"
            placeholder="请输入收款信息"
            size="small"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="收款信息" prop="">
          <el-select
            v-model="queryFormData.collectInfoId"
            filterable
            placeholder="请选择收款信息"
            size="small"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in payeeAccountList"
              :key="item.payeeAccountId"
              :label="item.payeeAccountName"
              :value="item.payeeAccountId"
            />
          </el-select>
        </el-form-item> -->

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
              v-for="item in noticeStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="确认用户名" prop="confirmOrderUserName">
          <el-input
            v-model="queryFormData.confirmOrderUserName"
            placeholder="请输入确认用户名"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item label="付款人姓名" prop="payerName">
          <el-input v-model="queryFormData.payerName" clearable placeholder="请输入付款人姓名" size="small" />
        </el-form-item>

        <el-form-item label="付款人ip" prop="payerIp">
          <el-input v-model="queryFormData.payerIp" clearable placeholder="请输入付款人ip" size="small" />
        </el-form-item>

        <el-form-item label="转账备注" prop="transferRemark" width="90">
          <el-input
            v-model="queryFormData.transferRemark"
            placeholder="请输入转账备注"
            size="small"
            clearable
          />
        </el-form-item>

        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryFormData.createTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd HH:mm:ss"
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
                  v-for="(item, index) in allItems"
                  :key="index"
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

          <el-button type="danger" icon="el-icon-delete" :disabled="selectionRows.length === 0" @click="patchCancelOrder"
            >批量取消</el-button
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
        @selection-change="handleSelectionChange"
        border
      >

      <el-table-column type="selection" width="55" />

        <el-table-column
          label="序号"
          align="center"
          min-width="40"
          v-if="selectedItems.includes('序号')"
        >
          <template slot-scope="{ $index }">
            {{ page.pageSize * (page.pageNum - 1) + $index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          label="订单号"
          align="center"
          min-width="140"
          v-if="selectedItems.includes('订单号')"
        >
          <template slot-scope="{ row }">
            <div style="display: flex; align-items: center">
              <el-tag class="">系统:</el-tag>
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

            <div style="display: flex; align-items: center" class="mt-10">
              <el-tag>商户:</el-tag>
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
          </template>
        </el-table-column>
        <!-- <el-table-column label="商户订单号" align="center" prop="merchantOrderNo" /> -->

        <!-- <el-table-column label="订单金额(元)" align="center" prop="orderAmount" sortable />
        <el-table-column label="实付金额" align="center" prop="pay_order_money" sortable /> -->

        <!-- <el-table-column
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
        </el-table-column> -->

        <el-table-column
          label="交易者信息"
          align="center"
          v-if="selectedItems.includes('交易者信息')"
          min-width="160"
        >
          <!-- <el-table-column label="商户信息" align="center" width="160"> -->
          <template slot-scope="{ row }">
            <div style="display: flex; flex-direction: column; align-items: flex-start">
              <div>
                <el-tag>商户账号</el-tag>
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
              <div class="mt-10">
                <el-tag>商户昵称</el-tag>
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
              <div class="mt-10">
                <el-tag>码商账号</el-tag>
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
              <div class="mt-10">
                <el-tag>码商昵称</el-tag>
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

        <el-table-column
          label="收款信息"
          min-width="150"
          align="center"
          prop="shoukuan_info"
          v-if="selectedItems.includes('收款信息')"
        >
          <template slot-scope="{ row }">
            <div style="display: flex; justify-content: flex-start; gap: 6px; align-items: center">
              <!-- <span>收款码</span> -->
              <el-tag>码</el-tag>
              <span
                v-if="row.collectInfoName"
                style="font-weight: 500; color: #409eff; cursor: pointer"
                @click="
                  (e) => {
                    clipboard(row.collectInfoName, e)
                  }
                "
              >
                {{ row.collectInfoName }}
              </span>
              <!-- 解析后的收款信息内容 -->
              <!-- <div v-html="getCollectInfoDisplay(row.collectInfoContent)"></div> -->
              <el-button type="text" @click="look_shoukuan_info(row)">查看</el-button>
            </div>

            <div style="display: flex; flex-direction: column; align-items: flex-start">
              <div class="mt-10" style="display: flex; align-items: center">
                <el-tag>通道</el-tag>

                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="row.channelName"
                  placement="top-start"
                >
                  <span
                    style="cursor: pointer; white-space: nowrap"
                    @click="
                      (e) => {
                        clipboard(row.channelName, e)
                      }
                    "
                    >{{ row.channelName }}</span
                  >
                </el-tooltip>
              </div>

              <div class="mt-10" style="display: flex; align-items: center">
                <el-tag>产品</el-tag>
                
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="row.productName"
                  placement="top-start"
                >
                  <span
                    style="cursor: pointer; white-space: nowrap"
                    @click="
                      (e) => {
                        clipboard(row.productName, e)
                      }
                    "
                    >{{ row.productName }}</span
                  >
                </el-tooltip>


              </div>
              <div class="mt-5">
                <el-tag>半小时流水</el-tag>
                <el-button type="text" @click="look_bill_info(row)">查看</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="码商信息" align="center" width="160">
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
          </el-table-column> -->
        <!-- </el-table-column> -->

        <el-table-column
          label="金额"
          align="center"
          min-width="100"
          v-if="selectedItems.includes('金额')"
        >
          <template slot-scope="{ row }">
            <div style="display: flex; flex-direction: column; align-items: flex-start">
              <div><el-tag>订单</el-tag> {{ row.orderAmount }}</div>
              <div class="mt-5"><el-tag>实付</el-tag> {{ row.payAmount }}</div>
            </div>
          </template>
        </el-table-column>

        <!--
        <el-table-column label="通道名称" align="center">
          <template slot-scope="{ row }">
            {{ channel_nameOptions.find((item) => item.value === row.channel_name).label }}
          </template>
        </el-table-column>

        <el-table-column label="产品名称" align="center">
          <template slot-scope="{ row }">
            {{ productList.find((item) => item.value === row.product_name).label }}
          </template>
        </el-table-column> -->

         <!-- 后端没完成   先注释  -->
        <el-table-column
          label="状态"
          align="center"
          min-width="140"
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
              <div class="mt-10">
                通知状态:
                <el-tag
                  v-if="row.notifyStatus != null"
                  :type="noticeStateOptions.find((item) => item.value === row.notifyStatus).type"
                >
                  {{
                    noticeStateOptions.find((item) => item.value === row.notifyStatus).label
                  }}</el-tag
                >
              </div>
            </div>
          </template>
        </el-table-column>

        
       

       

        <!-- <el-table-column label="商户" align="center" prop="trans_merchant_no" />
        <el-table-column label="码商" align="center" prop="trans_product_no" /> -->

        <el-table-column
          label="订单时间"
          align="center"
          min-width="200px"
          v-if="selectedItems.includes('订单时间')"
        >
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div class="mt-10" v-if="row.createTime">
                <el-tag>创建时间:</el-tag> {{ row.createTime }}
              </div>
              <div class="mt-10" v-if="row.receiveTime">
                <el-tag>接单时间:</el-tag> {{ row.receiveTime }}
              </div>
              <div class="mt-10" v-if="row.confirmOrderTime">
                <el-tag>确认时间:</el-tag> {{ row.confirmOrderTime }}
              </div>
              <div class="mt-10" v-if="row.notifyTime">
                <el-tag>通知时间:</el-tag> {{ row.notifyTime }}
              </div>
              <div class="mt-10" v-if="row.expiredTime">
                <el-tag>过期时间:</el-tag> {{ row.expiredTime }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="付款人信息"
          align="center"
          min-width="125"
          v-if="selectedItems.includes('付款人信息')"
        >
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <!-- <div v-if="row.payerName"><el-tag>姓名</el-tag> {{ row.payerName }}</div>
              <div v-if="row.payerIp" class="mt-5"><el-tag>ip</el-tag> {{ row.payerIp }}</div> -->

              <div v-if="row.payerName"><el-tag>姓名</el-tag> {{ row.payerName }}</div>
              <div v-if="row.payerIp" class="mt-10"><el-tag>ip</el-tag> {{ row.payerIp }}</div>

              <div class="mt-10 ta-l">
                <el-tag>提交信息</el-tag>
                <el-button type="text" @click="look_submit_info(row)">查看</el-button>
              </div>

              <div class="mt-10 ta-l" v-if="row.transferRemark">
                <el-tag>转账备注</el-tag>
                <span>{{ row.transferRemark }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column label="创建时间" align="center" sortable prop="create_time">
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column>

        <el-table-column label="确认时间" align="center" sortable prop="confirm_time">
          <template slot-scope="{ row }">
            {{ row.confirm_time }}
          </template>
        </el-table-column>

        <el-table-column label="通知时间" align="center" sortable prop="notifyTime">
          <template slot-scope="{ row }">
            {{ row.notifyTime }}
          </template>
        </el-table-column>

        <el-table-column label="过期时间" align="center" sortable prop="expiredTime">
          <template slot-scope="{ row }">
            {{ row.expiredTime }}
          </template>
        </el-table-column> -->

        <!-- <el-table-column
          label="转账备注"
          align="center"
          prop="transferRemark"
          v-if="selectedItems.includes('转账备注')"
        >
          <template slot-scope="{ row }">
            <span>{{ row.transferRemark ? row.transferRemark : '' }}</span>
          </template>
        </el-table-column> -->

        <!-- <el-table-column
          label="提交信息"
          align="center"
          prop=""
          v-if="selectedItems.includes('提交信息')"
        >
          <template slot-scope="{ row }">
            <el-button type="text" @click="look_submit_info(row)">查看</el-button>
          </template>
        </el-table-column> -->

        <!-- <el-table-column
          label="近半小时流水"
          align="center"
          prop="shoukuan_info"
          min-width="60"
          v-if="selectedItems.includes('近半小时流水')"
        >
          <template slot-scope="{ row }">
            <el-button type="text" @click="look_bill_info(row)">查看</el-button>
          </template>
        </el-table-column> -->

        <el-table-column
          label="确认用户名"
          align="center"
          prop="confirmOrderUserName"
          v-if="selectedItems.includes('确认用户名')"
          min-width="60"
        >
          <template slot-scope="{ row }">
            <span>{{ row.confirmOrderUserName ? row.confirmOrderUserName : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" min-width="100" fixtt="right">
          <template slot-scope="{ row }">
            <div class="opt-box" style="padding: 15px 0">
              <div type="primary" class="btn" @click="showChuliDialog(row)">
                <i class="el-icon-s-help" />处理订单
              </div>

              <div type="primary" class="btn" @click="showBlackDialog(row)">
                <i class="el-icon-s-help" />一键拉黑
              </div>

              <div type="primary" class="btn" @click="notice_merchant(row)">
                <i class="el-icon-message-solid" />通知商户
              </div>
              <div type="primary" class="btn" @click="look_trans_product_info(row)">
                <i class="el-icon-s-custom" />团队长
              </div>
              <div type="primary" class="btn" @click="orderInfo(row)">
                <i class="el-icon-s-order" />详情
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <!-- <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '编辑订单' : '新增条目'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input v-model="formData.systemOrderNo" placeholder="请输入系统订单号" size="small" />
        </el-form-item>

        <el-form-item label="商户订单号" prop="merchantOrderNo">
          <el-input
            v-model="formData.merchantOrderNo"
            placeholder="请输入商户订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="订单金额" prop="orderAmount">
          <el-input v-model="formData.orderAmount" placeholder="请输入订单金额" size="small" />
        </el-form-item>

        <el-form-item label="实付金额" prop="pay_order_money">
          <el-input v-model="formData.pay_order_money" placeholder="请输入实付金额" size="small" />
        </el-form-item>

        <el-form-item label="通道名称" prop="channelId">
          <el-select
            filterable
            v-model="formData.channelId"
            placeholder="请选择通道名称"
            size="small"
          >
            <el-option
              v-for="item in channel_nameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品名称" prop="product_name">
          <el-select
            filterable
            v-model="formData.product_name"
            placeholder="请选择产品名称"
            size="small"
          >
            <el-option
              v-for="item in productList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收款信息" prop="shoukuan_info">
          <el-input v-model="formData.shoukuan_info" placeholder="请输入收款信息" size="small" />
        </el-form-item>

        <el-form-item label="商户" prop="trans_merchant_no">
          <el-input v-model="formData.trans_merchant_no" placeholder="请输入商户" size="small" />
        </el-form-item>

        <el-form-item label="码商" prop="trans_product_no">
          <el-input v-model="formData.trans_product_no" placeholder="请输入码商" size="small" />
        </el-form-item>

        <el-form-item label="创建时间" prop="create_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.create_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="确认时间" prop="confirm_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.confirm_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="通知时间" prop="notifyTime">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.notifyTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="过期时间" prop="expiredTime">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.expiredTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="订单状态" prop="order_state">
          <el-select
            filterable
            v-model="formData.order_state"
            placeholder="请选择订单状态"
            size="small"
          >
            <el-option
              v-for="item in orderStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通知状态" prop="notice_state">
          <el-select
            filterable
            v-model="formData.notice_state"
            placeholder="请选择通知状态"
            size="small"
          >
            <el-option
              v-for="item in noticeStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单确认用户名" prop="order_confirm_user_name">
          <el-input
            v-model="formData.order_confirm_user_name"
            placeholder="请输入订单确认用户名"
            size="small"
          />
        </el-form-item>

        <el-form-item label="转账备注" prop="transferRemark">
          <el-input v-model="formData.transferRemark" placeholder="请输入付款信息" size="small" />
        </el-form-item>

        <el-form-item label="提交信息" prop="submit_info">
          <el-input v-model="formData.submit_info" placeholder="请输入提交信息" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog> -->

    <!-- <orderDetail ref="incomeOrderInfo" payType="collect"></orderDetail> -->
    <orderDetail
      ref="incomeOrderInfo"
      v-if="showOrderDetail"
      @close="showOrderDetail = false"
      :orderItem="currOrder"
      payType="collect"
    ></orderDetail>
    <halfHourBill
      ref="halfHourBill"
      v-if="showhalfHourBill"
      @close="showhalfHourBill = false"
      :orderItem="currOrder"
    >
    </halfHourBill>

    <!-- 团队长 -->
    <el-dialog :visible.sync="trans_product_visual" title="码商信息" width="600px">
      <!-- <my-table
        class="mt-10"
        :tableData="tableData"
        v-if="trans_product_visual"
        :loadData="loadTeamTableData"
        :total="50"
        style="width: 100%"
        border
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
            {{ row.providerId }}
          </template>
        </el-table-column>
      </my-table> -->

      <div>团队长：{{ rowTopProvider.userNickName }}</div>

      <div slot="footer">
        <el-button @click="trans_product_visual = false" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      @close="onCommonBtnCancel()"
      :visible.sync="showChuliDialogVisual"
      title="处理订单"
      class="deal-order"
      width="500px"
    >
      <el-form
        ref="commonFormRef"
        :rules="rules"
        :model="chuliFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号 :" prop="">
          <el-input disabled v-model="chuliFormData.systemOrderNo" size="small" />
        </el-form-item>
        <el-form-item label="商户订单号 :" prop="">
          <el-input disabled v-model="chuliFormData.merchantOrderNo" size="small" />
        </el-form-item>

        <el-form-item label="收款码名称 :" prop="">
          <el-input disabled v-model="chuliFormData.collectInfoName" size="small" />
        </el-form-item>

        <el-form-item label="付款人姓名 :" prop="">
          <el-input disabled v-model="chuliFormData.payerName" size="small" />
        </el-form-item>

        <el-form-item label="订单金额 :" prop="">
          <el-input
            disabled
            :value="
              chuliFormData.orderAmount
                ? chuliFormData.orderAmount.toFixed(2)
                : chuliFormData.orderAmount
            "
            size="small"
          />
        </el-form-item>

        <el-form-item label="实付金额 :" prop="">
          <el-input
            :value="
              chuliFormData.payAmount ? chuliFormData.payAmount.toFixed(2) : chuliFormData.payAmount
            "
            class="money"
            disabled
            size="small"
          />
        </el-form-item>

        <el-form-item label="转账备注 :" prop="">
          <el-input v-model="chuliFormData.transferRemark" disabled size="small" />
        </el-form-item>

        <el-form-item label="订单创建时间 :" prop="">
          <el-input v-model="chuliFormData.createTime" disabled size="small" />
        </el-form-item>

        <el-form-item label="操作类型 :" prop="commonDialogType">
          <el-select
            filterable
            v-model="chuliFormData.commonDialogType"
            placeholder="请选择操作类型"
            size="small"
          >
            <el-option label="确认订单" :value="4"></el-option>
            <el-option label="取消" :value="1"></el-option>
            <!-- <el-option label="补单" :value="2"></el-option> -->
            <el-option label="修改金额" :value="3"></el-option>
            <el-option label="冲正" :value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="新实付金额"
          v-if="chuliFormData.commonDialogType == 3"
          prop="newPayAmount"
        >
          <el-input
            v-model="chuliFormData.newPayAmount"
            v-number-input
            type="number"
            placeholder="请输入实付金额"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCommonBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onCommonBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="submit_info_dialog_visible"
      @close="closeInfoDialog()"
      title="查看提交信息"
      width="600px"
    >
      <div style="padding: 0 100px">
        <div
          v-for="(item, index) in submit_info_formData.submitInfo"
          :key="index"
          style="padding: 5px 0"
        >
          <div v-if="item.showType == 0">
            <span style="margin-right: 20px">{{ item.submitInfoKey }}：</span>
            <span style="font-weight: 600; margin-right: 10px">{{ item.submitInfoValue }}</span>
            <el-button
              type="text"
              @click="
                (e) => {
                  clipboard(item.submitInfoValue, e)
                }
              "
              >复制</el-button
            >
          </div>
          <div v-if="item.showType == 1">
            <span style="margin-right: 20px">{{ item.submitInfoKey }}：</span>
            <span>
              <el-image
                style="width: 200px; height: 200px"
                fit="fill"
                :src="item.imageUrl"
                alt=""
                :preview-src-list="[item.imageUrl]"
              ></el-image>
            </span>
          </div>
        </div>
      </div>

      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="closeInfoDialog()" size="small"> 关闭 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showBlackDialogVisual"
      title="一键拉黑"
      width="600px"
      @close="onBlackBtnCancel"
    >
      <el-form
        ref="blackFormData"
        :model="blackFormData"
        label-position="right"
        :rules="rules"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="请选择：" prop="black">
          <el-radio-group v-model="blackFormData.black" size="small">
            <el-radio :label="3">全部</el-radio>
            <el-radio :label="2">付款人姓名</el-radio>
            <el-radio :label="1">付款人IP</el-radio>
          </el-radio-group>
        </el-form-item>

        <div class="help-tip" style="text-align: center">
          设置在指定分钟内，允许接单的几次，如果超过该次数就会被拉入黑名单！
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="onBlackBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onBlackBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showAccountInfoVisible"
      :title="'查看收款信息'"
      width="600px"
      @close="showAccountInfoVisible = false"
    >
      <el-form
        :model="formData"
        class="add-form"
        readonly
        label-position="right"
        label-width="120px"
        style="margin: 0 50px"
      >
        <el-form-item label="当前码商" prop="">
        
          <div>
            {{ formData.providerUserName ? formData.providerUserName : '' }}
          </div>
        </el-form-item>

        <el-form-item label="收款码名称">
          <div>{{ formData.collectInfoName ? formData.collectInfoName : '' }}</div>
        </el-form-item>

        <el-form-item label="产品名称">
          <div>
            {{ formData.productName ? formData.productName : '' }}
          </div>
        </el-form-item>

        <div
          v-if="formData.payeeAccountConfig && showAccountInfoVisible"
        >
          <div
            v-if="formData.payeeAccountConfig.texts && formData.payeeAccountConfig.texts.length > 0"
          >
            <!-- 文本信息 -->
            <el-form-item
              v-for="item in formData.payeeAccountConfig.texts"
              :key="item.textConfigId"
              :label="item.textTitle"
            >
              <div>{{ item.textValue }}</div>
            </el-form-item>
          </div>
          <!-- 按钮信息 -->
          <div v-for="item in formData.payeeAccountConfig.buttons" :key="item.buttonConfigId">

            <div v-for="param in item.buttonParamList" :key="param.buttonParamId" class="params">
              <el-form-item :label="param.paramTitle">
                <div>{{ param.buttonParamValue }}</div>
              </el-form-item>
            </div>
          </div>

          <!-- 二维码设置 -->

          <div v-if="formData.payeeAccountConfig.qrConfig.isActive == 1">

            <el-form-item label="生成方式" prop="">
              <div>
                {{
                  formData.payeeAccountConfig.qrConfig.parseType == 0
                    ? '原图'
                    : formData.payeeAccountConfig.qrConfig.parseType == 1
                    ? '上传并解析'
                    : '直接配置数据'
                }}
              </div>
            </el-form-item>

            <template
              v-if="
                formData.payeeAccountConfig.qrConfig.parseType == 1 ||
                formData.payeeAccountConfig.qrConfig.parseType == 0
              "
            >
              <el-form-item label="二维码"> </el-form-item>
              <div style="text-align: center">
                <el-image
                  style="width: 300px"
                  :src="formData.payeeAccountConfig.qrConfig.fileList[0].url"
                  fit="scale-down"
                  class="hand"
                  @click="openImagePreview(formData.payeeAccountConfig.qrConfig.fileList[0].url)"
                />
              </div>
            </template>

            <el-form-item v-if="formData.payeeAccountConfig.qrConfig.parseType == 2" label="二维码">
              <el-image
                style="width: 160px; height: 160px"
                :src="formData.payeeAccountConfig.qrConfig.GenerQrUrl"
                fit="scale-down"
                 class="hand"
                @click="openImagePreview(formData.payeeAccountConfig.qrConfig.GenerQrUrl)"
              />

              <el-input
                v-model="formData.payeeAccountConfig.qrConfig.parseValue"
                type="textarea"
                :rows="4"
                readonly
                placeholder="输入数据"
                size="small"
              />
            </el-form-item>
          </div>

          <!-- 文件配置 -->
          <div
            v-if="formData.payeeAccountConfig.files && formData.payeeAccountConfig.files.length > 0"
            class="file-config"
          >

            <el-form-item
              v-for="(item, index) in formData.payeeAccountConfig.files"
              :key="index"
              :label="item.fileTitle"
            >
              <div style="display: flex; justify-content: space-between; padding-right: 50px">
                <span> {{ item.fileList.length > 0 ? item.fileList[0].name : '' }} </span>

                <el-button
                  size="mini"
                  plain
                  type="primary"
                  @click="
                    item.fileList.length > 0
                      ? downloadFile(item.fileList[0].url, item.fileList[0].name)
                      : ''
                  "
                  >下载</el-button
                >
              </div>
              <div class="red_tip">说明： {{ item.remark }}</div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-dialog>

    <ImagePreviewer
      :visible="imagePreview.visible"
      :src="imagePreview.src"
      @update:visible="onImagePreviewVisibleChange"
    />

  </div>
</template>

<script>
import orderDetail from './components/order-detail.vue'
import halfHourBill from './components/halfHourBill.vue'
import clipboard from '@/utils/clipboard'

import ImagePreviewer from '@/views/service-manager/components/ImagePreviewer.vue'

import {
  getTenantCollectOrderListPage,
  repairCollectOrder,
  modifyCollectOrderPayAmount,
  cancelCollectOrder,
  getCollectOrderDataAnalysis,
  getYesterdayCollectOrderDataAnalysis,
  getTodayCollectOrderDataAnalysis,
  exportTenantCollectOrderData,
  getPayeeAccountByName,
  providerCollectOrderConfirm,
  checkTradePassword,
  reversalOrder,
  getSubmitInfoInfo,
  getOrderPayeeAccountInfo,
  addBlackList
} from '@/api/collect-order.js'

import { getPayeeAccountInfoListByTenantId } from '@/api/service-income-info.js'

import { orderStateOptions } from "@/utils/constants";

import { getPayeeAccountInfoById } from '@/api/service-income-info.js'
import { getFileById } from '@/api/upload'

import { downloadFile } from '@/utils'

import { batchNotifyMerchants, notifyMerchantByOrderId } from '@/api/agent-pay'

import { formatDateTime } from '@/utils'

import { orderRules, queryRules } from './rules.js'

import { getChannelByTenantId } from '@/api/merchant.js'
import { getProductListByTenantId } from '@/api/service-list-setting.js'
import { getMerchantList } from '@/api/merchant-info.js'
import { getProviderOptionList } from '@/api/service-list.js'

import { getProviderTop } from '@/api/service-list'

import FileSaver from 'file-saver'

import { amountCheck } from '@/utils/validate.js'
import { isEmpty } from '@/utils'
export default {
  name: 'CollectOrder',
  components: { orderDetail, halfHourBill, ImagePreviewer },
  data() {
    return {
      page: {
        pageSize: 0,
        pageNum: 0
      },
      payeeAccountList: [], // 所有收款信息  下拉框
      blackFormData: {},
      showBlackDialogVisual: false,
      selectedItems: [],
      allSelected: true,
      allItems: [
        '序号',
        '订单号',
        '产品信息',
        '交易者信息',
        '金额',
        '收款信息',
        '付款人信息',
        '订单时间',
        '状态',
        '转账备注',
        '提交信息',
        '近半小时流水',
        '确认用户名'
      ],
      queryRules: queryRules,
      realtimeData: {}, //  实时数据
      todayData: {}, //  今日数据
      yesterdayData: {}, //  昨日数据
      collectInfoList: [],
      rules: orderRules,
      tableData: [],
      dialogVisible: false,
      formData: {},
      cardItems: ['订单数量', '订单金额', '成交订单数量', '成交订单金额', '成功率', '实付金额'],
      queryFormData: this.getQueryForm(),
      isEdit: false, // 是否是编辑状态
      huikuan_stateOptions: [
        { label: '待回款', value: 0, type: 'warning' },
        { label: '已回款', value: 1, type: 'success' }
      ],

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

      minPayAmountRules: [
        { validator: amountCheck, trigger: 'blur' }
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
        { validator: amountCheck, trigger: 'blur' }
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

      orderStateOptions,
      noticeStateOptions: [
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

      showChuliDialogVisual: false,
      // 提交信息弹框
      submit_info_dialog_visible: false,
      submit_info_formData: {
        tradePassword: '',
        isShow: false,
        systemOrderNo: ''
      },
      showOrderDetail: false,
      showhalfHourBill: false,
      currOrder: {},
      // 添加扩展数据，如 options 所需要的数据
      productList: [],
      allChannelList: [],
      providerList: [], // 码商列表
      allMerchantList: [], // 所有商户
      rowTopProvider: {},
      showAccountInfoVisible: false,
      payeeAccountvalue: '',
      imagePreview: {
        visible: false,
        src: ''
      },
      selectionRows:[],
    }
  },
  watch: {
    '$store.state.tenant.selectTenantId'(newV, oldV) {
       this.getTenantOrderInfo()
      this.queryTableData()
    },
  },
  methods: {
    patchCancelOrder(){
      // 弹出确认框
      this.$confirm('确定要取消选中的订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {

        const allCancelPromises =  [];
        this.selectionRows.forEach(item=>{
          allCancelPromises.push(cancelCollectOrder(item.orderId))
        })
        await Promise.all(allCancelPromises)
        this.$message.success('操作成功')
        this.queryTableData()
      }).catch(() => {
        // 取消操作
      });



    },
    handleSelectionChange(val) {
      console.log(JSON.stringify(val))
      this.selectionRows = val
    },
    openImagePreview(url) {
      if (!url) return
      this.imagePreview = {
        visible: true,
        src: url
      }
    },

    onImagePreviewVisibleChange(val) {
      this.imagePreview.visible = val
      if (!val) {
        this.imagePreview.src = ''
      }
    },
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

    showBlackDialog(row) {
      this.showBlackDialogVisual = true
      this.blackFormData = {
        black: 3,
        orderId: row.orderId,
        payerIp: row.payerIp,
        payerName: row.payerName
      }
    },
    onBlackBtnCancel() {
      this.showBlackDialogVisual = false
      this.$refs.blackFormData.resetFields()
    },
    onBlackBtnOk() {
      this.$refs.blackFormData.validate(async (valid) => {
        if (valid) {
          let res = await addBlackList({
            tenantId: this.$store.state.tenant.selectTenantId,
            orderId: this.blackFormData.orderId,
            payerIp: this.blackFormData.black == 2 ? '' : this.blackFormData.payerIp,
            payerName: this.blackFormData.black == 1 ? '' : this.blackFormData.payerName
          })
          console.log(res, 'res')
          this.$message.success('操作成功')
          this.onBlackBtnCancel()
        }
      })
    },

    // async payeeAccountChange(e) {
    //   let value = e.target.value

    //   if (value) {
    //     this.payeeAccountvalue = e.target.value
    //   }
    // },
    downloadFile,
    async loadTeamTableData(page) {
      this.$message.error('----暂无接口-----')

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

      let res = await getTenantCollectOrderListPage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    async loadTableData(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      this.page = page

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
      let res = await getTenantCollectOrderListPage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    flushPage() {
      this.queryTableData()
    },

    resetQueryForm() {
      this.collectInfoList = []
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
        // collectInfoName: '',
        merchantId: '',
        providerId: '',
        collectInfoId: '',
        orderStatus: '',
        notifyStatus: '',
        createTime: [todayStr, nowStr]
      }
    },

    queryTableData() {
      this.$refs.queryFormRef.validate(async (valid) => {
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
        // 获得实时统计
        getCollectOrderDataAnalysis(params).then((res) => {
          this.realtimeData = res.data
        })
        // 获得今日统计
        getTodayCollectOrderDataAnalysis(this.$store.state.tenant.selectTenantId).then((res) => {
          this.todayData = res.data
        })
      })
    },

    async handleDownload() {
      // 本地导出, 改为  联网导出
      // import('@/vendor/Export2Excel').then((excel) => {
      //   const tHeader = [
      //     'systemOrderNo',
      //     'merchantOrderNo',
      //     'orderAmount',
      //     'pay_order_money',
      //     'channel_name',
      //     'product_name',
      //     'shoukuan_info',
      //     'trans_merchant_no',
      //     'trans_product_no',
      //     'create_time',
      //     'confirm_time',
      //     'notifyTime',
      //     'expiredTime',
      //     'order_state',
      //     'notice_state',
      //     'huikuan_state',
      //     'order_confirm_user_name',
      //     'transferRemark',
      //     'submit_info',
      //     'opt'
      //   ]
      //   let data = []
      //   this.tableData.forEach((ele) => {
      //     let lineValue = []
      //     tHeader.forEach((item) => {
      //       let v = ele[item] ? ele[item] : ''
      //       lineValue.push(v)
      //     })

      //     data.push(lineValue)
      //   })

      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      // })

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

      let res = await exportTenantCollectOrderData(params)
      FileSaver.saveAs(res, '代收订单列表.xlsx')
    },
    clipboard,
    look_submit_info(row) {
      this.submit_info_formData = {
        tradePassword: '',
        isShow: false,
        submitInfo: '',
        orderId: row.orderId
      }
      this.submit_info_dialog_visible = true
      this.doLookInfo()
    },

    async doLookInfo() {
      let ret = await getSubmitInfoInfo(this.submit_info_formData.orderId, {
        tenantId: this.$store.state.tenant.selectTenantId
      })
      this.submit_info_formData.submitInfo = JSON.parse(ret.data)
      this.submit_info_formData.isShow = true

      // 如果提交的信息中有图片，异步加载图片
      this.submit_info_formData.submitInfo.forEach(async (item) => {
        if (item.showType == 1) {
          let res = await getFileById(item.submitInfoValue)

          item.imageUrl = res.data.fileUrl
          this.$forceUpdate()
        }
      })
    },

    closeInfoDialog() {
      this.submit_info_dialog_visible = false
      this.submit_info_formData = {
        tradePassword: '',
        isShow: false,
        submitInfo: '',
        orderId: ''
      }
    },

    showChuliDialog(row) {
      this.showChuliDialogVisual = true

      this.chuliFormData = {
        orderId: row.orderId,
        systemOrderNo: row.systemOrderNo,
        merchantOrderNo: row.merchantOrderNo,
        orderAmount: row.orderAmount,
        payAmount: row.payAmount,
        commonDialogType: '',
        newPayAmount: '',
        collectInfoName: row.collectInfoName,
        payerName: row.payerName,
        transferRemark: row.transferRemark,
        createTime: row.createTime
      }
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
          // 取消
          await cancelCollectOrder(this.chuliFormData.orderId)
        } else if (this.chuliFormData.commonDialogType == 2) {
          await repairCollectOrder(this.chuliFormData.orderId)

          // 补单
        } else if (this.chuliFormData.commonDialogType == 3) {
          // 修改金额
          await modifyCollectOrderPayAmount({
            orderId: this.chuliFormData.orderId,
            newPayAmount: this.chuliFormData.newPayAmount
          })
        } else if (this.chuliFormData.commonDialogType == 4) {
          //确认订单
          await providerCollectOrderConfirm(this.chuliFormData.orderId)
        } else if (this.chuliFormData.commonDialogType == 5) {
          //冲正
          await reversalOrder(this.chuliFormData.orderId)
        }

        this.$message.success('处理成功')
        this.flushPage()
        this.onCommonBtnCancel()
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

    async look_shoukuan_info(row) {
      // if (!row.collectInfoId) {
      //   this.$message.error('收款信息不存在', row.collectInfoId)
      //   return
      // }

      this.showAccountInfoVisible = true

      this.formData = Object.assign({}, row)
      // const res = await getPayeeAccountInfoById(row.collectInfoId)
      const res = await getOrderPayeeAccountInfo(row.orderId)

      const qrConfig = res.data.qrConfig
      qrConfig.fileId = qrConfig.qrUrl // 其实是 fileId

      if (qrConfig.parseType == null) {
        qrConfig.parseType = 0
        qrConfig.fileList = []
        console.error('-----不应该出现的情况，-----', qrConfig.parseType)
      } else if (qrConfig.parseType != 2) {
        // 0 原图 1 上传并解析
        let resp = await getFileById(qrConfig.qrUrl) // 其实是 fileId
        qrConfig.fileList = [
          {
            name: resp.data.originalName,
            url: resp.data.fileUrl
          }
        ]
        this.qrImageUrl = resp.data.fileUrl
      } else {
        let resp = await getFileById(qrConfig.qrUrl) // 其实是 fileId
        qrConfig.GenerQrUrl = resp.data.fileUrl ? resp.data.fileUrl : ''
        qrConfig.parseValue = qrConfig.parseValue ? qrConfig.parseValue : ''
      }

      if (res.data.files) {
        for (let index = 0; index < res.data.files.length; index++) {
          const ele = res.data.files[index]
          ele.fileId = ele.fileUrl

          let resp = await getFileById(ele.fileId) // 其实是 fileId

          ele.fileList = [
            {
              name: resp.data.originalName,
              url: resp.data.fileUrl
            }
          ]
        }
      }

      this.formData = {
        ...this.formData,
        payeeAccountConfig: {
          texts: res.data.texts,
          buttons: res.data.buttons,
          qrConfig: qrConfig,
          files: res.data.files
        }
      }
    },

    allNotify() {
      this.$confirm('确认要将全部未通知成功的订单重新通知吗？')
        .then((_) => {
          batchNotifyMerchants(this.$store.state.tenant.selectTenantId).then((res) => {
            this.$message.success('通知成功')
            this.flushPage()
          })
        })
        .catch((_) => {})
    },
    notice_merchant(row) {
      this.$confirm(`确认要通知商户 【 ${row.merchantUserName} 】 吗？`).then((_) => {
        notifyMerchantByOrderId(row.orderId).then((res) => {
          this.$message.success('通知成功')
          this.flushPage()
        })
      })
    },
    // async showConfirmDelete(row) {
    //   try {
    //     let ret = await this.$confirm(`确定删除 【 ${row} 】 吗？`)
    //     this.tableData = this.tableData.filter((item) => {
    //       return item.id !== row.id
    //     })
    //     //todo 调用接口删除
    //     console.log('删除成功')
    //   } catch (e) {
    //     console.log('取消删除')
    //   }
    // },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    look_bill_info(row) {
      this.currOrder = row
      this.showhalfHourBill = true
    },
    orderInfo(row) {
      // this.$refs.incomeOrderInfo.drawer = true
      this.currOrder = row
      this.showOrderDetail = true
    },
    // onDialogBtnOk() {
    //   this.dialogVisible = false
    //   if (this.isEdit) {
    //     // 编辑
    //     this.tableData = this.tableData.map((item) => {
    //       if (item.id === this.formData.id) {
    //         return this.formData
    //       }
    //       return item
    //     })
    //   } else {
    //     // 新增
    //     this.formData.id = Date.now()
    //     this.tableData.push(this.formData)
    //   }
    // }
    getCollectInfoDisplay(collectInfoContent) {
      if (!collectInfoContent) {
        return ''
      }

      try {
        const parsed = JSON.parse(collectInfoContent)
        if (parsed.texts && Array.isArray(parsed.texts)) {
          return parsed.texts
            .filter((text) => text.textTitle && text.textValue !== undefined && text.isShow)
            .map(
              (text) =>
                `<div style="text-align: left;" >${text.textTitle}:${text.textValue || ''}</div>`
            )
            .join('')
        }
        return ''
      } catch (error) {
        console.error('解析收款信息失败:', error)
        return ''
      }
    },

    getCollectInfoText(collectInfoContent) {
      if (!collectInfoContent || collectInfoContent === '收款信息不存在!') {
        return '收款信息不存在!'
      }

      try {
        const parsed = JSON.parse(collectInfoContent)
        if (parsed.texts && Array.isArray(parsed.texts)) {
          return parsed.texts
            .filter((text) => text.textTitle && text.textValue !== undefined)
            .map((text) => `${text.textTitle}:${text.textValue || ''}`)
            .join('\n')
        }
        return ''
      } catch (error) {
        console.error('解析收款信息失败:', error)
        return ''
      }
    },
    getTenantOrderInfo() {
      // 获得实时数据统计
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

      getCollectOrderDataAnalysis(params).then((res) => {
        this.realtimeData = res.data
      })

      getTodayCollectOrderDataAnalysis(this.$store.state.tenant.selectTenantId).then((res) => {
        this.todayData = res.data
      })

      getYesterdayCollectOrderDataAnalysis(this.$store.state.tenant.selectTenantId).then((res) => {
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
    },
    async loadAllPayeeAccountInfo() {
      // let res = await getPayeeAccountInfoListByTenantId(this.$store.state.tenant.selectTenantId)
      // this.payeeAccountList = res.data
    }
  },
  mounted() {
    this.getTenantOrderInfo()
    this.selectedItems = this.$store.state.settings.collectOrderColumns
    this.allSelected = this.selectedItems.length == this.allItems.length
    this.loadAllPayeeAccountInfo()
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
  padding-left: 8px;
  padding-right: 8px;
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
        content: '代收订单';
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

.demo-form-inline {
  .zhi {
    ::v-deep .el-form-item__label {
      padding-right: 5px;
    }
  }
}

::v-deep .deal-order {
  .el-form {
    .el-form-item__label {
      color: #999;
    }

    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }

    .el-input.is-disabled {
      .el-input__inner {
        color: black;
        border-color: transparent;
        background-color: transparent;
        padding-left: 0;
      }
    }

    .el-input.is-disabled.money {
      .el-input__inner {
        color: red;
        font-weight: 600;
      }
    }
  }
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

::v-deep .add-form {
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-dialog__body {
    padding-top: 0px;
  }
}
</style>

<style lang="scss">
.dark {
  .isShowUi {
    .gongji {
      .box {
        .item-card {
          background-image: linear-gradient(180deg, #38b8653d 0, #38b86500 40%, #38b86500);

          .title {
            color: #b3c0e7;
          }

          .item {
            .txt {
              color: #a3aed0;

              .money {
                color: #b3c0e7;
              }
            }
          }
        }

        .card2 {
          background-image: linear-gradient(180deg, #5258f43d 0, #5258f400 40%, #38b86500);
        }

        .card3 {
          background-image: linear-gradient(180deg, #faad143d 0, #faad1400 40%, #38b86500);
        }
      }
    }
  }
}
</style>
