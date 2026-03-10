<template>
  <view
    class="container isShowUi"
    :style="{ paddingTop: $store.state.navBarHeight + 'rpx' }"
  >
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="产品列表">
      <view class="right" slot="right">
        <view class="nav-right" @click="showFilter = true">
          <uni-icons type="search" color="#fff"></uni-icons>
          <text class="query-text">搜索</text>
        </view>
      </view>
    </custom-nav-bar>

  <view class="sub-nav-bar">
    <view class="item" :class="{curr:queryFormData.isActive===''}" @click="onSubNavClick('')">全部</view>
    <view class="item" :class="{curr:queryFormData.isActive===1}" @click="onSubNavClick(1)">启用中</view>
    <view class="item" :class="{curr:queryFormData.isActive===0}" @click="onSubNavClick(0)" >禁用中</view>
  </view>


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
           <!-- <text class="order-id">产品名称：{{ item.productName }}</text> -->
           <view class="order-id">产品类型: 
           <text  style="font-weight: 600; margin-left: 10rpx;" >{{ item.productTypeName }}</text>
           </view>
            <u-tag
                size="mini"
                class="info-value"
                :text="item.isActive == 1 ? '启用' : '禁用'"
                :type="item.isActive == 1 ? 'success' : 'error'"
                >{{
              }}</u-tag>    
              
          </view> 

          <view class="card-body">
           <!-- <view class="info-row">
              <text class="info-label">产品类型</text>
              <text class="info-value">{{ item.productTypeName }}</text>
            </view>

            <view class="info-row">
              <text class="info-label">交易类型</text>
              <text class="info-value">
                <u-tag plain size="mini" :text="tradeTypeOtions.find(ele=>ele.value == item.tradeType).label " ></u-tag>
              </text>
            </view> -->
            
            <view class="provide-name">
              <view class="name">
                <image
                  src="/static/imgs/user1.png"
                  style="width: 70rpx; height: 70rpx"
                  mode=""
                ></image>
                <text class="value">{{ item.productName }}</text>
              </view>
            
              <view class="level">
                <u-tag plain size="mini" 
                :type="tradeTypeOtions.find(ele=>ele.value == item.tradeType).type"
                :text="tradeTypeOtions.find(ele=>ele.value == item.tradeType).label " ></u-tag>
              </view>
            </view>
            
            

            <!-- <view class="info-row">
              <text class="info-label">收银台页面模板:</text>
              <text class="info-value">{{ item.templateName }}</text>
            </view> -->

         <view class="balance">
           <view class="item">
             <view class="info-value price">{{ item.providerRate }} %</view>
             <view class="info-label">产品费率</view>
           </view>
           
           <view class="item">
             <view class="info-value  price">¥{{ item.providerPerTransactionFee }} </view>
             <view class="info-label">单笔交易手续费</view>
           </view>
           
         </view>

          


           <!-- <view class="info-row">
              <text class="info-label">浮动金额设置</text>
              <text class="info-value"  @click=""  >
                 设置 
              </text>
              <u-icon name="arrow-right" color="#766053" size="14"></u-icon>
            </view> -->
            
            <view class="info-row">
              <text class="info-label">转账备注类型</text>
              <text
                class="info-value"
                v-text="
                  transferRemarkTypeOptions.find(
                    (ele) => ele.value == item.transferRemarkType
                  ).label
                "
              ></text>
            </view>
            <view class="info-row">
              <text class="info-label">自动类型</text>
              <!-- 自动类型(是否为自动确认订单) 0 否 1是 -->
              <text
                class="info-value"
                v-text="item.isAutoConfirmOrder == 1 ? '是' : '否'"
              ></text>
            </view>
            <!-- <view class="info-row">
              <text class="info-label">是否启用:</text>
              <u-tag
                class="info-value"
                size="mini"
                plain
                :text="item.isActive == 1 ? '启用' : '禁用'"
                :type="item.isActive == 1 ? 'success' : 'error'"
                >{{
              }}</u-tag>
            </view> -->

            <!-- <view class="notes-row">
              <text class="notes-label">自动类型:</text>
              <text class="notes-value">{{ item.remark }}</text>
            </view> -->
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
            <uni-forms-item label="产品名称" name="productName">
              <uni-easyinput
                v-model="queryFormData.productName"
                placeholder="请输入产品名称"
                @blur="$refs.queryFormDataRef.validateField('productName')"
              />
            </uni-forms-item>
            <uni-forms-item label="产品类型" name="productTypeId">
              <MySelect
                haveAll
                :options="productTypeList"
                v-model="queryFormData.tradeType"
              >
              </MySelect>
            </uni-forms-item>

            <!-- 交易类型（0-代收，1-代付）,可用值:0,1,示例值(1) -->
            <uni-forms-item label="交易类型" name="tradeType">
              <MySelect
                haveAll
                :options="tradeTypeOtions"
                v-model="queryFormData.tradeType"
              >
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="是否启用" name="isActive">
              <MySelect
                haveAll
                :options="isActiveOptions"
                v-model="queryFormData.isActive"
              >
              </MySelect>
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <button class="reset-btn" @click="resetQueryForm()">重置</button>
          <button class="search-btn" @click="btnSearchClick()">搜索</button>
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
              <uni-easyinput
                :value="$store.state.userName"
                disabled
                placeholder="请输入账号"
              />
            </uni-forms-item>

            <uni-forms-item label="可用余额(元)" name="userName">
              <uni-easyinput
                :value="$store.state.availableBalance"
                disabled
                placeholder="请输入可用余额"
                @blur="$refs.formDataRef.validateField('userName')"
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
  changeTypeOptions,
  transferRemarkTypeOptions,
  isActiveOptions,
  tradeTypeOtions
} from '@/utils/constants.js'

import { getProviderAccountChangePage } from '@/api/service-change-record.js'

import {
  getWithdrawApplyPage,
  addWithdrawApply
} from '@/api/service-apply-for.js'

import {
  getProductList,
  updateProductStatus,
  addProduct,
  updateProduct,
  getAllProductType,
  deleteProduct,
  getProductListByProvider,
  updateFloatAmount,
  checkProductName
} from '@/api/service-product-mananger.js'

import { debounce } from '@/utils/index.js'
export default {
  name: 'ReceiveOrder',
  data() {
    return {
      formDataRules,
      refreshOptions,
      transferRemarkTypeOptions,
      orderStateOptions,
      notifyStatusOptions,
      withdrawalApplyStatusOtions,
      businessTypeOptions,
      changeTypeOptions,
      isActiveOptions,
      tradeTypeOtions,
      queryRules: queryRules,

      productTypeList: [
        {
          label: 'iPhone ',
          value: '1'
        },
        {
          label: 'MacBook',
          value: '2'
        },
        {
          label: 'AirPods ',
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
    getAllProductType().then((res) => {
      console.log('----res----', res)
      this.productTypeList = res.data.map((item) => {
        return {
          label: item.productTypeName,
          value: item.productTypeId
        }
      })
    })
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
    onSubNavClick(v){
      this.queryFormData.isActive=v
      this.queryTableData()
    },
    
    showAddDialog() {
      this.dialogVisible = true
      this.formData = {}
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
    flushPage() {
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
      let res = await getProductListByProvider(this.page, params)
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
      const lastActive = this.queryFormData!=undefined && this.queryFormData.isActive != undefined?this.queryFormData.isActive:''
      return {
        productTypeId: '',
        tradeType: '',
        isActive: lastActive
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
        padding: 20rpx 30rpx;
        
        .provide-name {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 20rpx;
          padding: 10rpx;
          background-color: #fff7f0;
        
          .name {
            display: flex;
            align-items: center;
        
            .value {
              font-weight: 600;
              margin-left: 10rpx;
            }
          }
        
          .level {
            display: flex;
            font-size: 24rpx;
            color: #686a70;
        
            ::v-deep .u-tag--success--plain{
              border: 2rpx solid #0F93FF !important;
              .u-tag__text--success--plain{
                  color: #0F93FF;
              }
            }
            ::v-deep .u-tag--error--plain{
              border: 2rpx solid #FF4858 !important;
              .u-tag__text--error--plain{
                  color: #FF4858;
              }
            }
            
          }
        }
        
        .balance {
          display: flex;
          padding: 20rpx;
          justify-content: space-evenly;
        
          .item {
            display: flex;
            flex-direction: column;
            align-items: center;
        
            .info-value {
              font-weight: 700;
            }
        
            .info-label {
            text-align: center;
              font-size: 24rpx;
              color: #999999;
            }
          }
        }
        
        
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
  
</style>
