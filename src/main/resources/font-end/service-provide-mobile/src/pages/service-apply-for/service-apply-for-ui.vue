<template>
<view class="container isShowUi" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="提现申请">
      <view class="right" slot="right">
        <view class="nav-right" @click="showFilter = true">
          <uni-icons type="search" color="#fff"></uni-icons>
          <text class="query-text">搜索</text>
        </view>
      </view>
    </custom-nav-bar>
    
<!--  <view class="sub-nav-bar">
    <view class="item" :class="{curr:queryFormData.isActive===''}" @click="onSubNavClick('')">全部</view>
    <view class="item" :class="{curr:queryFormData.isActive===1}" @click="onSubNavClick(1)">审核通过</view>
    <view class="item" :class="{curr:queryFormData.isActive===0}" @click="onSubNavClick(0)" >审核中</view>
    <view class="item" :class="{curr:queryFormData.isActive===0}" @click="onSubNavClick(0)" >审核驳回</view>
  </view> -->
   

    <!-- 订单列表 -->
    <scroll-view
      class="order-list"
      scroll-y
      @scroll="(e) => (oldScrollTop = e.detail.scrollTop)"
      :scroll-with-animation="true"
      :scroll-top="scrollTop"
      refresher-enabled
      :refresher-triggered="refreshTriggered"
      @refresherrefresh="onScrollRefresh()"
    >
      <view class="flex-center mt-10" >
        <u-button class="btn"  type="primary" @click="showAddDialog()"
		style="width:80%" >提现申请</u-button >
        <image class="img" src="/static/imgs/tixian.png" style="width: 56rpx;height: 56rpx; " mode="aspectFill"></image>
      </view>

      <view class="no-data" v-if="tableData.length == 0">
        <uni-icons type="search" size="50"></uni-icons>
        <text>暂无相关数据</text>
      </view>
      <view class="main-content" v-else>
        <view
          v-for="(item, index) in tableData"
          :key="index"
          class="order-card"
        >
          <view class="card-header">
            <text class="order-id"
              >交易编号号: {{ item.withdrawalApplyId }}</text
            >
            <u-tag
              :text="
                withdrawalApplyStatusOtions.find(
                  (ele) => ele.value == item.withdrawalApplyStatus
                ).label
              "
              :type="
                withdrawalApplyStatusOtions.find(
                  (ele) => ele.value == item.withdrawalApplyStatus
                ).type
              "
            ></u-tag>
          </view>

          <view class="card-body">
            
            <view class="info-row">
              <text class="info-label">交易编号:</text>
              <text class="info-value">{{ item.withdrawalApplyId }}</text>
            </view>
            
            <view class="info-row">
              <text class="info-label">提现金额:</text>
              <text class="info-value price"
                >¥{{ item.withdrawalApplyAmount }}元</text>
            </view>
          
            
            <view class="info-row">
              <text class="info-label">提现收款信息:</text>
              <text class="info-value">{{ item.payeeInfo }}</text>
            </view>
            

            <view class="info-row">
              <text class="info-label">提现说明:</text>
              <text class="info-value">{{ item.withdrawalApplyDesc }}</text>
            </view>

            <view class="info-row">
              <text class="info-label">创建时间:</text>
              <text class="info-value">{{ item.createTime }}</text>
            </view>

            <view class="info-row">
              <text class="info-label">更新时间:</text>
              <text class="info-value">{{ item.updateTime }}</text>
            </view>

            <view class="notes-row">
              <text class="notes-label">备注信息:</text>
              <text class="notes-value">{{ item.remark }}</text>
            </view>
          </view>

          <!-- 	<view class="card-footer">
						<button class="action-btn" @click="acceptOrder(item)">接单</button>
					</view> -->
        </view>

        <pagination
          @change="onPaginationChange"
          :total="total"
          :value="page.pageNum"
        ></pagination>
      </view>
    </scroll-view>

    <!-- 搜索弹窗 -->
    <uni-popup
      ref="queryPopupRef"
      :show="showFilter"
      @maskClick="closeSearchModal()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">搜索条件</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="closeSearchModal()"
          ></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms
            ref="queryFormDataRef"
            :model="queryFormData"
            :rules="queryRules"
            label-position="top"
            label-width="200"
          >
            <uni-forms-item label="交易编号" name="withdrawalApplyId">
              <uni-easyinput
                v-model="queryFormData.withdrawalApplyId"
                type="number"
                placeholder="请输入订单号, 纯数字"
                @blur="
                  $refs.queryFormDataRef.validateField('withdrawalApplyId')
                "
              />
            </uni-forms-item>

            <uni-forms-item label="创建时间" name="" >
              <uni-datetime-picker
                type="datetimerange"
                v-model="queryFormData.createTime"
              />
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <u-button icon="reload" class="reset-btn" @click="resetQueryForm()">重置</u-button>
          <u-button icon="search" class="search-btn" @click="btnSearchClick()">搜索</u-button>
        </view>
      </view>
    </uni-popup>

    <!-- 新增   弹窗 -->
    <uni-popup
      ref="addPopupRef"
      :show="dialogVisible"
      @maskClick="onDialogBtnCancel()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">提现申请</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="onDialogBtnCancel()"
          ></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms
            ref="formDataRef"
            :model="formData"
            :rules="formDataRules"
            label-position="top"
            label-width="200"
          >
            <uni-forms-item label="账号" name="">
              <uni-easyinput :value="$store.state.userName" disabled  placeholder="请输入账号" />
            </uni-forms-item>

            <uni-forms-item label="可用余额(元)" name="userName">
              <uni-easyinput
               :value="$store.state.availableBalance.toFixed(2)"
			   disabled
                placeholder="请输入可用余额"
              />
            </uni-forms-item>

            <uni-forms-item
              label="提现金额(元)"
              name="withdrawalApplyAmount"
              required
            >
              <uni-easyinput
                v-model="formData.withdrawalApplyAmount"
                placeholder="请输入提现金额"
				v-number-input-positive
                type="number"
                @blur="$refs.formDataRef.validateField('withdrawalApplyAmount')"
              />
            </uni-forms-item>

            <uni-forms-item label="提现收款信息" name="payeeInfo" required>
              <uni-easyinput
                v-model="formData.payeeInfo"
                type="textarea"
                placeholder="请输入提现收款信息"
                @blur="$refs.formDataRef.validateField('payeeInfo')"
              />
            </uni-forms-item>

            <uni-forms-item
              label="提现说明"
              name="withdrawalApplyDesc"
              required
            >
              <uni-easyinput
                v-model="formData.withdrawalApplyDesc"
                type="textarea"
                placeholder="请输入提现说明"
                @blur="$refs.formDataRef.validateField('withdrawalApplyDesc')"
              />
            </uni-forms-item>

            <uni-forms-item label="交易密码" name="tradePwd" required>
              <uni-easyinput
                v-model="formData.tradePwd"
                type="password"
                placeholder="请输入交易密码"
                @blur="$refs.formDataRef.validateField('tradePwd')"
              />
            </uni-forms-item>

            <uni-forms-item label="谷歌密钥" name="googleCode" required>
              <uni-easyinput
                v-model="formData.googleCode"
                type="number"
                placeholder="请输入谷歌密钥, 6位数字"
                @blur="$refs.formDataRef.validateField('googleCode')"
              />
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <u-button @click="onDialogBtnCancel()">取消</u-button>
          <u-button type="primary" @click="onDialogBtnOk()">确定</u-button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { formatDateTime } from '@/utils'

import { queryRules, formDataRules } from './rules'

import { amountCheck } from '@/utils/validate.js'
import {
  refreshOptions,
  orderStateOptions,
  notifyStatusOptions,
  withdrawalApplyStatusOtions,
  businessTypeOptions,
  changeTypeOptions
} from '@/utils/constants.js'

import { getProviderAccountChangePage } from '@/api/service-change-record.js'

import { getWithdrawApplyPage, addWithdrawApply } from '@/api/service-apply-for.js'

import { debounce } from '@/utils/index.js'
export default {
  name: 'ReceiveOrder',
  data() {
    return {
		formDataRules,
      withdrawalApplyStatusOtions,
      refreshOptions: refreshOptions,
      orderStateOptions: orderStateOptions,
      notifyStatusOptions: notifyStatusOptions,
      businessTypeOptions: businessTypeOptions,
      changeTypeOptions: changeTypeOptions,
      queryRules: queryRules,
      minOrderAmountRules: [
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
              callback('最小值不能大于最大值')
            }
            return true
          }
        }
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

      productList: [
        {
          label: 'iPhone 14 Pro Max',
          value: '1'
        },
        {
          label: 'MacBook Pro 14寸',
          value: '2'
        },
        {
          label: 'AirPods Pro 2代',
          value: '3'
        }
      ],

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
      dialogVisible: false,
      formData: {}
    }
  },
  created() {
    console.log('---------onLoad-------')
    this.queryTableData()
  },
  watch: {
    showFilter(v) {
      if (this.$refs.queryPopupRef) {
        if (v) {
          this.$refs.queryPopupRef.open('bottom')
        } else {
          this.$refs.queryPopupRef.close()
        }
      }
    },
    dialogVisible(v) {
      if (this.$refs.addPopupRef) {
        if (v) {
          this.$refs.addPopupRef.open('bottom')
        } else {
          this.$refs.addPopupRef.close()
        }
      }
    }
  },
  onUnload() {
  },
  methods: {
    showAddDialog() {
      this.dialogVisible = true
      this.formData = {
       
      }
    },
    onDialogBtnCancel() {
      console.log('----onDialogBtnCancel-----')
      this.$refs.formDataRef.clearValidate()
      this.dialogVisible = false
    },
    onDialogBtnOk() {
      this.$refs.formDataRef
        .validate()
        .then(async (ret) => {
        
            let res = await addWithdrawApply(this.formData)
            console.log(res, 'res')
            this.$message.success('申请发送成功')
          
          this.onDialogBtnCancel()
          this.flushPage()
        })
        .catch((err) => {
          console.log('验证失败', err)
          this.$message.error('输入不正确，请检查')
        })
    },
	flushPage(){
		this.queryTableData()
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
      this.resetQueryForm()
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
          this.$message.error('输入不正确，请检查')
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
      let params = {}

      Object.keys(this.queryFormData).forEach((key) => {
        if (
          // this.queryFormData[key] !== '' &&
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
      // this.refreshTriggered = true
      let res = await getWithdrawApplyPage(params, this.page)
      console.log(res)
      this.tableData = res.data.list
      this.total = res.data.total
      this.refreshTriggered = false

      this.scrollToTop()
      this.closeSearchModal()
    },

    scrollToTop() {
      this.scrollTop = this.oldScrollTop
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },

    getQueryForm() {
      // let now = new Date()
      // const today = new Date(
      //   now.getFullYear(),
      //   now.getMonth(),
      //   now.getDate(),
      //   0,
      //   0,
      //   0
      // )
      // let endStr = formatDateTime(
      //   new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      // )
      // let startStr = formatDateTime(today)
      return {
        // productId: '',
        // merchantId: '',
        // providerId: '',
        // orderStatus: '',
        // notifyStatus: '',
        // createTime: [startStr, endStr]
        createTime: []
      }
    },

   
   
  }
}
</script>

<style lang="scss" scoped>
  // ::v-deep .nav-bar.isShowUi {
  //   border-radius: 0;
  // }

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
  
  .main-content{
    background-color: #eff4ff;
    .order-card{
      padding: 0;
      margin: 20rpx;
      .card-header{
        display: flex;
        padding: 0 40rpx;
        align-items: center;
        height: 72rpx;
        background-image: linear-gradient(to right , #AE9281 0%, #FFF6ED 50%, #EDD0BE 100%);
        border-radius: 20rpx 20rpx 0 0 ;
        color: #071A36;
        .value{
          font-weight: 600;
        }
      }
      .card-body{
        padding: 20rpx 40rpx;
        
        .info-label{
          text-align: left;
          width: 200rpx
          
        }
        .info-value{
          margin-right: 0;
        }
        
      }
      .footer{
        height: 60rpx;
        border-top: 2rpx dashed #EEEEEE;
        margin-bottom: 0;
        align-items: center;
      }
    }
  }
  
  ::v-deep .u-tag--success{
    background-image: linear-gradient(to top , #6BBCFF 0%, #0D92FF 100%) !important;
    
    .u-tag__text{
    color: #fff !important;
    }
    
  }
  
::v-deep .u-tag--{
  background-image: linear-gradient(to top , #52CABC 0%, #41B5A8 100%) !important;
  
  .u-tag__text{
  color: #fff !important;
  }
}
.flex-center{
  position: relative;
  .img{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-left: -100rpx;
  }
}
  
</style>
