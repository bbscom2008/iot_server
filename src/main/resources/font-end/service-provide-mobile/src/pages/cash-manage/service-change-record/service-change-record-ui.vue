<template>
  <view class="container isShowUi" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="账变记录">
      <view class="right" slot="right">
        <view class="nav-right" @click="showFilter = true">
          <uni-icons type="search" color="#fff"></uni-icons>
          <text class="query-text">搜索</text>
        </view>
      </view>
    </custom-nav-bar>

    <view class="sub-nav-bar">
      <view class="item" :class="{curr:queryFormData.businessType===''}" @click="onSubNavClick('')">全部</view>
      <view class="item" :class="{curr:queryFormData.businessType===2}" @click="onSubNavClick(2)">业务类</view>
      <view class="item" :class="{curr:queryFormData.businessType===0}" @click="onSubNavClick(0)" >代收类</view>
      <view class="item" :class="{curr:queryFormData.businessType===1}" @click="onSubNavClick(1)" >代付类</view>
    </view>


    <!-- 订单列表 -->
    <scroll-view class="order-list" scroll-y @scroll="e=>oldScrollTop=e.detail.scrollTop" :scroll-with-animation="true"
      :scroll-top="scrollTop" refresher-enabled :refresher-triggered="refreshTriggered"
      @refresherrefresh="onScrollRefresh()">

      <view class="no-data" v-if="tableData.length == 0">
        <uni-icons type="search" size="50"></uni-icons>
        <text>暂无相关数据</text>
      </view>
      <view class="main-content" v-else>
        <view v-for="(item, index) in tableData" :key="index" class="order-card">
          <view class="card-header">
            <view class="order-id">交易编号号 <text class="value">{{ item.accountChangeRecordId}}</text>  </view>
            <u-tag :text="changeTypeOptions.find(ele=>ele.value == item.changeType ).label  " 
            :type="changeTypeOptions.find(ele=>ele.value == item.changeType ).type"></u-tag>
          </view>

          <view class="card-body">
            <view class="info-row" v-if="item.systemOrderNo">
              <text class="info-label">系统订单号</text>
              <text class="info-value">{{ item.systemOrderNo}}</text>
            </view>

            <view class="info-row">
              <text class="info-label">业务类型</text>
              <text class="info-value">{{ item.businessType===2?'业务类':item.businessType===0?'代收类':'代付类' }}</text>
            </view>

            <view class="info-row">
              <text class="info-label">账变金额</text>
              <text class="info-value price">¥{{ item.changeAmount }}元</text>
            </view>

            <view class="info-row">
              <text class="info-label">账变后余额</text>
              <text class="info-value price">¥{{ item.balanceAfterChange }}元</text>
            </view>

            <view class="info-row">
              <text class="info-label">操作人</text>
              <text class="info-value">{{ item.createName }}</text>
            </view>


            <view class="info-row" v-if="item.merchantOrderNo">
              <text class="info-label">商户订单号</text>
              <text class="info-value">{{ item.merchantOrderNo }}</text>
            </view>

            <view class="info-row">
              <text class="info-label">创建时间</text>
              <text class="info-value">{{ item.createTime }}</text>
            </view>

            <view class="info-row footer" v-if="item.remark">
              <text class="info-label">备注信息</text>
              <text class="info-value">{{ item.remark }}</text>
            </view>
    
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
            <uni-forms-item label="交易编号" name="accountChangeRecordId">
              <uni-easyinput v-model="queryFormData.accountChangeRecordId" type="number" placeholder="请输入交易编号, 纯数字"
                @blur="
                  $refs.queryFormDataRef.validateField('accountChangeRecordId')
                " />
            </uni-forms-item>

            <uni-forms-item label="系统订单号" name="systemOrderNo">
              <uni-easyinput v-model="queryFormData.systemOrderNo" type="number" placeholder="请输入订单号, 纯数字"
                @blur="$refs.queryFormDataRef.validateField('systemOrderNo')" />
            </uni-forms-item>
            <uni-forms-item label="商户订单号" name="merchantOrderNo">
              <uni-easyinput v-model="queryFormData.merchantOrderNo" placeholder="请输入商户订单号"
                @blur="$refs.queryFormDataRef.validateField('merchantOrderNo')" />
            </uni-forms-item>

            <uni-forms-item label="业务类型" name="businessType">
              <MySelect haveAll :options="businessTypeOptions" v-model="queryFormData.businessType">
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="账变类型" name="changeType">
              <MySelect haveAll :options="changeTypeOptions" v-model="queryFormData.changeType">
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="账变金额" name="changeAmount">
              <uni-easyinput v-model.number="queryFormData.changeAmount" placeholder="请输入账变金额" type="number"
                @blur="$refs.queryFormDataRef.validateField('changeAmount')" />
            </uni-forms-item>

            <uni-forms-item label="创建时间" name="createTime" required>
              <uni-datetime-picker type="datetimerange" v-model="queryFormData.createTime" />
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <u-button icon="reload" class="reset-btn" @click="resetQueryForm()">重置</u-button>
          <u-button icon="search" class="search-btn" @click="btnSearchClick()">搜索</u-button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import {
    formatDateTime
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
    businessTypeOptions,
    changeTypeOptions
  } from '@/utils/constants.js'

  import {
    getProviderAccountChangePage
  } from '@/api/service-change-record.js'

  import {
    debounce
  } from '@/utils/index.js'
  export default {
    name: 'ReceiveOrder',
    data() {
      return {
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
      }
    },
    created() {
      console.log('---------onLoad-------');
     
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
      }
    },
    onUnload() {
    },
    methods: {
      
      onSubNavClick(v){
        this.queryFormData.businessType=v
        this.queryTableData()
      },
      
      onScrollRefresh() {
        console.log('---onScrollRefresh----');
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

        this.$refs.queryFormDataRef.validate()
          .then(async (ret) => {
            console.log('验证通过', ret)
            this.queryTableData()
          }).catch((err) => {
            console.log('验证失败', err)
            console.log(this.queryFormData);
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
        let params = {
          tenantId: this.$store.state.tenantId
        }

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
        let res = await getProviderAccountChangePage(params, this.page)
        console.log(res);
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
        });
      },

      getQueryForm() {
        let now = new Date()
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0
        )
        let endStr = formatDateTime(
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
        )
        let startStr = formatDateTime(today)
        const lastBusType = this.queryFormData!=undefined && this.queryFormData.businessType != undefined?this.queryFormData.businessType:''
        return {
          // productId: '',
          // merchantId: '',
          businessType: lastBusType,
          // providerId: '',
          // orderStatus: '',
          // notifyStatus: '',
          createTime: [startStr, endStr]
        }
      },


 
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .nav-bar.isShowUi {
    border-radius: 0;
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
  
</style>