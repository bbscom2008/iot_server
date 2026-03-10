<template>
  <view
    class="container isShowUi"
    :style="{ paddingTop: $store.state.navBarHeight + 'rpx' }"
  >
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="收款信息">
      <view class="right" slot="right">
        <view class="nav-right" @click="showFilter = true">
          <uni-icons type="search" color="#fff"></uni-icons>
          <text class="query-text">搜索</text>
        </view>
      </view>
    </custom-nav-bar>

    <view class="sub-nav-bar">
      <view
        class="item"
        :class="{ curr: queryFormData.isActive === '' }"
        @click="onSubNavClick('')"
        >全部</view
      >
      <view
        class="item"
        :class="{ curr: queryFormData.isActive === 1 }"
        @click="onSubNavClick(1)"
        >启用中</view
      >
      <view
        class="item"
        :class="{ curr: queryFormData.isActive === 0 }"
        @click="onSubNavClick(0)"
        >禁用中</view
      >
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
      <view
        class="opt-btn no-modify"
        v-if="!showCheckboxes"
        style="padding-top: 20rpx"
      >
        <u-button type="primary" @click="showAddDialog()" style="width: 20%"
          >新增</u-button
        >
        <u-button
          type="primary"
          :disabled="tableData.length == 0"
          @click="switchShowCheck()"
        >
          <image
            src="/static/imgs/copy.png"
            style="width: 38rpx; height: 38rpx; margin-right: 6rpx"
            mode=""
          ></image>
          {{ '批量操作' }}
        </u-button>

        <u-button
          type="primary"
          @click="showPatchDialog(true)"
          style="width: 20%"
          >全部修改</u-button
        >
        <u-button type="primary" @click="showAliUid()" style="width: 20%"
          >支付宝UID</u-button
        >
      </view>

      <view
        class="opt-btn modify-box"
        v-if="showCheckboxes"
        style="padding-top: 20rpx"
      >
        <u-checkbox-group
          v-model="isAllSelected"
          placement="column"
          @change="selectAll"
          style="width: 180rpx"
        >
          <u-checkbox
            name="all"
            :label="isAllSelected.length > 0 ? '全不选' : '全选'"
          ></u-checkbox>
        </u-checkbox-group>

        <u-button
          type="primary"
          class="btn"
          :disabled="selectRows.length == 0"
          @click="showPatchDialog(false)"
          >批量修改</u-button
        >

        <u-button
          type="primary"
          class="exit"
          :disabled="tableData.length == 0"
          @click="switchShowCheck()"
        >
          {{ '退出' }}</u-button
        >
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
              <u-checkbox :name="item.payeeAccountId"></u-checkbox>
            </view>

            <view
              class="order-card"
              :style="{ marginLeft: showCheckboxes ? '0rpx' : '20rpx' }"
            >
              <view class="card-header">
                <text class="order-id"
                  >收款码: {{ item.payeeAccountName }}</text
                >
                <u-tag
                  :text="
                    isAvailableOptions.find(
                      (ele) => ele.value == item.isAvailable
                    ).label
                  "
                  :type="
                    isAvailableOptions.find(
                      (ele) => ele.value == item.isAvailable
                    ).type
                  "
                ></u-tag>
              </view>

              <view class="card-body">
                <view class="info-row">
                  <text class="info-label">是否可用:</text>
                  <view
                    class="info-value"
                    :class="item.isAvailable == 1 ? 'txt-success' : 'txt-error'"
                  >
                    <text
                      style="margin-left: 10rpx"
                      v-if="item.isAvailable == 0"
                    >
                      {{ item.unavailableReason }}
                    </text>
                    <RefreshIcon
                      :isAvailable.sync="item.isAvailable"
                      v-if="item.isAvailable == 0"
                      :payeeAccountId="item.payeeAccountId"
                      color="$u-error"
                    ></RefreshIcon>

                    <text style="margin: 0 20rpx">
                      {{
                        isAvailableOptions.find(
                          (ele) => ele.value == item.isAvailable
                        ).label
                      }}</text
                    >
                    <!-- <u-icon
                  v-if="item.isAvailable == 0"
                  name="error-circle-fill"
                  color="$u-error"
                  size="22"
                ></u-icon> -->
                  </view>
                </view>
                <!-- <view class="info-row">
              <text class="info-label">码商账号:</text>
              <text class="info-value">{{ item.userName }}</text>
            </view> -->
                <view class="info-row">
                  <text class="info-label">产品名称:</text>
                  <text
                    class="info-value"
                    @click="copyAgentInfo(item.productName)"
                    >{{ item.productName }}</text
                  >
                </view>

                <view class="info-row">
                  <text class="info-label">收款码名称:</text>
                  <text
                    class="info-value"
                    @click="copyAgentInfo(item.payeeAccountName)"
                    >{{ item.payeeAccountName }}</text
                  >
                </view>

                <template v-if="!showCheckboxes">
                  <view class="info-row">
                    <text class="info-label">收款信息:</text>
                    <text class="info-value">
                      <u-button
                        size="mini"
                        plain
                        type="success"
                        @click="showIncomeInfo(item)"
                        >查看</u-button
                      >
                    </text>
                  </view>

                  <view class="info-row">
                    <text class="info-label">金额限制类型:</text>
                    <view class="info-value">
                      <view v-if="item.acceptOrderConfig.limitAmountType == 0">
                        无限制
                      </view>
                      <view v-if="item.acceptOrderConfig.limitAmountType == 1">
                        <!-- 固定金额 -->
                        <text class="txt-primary"
                          >固定金额 ：{{ item.acceptOrderConfig.fixedAmount }}
                        </text>
                      </view>
                      <view v-if="item.acceptOrderConfig.limitAmountType == 2">
                        <!-- 范围金额 -->
                        <text class="txt-primary">{{
                          ` 范围金额 ：${item.acceptOrderConfig.minAmount} ~ ${item.acceptOrderConfig.maxAmount}`
                        }}</text>
                      </view>
                    </view>
                  </view>
                  <view class="info-row">
                    <text class="info-label">当日最大金额限制:</text>
                    <text class="info-value"
                      >{{ item.acceptOrderConfig.dailyMaxAmount }} 元
                    </text>
                  </view>
                  <view class="info-row">
                    <text class="info-label">当日最大订单限制:</text>
                    <text class="info-value"
                      >{{ item.acceptOrderConfig.dailyMaxCount }} 单</text
                    >
                  </view>

                  <view class="info-row">
                    <text class="info-label">是否启用:</text>
                    <text class="info-value">
                      <MySwitch
                        v-model="item.acceptOrderConfig.isActive"
                        @change="(e) => onSwitchChange(e, item)"
                      >
                      </MySwitch>
                    </text>
                  </view>

                  <!-- <view class="info-row">
                    <text class="info-label">接单下线:</text>
                    <text class="info-value">
                      <MySwitch v-model="item.isOneTimeAccept" @change="(e) => oneTimeAcceptChange(e, item)">
                      </MySwitch>
                    </text>
                  </view> -->

                  <view class="info-row">
                    <text class="info-label">过期时间:</text>
                    <text class="info-value">{{
                      item.acceptOrderConfig.payeeAccountExpireTime
                    }}</text>
                  </view>

                  <view class="info-row">
                    <text class="info-label">授权状态:</text>
                    <text class="info-value">{{
                      item.authStatus == 1 ? '已授权' : '未授权'
                    }}</text>
                  </view>

                  <view class="info-row">
                    <text class="info-label">备注:</text>
                    <text class="info-value">{{ item.remark }}</text>
                  </view>

                  <view class="info-row">
                      <text class="info-label" style="color: #333;" >成功单数：{{ item.todayOrderCount }}</text>
                      <text class="info-value"
                        >成功金额：{{ item.todayOrderAmount }}</text
                      >
                  </view>

                  <view class="info-row">
                    <text class="info-label" style="color: #333;" >
                      接单金额：{{ item.businessAmount }}
                    </text>
                    <text class="info-value"
                      >接单次数：{{ item.totalAcceptOrderCount }}</text
                    >
                  </view>

                  <!-- <view class="info-row">
                    <text class="info-label">统计信息:</text>
                    <text class="info-value">
                      <u-button size="mini" plain type="success" @click="showTongJi(item)">查看</u-button>
                    </text>
                  </view> -->
                </template>
              </view>
              <view class="card-footer" v-if="!showCheckboxes">
                <u-button @click="showConfigOrderDialog(item)">
                  接单配置
                </u-button>

                <u-button @click="showMobileAuth(item)">手机授权</u-button>
                <u-button @click="showMonitorAddr(item)">监控地址</u-button>

                <u-button @click="showEditDialog(item)">修改</u-button>
                <u-button @click="showConfirmDelete(item)">删除</u-button>
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
            <uni-forms-item label="产品名称" name="productId">
              <MySelect
                haveAll
                :options="productList"
                v-model="queryFormData.productId"
              >
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="收款码名称" name="payeeAccountName">
              <uni-easyinput
                v-model="queryFormData.payeeAccountName"
                placeholder="请输入收款码名称"
                @blur="$refs.queryFormDataRef.validateField('payeeAccountName')"
              />
            </uni-forms-item>

            <uni-forms-item label="是否可用" name="isAvailable">
              <MySelect
                haveAll
                :options="isAvailableOptions"
                v-model="queryFormData.isAvailable"
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

            <uni-forms-item label="创建时间" name="">
              <uni-datetime-picker
                type="datetimerange"
                v-model="queryFormData.createTime"
              />
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <button class="reset-btn" @click="resetQueryForm()">重置</button>
          <button class="search-btn" @click="btnSearchClick()">搜索</button>
        </view>
      </view>
    </uni-popup>

    <!-----------  新增收款信息  -----  编辑   ---------   弹窗 -->
    <uni-popup
      ref="addPopupRef"
      :show="dialogVisible"
      @maskClick="onDialogBtnCancel()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">{{
            isEdit ? '修改收款信息' : '新增收款信息'
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
            :rules="incomeInfoRules"
            label-position="left"
            style="padding-top: 30rpx"
            :label-width="isEdit ? '220rpx' : '240rpx'"
          >
            <!-- <uni-forms-item label="当前码商" :name="isEdit ? '' : 'providerId'" required>
              <MySelect :options="providerList" v-model="formData.providerId"
                @change="$refs.formDataRef.validateField('providerId')">
              </MySelect>
            </uni-forms-item> -->

            <uni-forms-item
              label="收款码名称"
              :name="isEdit ? '' : 'payeeAccountName'"
              :rules="isEdit ? [] : payeeAccountNameRules"
              :required="!isEdit"
            >
              <uni-easyinput
                :disabled="isEdit"
                v-model="formData.payeeAccountName"
                placeholder="请输入收款码名称"
                @blur="$refs.formDataRef.validateField('payeeAccountName')"
              />
            </uni-forms-item>

            <view class="warn_tip" v-if="isPayeeAccountNameExist"
              >收款码名称已存在，使用时，请仔细区分！</view
            >

            <uni-forms-item
              label="产品名称"
              :name="isEdit ? '' : 'productId'"
              :required="!isEdit"
            >
              <MySelect
                v-if="!isEdit"
                :options="productList"
                v-model="formData.productId"
                @change="handleProductChanged"
              >
              </MySelect>
              <uni-easyinput
                v-if="isEdit"
                :disabled="isEdit"
                :value="formData.productName"
              />
            </uni-forms-item>

            <!-- <uni-forms-item label="接单下线" name="isOneTimeAccept" :required="!isEdit">
              <MySwitch v-model="formData.isOneTimeAccept" v-if="!isEdit"> </MySwitch>
              <uni-easyinput v-if="isEdit" disabled :value="formData.isOneTimeAccept?'开启':'关闭'" />
            </uni-forms-item> -->

            <view
              v-if="formData.payeeAccountConfig"
              style="text-align: left; margin-bottom: 20rpx"
            >
              <!-- 文本信息 -->
              <uni-forms-item
                v-for="(item, index) in formData.payeeAccountConfig.texts"
                :key="item.textConfigId"
                :label="item.textTitle"
                :required="item.isRequired === 1"
                :name="
                  item.isRequired === 1
                    ? `payeeAccountConfig.texts[${index}].textValue`
                    : ''
                "
                :rules="
                  item.isRequired === 1 ? incomeInfoRules.textValueRules : []
                "
              >
                <uni-easyinput
                  v-model="item.textValue"
                  :placeholder="item.remark"
                  size="small"
                  @blur="
                    $refs.formDataRef.validateField(
                      `_formdata_#payeeAccountConfig#texts#${index}#textValue`
                    )
                  "
                />
              </uni-forms-item>
              <!-- 按钮信息 -->

              <view
                v-for="button in formData.payeeAccountConfig.buttons"
                :key="button.buttonConfigId"
              >
                <view
                  v-for="item in button.buttonParamList"
                  :key="item.buttonParamId"
                >
                  <uni-forms-item
                    v-if="item.paramTitle && item.isShow"
                    :label="item.paramTitle"
                    :required="true"
                    :name="`buttonParamList_${item.buttonParamId}`"
                    :rules="incomeInfoRules.buttonParamValueRules"
                  >
                    <uni-easyinput
                      v-model="
                        formData[`buttonParamList_${item.buttonParamId}`]
                      "
                      :placeholder="item.remark"
                      size="small"
                      @blur="
                        $refs.formDataRef.validateField(
                          `buttonParamList_${item.buttonParamId}`
                        )
                      "
                    />
                  </uni-forms-item>
                </view>
              </view>

              <!-- 二维码设置 -->
              <view v-if="formData.payeeAccountConfig.qrConfig.isActive == 1">
                <uni-forms-item label="生成方式" prop="">
                  <MySelect
                    v-model="formData.payeeAccountConfig.qrConfig.parseType"
                    placeholder="解析模式"
                    @change="handleQrConfigChanged"
                    :options="parseTypeOptions"
                  >
                  </MySelect>
                </uni-forms-item>

                <uni-forms-item
                  v-if="formData.payeeAccountConfig.qrConfig.parseType != 2"
                  label="选择图片"
                  name="payeeAccountConfig.qrConfig.qrUrl"
                  :rules="incomeInfoRules.qrUrlRules"
                  required
                >
                  <u-upload
                    class="avatar-uploader"
                    accept="image"
                    :multiple="false"
                    :fileList="formData.payeeAccountConfig.qrConfig.fileList"
                    :maxCount="1"
                    @afterRead="afterRead"
                    @delete="deletePic"
                  >
                    <view v-show="!qrImageUrl" class="trgger-box">
                      <u-icon name="plus"></u-icon>
                    </view>
                  </u-upload>
                </uni-forms-item>

                <uni-forms-item
                  label="二维码"
                  v-if="
                    formData.payeeAccountConfig.qrConfig.parseType == 2 &&
                    formData.payeeAccountConfig.qrConfig.GenerQrUrl
                  "
                >
                  <MyImage
                    style="width: 292rpx; height: 292rpx"
                    :src="formData.payeeAccountConfig.qrConfig.GenerQrUrl"
                  />
                </uni-forms-item>

                <uni-forms-item
                  v-if="formData.payeeAccountConfig.qrConfig.parseType == 2"
                  label="输入数据"
                  required
                >
                  <!-- :rules="incomeInfoRules.parseValueRules" -->
                  <!-- :name="['payeeAccountConfig','qrConfig','parseValue']" -->
                  <!-- //  -->
                  <uni-easyinput
                    type="textarea"
                    v-model="formData.payeeAccountConfig.qrConfig.parseValue"
                    placeholder="输入数据"
                    size="small"
                    @blur="
                      $refs.formDataRef.validateField([
                        'payeeAccountConfig',
                        'qrConfig',
                        'parseValue'
                      ])
                    "
                  />
                </uni-forms-item>

                <u-button
                  type="primary"
                  v-if="formData.payeeAccountConfig.qrConfig.parseType == 2"
                  size="small"
                  @click="generateQrCodeImg()"
                  >{{
                    formData.payeeAccountConfig.qrConfig.GenerQrUrl
                      ? '重新生成'
                      : '生成二维码'
                  }}</u-button
                >
              </view>

              <!-- 文件配置 -->
              <view
                v-if="
                  formData.payeeAccountConfig.files &&
                  formData.payeeAccountConfig.files.length > 0
                "
                class="file-config"
              >
                <uni-forms-item
                  v-for="(item, index) in formData.payeeAccountConfig.files"
                  :key="index"
                  :label="item.fileTitle"
                  :name="`payeeAccountConfig.files[${index}].fileUrl`"
                  :rules="incomeInfoRules.fileUrlRules"
                >
                  <u-upload
                    class="avatar-uploader"
                    :multiple="false"
                    accept="file"
                    :maxCount="1"
                    :fileList="item.fileList"
                    :afterRead="(event) => afterReadFile(event, index)"
                    :delete="(file) => deleteFile(file, index)"
                  >
                    <u-button
                      v-if="!formData.payeeAccountConfig.files[index].fileUrl"
                      size="small"
                      type="primary"
                      >点击上传</u-button
                    >
                  </u-upload>
                  <view class="red_tip">说明： {{ item.remark }}</view>
                </uni-forms-item>
              </view>
            </view>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <u-button @click="onDialogBtnCancel()">取消</u-button>
          <u-button type="primary" @click="onDialogBtnOk()">确定</u-button>
        </view>
      </view>
    </uni-popup>

    <!-----------  批量  -----  全部   ---------   弹窗 -->
    <uni-popup
      ref="showPathPopupRef"
      :show="showPatchDialogVisable"
      @maskClick="onPatchDialogBtnCancel()"
    >
      <view class="query-popup modify-all">
        <view class="popup-header">
          <text class="popup-title">{{
            isModAll ? '全部修改' : '批量修改'
          }}</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="onPatchDialogBtnCancel()"
          ></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms
            ref="formPatchDataRef"
            :model="formPatchData"
            :rules="incomeInfoRules"
            label-position="left"
            label-width="240rpx"
          >
            <uni-forms-item label="是否启用">
              <u-radio-group v-model="formPatchData.isActive" placement="row">
                <u-radio label="保持不变" :name="null"> </u-radio>
                <u-radio style="margin: 0 30rpx" label="开启" :name="1">
                </u-radio>
                <u-radio label="关闭" :name="0"> </u-radio>
              </u-radio-group>
            </uni-forms-item>

            <!-- <uni-forms-item label="接单下线">
              <u-radio-group v-model="formPatchData.isOneTimeAccept" placement="row">
                <u-radio label="保持不变" :name="null"> </u-radio>
                <u-radio style="margin: 0 30rpx" label="开启" :name="1">
                </u-radio>
                <u-radio label="关闭" :name="0"> </u-radio>
              </u-radio-group>
            </uni-forms-item> -->

            <uni-forms-item label="修改金额限制">
              <MySwitch
                v-model="formPatchData.updateLimitAmountType"
              ></MySwitch>
            </uni-forms-item>

            <uni-forms-item
              label="金额限制类型"
              v-if="formPatchData.updateLimitAmountType"
              name="limitAmountType"
              required
            >
              <MySelect
                style="width: 100%"
                :options="limitAmountTypeOptions"
                v-model="formPatchData.limitAmountType"
              >
              </MySelect>
            </uni-forms-item>
            <uni-forms-item
              label="固定金额："
              v-if="
                formPatchData.updateLimitAmountType &&
                formPatchData.limitAmountType == 1
              "
              required
              name="fixedAmount"
            >
              <uni-easyinput
                v-model="formPatchData.fixedAmount"
                placeholder="请输入"
                @blur="
                  () => {
                    $refs.formPatchDataRef.validateField('fixedAmount')
                  }
                "
              />
            </uni-forms-item>

            <view
              style="display: flex"
              v-if="
                formPatchData.updateLimitAmountType &&
                formPatchData.limitAmountType == 2
              "
            >
              <uni-forms-item
                label="范围金额（元）"
                required
                name="minAmount"
                :rules="updateMinAmountRules"
                style="flex: 2"
              >
                <uni-easyinput
                  v-model="formPatchData.minAmount"
                  v-number-input
                  placeholder="请输入"
                  @blur="$refs.formPatchDataRef.validateField('minAmount')"
                >
                </uni-easyinput>
              </uni-forms-item>
              <text class="symbol" style="margin: 0 5px; padding-top: 5px"
                >~</text
              >
              <uni-forms-item
                label=""
                name="maxAmount"
                style="flex: 1"
                :rules="updateMaxAmountRules"
                label-width="0"
              >
                <uni-easyinput
                  v-model="formPatchData.maxAmount"
                  v-number-input
                  placeholder="请输入"
                  @blur="$refs.formPatchDataRef.validateField('maxAmount')"
                >
                </uni-easyinput>
              </uni-forms-item>
            </view>

            <uni-forms-item label="修改最大金额">
              <MySwitch v-model="formPatchData.updateDailyMaxAmount" />
            </uni-forms-item>

            <uni-forms-item
              v-if="formPatchData.updateDailyMaxAmount"
              label="当日最大金额"
              name="dailyMaxAmount"
              required
            >
              <uni-easyinput
                v-model="formPatchData.dailyMaxAmount"
                v-number-input-positive
                placeholder="请输入当日最大金额"
                type="number"
                @blur="$refs.formPatchDataRef.validateField('dailyMaxAmount')"
              />
            </uni-forms-item>

            <uni-forms-item label="修改最大订单数">
              <MySwitch v-model="formPatchData.updateDailyMaxCount" />
            </uni-forms-item>

            <uni-forms-item
              v-if="formPatchData.updateDailyMaxCount"
              label="当日最大订单数"
              name="dailyMaxCount"
              required
            >
              <uni-easyinput
                v-model="formPatchData.dailyMaxCount"
                v-input-int-positive
                type="number"
                placeholder="请输入当日最大订单数"
                @blur="$refs.formPatchDataRef.validateField('dailyMaxCount')"
              />
            </uni-forms-item>

            <uni-forms-item label="修改过期时间">
              <MySwitch v-model="formPatchData.updatePayeeAccountExpireTime" />
            </uni-forms-item>

            <uni-forms-item
              v-if="formPatchData.updatePayeeAccountExpireTime"
              label="过期时间"
              name="payeeAccountExpireTimeType"
            >
              <MySelect
                style="width: 100%"
                v-model="formPatchData.payeeAccountExpireTimeType"
                placeholder="请选择限制类型"
                @change="onChangePayeeAccountExpireTimeType"
                :options="payeeAccountExpireTimeTypeOptions"
              >
              </MySelect>
            </uni-forms-item>

            <uni-forms-item
              v-if="
                formPatchData.payeeAccountExpireTimeType == 1 &&
                formPatchData.updatePayeeAccountExpireTime
              "
              label="指定时间"
              required
              name="payeeAccountExpireTime"
            >
              <uni-datetime-picker
                type="datetime"
                v-model="formPatchData.payeeAccountExpireTime"
              />
              <!-- @change="$refs.formPatchDataRef.validateField('payeeAccountExpireTime')" -->
            </uni-forms-item>

            <uni-forms-item
              v-if="
                formPatchData.payeeAccountExpireTimeType == 2 &&
                formPatchData.updatePayeeAccountExpireTime
              "
              required
              label="指定时长"
              name="payeeAccountExpireDuration"
            >
              <!-- <uni-easyinput
                v-model="formPatchData.payeeAccountExpireDuration"
                v-input-int-positive
                placeholder="请输入数值"
                size="small"
              >
              </uni-easyinput> -->
              <!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
              <u--input
                placeholder="请输入数值"
                type="number"
                v-input-int-positive
                v-model="formPatchData.payeeAccountExpireDuration"
                @blur="
                  $refs.formPatchDataRef.validateField(
                    'payeeAccountExpireDuration'
                  )
                "
              >
                <template slot="suffix"> 分钟 </template>
              </u--input>
            </uni-forms-item>

            <!-- <uni-forms-item
              label="收款码名称"
              :name="isEdit ? '' : 'payeeAccountName'"
              :rules="isEdit ? [] : payeeAccountNameRules"
              required
            >
              <uni-easyinput
                v-model="formData.payeeAccountName"
                placeholder="请输入收款码名称"
                @blur="$refs.formDataRef.validateField('payeeAccountName')"
              />
            </uni-forms-item>

            <uni-forms-item
              label="产品名称"
              :name="isEdit ? '' : 'productId'"
              required
            >
              <MySelect
                :options="productList"
                v-model="formData.productId"
                @change="handleProductChanged"
              >
              </MySelect>
            </uni-forms-item> -->
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <u-button @click="onPatchDialogBtnCancel()">取消</u-button>
          <u-button type="primary" @click="onPatchDialogBtnOk()">确定</u-button>
        </view>
      </view>
    </uni-popup>

    <!-- 查看收款信息弹窗    -->
    <uni-popup
      ref="showAccountInfoRef"
      :show="showAccountInfoVisible"
      @maskClick="showAccountInfoVisible = false"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">查看收款信息</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="showAccountInfoVisible = false"
          ></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms
            v-if="showAccountInfoVisible"
            label-position="left"
            label-width="220rpx"
          >
            <!-- <uni-forms-item
              label="当前码商"
              :name="isEdit ? '' : 'providerId'"
            >
              <view class="item-value">{{ formData.userName }}</view>
            </uni-forms-item> -->

            <uni-forms-item label="收款码名称">
              <view class="item-value">
                {{ formData.payeeAccountName }}
              </view>
            </uni-forms-item>

            <uni-forms-item label="产品名称">
              <view class="item-value">
                {{ formData.productName }}
              </view>
            </uni-forms-item>

            <view
              v-if="formData.payeeAccountConfig && showAccountInfoVisible"
              style="padding: 20rpx 20rpx 20rpx 0; margin: 10rpx 0"
            >
              <!-- 文本信息 -->
              <uni-forms-item
                v-for="item in formData.payeeAccountConfig.texts"
                :key="item.textConfigId"
                :label="item.textTitle"
              >
                <view class="item-value">
                  {{ item.textValue }}
                </view>
              </uni-forms-item>
              <!-- 按钮信息 -->

              <view
                v-for="button in formData.payeeAccountConfig.buttons"
                :key="button.buttonConfigId"
              >
                <view
                  v-for="item in button.buttonParamList"
                  :key="item.buttonParamId"
                >
                  <uni-forms-item
                    v-if="item.paramTitle && item.isShow"
                    :label="item.paramTitle"
                  >
                    <view class="item-value">
                      {{ item.buttonParamValue }}
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

                <uni-forms-item
                  v-if="formData.payeeAccountConfig.qrConfig.parseType != 2"
                  label="选择图片12"
                >
                  <MyImage
                    style="width: 292rpx; height: 292rpx"
                    :src="formData.payeeAccountConfig.qrConfig.fileList[0].url"
                  />
                </uni-forms-item>

                <view
                  class="btn-box"
                  v-if="formData.payeeAccountConfig.qrConfig.parseType == 2"
                >
                  <uni-forms-item
                    v-if="formData.payeeAccountConfig.qrConfig.GenerQrUrl"
                    label="二维码"
                  >
                    <MyImage
                      style="width: 292rpx; height: 292rpx"
                      :src="formData.payeeAccountConfig.qrConfig.GenerQrUrl"
                    />
                  </uni-forms-item>

                  <uni-forms-item label="输入数据">
                    <view class="item-value">
                      {{ formData.payeeAccountConfig.qrConfig.parseValue }}
                    </view>
                  </uni-forms-item>
                </view>
              </view>

              <!-- 文件配置 -->
              <view
                v-if="
                  formData.payeeAccountConfig.files &&
                  formData.payeeAccountConfig.files.length > 0
                "
                class="file-config"
              >
                <uni-forms-item
                  v-for="(item, index) in formData.payeeAccountConfig.files"
                  :key="index"
                  :label="item.fileTitle"
                >
                  <view style="display: flex; justify-content: space-between">
                    {{ item.fileList[0].name }}
                    <u-button
                      size="mini"
                      style="width: 100rpx; margin: 0 10rpx"
                      type="primary"
                      @click="download(item.fileList[0])"
                      >下载</u-button
                    >
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

    <!-- 统计的弹窗 -->
    <uni-popup
      :show="isShowTongjiDialog"
      ref="tongjiPopupRef"
      @maskClick="closeTongjiDialog()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">统计信息</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="closeTongjiDialog()"
          ></uni-icons>
        </view>
        <scroll-view class="modal-content" scroll-y>
          <uni-forms label-position="left" label-width="220rpx">
            <uni-forms-item label="累计成功金额：">
              <u--input v-model="tongjiData.totalOrderAmount" disabled>
                <template slot="suffix"> 元 </template>
              </u--input>
            </uni-forms-item>
            <uni-forms-item label="累计成功单数：">
              <u--input v-model="tongjiData.totalOrderCount" disabled>
                <template slot="suffix"> 个 </template>
              </u--input>
            </uni-forms-item>
            <uni-forms-item label="昨日成功金额：">
              <u--input v-model="tongjiData.yesterdayOrderAmount" disabled>
                <template slot="suffix"> 元 </template>
              </u--input>
            </uni-forms-item>
            <uni-forms-item label="昨日成功单数：">
              <u--input v-model="tongjiData.yesterdayOrderCount" disabled>
                <template slot="suffix"> 个 </template>
              </u--input>
            </uni-forms-item>
            <uni-forms-item label="今日成功金额：">
              <u--input v-model="tongjiData.todayOrderAmount" disabled>
                <template slot="suffix"> 个 </template>
              </u--input>
            </uni-forms-item>
            <uni-forms-item label="今日成功单数：">
              <u--input v-model="tongjiData.todayOrderCount" disabled>
                <template slot="suffix"> 个 </template>
              </u--input>
            </uni-forms-item>
          </uni-forms>
        </scroll-view>
        <view class="query-buttons">
          <u-button type="primary" @click="closeTongjiDialog()">关闭</u-button>
        </view>
      </view>
    </uni-popup>

    <!-- 接单配置 的弹窗 -->
    <uni-popup
      :show="configOrderdialogVisible"
      ref="jieDanConfPopupRef"
      @maskClick="onConfigOrderBtnCancel()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">接单配置</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="onConfigOrderBtnCancel()"
          ></uni-icons>
        </view>
        <scroll-view class="modal-content" scroll-y>
          <uni-forms
            label-position="top"
            ref="configOrderRef"
            :model="formData"
            :rules="incomeInfoRules"
            label-width="220rpx"
          >
            <uni-forms-item
              label="金额限制类型："
              name="limitAmountType"
              required
            >
              <MySelect
                style="width: 100%"
                :options="limitAmountTypeOptions"
                v-model="formData.limitAmountType"
              >
              </MySelect>
            </uni-forms-item>

            <uni-forms-item
              v-if="formData.limitAmountType == 1"
              label="固定金额："
              name="fixedAmount"
              required
            >
              <uni-easyinput
                v-model="formData.fixedAmount"
                placeholder="请输入金额，多个金额用 “ , ” 分割"
                @blur="
                  () => {
                    $refs.configOrderRef.validateField('fixedAmount')
                  }
                "
              />
            </uni-forms-item>

            <view class="range-input" v-if="formData.limitAmountType == 2">
              <view class="range-title"> 范围金额 </view>
              <view class="range-body">
                <uni-forms-item
                  label=""
                  class="no-label"
                  name="minAmount"
                  label-position="left"
                  required
                  :rules="minAmountRules"
                >
                  <uni-easyinput
                    v-model="formData.minAmount"
                    type="number"
                    placeholder="最小值"
                    @blur="$refs.configOrderRef.validateField('minAmount')"
                  />
                </uni-forms-item>
                <view class="range-separator"> 至 </view>
                <uni-forms-item
                  label-position="left"
                  :rules="maxAmountRules"
                  class="no-label"
                  label=""
                  name="maxAmount"
                >
                  <uni-easyinput
                    v-model="formData.maxAmount"
                    placeholder="最大值"
                    type="number"
                    @blur="$refs.configOrderRef.validateField('maxAmount')"
                  />
                </uni-forms-item>
                <text class="range-unit">元</text>
              </view>
            </view>

            <uni-forms-item
              label="当日最大金额："
              name="dailyMaxAmount"
              required
            >
              <uni-easyinput
                type="number"
                v-model="formData.dailyMaxAmount"
                placeholder="请输入当日最大金额"
                @blur="
                  () => {
                    $refs.configOrderRef.validateField('dailyMaxAmount')
                  }
                "
              />
            </uni-forms-item>
            <view class="warn_tip"> 说明：当日最大成功金额，0 不限制 </view>

            <uni-forms-item
              label="当日最大订单数"
              name="dailyMaxCount"
              required
            >
              <uni-easyinput
                type="number"
                v-model="formData.dailyMaxCount"
                placeholder="请输入当日最大订单数"
                @blur="
                  () => {
                    $refs.configOrderRef.validateField('dailyMaxCount')
                  }
                "
              />
            </uni-forms-item>
            <view class="warn_tip"> 说明：当日最大成功订单数，0 不限制 </view>

            <uni-forms-item label="过期时间" name="payeeAccountExpireTimeType">
              <MySelect
                style="width: 100%"
                :options="payeeAccountExpireTimeTypeOptions"
                v-model="formData.payeeAccountExpireTimeType"
              >
              </MySelect>
            </uni-forms-item>
            <uni-forms-item
              v-if="formData.payeeAccountExpireTimeType == 1"
              label="指定时间"
              name="payeeAccountExpireTime"
              required
            >
              <uni-datetime-picker
                type="datetime"
                v-model="formData.payeeAccountExpireTime"
              />
            </uni-forms-item>
            <uni-forms-item
              v-if="formData.payeeAccountExpireTimeType == 2"
              label="指定时长"
              name="payeeAccountExpireDuration"
              required
            >
              <u--input
                v-model="formData.payeeAccountExpireDuration"
                v-input-int-positive
              >
                <template slot="suffix"> 分钟 </template>
              </u--input>
            </uni-forms-item>
          </uni-forms>
        </scroll-view>
        <view class="query-buttons">
          <button class="reset-btn" @click="onConfigOrderBtnCancel()">
            取消
          </button>
          <button class="search-btn" @click="onConfigOrderBtnOk()">确定</button>
        </view>
      </view>
    </uni-popup>

    <!-- 获取监控地址 的弹窗 -->
    <uni-popup
      :show="monitorDialogVisible"
      ref="closeMonitorDialogRef"
      @maskClick="closeMonitorDialog()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">获取监控地址</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="closeMonitorDialog()"
          ></uni-icons>
        </view>
        <scroll-view class="modal-content" scroll-y>
          <view style="padding-top: 20rpx" class="flex-center">
            <MyQrCode :value="monitorData.monitorUrl"></MyQrCode>
          </view>

          <view class="mt-10" style="word-break: break-all"
            >地址：{{ monitorData.monitorUrl }}
            <text
              class="look-txt"
              style="margin-left: 20px"
              @click="copyAgentInfo(monitorData.monitorUrl)"
              >复制</text
            >
          </view>

          <view class="mt-10" style="word-break: break-all"
            >key：{{ monitorData.monitorKey }}
            <text
              class="look-txt"
              style="margin-left: 20px"
              @click="copyAgentInfo(monitorData.monitorKey)"
              >复制</text
            >
          </view>
          <view
            class="mt-10"
            style="word-break: break-all; padding-bottom: 20rpx"
          >
            包名：{{ monitorData.monitorAppBackName }}
            <text
              class="look-txt"
              style="margin-left: 20px"
              @click="copyAgentInfo(monitorData.monitorAppBackName)"
              >复制</text
            >
          </view>
        </scroll-view>
        <view class="query-buttons">
          <u-button type="primary" @click="closeMonitorDialog()">关闭</u-button>
        </view>
      </view>
    </uni-popup>

    <!-- 手机授权二维码 的弹窗 -->
    <uni-popup
      :show="mobileAuthDialogVisible"
      ref="mobileAuthDialogVisibleRef"
      @maskClick="closeMobileAuth()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">手机扫码授权</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="closeMobileAuth()"
          ></uni-icons>
        </view>
        <scroll-view class="modal-content" scroll-y>
          <view style="padding-top: 20rpx" class="flex-center">
            <MyQrCode size="425rpx" :value="mobileAuthStr"></MyQrCode>
          </view>

          <view style="font-size: 26rpx; text-align: center; color: #cc0000"
            >点击按钮打开支付宝授权</view
          >

          <view style="font-size: 26rpx; text-align: center; color: #cc0000"
            >如果失败，请截图保存，打开支付宝扫码</view
          >
        </scroll-view>
        <view class="query-buttons">
          <u-button type="primary" @click="openAliPayAuth()"
            >打开支付宝授权</u-button
          >
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { formatDateTime, isEmpty, downloadFile } from '@/utils'

import { queryRules, formDataRules, incomeInfoRules } from './rules'

import { amountCheck, userNickNameRule } from '@/utils/validate.js'
import {
  refreshOptions,
  orderStateOptions,
  notifyStatusOptions,
  withdrawalApplyStatusOtions,
  businessTypeOptions,
  isAvailableOptions,
  parseTypeOptions,
  payeeAccountExpireTimeTypeOptions,
  uploadServiceUrl,
  limitAmountTypeOptions,
  changeTypeOptions,
  transferRemarkTypeOptions,
  isActiveOptions,
  tradeTypeOtions
} from '@/utils/constants.js'

import { getProviderAccountChangePage } from '@/api/service-change-record.js'

import {
  getPayeeAccountInfoListPageByProvider,
  deletePayeeAccountInfo,
  payeeAccountInfoNameIsExist,
  getPayeeAccountInfoQrCode,
  getPayeeAccountInfoById,
  updatePayeeAccountInfo,
  getAliPayAuthUrl,
  getPayeeAccountInfoCount,
  updatePayeeAccountInfoBatch,
  addPayeeAccountInfo,
  getPayeeAccountInfoByProductId,
  payeeAccountInfoEnable,
  isExistCollectorderTaken,
  isOneTimeAcceptIsActive,
  getMonitorAddrInfo,
  getProductById
} from '@/api/service-income-info.js'

import RefreshIcon from '../components/RefreshIcon.vue'

import {
  getWithdrawApplyPage,
  addWithdrawApply
} from '@/api/service-apply-for.js'

import { getProviderOptionList } from '@/api/service-list.js'

import { getProductListByProvider } from '@/api/service-product-mananger.js'

import { getProductInfoListByProviderId } from '@/api/service-income-info'

import { openExternal } from '@/utils/index.js'

import {
  getFileById,
  uploadFileToServer,
  handleUploadParseFileToServer,
  handleUploadDataToQrCode
} from '@/api/upload'

import { debounce } from '@/utils/index.js'
import MySwitch from '../../../components/MySwitch/MySwitch.vue'
export default {
  name: 'ReceiveOrder',
  components: {
    RefreshIcon
  },
  data() {
    return {
      formDataRules,
      incomeInfoRules,
      payeeAccountExpireTimeTypeOptions,
      refreshOptions,
      parseTypeOptions,
      limitAmountTypeOptions,
      isAvailableOptions,
      transferRemarkTypeOptions,
      orderStateOptions,
      notifyStatusOptions,
      withdrawalApplyStatusOtions,
      businessTypeOptions,
      changeTypeOptions,
      isActiveOptions,
      tradeTypeOtions,
      queryRules: queryRules,

      minAmount: [
        amountCheck,
        {
          validateFunction: (rule, value, data, callback) => {
            if (!this.formData.minAmount || !this.formData.maxAmount) {
              return true
            }

            if (
              Number(this.formData.minAmount) > Number(this.formData.maxAmount)
            ) {
              callback('最小值不能大于最大值')
            }
            return true
          }
        }
      ],
      maxAmountRules: [
        amountCheck,
        {
          validateFunction: (rule, value, data, callback) => {
            if (!this.formData.minAmount || !this.formData.maxAmount) {
              return true
            }

            if (
              Number(this.formData.minAmount) > Number(this.formData.maxAmount)
            ) {
              callback('最大值不能小于最小值')
            }
            return true
          }
        }
      ],

      updateMinAmountRules: [
        {
          required: true,
          errorMessage: '请输入最小金额'
        },
        amountCheck,
        {
          validateFunction: (rule, value, data, callback) => {
            if (
              isEmpty(this.formPatchData.minAmount) ||
              isEmpty(this.formPatchData.maxAmount)
            ) {
              return callback()
            }

            if (
              Number(this.formPatchData.minAmount) >=
              Number(this.formPatchData.maxAmount)
            ) {
              return callback('必须小于最大金额')
            }
            callback()
          }
        }
      ],
      updateMaxAmountRules: [
        {
          required: true,
          errorMessage: '请输入最大金额'
        },
        amountCheck,
        {
          validateFunction: (rule, value, data, callback) => {
            if (
              isEmpty(this.formPatchData.minAmount) ||
              isEmpty(this.formPatchData.maxAmount)
            ) {
              return callback()
            }

            if (
              Number(this.formPatchData.minAmount) >=
              Number(this.formPatchData.maxAmount)
            ) {
              return callback('必须大于最小金额')
            }
            callback()
          }
        }
      ],

      payeeAccountNameRules: [
        {
          required: true,
          errorMessage: '请输入收款码名称'
        },
        userNickNameRule,
        {
          validateFunction: async (rule, value, data, callback) => {
            // if (isEmpty(this.formData.providerId)) {
            //   return callback('请先选择码商')
            // }

            const ret = await payeeAccountInfoNameIsExist(
              value,
              this.$store.state.personalInfo.providerId
            )
            if (ret.data) {
              this.isPayeeAccountNameExist = true
              return callback()
            } else {
              this.isPayeeAccountNameExist = false
              return callback()
            }
          }
        }
      ],
      isPayeeAccountNameExist: false,
      productList: [], // 所有产品列表

      refreshIndex: 0,
      countdown: 0,

      isEdit: false,

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
      providerList: [],
      qrImageUrl: '',

      showAccountInfoVisible: false,

      showPatchDialogVisable: false, // 批量 、 全部 的弹窗
      isModAll: false, // 是否是全部修改
      formPatchData: {},
      payeeAccountConfig: {},
      isShowTongjiDialog: false,
      tongjiData: {},
      configOrderdialogVisible: false,
      showCheckboxes: false, // 左侧的 checkbox 框
      selectRows: [],
      isAllSelected: [],

      monitorDialogVisible: false, // 监控地址
      monitorData: '',
      mobileAuthDialogVisible: false, // 手机授权二维码 的弹窗
      mobileAuthStr: ''
    }
  },
  created() {
    console.log('---------onLoad-------')
    // this.startRefreshTimer()
    this.queryTableData()

    // 阻塞 获得 个人信息
    this.$store.dispatch('getPersonalInfo').then((info) => {
      getProductInfoListByProviderId(
        this.$store.state.personalInfo.providerId
      ).then((res) => {
        console.log('----res----', res)
        this.productList = res.data.map((item) => {
          return {
            label: item.productName,
            value: item.productId
          }
        })
      })
    })

    getProviderOptionList(this.$store.state.tenantId).then((res) => {
      console.log(res)
      this.providerList = res.data.map((ele) => {
        return {
          label: ele.userNickName,
          value: ele.providerId
        }
      })
    })
  },
  watch: {
    mobileAuthDialogVisible(v) {
      if (this.$refs.mobileAuthDialogVisibleRef) {
        if (v) {
          this.$refs.mobileAuthDialogVisibleRef.open('center')
        } else {
          this.$refs.mobileAuthDialogVisibleRef.close()
        }
      }
    },
    configOrderdialogVisible(v) {
      if (this.$refs.jieDanConfPopupRef) {
        if (v) {
          this.$refs.jieDanConfPopupRef.open('bottom')
        } else {
          this.$refs.jieDanConfPopupRef.close()
        }
      }
    },
    isShowTongjiDialog(v) {
      if (this.$refs.tongjiPopupRef) {
        if (v) {
          this.$refs.tongjiPopupRef.open('bottom')
        } else {
          this.$refs.tongjiPopupRef.close()
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
    showAccountInfoVisible(v) {
      if (this.$refs.showAccountInfoRef) {
        if (v) {
          this.$refs.showAccountInfoRef.open('bottom')
        } else {
          this.$refs.showAccountInfoRef.close()
        }
      }
    },
    showPatchDialogVisable(v) {
      if (this.$refs.showPathPopupRef) {
        if (v) {
          this.$refs.showPathPopupRef.open('bottom')
        } else {
          this.$refs.showPathPopupRef.close()
        }
      }
    },
    monitorDialogVisible(v) {
      if (this.$refs.closeMonitorDialogRef) {
        if (v) {
          this.$refs.closeMonitorDialogRef.open('bottom')
        } else {
          this.$refs.closeMonitorDialogRef.close()
        }
      }
    }
  },
  onUnload() {
    this.clearRefreshTimer()
  },
  methods: {
    showAliUid() {
      let aliHref = 'https://ur.alipay.com/17qF'
      window.location.href = aliHref
    },

    openAliPayAuth() {
      window.open(this.mobileAuthStr, '_blank')
    },

    closeMobileAuth() {
      this.mobileAuthDialogVisible = false
      this.mobileAuthStr = ''
      this.flushPage()
    },
    // async getProductById(productId) {
    //   let res = await getProductById(productId)
    //   this.formData.isOneTimeAccept = res.data.isOneTimeAccept
    // },

    // async oneTimeAcceptChange(e, row) {
    //   try {
    //     let res = await isOneTimeAcceptIsActive(row.payeeAccountId, e)
    //     console.log(res)
    //   } catch (err) {
    //     console.log(err)
    //   }
    //   this.flushPage()
    // },
    copyAgentInfo(msg) {
      uni.setClipboardData({
        data: `${msg}`,
        success: () => {
          uni.showToast({
            title: `复制成功${msg}`,
            icon: 'success'
          })
        }
      })
    },
    closeMonitorDialog() {
      this.monitorDialogVisible = false
      this.monitorData = ''
    },
    async showMonitorAddr(row) {
      this.monitorDialogVisible = true
      try {
        let ret = await getMonitorAddrInfo(row.payeeAccountId)
        this.monitorData = ret.data
      } catch (e) {
        console.log(e)
        uni.showToast({
          title: '获取失败',
          icon: 'none'
        })
        this.closeMonitorDialog()
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
    selectAll(e) {
      console.log('--select all --', e)
      if (e.length > 0) {
        this.selectRows = this.tableData.map((item) => item.payeeAccountId) // 全选
      } else {
        this.selectRows = [] // 全不选
      }
    },
    switchShowCheck() {
      this.showCheckboxes = !this.showCheckboxes
      this.selectRows = []
      this.isAllSelected = []
    },

    showMobileAuth(row) {
      let payeeAccountId = row.payeeAccountId
      getAliPayAuthUrl(payeeAccountId)
        .then((res) => {
          console.log('----getAliPayAuthUrl-----', res)
          this.mobileAuthStr = res.data.wapAuthUrl
          // openExternal(this.mobileAuthStr)
          this.mobileAuthDialogVisible = true
        })
        .catch((err) => {
          console.log(err)
          this.mobileAuthStr = ''
        })
    },

    async onConfigOrderBtnOk() {
      console.log('-----onConfigOrderBtnOk--hello--')
      // this.$refs.configOrderRef.validate(async (valid) => {
      //   console.log('-----valid----', valid)

      //   if (valid) {
      // 编辑
      const params = {
        tenantId: this.$store.state.tenantId,
        isActive: this.formData.isActive,
        limitAmountType: this.formData.limitAmountType,
        fixedAmount: this.formData.fixedAmount,
        minAmount: Number(this.formData.minAmount),
        maxAmount: Number(this.formData.maxAmount),
        dailyMaxAmount: Number(this.formData.dailyMaxAmount),
        dailyMaxCount: Number(this.formData.dailyMaxCount),
        payeeAccountExpireTimeType: this.formData.payeeAccountExpireTimeType,
        payeeAccountExpireTime: this.formData.payeeAccountExpireTime,
        payeeAccountExpireDuration: Number(
          this.formData.payeeAccountExpireDuration
        ),

        updatePayeeAccountExpireTime: true,
        updateLimitAmountType: true,
        updateDailyMaxAmount: true,
        updateDailyMaxCount: true
      }

      await updatePayeeAccountInfoBatch({
        ...params,
        payeeAccountIds: [this.formData.payeeAccountId]
      })

      this.$message.success('更新成功')

      this.onConfigOrderBtnCancel()
      this.flushPage()
      // }
      // })
    },
    onConfigOrderBtnCancel() {
      this.$refs.configOrderRef.clearValidate()
      this.configOrderdialogVisible = false
    },

    showConfigOrderDialog(row) {
      this.configOrderdialogVisible = true
      this.formData = Object.assign({}, row.acceptOrderConfig)
      this.formData.payeeAccountId = row.payeeAccountId
    },

    closeTongjiDialog() {
      this.isShowTongjiDialog = false
    },

    async showTongJi(row) {
      this.isShowTongjiDialog = true
      this.tongjiData = {
        ...row,
        totalOrderAmount: 0,
        totalOrderCount: 0,
        yesterdayOrderAmount: 0,
        yesterdayOrderCount: 0,
        todayOrderAmount: 0,
        todayOrderCount: 0
      }

      let res = await getPayeeAccountInfoCount(row.payeeAccountId)
      this.tongjiData = {
        ...row,
        ...res.data
      }
    },

    onSubNavClick(v) {
      this.queryFormData.isActive = v
      this.queryTableData()
    },
    onChangePayeeAccountExpireTimeType() {
      this.$refs.formPatchDataRef.clearValidate([
        'payeeAccountExpireTime',
        'payeeAccountExpireDuration'
      ])
    },

    datetimeChange(event) {
      console.log('datetimeChange : ', event)
    },
    onPatchDialogBtnOk() {
      console.log('-----onPatchDialogBtnOk--hello--')
      this.$refs.formPatchDataRef.validate().then(async (valid) => {
        console.log('-----valid----', valid)
        if (valid) {
          const params = {
            tenantId: this.$store.state.tenantId,
            isActive: this.formPatchData.isActive,
            // isOneTimeAccept: this.formPatchData.isOneTimeAccept,
            limitAmountType: this.formPatchData.limitAmountType,
            fixedAmount: this.formPatchData.fixedAmount,
            minAmount: Number(this.formPatchData.minAmount),
            maxAmount: Number(this.formPatchData.maxAmount),
            dailyMaxAmount: Number(this.formPatchData.dailyMaxAmount),
            dailyMaxCount: Number(this.formPatchData.dailyMaxCount),
            payeeAccountExpireTimeType:
              this.formPatchData.payeeAccountExpireTimeType,
            payeeAccountExpireTime: this.formPatchData.payeeAccountExpireTime,
            payeeAccountExpireDuration: Number(
              this.formPatchData.payeeAccountExpireDuration
            ),

            updatePayeeAccountExpireTime:
              this.formPatchData.updatePayeeAccountExpireTime == 1,
            updateLimitAmountType:
              this.formPatchData.updateLimitAmountType == 1,
            updateDailyMaxAmount: this.formPatchData.updateDailyMaxAmount == 1,
            updateDailyMaxCount: this.formPatchData.updateDailyMaxCount == 1
          }

          if (this.isModAll) {
            await updateAllPayeeAccountInfo({
              ...params
            })
          } else {
            await updatePayeeAccountInfoBatch({
              ...params,
              payeeAccountIds: this.selectRows
            })
          }

          this.onPatchDialogBtnCancel()
          this.flushPage()
        }
      })
    },

    onPatchDialogBtnCancel() {
      this.showPatchDialogVisable = false
      // this.$refs.formPatchDataRef.resetFields()
    },

    showPatchDialog(isModAll) {
      this.isModAll = isModAll // 是否是全部修改

      this.formPatchData = {
        isActive: null, // 0 保持不变  1  开启   2  关闭
        // isOneTimeAccept: null, // 0 保持不变  1  开启   2  关闭
        limitAmountType: 0, // 0 无限制  1  固定金额   2 范围金额

        updateLimitAmountType: 0,
        updateDailyMaxAmount: 0,
        updateDailyMaxCount: 0,
        updatePayeeAccountExpireTime: 0,
        payeeAccountExpireTimeType: 0
      }

      this.showPatchDialogVisable = true
    },

    download(item) {
      // uni.downloadFile({
      //   url: item.url, //仅为示例，并非真实的资源
      //   success: (res) => {
      //     console.log('下载成功', res)
      //     if (res.statusCode === 200) {
      //       uni.saveFile({
      //         tempFilePath: res.tempFilePath,
      //         success: function (res) {
      //           console.log('保存成功',res)
      //         }
      //       })
      //     }
      //   }
      // })
      downloadFile(item.url, item.name)
    },
    async showIncomeInfo(row) {
      this.showAccountInfoVisible = true

      this.formData = Object.assign({}, row)

      const res = await getPayeeAccountInfoById(row.payeeAccountId)

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
      this.$forceUpdate()
    },

    async showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true

      this.formData = Object.assign({}, row)

      const res = await getPayeeAccountInfoById(row.payeeAccountId)

      const qrConfig = res.data.qrConfig
      qrConfig.fileId = qrConfig.qrUrl // 其实是 fileId

      if (qrConfig.parseType == null) {
        // 新增时,没有,默认 0
        qrConfig.parseType = 0
        qrConfig.fileList = []
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

      if (res.data.files && res.data.files.length > 0) {
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

      // 处理按钮, 将按钮展开，
      const temp_data = {}
      if (res.data.buttons && res.data.buttons.length > 0) {
        res.data.buttons.forEach((item) => {
          item.buttonParamList.forEach((item2) => {
            temp_data[`buttonParamList_${item2.buttonParamId}`] =
              item2.buttonParamValue
          })
        })
      }

      this.formData = {
        ...this.formData, // 原始数据
        payeeAccountConfig: {
          texts: res.data.texts,
          buttons: res.data.buttons,
          qrConfig: qrConfig,
          files: res.data.files
        },
        ...temp_data
      }

      this.$forceUpdate()
    },

    handleQrConfigChanged() {
      this.$refs.formDataRef.clearValidate([
        'payeeAccountConfig.qrConfig.qrUrl',
        'payeeAccountConfig.qrConfig.parseValue'
      ])
      this.formData.payeeAccountConfig.qrConfig.qrUrl = undefined
      this.formData.payeeAccountConfig.qrConfig.parseValue = ''
      this.formData.payeeAccountConfig.qrConfig.GenerQrUrl = undefined
      this.formData.payeeAccountConfig.qrConfig.fileList = []
      this.qrImageUrl = undefined
      this.$forceUpdate()
    },
    generateQrCodeImg() {
      // if (this.formData.payeeAccountConfig.qrConfig.GenerQrUrl) {
      //   // 现在已经有了，重新生成
      //   this.formData.payeeAccountConfig.qrConfig.GenerQrUrl = undefined
      //   this.formData.payeeAccountConfig.qrConfig.parseValue = undefined
      //   this.formData.payeeAccountConfig.qrConfig.qrUrl = undefined
      //   return false
      // }

      this.$refs.formDataRef.validateField(
        'payeeAccountConfig.qrConfig.parseValue',
        async (error) => {
          if (!error) {
            console.log('---generateQrCodeImg--ok-')

            const ret = await handleUploadDataToQrCode(
              this.formData.payeeAccountConfig.qrConfig.parseValue
            )
            console.log(ret)

            let resp = await getFileById(ret.data)
            console.log('--resp----', resp)

            // 根据数据生成的二维码图片地址
            this.formData.payeeAccountConfig.qrConfig.fileId = ret.data // fileId
            this.formData.payeeAccountConfig.qrConfig.GenerQrUrl =
              resp.data.fileUrl
            this.$forceUpdate()
          } else {
            console.log('---generateQrCodeImg--error-')
          }
        }
      )
    },
    // 删除图片
    deletePic(file) {
      console.log('----file----', file)
      this.formData.payeeAccountConfig.qrConfig.fileList.splice(file.index, 1)
      this.qrImageUrl = undefined
    },
    deleteFile(file, index) {
      console.log('----file--index--', file, index)
      this.formData.payeeAccountConfig.files[index].fileList = []
    },
    async afterReadFile(event, index) {
      console.log('----event--index--', event, index)
      // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
      // let lists = [].concat(event.file)
      let lists = [event]

      let fileListLen =
        this.formData.payeeAccountConfig.files[index].fileList.length

      lists.map((item) => {
        this.formData.payeeAccountConfig.files[index].fileList.push({
          ...item,
          status: 'uploading',
          message: '上传中'
        })
      })

      for (let i = 0; i < lists.length; i++) {
        console.log('----lists[i].url----', lists[i].url)

        let result = await this.uploadFilePromise(lists[i].url)
        result = JSON.parse(result)

        console.log('----result----', result)
        console.log('---typeof-result----', typeof result)

        this.formData.payeeAccountConfig.files[index].fileUrl = result[0].url

        let item =
          this.formData.payeeAccountConfig.files[index].fileList[fileListLen]
        this.formData.payeeAccountConfig.files[index].fileList.splice(
          fileListLen,
          1,
          Object.assign(item, {
            status: 'success',
            message: '',
            url: result[0].url
          })
        )
        fileListLen++
      }
    },

    async afterRead(event) {
      console.log('--afterRead--event----', event)

      // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
      let lists = [].concat(event.file)
      let fileListLen =
        this.formData.payeeAccountConfig.qrConfig.fileList.length

      lists.map((item) => {
        this.formData.payeeAccountConfig.qrConfig.fileList.push({
          ...item,
          status: 'uploading',
          message: '上传中'
        })
      })
      const index = 0 // 只用一个文件
      console.log('---lists[index]---', lists[index])
      let response = await this.uploadFilePromise(lists[index].url)

      console.log('----response----', response)
      console.log('---typeof-response----', typeof response)

      if (response && response.data) {
        let ret = await getFileById(response.data)
        console.log(ret)
        this.formData.payeeAccountConfig.qrConfig.fileId = response.data // fileId

        this.formData.payeeAccountConfig.qrConfig.qrUrl = ret.data.fileUrl
        this.formData.payeeAccountConfig.qrConfig.fileUrl = ret.data.fileUrl

        this.qrImageUrl = ret.data.fileUrl
        // this.$set(
        //   this.formData.payeeAccountConfig.qrConfig,
        //   'fileUrl',
        //   ret.data.fileUrl
        // )
        let item = this.formData.payeeAccountConfig.qrConfig.fileList[0]

        this.formData.payeeAccountConfig.qrConfig.fileList.splice(
          0,
          1,
          Object.assign(item, {
            status: 'success',
            message: '',
            url: ret.data.fileUrl
          })
        )
      } else {
        console.error('上传文件出错，data 为空')
        // this.$set(this.formData.payeeAccountConfig.files[index], 'fileUrl', [])
        this.formData.payeeAccountConfig.qrConfig.fileList = []
        this.qrImageUrl = undefined
      }

      // this.formData.payeeAccountConfig.qrConfig.qrUrl = result[0].url
    },
    async uploadFilePromise(filePath) {
      try {
        if (this.formData.payeeAccountConfig.qrConfig.parseType == 0) {
          let res = await uploadFileToServer(filePath)
          console.log('----uploadFileToServer------', res)
          return res
        } else if (this.formData.payeeAccountConfig.qrConfig.parseType == 1) {
          let res = await handleUploadParseFileToServer(filePath)
          console.log('----handleUploadParseFileToServer------', res)
          return res
        } else {
          console.error(
            'parseType 错误 ',
            this.formData.payeeAccountConfig.qrConfig.parseType
          )
        }
      } catch (e) {
        console.log(e)
      }
    },
    handleProductChanged(e) {
      console.log('--handleProductChanged---', e)
      // this.getProductById(e)
      // this.loadingInfo = true
      this.qrImageUrl = undefined // 重置配置
      getPayeeAccountInfoByProductId(e)
        .then((res) => {
          // 处理按钮 空参数 问题
          if (res.data.buttons) {
            res.data.buttons = res.data.buttons.map((item) => {
              if (item.buttonParamList && item.buttonParamList.length > 0) {
                item.buttonParamList = item.buttonParamList.filter(
                  (ele) => ele.buttonParamId
                )
              }
              return item
            })
          }

          this.payeeAccountConfig = res.data

          this.formData = {
            ...this.formData,
            payeeAccountConfig: {
              ...res.data,
              qrConfig: {
                ...res.data.qrConfig,
                qrUrl: '', // 上传图片 得到的  二维码图片地址
                parseType: 0, // 二维码配置索引 0 原图 1 上传并解析 2 直接配置数据
                parseValue: '', // 输入的数据
                GenerQrUrl: '', // 生成的二维码图片地址
                fileList: []
              }
            }
          }
        })
        .catch((err) => {
          console.log('error----', err)
          this.loadingInfo = false
        })
        .finally(() => {
          console.log('----finally----')
          this.loadingInfo = false
        })
    },
    showConfirmDelete(item) {
      uni.showModal({
        title: '提示',
        content: '确认要删除吗？',
        success: async (res) => {
          if (res.confirm) {
            await deletePayeeAccountInfo(item.payeeAccountId)
            this.$message.success('删除成功')
            this.flushPage()
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        }
      })
    },
    showAddDialog() {
      console.log('-----showAddDialog------')
      this.dialogVisible = true
      this.isEdit = false
      this.formData = {
        // isOneTimeAccept: 0,
        // providerId: this.providerList.length > 0 ? this.providerList[0].value : '' // 新增时，默认选择第一个
      }
    },
    async onSwitchChange(e, row) {
      console.log(e)
      // 之前开的，现在关了
      if (e == 0) {
        try {
          // 先判断是否有使用的订单
          let ret = await isExistCollectorderTaken(row.payeeAccountId)
          if (ret.data) {
            uni.showModal({
              title: '提示',
              content: '有订单正在使用，确定要关闭吗？',
              cancelText: '取消',
              confirmText: '确定',
              success: async () => {
                await payeeAccountInfoEnable(row.payeeAccountId, e)
                this.flushPage()
              },
              fail: () => {
                // 取消
                row.acceptOrderConfig.isActive = 1
              }
            })
          } else {
            // 上面出错了，直接修改
            let res = await payeeAccountInfoEnable(row.payeeAccountId, e)
            console.log(res)
          }
        } catch (err) {
          // 上面出错了，直接修改
          let res = await payeeAccountInfoEnable(row.payeeAccountId, e)
          console.log(res)
        }
      } else {
        // 从关到开，直接修改
        await payeeAccountInfoEnable(row.payeeAccountId, e)
        this.flushPage()
      }
    },
    onDialogBtnCancel() {
      console.log('----onDialogBtnCancel-----')
      this.$refs.formDataRef.clearValidate()
      this.dialogVisible = false
      this.isPayeeAccountNameExist = false
      this.formData = {
        // isOneTimeAccept: 0
      }
    },
    onDialogBtnOk() {
      console.log('onDialogBtnOk--', this.formData)

      // 如果填 写了数据，但没有生成 二维码，提示，请先生成二维码
      if (
        this.formData.payeeAccountConfig.qrConfig.parseType == 2 &&
        !this.formData.payeeAccountConfig.qrConfig.GenerQrUrl &&
        this.formData.payeeAccountConfig.qrConfig.parseValue.length > 0
      ) {
        this.$message.error('请先生成二维码')
        return false
      }

      this.$refs.formDataRef
        .validate()
        .then(async () => {
          if (this.isEdit) {
            // 编辑
            const eidtParams = this.procPayeeAccountInfoEditParams()
            await updatePayeeAccountInfo(eidtParams)
            this.$message.success('更新成功')
          } else {
            // 新增

            // 减化数据
            const paramData = this.procPayeeAccountInfoParams()
            await addPayeeAccountInfo({
              tenantId: this.$store.state.tenantId, // 租户id,超管端必传,示例值(1)
              providerId: this.$store.state.personalInfo.providerId,
              productId: this.formData.productId,
              payeeAccountName: this.formData.payeeAccountName,
              // isOneTimeAccept: this.formData.isOneTimeAccept,
              payeeAccountConfig: paramData
            })
            this.$message.success('新增成功')
          }

          this.onDialogBtnCancel()
          this.flushPage()
        })
        .catch((err) => {
          console.log('验证失败', err)
          console.log(this.queryFormData)
          this.$message.error('输入不正确，请检查')
        })
    },

    procPayeeAccountInfoEditParams() {
      const configData = this.formData.payeeAccountConfig

      if (
        configData.qrConfig.parseType == 2 &&
        configData.qrConfig.GenerQrUrl
      ) {
        // 上传图片 得到的  二维码图片地址
        configData.qrConfig.qrUrl = configData.qrConfig.GenerQrUrl
      }

      // 获得所有的 buttonParams
      const allButtonParams = {}
      Object.keys(this.formData).forEach((key) => {
        if (key.startsWith('buttonParamList_')) {
          allButtonParams[key.replace('buttonParamList_', '')] =
            this.formData[key]
        }
      })

      const payeeAccountConfig = {
        payeeAccountId: this.formData.payeeAccountId,
        texts: configData.texts
          ? configData.texts.map((ele) => {
              return {
                payeeAccountTextId: ele.payeeAccountTextId,
                textValue: ele.textValue
              }
            })
          : configData.texts,
        buttons: configData.buttons
          ? configData.buttons.map((ele) => {
              return {
                payeeAccountButtonId: ele.payeeAccountButtonId,
                buttonUrl: ele.buttonUrl,
                resultButtonUrl: ele.resultButtonUrl,
                buttonParamList: ele.buttonParamList
                  ? ele.buttonParamList.map((param) => {
                      return {
                        payeeAccountButtonParamId:
                          param.payeeAccountButtonParamId,
                        paramCode: param.paramCode,
                        buttonParamValue: allButtonParams[param.buttonParamId]
                      }
                    })
                  : ele.buttonParamList
              }
            })
          : configData.buttons,
        qrConfig: configData.qrConfig
          ? {
              payeeAccountQrId: configData.qrConfig.payeeAccountQrId,
              isActive: configData.qrConfig.isActive,
              qrUrl: configData.qrConfig.fileId, // 保存时，上传 fileId
              parseValue: configData.qrConfig.parseValue,
              parseType: configData.qrConfig.parseType
            }
          : configData.qrConfig,
        files: configData.files
          ? configData.files.map((ele) => {
              return {
                payeeAccountFileId: ele.payeeAccountFileId,
                fileUrl: ele.fileId // 保存时，上传 fileId
              }
            })
          : configData.files
      }
      return payeeAccountConfig
    },

    procPayeeAccountInfoParams() {
      const configData = this.formData.payeeAccountConfig

      if (
        configData.qrConfig.parseType == 2 &&
        configData.qrConfig.GenerQrUrl
      ) {
        // 上传图片 得到的  二维码图片地址
        configData.qrConfig.qrUrl = configData.qrConfig.GenerQrUrl
      }
      // 获得所有的 buttonParams
      const allButtonParams = {}
      Object.keys(this.formData).forEach((key) => {
        if (key.startsWith('buttonParamList_')) {
          allButtonParams[key.replace('buttonParamList_', '')] =
            this.formData[key]
        }
      })

      console.log(allButtonParams)

      const payeeAccountConfig = {
        // payeeAccountId: 1,
        texts: configData.texts
          ? configData.texts.map((ele) => {
              return {
                textConfigId: ele.textConfigId,
                textValue: ele.textValue
              }
            })
          : configData.texts,

        buttons: configData.buttons
          ? configData.buttons.map((ele) => {
              return {
                buttonConfigId: ele.buttonConfigId,
                buttonUrl: ele.buttonUrl,
                buttonParamList: ele.buttonParamList
                  ? ele.buttonParamList.map((param) => {
                      return {
                        buttonParamId: param.buttonParamId,
                        paramCode: param.paramCode,
                        buttonParamValue: allButtonParams[param.buttonParamId]
                      }
                    })
                  : ele.buttonParamList
              }
            })
          : configData.buttons,

        qrConfig: configData.qrConfig
          ? {
              qrConfigId: configData.qrConfig.qrConfigId,
              isActive: configData.qrConfig.isActive,
              qrUrl: configData.qrConfig.fileId, // 保存时，上传 fileId
              parseValue: configData.qrConfig.parseValue,
              parseType: configData.qrConfig.parseType
            }
          : configData.qrConfig,
        files: configData.files
          ? configData.files.map((ele) => {
              return {
                fileConfigId: ele.fileConfigId,
                fileUrl: ele.fileId // 保存时，上传 fileId
              }
            })
          : configData.files
      }
      return payeeAccountConfig
    },

    flushPage() {
      this.queryTableData()
      this.showCheckboxes = false // 隐藏复选框
      this.isAllSelected = [] // 取消全选
      this.selectRows = [] // 清空选中的复选框的值
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
          // this.queryFormData[key] !== ''
          this.queryFormData[key] !== undefined
        ) {
          if (key == 'createTime') {
            // params['startTime'] = this.queryFormData['expireTime'][0]
            // params['endTime'] = this.queryFormData['expireTime'][1]
            params.dateRangeQuery = {
              startTime: this.queryFormData['createTime'][0],
              endTime: this.queryFormData['createTime'][1]
            }
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })
      // this.refreshTriggered = true
      let res = await getPayeeAccountInfoListPageByProvider(this.page, params)
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

      const lastActive =
        this.queryFormData != undefined &&
        this.queryFormData.isActive != undefined
          ? this.queryFormData.isActive
          : ''

      return {
        productId: '',
        isAvailable: '',
        isActive: lastActive,
        // createTime: [startStr, endStr]
        createTime: []
      }
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

.modify-box {
  align-items: center;

  .u-button--primary {
    margin: 0;
    width: 240rpx;
    height: 60rpx;
  }
}

.no-modify {
  .u-button {
    width: auto;
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
    background-image: linear-gradient(
      to right,
      #ae9281 0%,
      #fff6ed 50%,
      #edd0be 100%
    );
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

  .checkbox-wrapper {
    padding: 20rpx;
  }

  ::v-deep .u-button--normal {
    padding: 0 10rpx;
    font-size: 24rpx;
  }

  .order-card {
    padding: 0;
    margin: 20rpx;

    .card-header {
      display: flex;
      padding: 0 40rpx;
      align-items: center;
      height: 72rpx;
      background-image: linear-gradient(
        to right,
        #ae9281 0%,
        #fff6ed 50%,
        #edd0be 100%
      );
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
          width: 240rpx;
        }

        .info-value {
          margin-right: 0;
        }
      }
    }

    .card-footer {
      padding-top: 0;
      gap: 10rpx;
      padding: 10rpx;

      .action-btn {
        border-color: #ebedf0 !important;
        padding-left: 50rpx;
        padding-right: 15rpx;
        box-sizing: border-box;
        font-size: 24rpx;
      }

      .u-button {
        flex: 1;
      }

      .peizhi::after,
      .huabo::after,
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
  background-image: linear-gradient(
    to top,
    #6bbcff 0%,
    #0d92ff 100%
  ) !important;

  .u-tag__text {
    color: #fff !important;
  }
}

::v-deep .u-tag-- {
  background-image: linear-gradient(
    to top,
    #52cabc 0%,
    #41b5a8 100%
  ) !important;

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

.item-value {
  height: 100%;
  display: flex;
  align-items: center;
}

.order-list .info-row .info-label {
  // background-color: aqua;
  // display: block;
  width: 220rpx;
}

.trgger-box {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #8c939d;
  width: 100rpx;
  height: 100rpx;
  border: 1rpx solid #ccc;
}

::v-deep .modify-all {
  .uni-forms-item__content {
    display: flex;
    align-items: center;
  }
}

.warn_tip {
  padding: 0 0 20px;
  color: red;
}
</style>