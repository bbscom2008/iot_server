<template>
  <view class="container isShowUi" :style="{ paddingTop: $store.state.navBarHeight + 'rpx' }">
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="团队管理">
      <view class="right" slot="right">
        <view class="nav-right" @click="showFilter = true">
          <uni-icons type="search" color="#fff"></uni-icons>
          <text class="query-text">搜索</text>
        </view>
      </view>
    </custom-nav-bar>

    <view class="sub-nav-bar">
      <view class="item" :class="{ curr: queryFormData.isActive === '' }" @click="onSubNavClick('')">全部</view>
      <view class="item" :class="{ curr: queryFormData.isActive === 1 }" @click="onSubNavClick(1)">启用中</view>
      <view class="item" :class="{ curr: queryFormData.isActive === 0 }" @click="onSubNavClick(0)">禁用中</view>
    </view>

    <!-- 订单列表 -->
    <scroll-view class="order-list" scroll-y @scroll="(e) => (oldScrollTop = e.detail.scrollTop)"
      :scroll-with-animation="true" :scroll-top="scrollTop" refresher-enabled :refresher-triggered="refreshTriggered"
      @refresherrefresh="onScrollRefresh()">
      <view class="opt-btn">
        <u-button class="add-btn" type="primary" @click="showAddDialog()">新增</u-button>
        <u-button class="copy-btn" type="primary" @click="showAddDialog(true)">复制</u-button>
      </view>

      <view class="no-data" v-if="tableData.length == 0">
        <uni-icons type="search" size="50"></uni-icons>
        <text>暂无相关数据</text>
      </view>
      <view class="main-content" v-else>
        <view v-for="(item, index) in tableData" :key="index" class="order-card">
          <view class="card-header">
            <text class="order-id">账号: {{ item.userName }}</text>
            <u-tag :text="
                isActiveOptions.find((ele) => ele.value == item.isActive).label
              " :type="
                isActiveOptions.find((ele) => ele.value == item.isActive).type
              "></u-tag>
          </view>

          <view class="card-body">
            <view class="provide-name">
              <view class="name">
                <image src="/static/imgs/user1.png" style="width: 70rpx; height: 70rpx" mode=""></image>
                <text class="value">{{ item.userNickName }}</text>
              </view>

              <view class="level">
                <!-- <text class="info-label">当前层级:</text>
                <text class="value">{{ item.level }}</text>
                 -->
                <text class="info-label">团队:</text>
                <view class="info-value" @click="showLevelTree(item)">
                  <view class="click-text">查看 </view>
                  <u-icon name="arrow-right" color="#766053" size="16"></u-icon>
                </view>
              </view>
            </view>

            <view class="balance">
              <view class="item">
                <text class="info-value price">¥{{ item.availableBalance }}</text>
                <text class="info-label">可用余额</text>
              </view>

              <view class="item">
                <text class="info-value price">¥{{ item.freezeBalance }}</text>
                <text class="info-label">冻结金额</text>
              </view>
              <view class="item">
                <text class="info-value price">¥{{ item.minAllowableCollectAmount }}</text>
                <text class="info-label">最低接单金额</text>
              </view>
            </view>

            <view class="time-box">
              <view class="item">
                <text class="info-value">{{ item.createTime }}</text>
                <text class="info-label">创建</text>
              </view>
              <view class="item">
                <text class="info-value">{{ item.updateTime }}</text>
                <text class="info-label">更新</text>
              </view>
            </view>

            <view class="remark">
              <text class="info-label">备注信息:</text>
              <text class="info-value">{{ item.remark }}</text>
            </view>

            <!-- 
						<view class="notes-row">
				  <text class="notes-label">备注信息:</text>
				  <text class="notes-value">{{ item.remark }}</text>
				</view>-->
          </view>

          <view class="card-footer">
            <u-button class="action-btn" :class="{ peizhi: item.isBalanceTransfer == 0 }" @click="configProduct(item)">
              配置产品
            </u-button>
            <u-button class="action-btn" :class="{ modify: item.isBalanceTransfer == 0 }" @click="showEditDialog(item)">
              修改
            </u-button>
            <u-button class="action-btn" v-if="item.isBalanceTransfer == 1" @click="showBalanceDialog(item)">
              余额划拨
            </u-button>
            <u-button class="action-btn" :class="{ kaihu: item.isBalanceTransfer == 0 }" @click="showUserInfo(item)">
              开户信息
            </u-button>
          </view>
        </view>

        <pagination @change="onPaginationChange" :total="total" :value="page.pageNum"></pagination>
      </view>
    </scroll-view>

    <!-- 开户信息  弹窗 -->
    <uni-popup ref="user_info_ref" :show="user_info_dialog" @maskClick="user_info_dialog = false">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">个人信息</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="user_info_dialog = false"></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <view class="profile-card">
            <!-- 	<view class="profile-header">
							<text class="profile-title">个人信息</text>
						</view> -->

            <view class="info-item">
              <text class="info-label">账号：</text>
              <text class="info-value">{{ profileData.userName }}</text>
            </view>

            <view class="info-item">
              <text class="info-label">初始登录密码：</text>
              <text class="info-value">{{ profileData.loginPassword }}</text>
            </view>

            <view class="info-item">
              <text class="info-label">码商管理后台（PC端）：</text>
              <text class="info-value">{{ profileData.loginAddress }}</text>
            </view>

            <view class="info-item">
              <text class="info-label">码商管理后台（手机端）：</text>
              <text class="info-value">{{ profileData.serverMobileUrl }}</text>
            </view>

            <view class="notice">
              <view class="notice-text">说明：（主要针对账号安全设定）</view>
              <view class="notice-text">1、平台、商户、码商开户时都会生成临时密码，账号初次登录时会强制进行修改</view>
              <view class="notice-text">2、若开户后忘记临时密码需要跟后台申请重置</view>
              <view class="notice-text">3、初次登录后，请及时设置交易密码</view>
            </view>
          </view>
        </scroll-view>

        <view class="query-buttons">
          <u-button type="primary" @click="onCopyBtnClick()">复制</u-button>
          <u-button @click="user_info_dialog = false">关闭</u-button>
        </view>
      </view>
    </uni-popup>

    <!-- 新增   弹窗 -->
    <uni-popup ref="addPopupRef" :show="dialogVisible" @maskClick="onDialogBtnCancel()">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">{{
            isEdit ? '修改码商' : '新增码商'
          }}</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="onDialogBtnCancel()"></uni-icons>
        </view>
        <scroll-view class="modal-content" scroll-y>
          <uni-forms ref="formDataRef" :model="formData" :rules="formDataRules" label-position="top"
            label-width="360rpx">
            <uni-forms-item label="账号" :name="isEdit ? '' : 'userName'" :required="!isEdit"
              :rules="isEdit ? [] : userNameRules">
              <uni-easyinput v-model="formData.userName" placeholder="请输入账号" :disabled="isEdit"
                @blur="$refs.formDataRef.validateField('userName')" />
            </uni-forms-item>

            <uni-forms-item label="码商名称" name="userNickName" required>
              <uni-easyinput v-model="formData.userNickName" placeholder="请输入码商名称2"
                @blur="$refs.formDataRef.validateField('userNickName')" />
            </uni-forms-item>

            <uni-forms-item label="同时最大接单数（代收）" name="maxConcurrentCollectOrdersCount" required>
              <uni-easyinput v-model="formData.maxConcurrentCollectOrdersCount" placeholder="请输入数量" @blur="
                  $refs.formDataRef.validateField('maxConcurrentCollectOrdersCount')
                " />
            </uni-forms-item>

            <uni-forms-item label="同时最大接单数（代付）" name="maxConcurrentPaymentOrdersCount" required>
              <uni-easyinput v-model="formData.maxConcurrentPaymentOrdersCount" placeholder="请输入数量" @blur="
                  $refs.formDataRef.validateField('maxConcurrentPaymentOrdersCount')
                " />
            </uni-forms-item>


            <uni-forms-item label="最低接单金额" name="minAllowableCollectAmount">
              <uni-easyinput disabled v-model="formData.minAllowableCollectAmount" />
            </uni-forms-item>

            <uni-forms-item label="码商飞机号" name="botUserName">
              <uni-easyinput v-model="formData.botUserName" placeholder="输入码商飞机号"
                @blur="$refs.formDataRef.validateField('botUserName')" />
            </uni-forms-item>

            <uni-forms-item label="群组ID" name="groupIdList">
              <uni-easyinput v-model="formData.groupIdList" placeholder="输入群组ID,不能有空格,以负号开头，多个ID以逗号间隔"
                @blur="$refs.formDataRef.validateField('groupIdList')" />
            </uni-forms-item>

            <uni-forms-item label="授权审核人ID" name="personOperatorAuthList">
              <uni-easyinput v-model="formData.personOperatorAuthList" placeholder="不能有空格，多个ID以逗号间隔" @blur="
                  $refs.formDataRef.validateField('personOperatorAuthList')
                " />
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <u-button @click="onDialogBtnCancel()">取消</u-button>
          <u-button type="primary" @click="onDialogBtnOk()">确定</u-button>
        </view>
      </view>
    </uni-popup>

    <!-- 复制码商弹窗 -->
    <uni-popup ref="copyPopupRef" :show="copyDialogVisible" @maskClick="onCopyDialogBtnCancel()">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">复制码商</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="onCopyDialogBtnCancel()"></uni-icons>
        </view>
        <scroll-view class="modal-content" scroll-y>
          <uni-forms ref="copyFormDataRef" :model="formData" :rules="formDataRules" label-position="top"
            label-width="200">
            <uni-forms-item label="账号" name="userName" required>
              <uni-easyinput v-model="formData.userName" placeholder="请输入账号"
                @blur="$refs.copyFormDataRef.validateField('userName')" />
            </uni-forms-item>

            <uni-forms-item label="码商名称" name="userNickName" required>
              <uni-easyinput v-model="formData.userNickName" placeholder="请输入码商名称"
                @blur="$refs.copyFormDataRef.validateField('userNickName')" />
            </uni-forms-item>

            <uni-forms-item label="码商模板" name="providerId" required>
              <MySelect :options="allProvideList" v-model="formData.providerId">
              </MySelect>
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <u-button @click="onCopyDialogBtnCancel()">取消</u-button>
          <u-button type="primary" @click="onCopyDialogBtnOk()">确定</u-button>
        </view>
      </view>
    </uni-popup>

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
            <!-- 查询的条目 -->
            <uni-forms-item label="账号" name="userName">
              <uni-easyinput v-model="queryFormData.userName" placeholder="请输入账号"
                @blur="$refs.queryFormDataRef.validateField('userName')" />
            </uni-forms-item>

            <uni-forms-item label="码商名称" name="userNickName">
              <uni-easyinput v-model="queryFormData.userNickName" placeholder="请输入码商名称"
                @blur="$refs.queryFormDataRef.validateField('userNickName')" />
            </uni-forms-item>

            <uni-forms-item label="是否启用" name="isActive">
              <MySelect haveAll :options="isActiveOptions" v-model="queryFormData.isActive">
              </MySelect>
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <u-button icon="reload" class="reset-btn" @click="resetQueryForm()">重置</u-button>
          <u-button icon="search" class="search-btn" @click="btnSearchClick()">搜索</u-button>
        </view>
      </view>
    </uni-popup>

    <!--   余额划拨    弹窗 -->
    <uni-popup ref="balanceDialogRef" :show="balanceDialogVisible" @maskClick="btnBalanceCancel()">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">余额划拨</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="btnBalanceCancel()"></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms ref="balanceFormRef" :model="formData" :rules="balanceRules" style="padding-top: 30rpx"
            label-position="left" label-align="right" label-width="220rpx">
            <!-- 查询的条目 -->

            <uni-forms-item label="当前码商" name="">
              <uni-easyinput :value="$store.state.personalInfo.userName" disabled />
            </uni-forms-item>

            <uni-forms-item label="当前可用余额" name="">
              <uni-easyinput :value="$store.state.topList.availableBalance.toFixed(2)" disabled />
            </uni-forms-item>
            <uni-forms-item label="收款用户名" name="receiveUserId">
              <uni-easyinput :value="formData.userNickName" disabled />
            </uni-forms-item>

            <uni-forms-item label="收款人可用余额" name="receiveUserId">
              <uni-easyinput :value="formData.availableBalance" disabled />
            </uni-forms-item>

            <uni-forms-item label="操作" name="operationType" required>
              <MySelect :options="balanceTypeOptions" v-model="formData.operationType">
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="变动金额" name="changeAmount" required>
              <uni-easyinput v-model="formData.changeAmount" placeholder="请输入变动金额" type="number"
                @blur="$refs.balanceFormRef.validateField('changeAmount')" />
            </uni-forms-item>

            <uni-forms-item label="交易密码" name="tradePassword" required>
              <uni-easyinput type="password" v-model.number="formData.tradePassword" placeholder="请输入交易密码"
                @blur="$refs.balanceFormRef.validateField('tradePassword')" />
            </uni-forms-item>

            <uni-forms-item label="备注" name="">
              <uni-easyinput v-model="formData.remark" placeholder="请输入备注" />
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <u-button icon="reload" class="reset-btn" @click="btnBalanceCancel()">重置</u-button>
          <u-button icon="checkmark" class="search-btn" @click="btnBalanceOk()">确定</u-button>
        </view>
      </view>
    </uni-popup>

    <!-- 复制码商弹窗 -->
    <uni-popup ref="levelTreePopupRef" :show="showLevelTreeVisual" @maskClick="closeLevelTreePopup()">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">查看码商团队</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="closeLevelTreePopup()"></uni-icons>
        </view>
        <scroll-view class="modal-content" scroll-y>
          <view class="table">
            <view class="head">
              <view class="item c1">序号</view>
              <view class="item c2">码商账号</view>
              <view class="item c3">码商名称</view>
              <!-- <view class="item c4">级别</view> -->
              <view class="item c5">是否启用</view>
            </view>
            <view class="body">
              <view class="row" v-for="(item, index) in levelTreeData" :key="item.userName">
                <view class="item c1">{{ index + 1 }}</view>
                <view class="item c2">{{ item.userName }}</view>
                <view class="item c3">{{ item.userNickName }}</view>
                <!-- <view class="item c4">{{ item.level }}</view> -->
                <view class="item c5">{{
                  item.isActive ? '启用' : '禁用'
                }}</view>
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="query-buttons">
          <u-button type="primary" @click="closeLevelTreePopup()">关闭</u-button>
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
    queryRules,
    formDataRules,
    balanceRules
  } from './rules'

  import {
    amountCheck
  } from '@/utils/validate.js'
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
    getProviderLevel,
    getProviderChildListByUserId,
    updateSingleProvider,
    transferBalance
  } from '@/api/report-center'

  import {
    userNameRule
  } from '@/utils/validate.js'

  import {
    debounce
  } from '@/utils/index.js'

  import {
    isExistProviderUserName,
    getProviderInfoDetailByProviderId,
    getProviderMinAllowableCollectAmount
  } from '@/api/service-list.js'

  export default {
    name: 'ReceiveOrder',
    data() {
      return {
        userNameRules: [{
            required: true,
            errorMessage: '请输入用户名'
          },
          userNameRule,
          {
            validateFunction: async (rule, value, data, callback) => {
              let ret = await isExistProviderUserName(
                this.$store.state.tenantId, {
                  providerUserName: value
                }
              )
              if (ret.data) {
                return callback('账号已存在')
              } else {
                return callback()
              }
            }
          }
        ],
        balanceRules,
        balanceTypeOptions,
        refreshOptions,
        orderStateOptions,
        notifyStatusOptions,
        isActiveOptions,
        changeTypeOptions,
        queryRules,
        formDataRules,

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
        formData: {},
        isCopy: false, // true 复制  false 新增
        allProvideList: [], // 所有的码商，  下位框
        user_info_dialog: false, // 开户信息弹窗
        profileData: {}, //
        balanceDialogVisible: false, //

        receiveUserList: [{
          label: 'abc',
          value: 123
        }],
        copyDialogVisible: false, // 复制对话框
        showLevelTreeVisual: false,
        levelTreeData: [],
        isEdit: false
      }
    },
    created() {
      console.log('---------onLoad-------')
      this.queryTableData()
      this.flushData()
    },
    watch: {
      showLevelTreeVisual(v) {
        if (this.$refs.levelTreePopupRef) {
          if (v) {
            this.$refs.levelTreePopupRef.open('center')
          } else {
            this.$refs.levelTreePopupRef.close()
          }
        }
      },
      copyDialogVisible(v) {
        if (this.$refs.copyPopupRef) {
          if (v) {
            this.$refs.copyPopupRef.open('bottom')
          } else {
            this.$refs.copyPopupRef.close()
          }
        }
      },
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
    onUnload() {
      this.clearRefreshTimer()
    },
    methods: {
      closeLevelTreePopup() {
        this.showLevelTreeVisual = false
      },

      async showLevelTree(row) {
        this.showLevelTreeVisual = true
        let res = await getProviderLevel(row.providerId)
        console.log(res, 'res')
        this.levelTreeData = res.data
      },

      onSubNavClick(v) {
        this.queryFormData.isActive = v
        this.queryTableData()
      },

      btnBalanceCancel() {
        this.$refs.balanceFormRef.clearValidate()
        this.balanceDialogVisible = false
        this.formData = {}
      },
      btnBalanceOk() {
        this.$refs.balanceFormRef
          .validate()
          .then(async (ret) => {
            try {
              await transferBalance({
                // ...this.formData,
                userId: this.$store.state.userAccount.userId,
                businessType: 2, //  0-代收类，1-代付类，2-业务类
                receiveUserId: this.formData.userId,
                changeAmount: Number(this.formData.changeAmount),
                operationType: this.formData.operationType,
                tradePassword: this.formData.tradePassword,
                remark: this.formData.remark
              })
              this.$message.success('划拨成功')
              this.btnBalanceCancel()
              this.flushPage()
            } catch (e) {
              console.log(e);
            }
          })
          .catch((err) => {
            this.$message.error('输入不正确，请检查')
          })
      },
      showBalanceDialog(row) {
        this.formData = Object.assign({}, row)
        this.balanceDialogVisible = true
        this.formData.operationType = 0 // 默认充值
      },
      async showUserInfo(row) {
        console.log('开户信息')
        this.user_info_dialog = true
        this.profileData = {}
        let res = await getProviderOpenInfo(row.providerId)
        this.profileData = res.data
        console.log(res)
      },
      onCopyBtnClick() {
        uni.setClipboardData({
          data: `账号：
${this.profileData.userName}
初始登录密码：
${this.profileData.loginPassword}
码商管理后台（PC端）：
${this.profileData.loginAddress}
码商管理后台（手机端）：
${this.profileData.serverMobileUrl || ''}

说明：（主要针对账号安全设定）
1、平台、商户、码商开户时都会生成临时密码，账号初次登录时会强制进行修改
2、若开户后忘记临时密码需要跟后台申请重置
3、初次登录后，请及时设置交易密码`,
          success: () => {
            uni.showToast({
              title: '复制成功',
              icon: 'success'
            })
          }
        })
      },

      onCopyDialogBtnCancel() {
        console.log('----onCopyDialogBtnCancel-----')
        this.copyDialogVisible = false
        this.$refs.copyFormDataRef.clearValidate()
      },
      onCopyDialogBtnOk() {
        this.$refs.copyFormDataRef
          .validate()
          .then(async (ret) => {
            await masterProviderCopy(this.formData)
            this.$message.success('复制成功')
            this.onCopyDialogBtnCancel()
            this.flushPage()
          })
          .catch((err) => {
            this.$message.error('输入不正确，请检查')
          })
      },

      onDialogBtnCancel() {
        console.log('----onDialogBtnCancel-----')
        this.dialogVisible = false
        this.$refs.formDataRef.clearValidate()
      },

      onDialogBtnOk() {
        this.$refs.formDataRef
          .validate()
          .then(async (ret) => {
            if (this.isEdit) {
              let res = await updateSingleProvider({
                providerName: this.formData.userNickName,
                parentId: this.formData.parentId,
                userId: this.formData.userId,
                providerId: this.formData.providerId,
                maxConcurrentCollectOrdersCount: Number(this.formData.maxConcurrentCollectOrdersCount),
                maxConcurrentPaymentOrdersCount: Number(this.formData.maxConcurrentPaymentOrdersCount),
                minAllowableCollectAmount: this.formData.minAllowableCollectAmount,
                botUserName: this.formData.botUserName,
                groupIdList: this.formData.groupIdList ?
                  this.formData.groupIdList.split(',') : [],
                personOperatorAuthList: this.formData.personOperatorAuthList ?
                  this.formData.personOperatorAuthList.split(',') : []
              })
              this.$message.success('修改成功')
            } else {
              let res = await masterProviderAdd({
                ...this.formData,
                tenantId: this.$store.state.tenantId,
                userName: this.formData.userName,
                userNickName: this.formData.userNickName,
                maxConcurrentCollectOrdersCount: Number(this.formData.maxConcurrentCollectOrdersCount),
                maxConcurrentPaymentOrdersCount: Number(this.formData.maxConcurrentPaymentOrdersCount),
                minAllowableCollectAmount: this.formData.minAllowableCollectAmount,
                botUserName: this.formData.botUserName,
                groupIdList: this.formData.groupIdList ?
                  this.formData.groupIdList.split(',') : [],
                personOperatorAuthList: this.formData.personOperatorAuthList ?
                  this.formData.personOperatorAuthList.split(',') : []
              })
              console.log(res, 'res')
              this.$message.success('添加成功')
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
        this.flushData()
      },
      flushData() {
        getProviderChildListByUserId(this.$store.state.userAccount.userId).then(
          (res) => {
            console.log('----getProviderChildListByUserId-----', res)
            this.allProvideList = res.data.map((ele) => {
              return {
                label: ele.userNickName,
                value: ele.providerId
              }
            })
          }
        )
      },

      async showEditDialog(row) {
        this.isEdit = true
        this.dialogVisible = true
        let res = await getProviderInfoDetailByProviderId(row.providerId)
        this.formData = Object.assign({}, res.data)

        this.formData.minAllowableCollectAmount = row.minAllowableCollectAmount

        this.formData.botUserName = res.data.botUserName
        this.formData.groupIdList = res.data.groupIdList ?
          res.data.groupIdList.join(',') :
          ''
        this.formData.personOperatorAuthList = res.data.personOperatorAuthList ?
          res.data.personOperatorAuthList.join(',') :
          ''
      },

      showAddDialog(isCopy) {
        this.isCopy = isCopy
        this.isEdit = false

        this.formData = {
          userName: '',
          userNickName: '',
          minAllowableCollectAmount: '',
          maxConcurrentCollectOrdersCount: 0,
          maxConcurrentPaymentOrdersCount: 0,
        }

        if (this.isCopy) {
          this.copyDialogVisible = true
          this.formData.providerId =
            this.allProvideList.length > 0 ? this.allProvideList[0].value : ''
        } else {
          this.dialogVisible = true
          this.getProviderMinAllowableCollectAmount()
        }
      },

      async getProviderMinAllowableCollectAmount() {
        let res = await getProviderMinAllowableCollectAmount(
          this.$store.state.tenantId
        )
        this.formData.minAllowableCollectAmount = res.data ? Number(res.data) : 0
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

        let res = await getProviderListPage(params, this.page)
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
        const lastActive =
          this.queryFormData != undefined &&
          this.queryFormData.isActive != undefined ?
          this.queryFormData.isActive :
          ''

        return {
          userName: '',
          userNickName: '',
          isActive: lastActive
        }
      },

      configProduct(order) {
        uni.navigateTo({
          url: `/pages/team-manager/config-product/config-product?providerId=${order.providerId}&userNickName=${order.userNickName}`
        })
      }
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

  .opt-btn {
    padding: 40rpx 40rpx 20rpx;

    .u-button--primary {
      border-radius: 40rpx !important;
    }

    .copy-btn::after,
    .add-btn::after {
      background-image: url(/static/imgs/add.png);
      background-size: contain;
      width: 36rpx;
      height: 36rpx;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin-left: -60rpx;
    }

    .copy-btn::after {
      background-image: url(/static/imgs/copy.png);
    }
  }

  .nav-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 440rpx;
    height: 72rpx;
    border: 2rpx solid #ffffff26;
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
      background-image: linear-gradient(to right,
          #ae9281 0%,
          #fff6ed 50%,
          #edd0be 100%);
    }

    .right {
      color: #cfd5e3;
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
      color: #cfd5e3;
      text-align: center;
      line-height: 80rpx;
    }

    .curr {
      color: #e0c4b2;
      border-bottom: 8rpx solid #e0c4b2;
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
        background-image: linear-gradient(to right,
            #ae9281 0%,
            #fff6ed 50%,
            #edd0be 100%);
        border-radius: 20rpx 20rpx 0 0;
        color: #071a36;

        .value {
          font-weight: 600;
        }
      }

      .card-body {
        padding: 20rpx;

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

            .value {
              padding: 0 10rpx;
            }

            .info-value {
              display: flex;
              align-items: center;
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
              font-size: 24rpx;
              color: #999999;
            }
          }
        }

        .time-box {
          display: flex;
          justify-content: space-between;
          font-size: 24rpx;
          color: #686a70;
          padding: 0rpx 30rpx;

          .info-value {
            margin-right: 10rpx;
          }
        }

        .remark {
          font-size: 24rpx;
          padding: 10rpx 30rpx;
          color: #999999;

          .info-value {
            font-size: 28rpx;
            color: #071a36;
            margin-left: 10rpx;
          }
        }

        .info-row {
          .info-label {
            text-align: left;
            width: 200rpx;
          }

          .info-value {
            margin-right: 0;
          }
        }
      }

      .card-footer {
        padding-top: 0;

        .action-btn {
          border-color: #ebedf0 !important;

          padding-left: 0;
          padding-right: 0;
          box-sizing: border-box;
          font-size: 24rpx;
        }

        .peizhi,
        .huabo,
        .modify,
        .kaihu {
          padding-left: 50rpx;
          padding-right: 15rpx;
        }

        .peizhi::after,
        .huabo::after,
        .modify::after,
        .kaihu::after {
          content: '';
          width: 36rpx;
          height: 36rpx;
          background-image: url(/static/imgs/setting.png);
          background-size: contain;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          margin-left: -60rpx;
        }

        .huabo::after {
          background-image: url(/static/imgs/huabo.png);
        }

        .modify::after {
          background-image: url(/static/imgs/modify.png);
        }

        .kaihu::after {
          background-image: url(/static/imgs/kaihu.png);
        }
      }

      .footer {
        height: 60rpx;
        border-top: 2rpx dashed #eeeeee;
        margin-bottom: 0;
        align-items: center;
      }
    }
  }

  ::v-deep .u-tag--success {
    background-image: linear-gradient(to top,
        #6bbcff 0%,
        #0d92ff 100%) !important;

    .u-tag__text {
      color: #fff !important;
    }
  }

  ::v-deep .u-tag-- {
    background-image: linear-gradient(to top,
        #52cabc 0%,
        #41b5a8 100%) !important;

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

  ::v-deep .no-label-title {
    margin-bottom: 0 !important;
  }

  ::v-deep .uni-date__x-input {
    font-size: 13px;
  }

  ::v-deep .card-footer .u-button {
    height: 60rpx;
  }

  ::v-deep .modal-content {
    padding: 0 20rpx;
  }

  .table {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    text-align: center;
    padding: 30rpx 0;
    font-size: 24rpx;

    .head {
      display: flex;
      background-color: #eff4ff;
      padding: 20rpx 0;
    }

    .body {
      .row {
        display: flex;
        padding: 10rpx 0;
        gap: 6rpx;

        .item {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }

    .c4,
    .c1 {
      width: 80rpx;
      text-align: center;
    }

    .c3,
    .c2 {
      flex: 1;
      text-align: center;
    }

    .c5 {
      width: 120rpx;
    }
  }
</style>