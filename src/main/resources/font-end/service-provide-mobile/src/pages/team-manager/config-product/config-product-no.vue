<template>
  <view
    class="container"
    :style="{ paddingTop: $store.state.navBarHeight + 'rpx' }"
  >
    <!-- 自定义标题栏 -->
    <custom-nav-bar :title="`配置【${userNickName}】的产品`">
      <view class="right" slot="right">
        <view class="nav-right" @click="showFilter = true">
          <uni-icons type="search" color="#fff"></uni-icons>
          <text class="query-text">搜索</text>
        </view>
      </view>
    </custom-nav-bar>

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
      <view class="opt-btn">
        <u-button
          type="primary"
          :disabled="tableData.length == 0"
          plain
          @click="switchShowCheck()"
          >{{ showCheckboxes ? '退出' : '批量操作' }}</u-button
        >

        <u-button
          type="primary"
          plain
          v-if="!showCheckboxes"
          @click="showAddDialog()"
          >新增</u-button
        >

        <u-button
          type="primary"
          :disabled="selectRows.length == 0"
          plain
          v-if="showCheckboxes"
          @click="patchUnbindBtn"
          >批量解绑</u-button
        >
        <u-button
          type="primary"
          plain
          :disabled="selectRows.length == 0"
          v-if="showCheckboxes"
          @click="updatePathch(false)"
          >批量修改</u-button
        >
        <u-button
          type="primary"
          plain
          v-if="!showCheckboxes"
          @click="updatePathch(true)"
          >全部修改</u-button
        >
      </view>

      <!-- 全选复选框 -->
      <view v-if="showCheckboxes">
        <u-checkbox-group
          v-model="isAllSelected"
          placement="column"
          style="margin-bottom: 20rpx"
          @change="selectAll"
        >
          <u-checkbox
            name="all"
            :label="isAllSelected.length > 0 ? '全不选' : '全选'"
          ></u-checkbox>
        </u-checkbox-group>
        <!-- <text @click="showCheckboxes=false">退出编辑</text> -->
      </view>

      <view class="no-data" v-if="tableData.length == 0">
        <uni-icons type="search" size="50"></uni-icons>
        <text>暂无相关数据</text>
      </view>
      <view class="main-content" v-else>
        <u-checkbox-group
          v-model="selectRows"
          placement="column"
          @change="selectChange"
        >
          <view
            v-for="(item, index) in tableData"
            :key="index"
            class="item-card"
          >
            <!-- 复选框 -->
            <view v-if="showCheckboxes" class="checkbox-wrapper">
              <u-checkbox :name="item.id"></u-checkbox>
            </view>

            <view class="order-card">
              <view class="card-header">
                <text class="order-id">产品名称: {{ item.productName }}</text>
                <u-tag
                  :text="
                    isActiveOptions.find((ele) => ele.value == item.isActive)
                      .label
                  "
                  :type="
                    isActiveOptions.find((ele) => ele.value == item.isActive)
                      .type
                  "
                ></u-tag>
              </view>

              <view class="card-body">
                <view class="info-row">
                  <text class="info-label">码商费率:</text>
                  <text class="info-value">{{ item.providerRate }} %</text>
                </view>

                <view class="info-row">
                  <text class="info-label">单笔费用:</text>
                  <text class="info-value price"
                    >¥{{ item.providerPerTransactionFee }}元</text
                  >
                </view>
              </view>

              <view class="card-footer">
                <u-button plain @click="showEditDialog(item)"> 修改 </u-button>
                <u-button plain @click="unBindItem(item)"> 解绑 </u-button>
              </view>
            </view>
          </view>
        </u-checkbox-group>

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
            <!-- 查询的条目 -->
            <uni-forms-item label="产品名称" name="productName">
              <!-- <uni-easyinput
                v-model="queryFormData.productName"
                placeholder="请输入产品名称"
                @blur="$refs.queryFormDataRef.validateField('productName')"
            /> -->
              <MySelect
                haveAll
                :options="allProductList"
                v-model="queryFormData.productId"
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

    <!-- 新增  和  修改  弹窗 -->
    <uni-popup
      ref="addPopupRef"
      :show="dialogVisible"
      @maskClick="onDialogBtnCancel()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">{{
            isEdit ? '修改产品' : '新增产品'
          }}</text>
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
            <uni-forms-item label="码商名称" name="">
              <uni-easyinput
                v-model="userNickName"
                placeholder="请输入码商名称"
                disabled
              />
            </uni-forms-item>

            <uni-forms-item label="产品名称" name="productId" required>
              <MySelect
                :options="allProductList"
                v-model="formData.productId"
                placeholder="请选择产品名称"
              >
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="码商费率(%)" name="providerRate" required>
              <uni-easyinput
                v-model="formData.providerRate"
                placeholder="请输入码商费率"
                type="number"
                @blur="$refs.formDataRef.validateField('providerRate')"
              />
            </uni-forms-item>

            <uni-forms-item
              label="单笔费用"
              name="providerPerTransactionFee"
              required
            >
              <uni-easyinput
                v-model="formData.providerPerTransactionFee"
                placeholder="请输入单笔费用"
                type="number"
                @blur="
                  $refs.formDataRef.validateField('providerPerTransactionFee')
                "
              />
            </uni-forms-item>

            <uni-forms-item label="是否启用" name="isActive" required>
              <MySelect :options="isActiveOptions" v-model="formData.isActive">
              </MySelect>
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <u-button @click="onDialogBtnCancel()">取消</u-button>
          <u-button type="primary" @click="onDialogBtnOk()">确定</u-button>
        </view>
      </view>
    </uni-popup>

    <AllUpdate
      :isAll="isAll"
      :providerId="providerId"
      @flushPage="flushPage"
      :idList="selectRows"
      :updateVisible.sync="updateVisible"
    ></AllUpdate>
  </view>
</template>

<script>
import { formatDateTime } from '@/utils'

import { queryRules, formDataRules, balanceRules } from './rules'

import { amountCheck } from '@/utils/validate.js'

import {
  refreshOptions,
  orderStateOptions,
  notifyStatusOptions,
  isActiveOptions,
  balanceTypeOptions,
  changeTypeOptions
} from '@/utils/constants.js'

import {
  getProviderListPage,
  masterProviderAdd,
  masterProviderCopy,
  getProviderOpenInfo,
  deleteProductProviderRelRelation,
  getProviderLevel,
  getProductProviderRel,
  batchDeleteProductProviderRelRelation,
  UpdateProductProviderRelationById,
  transferBalance,
  createProviderProductRelation
} from '@/api/report-center'

import { getProductListByProviderIdWhenConfigProduct } from '@/api/report-center'

import { debounce } from '@/utils/index.js'

import AllUpdate from './all-update.vue'

export default {
  name: 'ReceiveOrder',
  components: {
    AllUpdate
  },
  data() {
    return {
      formDataRules,
      isActiveOptions,
      queryRules,
      userNickName: '',
      providerId: '',
      oldScrollTop: 0,
      scrollTop: 0,
      refreshTriggered: false,
      tableData: [],
      showFilter: false,
      queryFormData: this.getQueryForm(),
      total: 0,
      page: {
        pageSize: 10,
        pageNum: 1
      },
      dialogVisible: false,
      formData: {},
      isEdit: false, // true 复制  false 新增

      showCheckboxes: false, // 控制复选框的显示与隐藏
      isAllSelected: [], // 全选状态
      selectRows: [], // 选中的复选框的值
      updateVisible: false, // 控制弹窗的显示与隐藏
      isAll: false,
      idList: [],
      allProductList: []
    }
  },
  props:{
    options:{
      type: Object,
      default: {}
    }
  },
  created() {
    const options = this.options
    console.log(options)
    this.providerId = options.providerId
    this.userNickName = options.userNickName
    this.flushPage()
    getProductListByProviderIdWhenConfigProduct(this.providerId).then((res) => {
      this.allProductList = res.data.map((ele) => {
        return {
          label: ele.productName,
          value: ele.productId
        }
      })
    })
  },

  watch: {
    balanceDialogVisible(v) {
      if (this.$refs.balanceDialogRef) {
        if (v) {
          this.$refs.balanceDialogRef.open('bottom')
        } else {
          this.$refs.balanceDialogRef.close()
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
    dialogVisible(v) {
      if (this.$refs.addPopupRef) {
        if (v) {
          this.$refs.addPopupRef.open('bottom')
        } else {
          this.$refs.addPopupRef.close()
        }
      }
    },
    user_info_dialog(v) {
      if (this.$refs.user_info_ref) {
        if (v) {
          this.$refs.user_info_ref.open('bottom')
        } else {
          this.$refs.user_info_ref.close()
        }
      }
    }
  },
  onUnload() {},
  methods: {
    updatePathch(isAll) {
      this.isAll = isAll
      this.updateVisible = true
    },
    switchShowCheck() {
      this.showCheckboxes = !this.showCheckboxes
      this.selectRows = []
      this.isAllSelected = []
    },
    // 全选/全不选
    selectAll(e) {
      console.log('--select all --', e)
      if (e.length > 0) {
        this.selectRows = this.tableData.map((item) => item.id) // 全选
      } else {
        this.selectRows = [] // 全不选
      }
    },
    selectChange(row) {
      console.log('--select change --', row)
      if (row.length == this.tableData.length) {
        this.isAllSelected = ['all'] // 全选
      } else {
        this.isAllSelected = [] // 全不选
      }
      this.selectRows = row // 更新选中的复选框的值
      console.log('----this.selectRows----', this.selectRows)
    },
    patchUnbindBtn() {
      uni.showModal({
        title: '确认解绑',
        content: `确定要解绑选中的产品吗？`,
        success: async (res) => {
          if (res.confirm) {
            await batchDeleteProductProviderRelRelation(this.selectRows)

            this.$message.success('解绑成功')
            this.flushPage()
          }
        }
      })
    },
    unBindItem(item) {
      uni.showModal({
        title: '确认解绑',
        content: `确定要解绑 ${item.productName} 吗？`,
        success: async (res) => {
          if (res.confirm) {
            await deleteProductProviderRelRelation(item.id)
            this.$message.success('解绑成功')
            this.flushPage()
          }
        }
      })
    },
    onDialogBtnCancel() {
      this.$refs.formDataRef.clearValidate()
      this.dialogVisible = false
    },
    onDialogBtnOk() {
      this.$refs.formDataRef
        .validate()
        .then(async (ret) => {
          try{
			if (this.isEdit) {
            await UpdateProductProviderRelationById({
              providerId: this.providerId,
              id: this.formData.id,
              productId: this.formData.productId,
              providerRate: this.formData.providerRate,
              providerPerTransactionFee:
                this.formData.providerPerTransactionFee,
              isActive: this.formData.isActive
            })
            this.$message.success('修改成功')
          } else {
            let res = await createProviderProductRelation({
              providerId: this.providerId,
              ...this.formData
            })
            console.log(res, 'res')
            this.$message.success('添加成功')
          }
		  }catch(e){
			  this.$message.error(e)
		  }



          this.onDialogBtnCancel()
          this.flushPage()
        })
        .catch((err) => {
          this.$message.error('输入不正确，请检查')
        })
    },
    flushPage() {
      this.queryTableData()
      this.showCheckboxes = false // 隐藏复选框
      this.isAllSelected = [] // 取消全选
      this.selectRows = [] // 清空选中的复选框的值
      this.queryFormData = this.getQueryForm()
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        isActive: 1,
        productId: ''
      }
    },
    showEditDialog(item) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, item)
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
    },
    // 确认搜索
    async queryTableData() {
      console.log('--this.queryFormData---', this.queryFormData)
      let params = {
        providerId: this.providerId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== undefined) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      try {
        let res = await getProductProviderRel(params, this.page)
        console.log(res)
        this.tableData = res.data.list
        this.total = res.data.total
      } catch (e) {
        console.log(e)
      } finally {
      }

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
      return {
        productId: '',
        isActive: ''
      }
    },

    // 长按条目显示复选框
    onItemLongPress() {
      this.showCheckboxes = true
      this.isAllSelected = false
    }
  }
}
</script>

<style scoped>
.refresh-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.refresh-select .picker {
  color: #333;
  font-size: 28rpx;
}

.refresh-timer {
  color: #666;
  font-size: 26rpx;
}

.select-all {
  padding: 10rpx;
}

/* 	.checkbox-wrapper {
		position: absolute;
		left: 10rpx;
		top: 50%;
		transform: translateY(-50%);
	} */

/* .order-card {
		position: relative;
		padding-left: 40rpx;
	} */
</style>
