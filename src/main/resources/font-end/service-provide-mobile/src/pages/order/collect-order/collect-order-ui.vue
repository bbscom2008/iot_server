<template>
  <!-- <view class="container" :style="{paddingTop:$store.state.navBarHeight+'rpx', paddingBottom:$store.state.tabBarHeight+'rpx'}"> -->
  <view class="container isShowUi" :style="{
      paddingTop: $store.state.navBarHeight + 'rpx',
    }">
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="">
      <view slot="title" class="nav-title">
        <view class="left">代收订单</view>
        <view class="right" @click="jumpTo('/pages/order/agent-pay/agent-pay')">代付订单</view>
      </view>

      <view class="right" slot="right">
        <view class="nav-right" @click="showFilter = true">
          <uni-icons type="search" color="#fff"></uni-icons>
          <text class="query-text">搜索</text>
        </view>
      </view>
    </custom-nav-bar>

    <view class="sub-nav-bar">
      <view class="item" :class="{curr:queryFormData.orderStatus===''}" @click="onSubNavClick('')">全部</view>
      <view class="item" :class="{curr:queryFormData.orderStatus===1}" @click="onSubNavClick(1)">待接单</view>
      <view class="item" :class="{curr:queryFormData.orderStatus===2}" @click="onSubNavClick(2)">已接单</view>
      <view class="item" :class="{curr:queryFormData.orderStatus===4}" @click="onSubNavClick(4)">已取消</view>
      <view class="item" :class="{curr:queryFormData.orderStatus===3}" @click="onSubNavClick(3)">已成功</view>
    </view>

    <!-- 订单列表 -->
    <scroll-view class="order-list" scroll-y @scroll="(e) => (oldScrollTop = e.detail.scrollTop)"
      :scroll-with-animation="true" :scroll-top="scrollTop" refresher-enabled :refresher-triggered="refreshTriggered"
      @refresherrefresh="onScrollRefresh()">
      <!-- 刷新控制区域 -->
      <view class="refresh-control">
        <view class="refresh-select">
          <picker @change="onRefreshChange" :value="refreshIndex" :range="refreshOptions" range-key="label">
            <view class="picker">
              自动刷新: {{ refreshOptions[refreshIndex].label }}
            </view>
          </picker>
        </view>
        <view class="refresh-timer"> 下次刷新: {{ countdown }}秒 </view>
      </view>

      <view class="no-data" v-if="tableData.length == 0">
        <uni-icons type="search" size="50"></uni-icons>
        <text>暂无相关数据</text>
      </view>
      <view class="main-content" v-else>
        <view v-for="(item, index) in tableData" :key="index" class="order-card">
          <view class="card-header">
            <text class="order-id">系统订单号:  <text @click="copyInfo(item.systemOrderNo)" >{{ item.systemOrderNo }}</text>  </text>
            <u-tag size="mini" :text="
                orderStateOptions.find((ele) => ele.value == item.orderStatus)?orderStateOptions.find((ele) => ele.value == item.orderStatus)
                  .label:''
              " :type="
                orderStateOptions.find((ele) => ele.value == item.orderStatus)?orderStateOptions.find((ele) => ele.value == item.orderStatus)
                  .type:''
              ">
            </u-tag>
          </view>

          <view class="card-body">
            <view class="info-row w100">
              <text class="info-label">商户订单号:</text>
              <text class="info-value" @click="copyInfo(item.merchantOrderNo)">{{ item.merchantOrderNo }}</text>
            </view>

            <view class="info-row w100">
              <text class="info-label">产品信息:</text>
              <text class="info-value">{{
                item.productName 
              }}</text>
            </view>

            <view class="info-row w50">
              <text class="info-label">订单金额:</text>
              <text class="info-value price">¥ {{ item.orderAmount.toFixed(2) }} 元</text>
            </view>
            <view class="info-row w50">
              <text class="info-label">实付金额:</text>
              <text class="info-value price">¥ {{ item.payAmount.toFixed(2) }} 元</text>
            </view>

            <view class="info-row w50">
              <text class="info-label">收款信息:</text>
              <view @click="look_shoukuan_info(item)" class="info-value">
                <text class="look-txt">查看</text> {{ item.collectInfoName }}
              </view>
            </view>

            <view class="info-row w50">
              <text class="info-label">提交信息:</text>
              <text class="info-value look-txt" @click="look_submit_info(item)">查看</text>
            </view>

            <view class="info-row w50" v-if="item.confirmOrderUserName" >
              <text class="info-label">确认用户名:</text>
              <text class="info-value">{{ item.confirmOrderUserName  }}</text>
            </view>

            <view class="info-row w50" v-if="item.payerName" >
              <text class="info-label"  >付款人姓名:</text>
              <text class="info-value ">{{ item.payerName}}</text>
            </view>


            <template v-if="item.isShowAll">

              <view class="info-row w50">
                <text class="info-label">订单状态:</text>
                <view class="info-value">
                  <u-tag size="mini" :text="
                      orderStateOptions.find(
                        (ele) => ele.value == item.orderStatus
                      ).label
                    " :type="
                      orderStateOptions.find(
                        (ele) => ele.value == item.orderStatus
                      ).type
                    ">
                  </u-tag>
                </view>
              </view>

              <view class="info-row w50">
                <text class="info-label">通知状态:</text>
                <view class="info-value">
                  <u-tag size="mini" :text="
                      notifyStatusOptions.find(
                        (row) => row.value === item.notifyStatus
                      ).label
                    " :type="
                      notifyStatusOptions.find(
                        (row) => row.value === item.notifyStatus
                      ).type
                    ">
                  </u-tag>
                </view>
              </view>

              <view class="info-row w50" v-if="item.payerIp">
                <text class="info-label">付款人IP:</text>
                <text class="info-value">{{ item.payerIp  }}</text>
              </view>

            </template>


            <view class="info-row w50" v-if="item.isShowAll">
              <text class="notes-label">转账备注:</text>
              <text class="notes-value">{{ item.transferRemark }}</text>
            </view>


            <div class="line2"  v-if="item.isShowAll">
              <view class="time-row w50" v-if="item.createTime">
                <text class="time-label" style="color: green" >创建</text>
                <text class="info-value" style="color: green" >{{ item.createTime }}</text>
              </view>

              <view class="time-row w50" v-if="item.receiveTime">
                <text class="time-label">接单</text>
                <text class="info-value">{{ item.receiveTime }}</text>
              </view>

              <view class="time-row w50" v-if="item.confirmOrderTime">
                <text class="time-label">确认</text>
                <text class="info-value">{{ item.confirmOrderTime }}</text>
              </view>

              <view class="time-row w50" v-if="item.notifyTime">
                <text class="time-label">通知</text>
                <text class="info-value">{{ item.notifyTime }}</text>
              </view>

              <view class="time-row w50" v-if="item.expiredTime">
                <text class="time-label" style="color: red" >过期</text>
                <text class="info-value" style="color: red" >{{ item.expiredTime }}</text>
              </view>
            </div>

          </view>
          <view class="switch-box" @click="item.isShowAll = !item.isShowAll">
            <view v-if="item.isShowAll" class="txt">收起</view>
            <u-icon v-if="item.isShowAll" name="arrow-up" color="#999999" size="20"></u-icon>
            <view v-if="!item.isShowAll" class="txt">全部订单信息</view>
            <u-icon v-if="!item.isShowAll" name="arrow-down" color="#999999" size="20"></u-icon>
          </view>

          <view class="card-footer" style="gap: 20rpx;"  >
            <u-button style="flex: 1;" @click="procOrder(item, 0)"
            v-if="$store.state.providerPermission.isCancelOrder"
             >取消</u-button>
            <u-button style="flex: 2;" type="primary" @click="procOrder(item, 1)">确认</u-button>
            <u-button style="flex: 1;" @click="showBlackDialog(item)"
            v-if="$store.state.providerPermission.isOneKeyBlacklist"
            >一键拉黑</u-button>
          </view>
        </view>

        <pagination @change="onPaginationChange" :total="total" :value="page.pageNum"></pagination>
      </view>
    </scroll-view>

    <!-- 搜索弹窗 -->
    <uni-popup ref="queryPopupRef" :show="showFilter" @maskClick="closeSearchModal()">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">搜索条件</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="closeSearchModal()"></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms ref="queryFormDataRef" :model="queryFormData" :rules="queryRules" label-position="top"
            label-width="200">
            <uni-forms-item label="系统订单号" name="systemOrderNo">
              <uni-easyinput v-model="queryFormData.systemOrderNo" type="number" placeholder="请输入订单号, 纯数字"
                @blur="$refs.queryFormDataRef.validateField('systemOrderNo')" />
            </uni-forms-item>

            <uni-forms-item label="商户订单号" name="merchantOrderNo">
              <uni-easyinput v-model="queryFormData.merchantOrderNo" placeholder="请输入商户订单号"
                @blur="$refs.queryFormDataRef.validateField('merchantOrderNo')" />
            </uni-forms-item>

            <view class="range-input">
              <view class="range-title"> 订单金额 </view>
              <view class="range-body">
                <uni-forms-item label="" class="no-label" name="orderAmount" label-position="left"
                  :rules="minOrderAmountRules">
                  <uni-easyinput v-model="queryFormData.orderAmount" type="number" placeholder="输入订单金额" @blur="
                      $refs.queryFormDataRef.validateField('orderAmount')
                    " />
                </uni-forms-item>
               <!-- <view class="range-separator"> 至 </view>
                <uni-forms-item label-position="left" :rules="maxOrderAmountRules" class="no-label" label=""
                  name="maxOrderAmount">
                  <uni-easyinput v-model="queryFormData.maxOrderAmount" placeholder="最大值" type="number" @blur="
                      $refs.queryFormDataRef.validateField('maxOrderAmount')
                    " />
                </uni-forms-item> -->
                <text class="range-unit">元</text>
              </view>
            </view>

            <view class="range-input">
              <view class="range-title"> 实付金额 </view>
              <view class="range-body">
                <uni-forms-item label="" class="no-label" name="payAmount" label-position="left"
                  :rules="minPayAmountRules">
                  <uni-easyinput v-model="queryFormData.payAmount" type="number" placeholder="输入实付金额"
                    @blur="$refs.queryFormDataRef.validateField('payAmount')" />
                </uni-forms-item>
                <!-- <view class="range-separator"> 至 </view>
                <uni-forms-item label-position="left" :rules="maxPayAmountRules" class="no-label" label=""
                  name="maxPayAmount">
                  <uni-easyinput v-model="queryFormData.maxPayAmount" placeholder="最大值" type="number"
                    @blur="$refs.queryFormDataRef.validateField('maxPayAmount')" />
                </uni-forms-item> -->
                <text class="range-unit">元</text>
              </view>
            </view>

            <uni-forms-item label="产品名称" name="productId">
              <MySelect haveAll :options="productList" v-model="queryFormData.productId">
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="订单状态" name="orderStatus">
              <MySelect haveAll :options="orderStateOptions" v-model="queryFormData.orderStatus">
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="通知状态" name="notifyStatus">
              <MySelect haveAll :options="notifyStatusSimpleOptions" v-model="queryFormData.notifyStatus">
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="转账备注" name="">
              <uni-easyinput v-model="queryFormData.transferRemark" placeholder="请输入转账备注" />
            </uni-forms-item>

            <uni-forms-item label="确认用户名" name="confirmOrderUserName">
              <uni-easyinput v-model="queryFormData.confirmOrderUserName" placeholder="请输入确认用户名" @blur="
                  $refs.queryFormDataRef.validateField('confirmOrderUserName')
                " />
            </uni-forms-item>


            <!-- <uni-forms-item label="创建时间" name="createTime" required> -->
            <!-- <uni-datetime-picker
                type="datetimerange"
                v-model="queryFormData.createTime"
              /> -->

            <!-- </uni-forms-item> -->
            <view class="range-input">
              <uni-forms-item label="创建时间" required class="no-label-title" label-position="left"></uni-forms-item>


              <view class="range-body">
                <uni-forms-item label="" class="no-label" name="startTime" label-position="left">
                  <uni-datetime-picker type="datetime" :start="startTimeRange.start" :end="startTimeRange.end"
                    @change="onStartTimeChange" v-model="queryFormData.startTime" />
                </uni-forms-item>
                <view class="range-separator"> 至 </view>
                <uni-forms-item label-position="left" class="no-label" label="" name="endTime">
                  <uni-datetime-picker type="datetime" :start="endTimeRange.start" :end="endTimeRange.end"
                    @change="onEndTimeChange" v-model="queryFormData.endTime" />
                </uni-forms-item>
              </view>
            </view>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <button class="reset-btn" @click="resetQueryForm()">重置</button>
          <button class="search-btn" @click="btnSearchClick()">搜索</button>
        </view>
      </view>
    </uni-popup>

    <!-- 确认 、 接单 、 补单  弹窗 -->
    <uni-popup ref="procOrderPopupRef" :show="showOrderPopup" @maskClick="closeOrderModal()">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">
            {{
              procType == 0 ? '取消订单' : procType == 1 ? '确认订单' : '补单'
            }}</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="closeOrderModal()"></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms ref="queryFormDataRef"
					 class="deal-info"
					 :model="formData" label-position="left" label-width="200">
            
						<uni-forms-item label="系统订单号 : " name="">
              <uni-easyinput v-model="formData.systemOrderNo" disabled />
            </uni-forms-item>
						
						<uni-forms-item label="商户订单号 : " name="">
						  <uni-easyinput v-model="formData.merchantOrderNo" disabled />
						</uni-forms-item>
						
						<uni-forms-item label="付款人姓名 : " name="">
						  <uni-easyinput v-model="formData.payerName" disabled />
						</uni-forms-item>
						
						
						<uni-forms-item label="收款信息名称 : " name="">
						  <uni-easyinput v-model="formData.collectInfoName" disabled />
						</uni-forms-item>
						
						<uni-forms-item label="订单金额 : " name="">
						  <uni-easyinput :value="formData.orderAmount?formData.orderAmount.toFixed(2):formData.orderAmount" disabled />
						</uni-forms-item>
						
						<uni-forms-item label="实付金额 : " name="">
						  <uni-easyinput :value="formData.payAmount?formData.payAmount.toFixed(2):formData.payAmount" class="money" disabled />
						</uni-forms-item>

            <uni-forms-item label="转账备注 : " name="">
              <uni-easyinput v-model="formData.transferRemark" disabled />
            </uni-forms-item>

            <uni-forms-item label="订单创建时间 : " name="">
              <uni-easyinput v-model="formData.createTime" disabled />
            </uni-forms-item>
						
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <button class="reset-btn" @click="closeOrderModal()">取消</button>
          <button class="search-btn" @click="orderBtnOk()">确认</button>
        </view>
      </view>
    </uni-popup>

    <!-- 查看提交信息 弹窗 -->
    <uni-popup ref="submit_info_dialog_visibleRef" :show="submit_info_dialog_visible" @maskClick="closeInfoDialog()">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">查看提交信息</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="closeInfoDialog()"></uni-icons>
        </view>

        <view style="padding: 0 100rpx; background-color: white;">
          <view v-for="item in submit_info_formData.submitInfo" style="padding: 5rpx 0;" :key="item.submitInfoKey">
            <view v-if="item.showType == 0">
              <text style="margin-right: 20rpx;">{{ item.submitInfoKey }}：</text>
              <text style="font-weight: 600; margin-right: 10rpx;">{{ item.submitInfoValue }}</text>
              <!-- <el-button type="text" @click="
                        (e) => {
                          clipboard(item.submitInfoValue, e )
                        }
                      ">复制</el-button> -->
              <!-- <view  @click="onCopyBtnClick()">复制</view> -->

            </view>
            <view v-if="item.showType == 1">
              <text style="margin-right: 20rpx;">{{ item.submitInfoKey }}：</text>
              <text>
                <image style="width: 200rpx; height: 200rpx;" mode="scaleToFill" :src="item.imageUrl" alt=""
                  @click="previewImage(item.imageUrl)"></image>
              </text>
            </view>
          </view>
        </view>


        <view class="query-buttons">
          <!-- <button class="reset-btn" @click="closeInfoDialog()">取消</button> -->
          <button class="search-btn" @click="closeInfoDialog()">关闭</button>
        </view>
      </view>
    </uni-popup>

    <!-- 一键拉黑 弹窗 -->
    <uni-popup ref="showBlackDialogVisualRef" :show="showBlackDialogVisual" @maskClick="onBlackBtnCancel()">
      <view class="query-popup" style="background-color: white;" >
        <view class="popup-header">
          <text class="popup-title">一键拉黑</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="onBlackBtnCancel()"></uni-icons>
        </view>

        <view style="text-align: center; padding: 40rpx 80rpx;" >
          <!-- 确定要拉黑付款人IP吗？ -->
          <uni-forms ref="blackFormDataRef" :model="blackFormData" label-position="left"
            label-width="140rpx">
            <uni-forms-item label="请选择：">
              <u-radio-group v-model="blackFormData.black" placement="col">
                <u-radio style="margin: 10rpx 0;"  label="全部" :name="3"> </u-radio>
                <u-radio style="margin: 10rpx 0;"  label="付款人姓名" :name="2"> </u-radio>
                <u-radio style="margin: 10rpx 0;"  label="付款人IP" :name="1"> </u-radio>
              </u-radio-group>
            </uni-forms-item>
          </uni-forms>
        </view>
        <view class="query-buttons">
          <button class="reset-btn" @click="onBlackBtnCancel()">取消</button>
          <button class="search-btn" @click="onBlackBtnOk()">确定</button>
        </view>
      </view>
    </uni-popup>



    <!-- 查看收款信息弹窗    -->
    <uni-popup ref="showAccountInfoRef" :show="showAccountInfoVisible" @maskClick="showAccountInfoVisible = false">
      <view class="query-popup look-info">
        <view class="popup-header">
          <text class="popup-title">查看收款信息</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="showAccountInfoVisible = false"></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms v-if="showAccountInfoVisible" label-position="left" label-width="220rpx">


            <uni-forms-item label="收款信息名称">
              <view class="item-value" style="display: flex; align-items: center;height: 100%;">
                {{ formData.collectInfoName }}
              </view>
            </uni-forms-item>

            <uni-forms-item label="产品名称">
              <view class="item-value" style="display: flex; align-items: center;height: 100%;">
                {{ formData.productName }}
              </view>
            </uni-forms-item>

            <view v-if="formData.payeeAccountConfig && showAccountInfoVisible">
              <!-- 文本信息 -->
              <uni-forms-item v-for="(item) in formData.payeeAccountConfig.texts" :key="item.textConfigId"
                :label="item.textTitle">
                <view class="item-value" style="display: flex; align-items: center;height: 100%;">
                  {{ item.textValue }}
                </view>
              </uni-forms-item>
              <!-- 按钮信息 -->

              <view v-for="button in formData.payeeAccountConfig.buttons" :key="button.buttonConfigId">
                <view class="" v-for="item in button.buttonParamList" :key="item.buttonParamId">
                  <uni-forms-item :label="item.paramTitle" v-if="item.paramTitle && item.isShow">
                    <view class="item-value">
                      {{ formData[`buttonParamList_${item.buttonParamId}`] }}
                    </view>
                  </uni-forms-item>
                </view>

              </view>

              <!-- 二维码设置 -->

              <view v-if="formData.payeeAccountConfig.qrConfig.isActive == 1">
                <uni-forms-item label="生成方式" prop="">
                  <view class="item-value">
                    {{
                      parseTypeOptions.find(
                        (ele) =>
                          ele.value ==
                          formData.payeeAccountConfig.qrConfig.parseType
                      ).label
                    }}
                  </view>
                </uni-forms-item>

                <uni-forms-item v-if="formData.payeeAccountConfig.qrConfig.parseType != 2" label="选择图片">
                  <MyImage style="width: 292rpx; height: 292rpx"
                    :src="formData.payeeAccountConfig.qrConfig.fileList[0].url" />
                </uni-forms-item>

                <view class="btn-box" v-if="formData.payeeAccountConfig.qrConfig.parseType == 2">
                  <uni-forms-item v-if="formData.payeeAccountConfig.qrConfig.GenerQrUrl" label="二维码">
                    <MyImage style="width: 292rpx; height: 292rpx"
                      :src="formData.payeeAccountConfig.qrConfig.GenerQrUrl" />
                  </uni-forms-item>

                  <uni-forms-item label="输入数据">
                    <view class="item-value">
                      {{ formData.payeeAccountConfig.qrConfig.parseValue }}
                    </view>
                  </uni-forms-item>
                </view>
              </view>

              <!-- 文件配置 -->
              <view v-if="
                  formData.payeeAccountConfig.files &&
                  formData.payeeAccountConfig.files.length > 0
                " class="file-config">
                <uni-forms-item v-for="(item, index) in formData.payeeAccountConfig.files" :key="index"
                  :label="item.fileTitle">
                  <view style="display: flex; justify-content: space-between">
                    {{ item.fileList[0].name }}
                    <u-button size="mini" style="width: 100rpx; margin: 0 10rpx" type="primary"
                      @click="download(item.fileList[0])">下载</u-button>
                  </view>
                  <view class="red_tip">说明： {{ item.remark }}</view>
                </uni-forms-item>
              </view>
            </view>
          </uni-forms>
        </scroll-view>

        <!-- <view class="query-buttons">
          <u-button @click="onDialogBtnCancel()">取消</u-button>
          <u-button type="primary" @click="onDialogBtnOk()">确定</u-button>
        </view> -->
      </view>
    </uni-popup>


    <CheckTradePwd  @checkSuccess="doConfirmOrder"   :showCheckPwdPopup.sync="showCheckPwdPopup"/>


  </view>
</template>

<script>
  import {
    replaceBigNumbers,
    copyInfo
  } from '@/utils/index.js'

  import CheckTradePwd from '@/components/check-trade-password/index.vue'


  import {
    formatDateTime,
    downloadFile
  } from '@/utils'

  import {
    queryRules
  } from './rules'

  import {
    amountCheck
  } from '@/utils/validate.js'
  import {
    refreshOptions,
    orderStateOptions,
    notifyStatusOptions,
    notifyStatusSimpleOptions,
    businessTypeOptions,
    parseTypeOptions,
    changeTypeOptions
  } from '@/utils/constants.js'

  import {
    getProviderReportPage,
    providerDailyReportSummary
  } from '@/api/report-center.js'

  import {
    getCollectOrderList,
    cancelCollectOrder,
    confirmCollectOrder,
    getProductListByProviderUserId,
    supplementCollectOrder,
    getSubmitInfoInfo,
    addBlackList
  } from '@/api/collect-order.js'

  import {
    getPayeeAccountInfoById
  } from '@/api/service-income-info.js'

  import {
    getFileById
  } from '@/api/upload'

  import {
    debounce
  } from '@/utils/index.js'

  import {
    mapState
  } from 'vuex'

  export default {
    name: 'ReceiveOrder',
    components:{
      CheckTradePwd,
    },
    props: {
      isInTab: {
        type: Boolean | String,
        default: false
      }
    },
    data() {
      return {
        showCheckPwdPopup: false,
        datatimestr: '',
        parseTypeOptions,
        refreshOptions: refreshOptions,
        orderStateOptions: orderStateOptions,
        notifyStatusOptions: notifyStatusOptions,
        businessTypeOptions: businessTypeOptions,
        changeTypeOptions: changeTypeOptions,
        notifyStatusSimpleOptions,
        minOrderAmountRules: [
          amountCheck,
          // {
          //   validateFunction: (rule, value, data, callback) => {
          //     if (
          //       !this.queryFormData.minOrderAmount ||
          //       !this.queryFormData.maxOrderAmount
          //     ) {
          //       return true
          //     }

          //     if (
          //       Number(this.queryFormData.minOrderAmount) >
          //       Number(this.queryFormData.maxOrderAmount)
          //     ) {
          //       callback('最小值不能大于最大值')
          //     }
          //     return true
          //   }
          // }
        ],
        maxOrderAmountRules: [
          amountCheck,
          {
            validateFunction: (rule, value, data, callback) => {
              if (
                !this.queryFormData.minOrderAmount ||
                !this.queryFormData.maxOrderAmount
              ) {
                return true
              }

              if (
                Number(this.queryFormData.minOrderAmount) >
                Number(this.queryFormData.maxOrderAmount)
              ) {
                callback('最大值不能小于最小值')
              }
              return true
            }
          }
        ],
        minPayAmountRules: [
          amountCheck,
          // {
          //   validateFunction: (rule, value, data, callback) => {
          //     if (
          //       !this.queryFormData.minPayAmount ||
          //       !this.queryFormData.maxPayAmount
          //     ) {
          //       return true
          //     }

          //     if (
          //       Number(this.queryFormData.minPayAmount) >
          //       Number(this.queryFormData.maxPayAmount)
          //     ) {
          //       callback('最小值不能大于最大值')
          //     }
          //     return true
          //   }
          // }
        ],
        maxPayAmountRules: [
          amountCheck,
          {
            validateFunction: (rule, value, data, callback) => {
              if (
                !this.queryFormData.minPayAmount ||
                !this.queryFormData.maxPayAmount
              ) {
                return true
              }

              if (
                Number(this.queryFormData.minPayAmount) >
                Number(this.queryFormData.maxPayAmount)
              ) {
                callback('最大值不能小于最小值')
              }
              return true
            }
          }
        ],

        queryRules: queryRules,
        refreshIndex: 0,
        countdown: 0,

        timer: null,
        queryFormData: this.getQueryForm(),
        tableData: [],
        showFilter: false, // 显示搜索框
        refreshTriggered: false,
        page: {
          pageSize: 10,
          pageNum: 1
        },
        total: 0,
        scrollTop: 0,
        oldScrollTop: 0,
        summaryInfo: {}, // 汇总信息
        productList: [],
        formData: {},
        procType: 1, // 1 确认 0 取消  2  补单
        showOrderPopup: false,

        startTimeRange: {
          start: '',
          end: ''
        },

        endTimeRange: {
          start: '',
          end: ''
        },
        submit_info_formData: {},
        submit_info_dialog_visible: false,

        showAccountInfoVisible: false,

        showBlackDialogVisual: false,
        blackFormData: {},

      }
    },
    mounted() {
      console.log('-----mounted----onLoad-------')
      this.getAllProductList()
      this.queryTableData()

      this.refreshIndex = uni.getStorageSync('collectOrderRefreshIndex') || 0

      this.startRefreshTimer()

      this.$store.dispatch('loadUserProviderPermission')
    },

    computed: {
      ...mapState({
        tabIndex: (state) => state.tabIndex
      })
    },
    watch: {
      tabIndex(newValue, oldValue) {
        console.log('tabIndex 发生变化，旧值:', oldValue, '新值:', newValue)
        if (oldValue === 1) {
          this.clearRefreshTimer()
        }
      },
      showAccountInfoVisible(v) {
        if (this.$refs.showAccountInfoRef) {
          if (v) {
            this.$refs.showAccountInfoRef.open('bottom')
          } else {
            this.$refs.showAccountInfoRef.close()
          }
        }
      },
      showBlackDialogVisual(v) {
        if (this.$refs.showBlackDialogVisualRef) {
          if (v) {
            this.$refs.showBlackDialogVisualRef.open('center')
          } else {
            this.$refs.showBlackDialogVisualRef.close()
          }
        }
      },
      submit_info_dialog_visible(v) {
        if (this.$refs.submit_info_dialog_visibleRef) {
          if (v) {
            this.$refs.submit_info_dialog_visibleRef.open('bottom')
          } else {
            this.$refs.submit_info_dialog_visibleRef.close()
          }
        }
      },
      showFilter(v) {
        if (this.$refs.queryPopupRef) {
          if (v) {
            this.$refs.queryPopupRef.open('bottom')
          } else {
            this.$refs.queryPopupRef.close()
          }
        }
      },
      showOrderPopup(v) {
        if (this.$refs.procOrderPopupRef) {
          if (v) {
            this.$refs.procOrderPopupRef.open('bottom')
          } else {
            this.$refs.procOrderPopupRef.close()
          }
        }
      }
    },
    beforeDestroy() {
      console.log('-------beforeDestroy--------');
      this.clearRefreshTimer()
    },
    methods: {
      copyInfo,

      showBlackDialog(row) {
      this.showBlackDialogVisual = true
      this.blackFormData = {
        black: 2,
        orderId: row.orderId,
        payerIp: row.payerIp,
        payerName: row.payerName
      }
    },
    onBlackBtnCancel() {
      this.showBlackDialogVisual = false
      this.$refs.blackFormDataRef.clearValidate()
    },
    async onBlackBtnOk() {
      // this.$refs.blackFormDataRef.validate().then(async valid => {
      //   if (valid) {
          let res = await addBlackList({
            tenantId: this.$store.state.tenantId,
            orderId: this.blackFormData.orderId,
            payerIp: this.blackFormData.black == 2 ? '' : this.blackFormData.payerIp,
            payerName: this.blackFormData.black == 1 ? '' : this.blackFormData.payerName
          })
          console.log(res, 'res')
          this.$message.success('操作成功')
          this.onBlackBtnCancel()
      //   }
      // })
    },


      download(item) {
        downloadFile(item.url, item.name)
      },

      previewImage(imageUrl) {
        uni.previewImage({
          urls: [imageUrl],
          current: 0,
          indicator: 'none'
        })
      },

      async look_shoukuan_info(row) {
        if (!row.collectInfoId) {
          uni.showToast({
            title: '收款信息不存在',
            icon: 'none',
            duration: 2000
          })
          return
        }
        this.showAccountInfoVisible = true
        this.formData = Object.assign({}, row)

        const res = await getPayeeAccountInfoById(row.collectInfoId)

        const qrConfig = res.data.qrConfig
        qrConfig.fileId = qrConfig.qrUrl // 其实是 fileId

        if (qrConfig.parseType == null) {
          qrConfig.parseType = 0
          qrConfig.fileList = []
          console.error('-----不应该出现的情况，-----', qrConfig.parseType)
        } else if (qrConfig.parseType != 2) {
          // 0 原图 1 上传并解析
          let resp = await getFileById(qrConfig.qrUrl) // 其实是 fileId
          qrConfig.fileList = [{
            name: resp.data.originalName,
            url: resp.data.fileUrl
          }]
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

            ele.fileList = [{
              name: resp.data.originalName,
              url: resp.data.fileUrl
            }]
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

      onCopyBtnClick() {
        uni.setClipboardData({
          data: `${this.submit_info_formData.submitInfo}`,
          success: () => {
            uni.showToast({
              title: '复制成功',
              icon: 'success'
            })
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
      look_submit_info(row) {
        this.submit_info_formData = {
          tradePassword: '',
          isShow: false,
          submitInfo: '',
          orderId: row.orderId
        }


        this.doLookInfo()
      },
      async doLookInfo() {
        let ret = await getSubmitInfoInfo(this.submit_info_formData.orderId, {
          tenantId: this.$store.state.tenantId
        })
        if (!ret.data) {
          uni.showToast({
            title: '暂无任何信息',
            icon: 'none',
            duration: 2000
          })
          return
        }

        this.submit_info_dialog_visible = true

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
      jumpTo(page) {
        if (this.isInTab) {
          this.$store.state.tabOrderType = 1
        } else {
          uni.redirectTo({
            url: page
          })
        }
      },

      onSubNavClick(v) {
        this.queryFormData.orderStatus = v
        this.queryTableData()
      },
      onStartTimeChange(e) {
        console.log(e)

        if (!e) {
          this.endTimeRange.start = 1
          this.endTimeRange.end = Date.now()
          return
        }

        const now = new Date()
        const today_start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0
        ) // 今天凌晨
        const middle = new Date(
          today_start.getTime() - 3600 * 1000 * 24 * 2 - 500
        ) // 3天前的半夜

        let selectDateTime = new Date(e)
        if (middle.getTime() > selectDateTime.getTime()) {
          // 选了3 天前的
          this.endTimeRange.start = e
          this.endTimeRange.end = formatDateTime(middle)
        } else {
          // 选了3天内的
          this.endTimeRange.start = e

          this.endTimeRange.end = formatDateTime(
            new Date(today_start.getTime() + 24 * 60 * 60 * 1000 - 1000)
          )
        }
        console.log(JSON.stringify(this.endTimeRange))
      },
      onEndTimeChange(e) {
        console.log(e)
        if (!e) {
          this.startTimeRange.start = 1
          this.startTimeRange.end = Date.now()
          return
        }
        const now = new Date()
        const today_start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0
        ) // 今天凌晨
        const middle = new Date(
          today_start.getTime() - 3600 * 1000 * 24 * 2 - 500
        ) // 3天前的半夜

        let selectDateTime = new Date(e)
        if (middle.getTime() > selectDateTime.getTime()) {
          // 选了3 天前的
          this.startTimeRange.start = 1
          this.startTimeRange.end = e
        } else {
          // 选了3天内的
          this.startTimeRange.start = formatDateTime(new Date(middle.getTime() + 1000))

          this.startTimeRange.end = e
        }

        console.log(JSON.stringify(this.startTimeRange))
      },

      async getAllProductList() {
        let ret = await getProductListByProviderUserId(this.$store.getters.userId)
        this.productList = ret.data.map((ele) => {
          return {
            label: ele.productName,
            value: ele.productId
          }
        })
      },

      async orderBtnOk() {
        if (this.procType == 0) {
          // 取消
          cancelCollectOrder(this.formData.orderId).then((res) => {
            this.$message.success('取消成功')
            this.closeOrderModal()
            this.queryTableData()
          })
        } else if (this.procType == 1) {

          if(this.$store.getters.isSecondConfirmOrder){
            this.showCheckPwdPopup=true
          }else{
            this.doConfirmOrder()
          }

          
        } else if (this.procType == 2) {
          // 补单
          supplementCollectOrder(this.formData.orderId).then((res) => {
            this.$message.success('补单成功')
            this.closeOrderModal()
            this.queryTableData()
          })
        }
      },
      doConfirmOrder(){
        // 确认
          confirmCollectOrder(this.formData.orderId).then((res) => {
            this.$message.success('确认成功')
            this.closeOrderModal()
            this.queryTableData()
          })
      },
      closeOrderModal() {
        this.showOrderPopup = false
      },
      procOrder(row, type) {
        this.procType = type
        this.showOrderPopup = true
        this.formData = row
      },

      onScrollRefresh() {
        console.log('---onScrollRefresh----')
        this.refreshTriggered = true
        this.queryTableData()
      },
      /**
	 分页器改变的监听 
	*/
      onPaginationChange(page) {
        this.page = page
        this.queryTableData()
      },
      // onLoadMore: debounce(function() {
      //   if (this.$store.state.isLoading) return
      //   this.page.pageNum += 1
      //   console.log('-----this.page.pageNum-----', this.page.pageNum);
      //   this.queryTableData()
      // }),

      closeSearchModal() {
        this.showFilter = false
        // this.resetQueryForm()
        if (this.$refs.queryFormDataRef) {
          this.$refs.queryFormDataRef.clearValidate()
        }
      },

      resetQueryForm() {
        this.queryFormData = this.getQueryForm()
      },

      btnSearchClick() {
        this.$refs.queryFormDataRef
          .validate()
          .then(async (ret) => {
            console.log('验证通过', ret)
            this.queryTableData()
          })
          .catch((err) => {
            console.log('验证失败', err)
            console.log(this.queryFormData)
            this.$message.error('输入有误：' + err[0].errorMessage)
          })

        // this.$refs.queryFormDataRef.validate([], (err, formData) => {
        // 	if (!err) {
        // 		console.log('success', formData)
        // 		this.queryTableData()
        // 	}else{
        // 		console.log('--error--', err);
        // 	}
        // })
      },
      // 确认搜索
      async queryTableData() {
        console.log('--this.queryFormData---', this.queryFormData)
        let params = {
          // providerName: this.$store.state.userName
        }

        Object.keys(this.queryFormData).forEach((key) => {
          if (
            this.queryFormData[key] !== '' &&
            this.queryFormData[key] !== undefined
          ) {
            if (key == 'createTime') {
              params['startTime'] = this.queryFormData['createTime'][0]
              params['endTime'] = this.queryFormData['createTime'][1]
            } else {
              params[key] = this.queryFormData[key]
            }
          }
        })
        // 操作类型(0-当前码商、1-下级码商)
        params.operationType = 0
        let res = await getCollectOrderList(params, this.page)
        console.log(res)
        this.tableData = res.data.list.map(item => {
          item.isShowAll = false // 展开订单信息
          return item
        })
        this.total = res.data.total

        //   // 汇总信息
        //   let ret = await providerDailyReportSummary(params, this.page)
        //   console.log('---providerDailyReportSummary---', ret)
        //   this.summaryInfo = ret.data

        this.refreshTriggered = false

        this.scrollToTop()
        this.closeSearchModal()
      },

      flushPage() {
        this.queryTableData()
      },

      scrollToTop() {
        this.scrollTop = this.oldScrollTop
        this.$nextTick(() => {
          this.scrollTop = 0
        })
      },

      getQueryForm() {
        let now = new Date()
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2,
          0,
          0,
          0
        )
        let endStr = formatDateTime(
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
        )
        let startStr = formatDateTime(today)

        this.$nextTick(() => {
          const tomorrow = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0,
            0,
            0
          ) // 今天凌晨

          this.startTimeRange.end = formatDateTime(tomorrow)
          this.endTimeRange.end = formatDateTime(tomorrow)
        })

        const lastOrderStatus = this.queryFormData != undefined && this.queryFormData.orderStatus != undefined ?
          this
          .queryFormData.orderStatus : ''

        return {
          productId: '',
          // merchantId: '',
          // providerId: '',
          orderStatus: lastOrderStatus,
          notifyStatus: '',
          startTime: startStr,
          endTime: endStr,
          // createTime: [startStr, endStr]
        }
      },

      onRefreshChange(e) {
        console.log('---onRefreshChange--', e)
        this.clearRefreshTimer()

        this.refreshIndex = e.detail.value

        uni.setStorageSync('collectOrderRefreshIndex', this.refreshIndex)

        this.startRefreshTimer()
      },
      startRefreshTimer() {
        const interval = this.refreshOptions[this.refreshIndex].value
        if (interval <= 0) {
          this.countdown = 0
          return
        }

        this.countdown = interval
        this.timer = setInterval(() => {
          this.countdown--
          if (this.countdown <= 0) {
            this.refreshOrders()
            this.countdown = interval
          }
        }, 1000)
      },
      clearRefreshTimer() {
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
        this.countdown = 0
        this.refreshIndex = 0
      },
      refreshOrders() {
        this.flushPage()
      }

      // acceptOrder(order) {
      //   uni.showModal({
      //     title: '确认接单',
      //     content: `确定要接单 ${order.systemOrderId} 吗？`,
      //     success: (res) => {
      //       if (res.confirm) {
      //         uni.showLoading({
      //           title: '接单中...'
      //         })

      //         // 模拟接单操作
      //         setTimeout(() => {
      //           order.status = '处理中'
      //           order.acceptedTimes += 1
      //           uni.hideLoading()
      //           uni.showToast({
      //             title: '接单成功',
      //             icon: 'success'
      //           })
      //         }, 1000)
      //       }
      //     }
      //   })
      // }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .nav-bar.isShowUi {
    border-radius: 0;
  }

  .container {
    .order-list {
      height: calc(100% - 40px);
    }
  }

  .nav-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 440rpx;
    height: 72rpx;
    border: 2rpx solid #FFFFFF26;
    border-radius: 36rpx;

    .left,
    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200rpx;
      height: 64rpx;
      border-radius: 32rpx;
    }

    .left {
      background-image: linear-gradient(to right, #AE9281 0%, #FFF6ED 50%, #EDD0BE 100%);
    }

    .right {
      color: #CFD5E3;
    }

  }


  .sub-nav-bar {
    display: flex;
    padding: 0 30rpx;
    background-color: #232738;
    border-radius: 0 0 40rpx 40rpx;
    justify-content: space-evenly;
    height: 80rpx;
    // align-items: center;

    .item {
      width: 25%;
      color: #CFD5E3;
      text-align: center;
      line-height: 80rpx;
    }

    .curr {
      color: #E0C4B2;
      border-bottom: 8rpx solid #E0C4B2;
      box-sizing: border-box;
    }
  }

  .main-content {
    background-color: #eff4ff;

    .order-card {
      padding: 0;
      margin: 20rpx;

      .card-header {
        display: flex;
        padding: 0 40rpx;
        align-items: center;
        height: 72rpx;
        background-image: linear-gradient(to right, #AE9281 0%, #FFF6ED 50%, #EDD0BE 100%);
        border-radius: 20rpx 20rpx 0 0;
        color: #071A36;

        .value {
          font-weight: 600;
        }
      }

      .card-body {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 20rpx 40rpx;

        .w100{
          width: 100%;
          display: flex;
          align-items: center;
        }
        .w50{
          width: 48%;
          display: flex;
          align-items: center;
        }

        .line2 {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;

          }

          .time-row {
            font-size: 24rpx;
            color: #999999;
            .time-label {
              margin-right: 10rpx;
            }
          }


          .info-label {
            text-align: left;
            width: 140rpx;
            margin-right: 0;
          }

        .notes-row {
          display: flex;
          align-items: center;
          padding: 20rpx 0;

          .notes-label {
            font-size: 24rpx;
            width: 240rpx;
          }

          .notes-value {
            font-size: 24rpx;
            line-height: 28rpx;
            margin: 0;
          }
        }

        // .info-label {
        //   font-size: 24rpx;
        //   text-align: left;
        //   width: 200rpx
        // }

        .info-value {
          font-size: 24rpx;
          margin-right: 0;
        }

      }

      .switch-box {
        display: flex;
        justify-content: center;
        align-items: center;

        .txt {
          color: #999999;
          margin-right: 10rpx;
        }
      }

      .footer {
        height: 60rpx;
        border-top: 2rpx dashed #EEEEEE;
        margin-bottom: 0;
        align-items: center;
      }
    }
  }

  ::v-deep .u-tag--success {
    background-image: linear-gradient(to top, #6BBCFF 0%, #0D92FF 100%) !important;

    .u-tag__text {
      color: #fff !important;
    }

  }

  ::v-deep .u-tag-- {
    background-image: linear-gradient(to top, #52CABC 0%, #41B5A8 100%) !important;

    .u-tag__text {
      color: #fff !important;
    }
  }


  .refresh-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 20rpx;
    margin: 20rpx;
    background-color: #d8dae0;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  }

  .refresh-select {
    flex: 1;
  }

  .refresh-select .picker {
    color: #333;
    font-size: 28rpx;
  }

  .refresh-timer {
    color: #666;
    font-size: 26rpx;
  }

  ::v-deep .uni-forms-item {
    flex: 1;
  }

  ::v-deep .look-info .uni-forms-item {
    margin-bottom: 0 !important;
  }

  ::v-deep .no-label-title {
    margin-bottom: 0 !important;
  }

  ::v-deep .uni-date__x-input {
    font-size: 13px;
  }


  ::v-deep .card-footer .u-button {
    height: 60rpx;
  }
	
	::v-deep .deal-info{
		.uni-forms-item{
			margin-bottom: 10rpx;
		}
		.is-disabled{
			background-color: transparent !important;
			border-color: transparent !important;
		}
		.money {
			input {
				color: #c00;
			}
		}
	}
	
	
</style>