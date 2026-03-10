<template>
  <div class="container">
    <el-card>
      <el-form
        ref="queryFormDataRef"
        :rules="queryRules"
        :inline="true"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="码商名称" prop="">
          <el-select
            v-model="queryFormData.providerId"
            filterable
            placeholder="请选择码商"
            size="small"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in providerList"
              :key="item.providerId"
              :label="item.userNickName"
              :value="item.providerId"
            />
          </el-select>
        </el-form-item>

         <!-- <el-form-item label="码商级别" prop="level">
          <el-input
            v-model="queryFormData.level"
            placeholder="请输入码商级别"
            clearable
            size="small"
          />
        </el-form-item> -->


        <el-form-item label="产品名称" prop="">
          <el-select
            v-model="queryFormData.productId"
            filterable
            placeholder="请选择产品名称"
            size="small"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in productList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            />
          </el-select>
        </el-form-item>

        
        <el-form-item label="收款码名称" prop="payeeAccountName">
          <el-autocomplete
            v-model="queryFormData.payeeAccountName"
            :fetch-suggestions="queryPayeeAccountSuggestions"
            placeholder="请输入收款信息名称"
            clearable
            size="small"
            :trigger-on-focus="true"
            @select="handlePayeeAccountSelect"
            @clear="handlePayeeAccountClear"
          />
        </el-form-item>

        <el-form-item label="是否可用" prop="">
          <el-select
            v-model="queryFormData.isAvailable"
            filterable
            placeholder="请选择是否可用"
            size="small"
          >
            <el-option label="全部" value="" />
            <el-option label="可用" :value="1" />
            <el-option label="不可用" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="">
          <el-select
            v-model="queryFormData.isActive"
            filterable
            placeholder="请选择是否启用"
            size="small"
          >
            <el-option label="全部" value="" />
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>

         <el-form-item label="不可用原因" prop="">
          <el-autocomplete
            v-model="queryFormData.unavailableReason"
            :fetch-suggestions="queryUnavailableReason"
            placeholder="请输入收款码名称"
            clearable
            size="small"
            :trigger-on-focus="true"
            @select="handleUnavailableReason"
            @clear="handleUnavailableReasonClear"
          />
        </el-form-item>


        <el-form-item label="备注" prop="remark">
          <el-autocomplete
            v-model="queryFormData.remark"
            :fetch-suggestions="queryRemark"
            placeholder="请输入收款码名称"
            clearable
            size="small"
            :trigger-on-focus="true"
            @select="handleRemark"
            @clear="handleRemarkClear"
          />
         
        </el-form-item>

        <el-form-item label="创建时间" prop="">
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
            :picker-options="myPickerOptionsAll"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
            >搜索</el-button
          >
          <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-10">
      <div style="display: flex; gap: 15px; align-items: center">
        <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()"
          >新增</el-button
        >

        <el-button
          type="success"
          :disabled="selectionRows.length == 0"
          icon="el-icon-edit-outline"
          size="mini"
          @click="patchActive(true)"
          >批量开启</el-button
        >

        <el-button
          type="danger"
          :disabled="selectionRows.length == 0"
          icon="el-icon-edit-outline"
          size="mini"
          @click="patchActive(false)"
          >批量关闭</el-button
        >

        <el-button
          type="primary"
          :disabled="selectionRows.length == 0"
          plain
          icon="el-icon-edit"
          @click="showPatchDialog(false)"
          >批量修改</el-button
        >

        <el-button
          type="danger"
          :disabled="selectionRows.length == 0"
          plain
          icon="el-icon-edit-outline"
          @click="deleteAll()"
          >批量删除</el-button
        >

        <!-- <el-button type="primary" plain icon="el-icon-plus" @click="addPatch()">批量新增</el-button> -->
        <!-- <el-button
        type="success"
        :disabled="selectionRows.length == 0"
        plain
        icon="el-icon-edit-outline"
        @click="optAll(true)"
        >批量开启</el-button
      >
      <el-button
        type="danger"
        :disabled="selectionRows.length == 0"
        plain
        icon="el-icon-edit-outline"
        @click="optAll(false)"
        >批量关闭</el-button
      > -->

        <el-button
          :disabled="selectionRows.length !== 1"
          type="success"
          plain
          icon="el-icon-lock"
          @click="showMobileAuth()"
          >支付宝授权</el-button
        >

        <el-button type="primary" plain icon="el-icon-user" @click="showAliUid = true"
          >获取支付宝UID</el-button
        >

        <el-button type="success" plain icon="el-icon-download" @click="exportReport()"
          >导出</el-button
        >
        <!-- <el-button type="primary" plain icon="el-icon-plus" @click="showPatchDialog(true)"
        >全部修改</el-button
      > -->
      </div>

      <my-table
        ref="tableRef"
        class="mt-10"
        :load-data="loadTableData"
        :table-data="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" />
        <el-table-column label="序号" align="center" width="40">
          <template slot-scope="{ $index }">
            {{ page.pageSize * (page.pageNum - 1) + $index + 1 }}
          </template>
        </el-table-column>

        <el-table-column label="是否可用" align="center" width="110">
          <template slot-scope="{ row }">
            <div>
              <div
                style="
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                  line-height: 15px;
                "
              >
                <el-tooltip
                  v-if="!row.isAvailable"
                  class="item"
                  effect="dark"
                  :content="row.unavailableReason"
                  placement="top"
                >
                  <svg-icon icon-class="tanhao" style="font-size: 24px" class="hand" />
                </el-tooltip>

                <span>{{ row.isAvailable ? '可用' : '不可用' }}</span>

                <RefreshIcon
                  v-if="row.isAvailable == 0"
                  :payeeAccountId="row.payeeAccountId"
                  :isAvailable.sync="row.isAvailable"
                  @availableChange="flushPage()"
                />
              </div>
              <div class="help-tip mt-5">{{ row.unavailableReason }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="收款信息" align="center" prop="userName" min-width="200">
          <template slot-scope="{ row }">
            <div style="display: flex; gap: 5px; justify-content: space-between;">
              <el-tag type="primary">码商</el-tag>
              <div style="cursor: pointer"
                @click="
                  (e) => {
                    clipboard(row.userNickName, e)
                  }
                " >
                {{ row.userNickName }}
              </div>
              <div>
                <el-tag v-if="row.isActiveProvider == 1" type="success" size="mini">启用</el-tag>
                <el-tag v-else type="danger" size="mini">关闭</el-tag>
              </div>
            </div>

            <div style="display: flex; gap: 5px; margin: 10px 0;  justify-content: space-between;">
              <el-tag type="primary">产品</el-tag>
              <div style="cursor: pointer"
                @click="
                  (e) => {
                    clipboard(row.productName, e)
                  }
                " >
                {{ row.productName }}
              </div>
              <div>
                <el-tag v-if="row.isActiveProduct == 1" type="success" size="mini"  >启用</el-tag>
                <el-tag v-else type="danger">关闭</el-tag>
              </div>
            </div>

            <div style="display: flex; gap: 5px; align-items: center; justify-content: space-between;">
              <el-tag type="primary">收款码</el-tag>
              <div style="cursor: pointer"
                @click="
                  (e) => {
                    clipboard(row.payeeAccountName, e)
                  }
                " >
                {{ row.payeeAccountName }}
              </div>
              <el-button type="text" size="mini" class="hand" @click="checkIncomeInfo(row)"
                >查看</el-button
              >
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="产品名称" align="center" prop="productName">
          <template slot-scope="{ row }">
            <div>
              {{ row.productName }}
            </div>
            <div>
              <el-tag v-if="row.isActiveProduct == 1" type="success">启用</el-tag>
              <el-tag v-else type="danger">关闭</el-tag>
            </div>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="收款码名称" align="center" prop="payeeAccountName" width="120">
          <template slot-scope="{ row }">
            <div>
              {{ row.payeeAccountName }}
            </div>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="租户名称" align="center" prop="tenant_id" width="85" /> -->

        <!-- <el-table-column label="收款信息" align="center">
          <template slot-scope="{ row }">
             <div>
              {{ row.payeeAccountName }}
            </div>
            <el-button type="text" size="mini" class="hand" @click="checkIncomeInfo(row)"
              >查看</el-button
            >
          </template>
        </el-table-column> -->
        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.acceptOrderConfig.isActive"
              @change="(e) => onSwitchChange(e, row)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column label="接单下线" align="center" width="130">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isOneTimeAccept" @change="(e) => oneTimeAcceptChange(e, row)" />
          </template>
        </el-table-column> -->

        <!-- 限额类型（0-无限制，1-固定金额，2-范围金额） -->
        <el-table-column label="金额限制类型" align="center" min-width="110">
          <template slot-scope="{ row }">
            <span v-if="row.acceptOrderConfig.limitAmountType == '0'">无限制</span>

            <el-tag v-else-if="row.acceptOrderConfig.limitAmountType == '1'" size="small">{{
              row.acceptOrderConfig.fixedAmount
            }}</el-tag>

            <span v-if="row.acceptOrderConfig.limitAmountType == '2'">
              <el-tag style="padding: 0 5px;"  size="small">{{ row.acceptOrderConfig.minAmount }}</el-tag> ~
              <el-tag style="padding: 0 5px;"  size="small">{{ row.acceptOrderConfig.maxAmount }}</el-tag>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="当日限制" align="center" min-width="120">
          <template slot-scope="{ row }">
            <div
              v-if="
                row.acceptOrderConfig.dailyMaxAmount == 0 &&
                row.acceptOrderConfig.dailyMaxCount == 0
              "
            >
              无限制
            </div>
            <div v-else>
              最大金额:{{
                row.acceptOrderConfig.dailyMaxAmount == 0
                  ? '无限制'
                  : row.acceptOrderConfig.dailyMaxAmount
              }}
              <br />
              最大订单数:{{
                row.acceptOrderConfig.dailyMaxCount == 0
                  ? '无限制'
                  : row.acceptOrderConfig.dailyMaxCount
              }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="当日剩余" align="center" width="120">
          <template slot-scope="{ row }">
            <div>
              可用金额:{{ row.daily_available_amount }} <br />
              可用订单数:{{ row.daily_available_count }}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="授权状态" align="center" min-winth="120"  v-if="!isSaDan"    >
          <template slot-scope="{ row }">
            <el-tag style="margin-right:0;"  v-if="row.authStatus == 1" type="success">已授权</el-tag>
            <el-tag style="margin-right:0;" v-else-if="row.authStatus == 0" type="danger">未授权</el-tag>
            <el-tag style="margin-right:0;" v-else-if="row.authStatus == 2" type="danger">未监控</el-tag>
            <el-tag style="margin-right:0;" v-else-if="row.authStatus == 3" type="success">已监控</el-tag>

            <div  class="mt-10 ta-c"   v-if="row.authStatus == 1 && row.uid">
              <el-tag type="success" style="padding-right:0px; padding-left: 0px; "  >支付宝UID</el-tag>
              <div>
                <span
                style="cursor: pointer"
                @click="
                  (e) => {
                    clipboard(row.uid, e)
                  }
                "
                >{{ row.uid }}</span
              >
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" min-width="130px">
          <template slot-scope="{ row }">
            <div style="display: flex; justify-content: center;  ">
              <!-- <span>创建：</span> -->
               <span> {{ row.createTime }} </span>
            </div>
            <!-- <div style="display: flex;"  class="mt-10"  >
              <span>过期：</span>
              <span> {{ row.acceptOrderConfig.payeeAccountExpireTime }} </span>
            </div> -->
          </template>
        </el-table-column>

        <el-table-column label="今日成功订单信息" align="center" min-width="130" v-if="!isSaDan" >
          <template slot-scope="{ row }">
            <!-- <div class="tongji-item">
              <el-tag class="tongji-txt" type="primary">累计:</el-tag>
              <span class="count">{{ row.totalOrderCount }}</span
              ><span>单</span> <span class="amount">{{ row.totalOrderAmount }}</span
              ><span>元</span>
            </div>

            <div style="margin: 10px 0" class="tongji-item">
              <el-tag class="tongji-txt" type="success">昨日:</el-tag>
              <span class="count">{{ row.yesterdayOrderCount }}</span
              ><span>单</span> <span class="amount">{{ row.yesterdayOrderAmount }}</span
              ><span>元</span>
            </div>

            <div class="tongji-item">
              <el-tag class="tongji-txt" type="danger">今日:</el-tag>
              <span class="count">{{ row.todayOrderCount }}</span
              ><span>单</span> <span class="amount">{{ row.todayOrderAmount }}</span
              ><span>元</span>
            </div>

            <div class="tongji-item mt-10 ">
              <el-tag class="tongji-txt" type="info"  style="color: #606266;" >当前接单金额:</el-tag>
               <span class="amount">{{ row.businessAmount }}</span
              ><span>元</span>
            </div> -->
            <div class="tongji-item">
              <el-tag class="tongji-txt" type="primary" >成功单数：</el-tag>
              <span class="amount">{{ row.todayOrderCount }}</span>
              <span>笔</span>
            </div>
            <div class="tongji-item mt-10">
              <el-tag class="tongji-txt" type="primary" >成功金额：</el-tag>
              <span class="amount">{{ row.todayOrderAmount }}</span>
              <span>元</span>
            </div>
            <div class="tongji-item mt-10">
              <el-tag class="tongji-txt" type="primary" >接单金额：</el-tag>
              <span class="amount">{{ row.businessAmount }}</span>
              <span>元</span>
            </div>

            <div class="tongji-item mt-10">
              <el-tag class="tongji-txt" type="primary" >接单次数：</el-tag>
              <span class="amount">{{ row.totalAcceptOrderCount  }}</span>
              <span>笔</span>
            </div>


          </template>
        </el-table-column>

        <el-table-column label="备注" align="center" prop="remark" />

        

        <!-- <el-table-column label="过期时间" align="center" prop="payeeAccountExpireTime" width="90px">
          <template slot-scope="{ row }">
            <span
              v-html="row.acceptOrderConfig.payeeAccountExpireTime.replace(' ', '<br/>')"
            ></span>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="处理中金额" align="center" prop="businessAmount" /> -->

        <el-table-column align="center" label="操作" width="110" fixed="right" >
          <template slot-scope="{ row }">
            <div class="opt">
              <!-- <div type="success" class="btn" @click="showConfigOrderDialog(row)">
                <i class="el-icon-edit" />接单配置
              </div> -->
              <div type="success" class="btn" @click="showMobileAuth(row)" v-if="!isSaDan" >
                <i class="el-icon-edit" />支付宝授权
              </div>

              <!-- <div type="success" class="btn" @click="loginWeiXin(row)">
                <i class="el-icon-edit" />微信登录
              </div> -->

              <div type="success" class="btn" @click="showMonitorAddr(row)" v-if="!isSaDan" >
                <i class="el-icon-edit" />监控地址
              </div>

              <div type="success" class="btn" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
              <div type="primary" class="btn" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改收款信息' : '新增收款信息'"
      width="720px"
    >
      <div v-loading="isDialogLoading">
        <CreateIncomeInfo
          ref="formDataRef"
          :form-data="formData"
          :income-info-rules="incomeInfoRules"
          :payee-account-name-rules="payeeAccountNameRules"
          :provider-list="providerList"
          :provider-product-list="providerProductList"
          :is-edit="isEdit"
          :product-loading="productLoading"
          :loading-info="loadingInfo"
          :is-payee-account-name-exist="isPayeeAccountNameExist"
          :qr-image-url="qrImageUrl"
          :before-upload="beforeUpload"
          :upload-image="uploadImage"
          :handle-qr-config-success="handleQrConfigSuccess"
          :handle-qr-config-remove="handleQrConfigRemove"
          :handle-qr-config-error="handleQrConfigError"
          :before-upload-file="beforeUploadFile"
          :upload-config-file="uploadConfigFile"
          :handle-file-success="handleFileSuccess"
          :handle-file-remove="handleFileRemove"
          :on-provider-change="handleProviderChanged"
          :on-product-change="handleProductChanged"
          :on-qr-config-change="handleQrConfigChanged"
          :on-generate-qr="generateQrCodeImg"
          @first-text-multiple="handleFirstTextMultiple"
        />
        <ReceiveOrderConf
          ref="acceptOrderRef"
          :form-data="acceptOrderForm"
          :show-is-active="true"
          :form-rules="incomeInfoRules"
          :min-amount-rules="acceptMinAmountRules"
          :max-amount-rules="acceptMaxAmountRules"
          label-width="140px"
          form-style="margin: 0 30px"
          @expire-type-change="(form) => onAcceptExpireTypeChange('acceptOrderRef', form)"
        />
      </div>
      <div slot="footer">
        <el-button size="small" @click="onDialogBtnCancel()"> 取消 </el-button>
        <el-button type="primary" size="small" @click="onDialogBtnOk()"
          :disabled="$store.state.app.loading"
        > 确定 </el-button>
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
            {{ formData.userName }}
          </div>
        </el-form-item>

        <el-form-item label="收款码名称">
          <div>{{ formData.payeeAccountName }}</div>
        </el-form-item>

        <el-form-item label="产品名称">
          <div>
            {{ formData.productName }}
          </div>
        </el-form-item>

        <el-form-item label="备注">
          <div>
            {{ formData.remark }}
          </div>
        </el-form-item>

        <div
          v-if="formData.payeeAccountConfig && showAccountInfoVisible"
        >
          <div
            v-if="formData.payeeAccountConfig.texts && formData.payeeAccountConfig.texts.length > 0"
          >
            <!-- <div
              class="title"
              style="font-weight: 700; text-align: left; margin-bottom: 10px; margin-left: 10px"
            >
              文本信息配置
            </div> -->
            <!-- 文本信息 -->
            <el-form-item
              v-for="item in formData.payeeAccountConfig.texts"
              :key="item.textConfigId"
              :label="item.textTitle"
            >
              <!-- <el-input readonly v-model="item.textValue" :placeholder="item.remark" size="small" /> -->
              <div>{{ item.textValue }}</div>
            </el-form-item>
          </div>
          <!-- 按钮信息 -->
          <div v-for="item in formData.payeeAccountConfig.buttons" :key="item.buttonConfigId">
            <!-- <div
              class="title"
              style="font-weight: 700; text-align: left; margin-bottom: 10px; margin-left: 10px"
            >
              {{ item.buttonTitle }} 按钮参数配置
            </div> -->

            <div v-for="param in item.buttonParamList" :key="param.buttonParamId" class="params">
              <el-form-item :label="param.paramTitle" v-if="param.paramTitle && param.isShow">
                <!-- <el-input
                  readonly
                  v-model="param.buttonParamValue"
                  :placeholder="param.remark"
                  size="small"
                /> -->
                <div>{{ param.buttonParamValue }}</div>
              </el-form-item>
            </div>
          </div>

          <!-- 二维码设置 -->

          <div v-if="formData.payeeAccountConfig.qrConfig.isActive == 1">
            <!-- <div
              class="title"
              style="font-weight: 700; text-align: left; margin-bottom: 10px; margin-left: 10px"
            >
              二维码配置
            </div> -->

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

            <el-form-item
              v-if="
                formData.payeeAccountConfig.qrConfig.parseType == 1 ||
                formData.payeeAccountConfig.qrConfig.parseType == 0
              "
              label="二维码"
            >
              <el-image
                style="width: 346px;"
                :src="formData.payeeAccountConfig.qrConfig.fileList[0].url"
                fit="scale-down"
                class="hand"
                @click="openImagePreview(formData.payeeAccountConfig.qrConfig.fileList[0].url)"
              />
            </el-form-item>

            <el-form-item v-if="formData.payeeAccountConfig.qrConfig.parseType == 2" label="二维码">
              <el-image
                style="width: 346px;"
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
            <!-- <div
              class="title"
              style="font-weight: 700; text-align: left; margin-bottom: 10px; margin-left: 10px"
            >
              文件配置
            </div> -->

            <el-form-item
              v-for="(item, index) in formData.payeeAccountConfig.files"
              :key="index"
              :label="item.fileTitle"
            >
              <!-- <el-input readonly v-model="item.fileList[0].name" size="small" /> -->
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
        <div v-else v-loading="true" ></div>
      </el-form>
      <div slot="footer">
        <!-- <el-button size="small" @click="onDialogBtnCancel()"> 取消 </el-button> -->
        <el-button type="primary" size="small" @click="showAccountInfoVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <!-- 接单配置弹窗 -->
    <!-- <el-dialog
      :visible.sync="configOrderdialogVisible"
      title="接单配置"
      width="600px"
      @close="onConfigOrderBtnCancel()"
    >
      <ReceiveOrderConf
        ref="configOrderRef"
        :form-data="formData"
        :form-rules="incomeInfoRules"
        :min-amount-rules="configMinAmountRules"
        :max-amount-rules="configMaxAmountRules"
        label-width="120px"
        form-style="margin-right: 100px"
        @expire-type-change="(form) => onAcceptExpireTypeChange('configOrderRef', form)"
      />
      <div slot="footer">
        <el-button size="small" @click="onConfigOrderBtnCancel()"> 取消 </el-button>
        <el-button type="primary" size="small" @click="onConfigOrderBtnOk()"> 确定 </el-button>
      </div>
    </el-dialog> -->

    <el-dialog
      :visible.sync="isShowPatchDialog"
      @close="onPatchAddBtnCancel"
      title="批量导入收款信息"
      width="800px"
      :close-on-click-modal="false"
    >
      <!-- 步骤指示器 -->
      <el-steps
        :active="batchImportStep"
        finish-status="success"
        align-center
        style="margin-bottom: 30px"
      >
        <el-step title="选择产品"></el-step>
        <el-step title="上传图片"></el-step>
        <el-step title="生成模板"></el-step>
        <el-step title="导入数据"></el-step>
      </el-steps>

      <div class="step-content" style="min-height: 350px; padding: 20px">
        <!-- 步骤0: 选择产品 -->
        <div v-show="batchImportStep === 0">
          <el-form
            ref="formPatchRef"
            :model="formData"
            :rules="patchAddRules"
            label-position="right"
            label-width="100px"
          >
            <el-form-item label="选择码商" prop="providerId">
              <el-select
                v-model="formData.providerId"
                filterable
                placeholder="请选择码商"
                size="small"
                @change="handleProviderChanged"
                style="width: 100%"
              >
                <el-option
                  v-for="item in providerList"
                  :key="item.providerId"
                  :label="item.userNickName"
                  :value="item.providerId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="产品名称" prop="productId">
              <el-select
                v-model="formData.productId"
                filterable
                placeholder="请选择产品"
                size="small"
                @change="onProductChange"
                style="width: 100%"
              >
                <el-option
                  v-for="item in providerProductList"
                  :key="item.productId"
                  :label="item.productName"
                  :value="item.productId"
                  :loading="productLoading"
                />
              </el-select>
            </el-form-item>

            <!-- 产品配置提示 -->
            <div
              v-if="productConfig"
              style="
                margin-top: 15px;
                padding: 10px;
                background: #f0f9ff;
                border-left: 3px solid #409eff;
                font-size: 13px;
              "
            >
              <b>{{ productConfig.productName }}</b>
              <span v-if="needQrCode || needFile">- 需上传：</span>
              <el-tag v-if="needQrCode" size="mini" type="warning" style="margin: 0 5px"
                >二维码ZIP</el-tag
              >
              <el-tag v-if="needFile" size="mini" type="warning" style="margin: 0 5px"
                >文件ZIP</el-tag
              >
              <span v-if="!needQrCode && !needFile" style="color: #67c23a">- 无需上传图片</span>
            </div>
          </el-form>
        </div>

        <!-- 步骤1: 上传ZIP文件 -->
        <div v-show="batchImportStep === 1">
          <el-alert
            v-if="!needQrCode && !needFile"
            type="success"
            title="该产品无需上传图片，可直接下一步"
            :closable="false"
            style="margin-bottom: 20px"
          />

          <el-form label-width="120px" v-if="needQrCode || needFile">
            <!-- 上传二维码ZIP -->
            <el-form-item label="二维码图片" v-if="needQrCode">
              <el-upload
                :auto-upload="false"
                :limit="1"
                accept=".zip"
                :file-list="qrCodeZipList"
                :on-change="handleQrCodeChange"
                :on-remove="handleQrCodeRemove"
                drag
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将二维码ZIP拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">
                  将所有二维码图片（jpg/png/gif）打包成ZIP文件上传
                </div>
              </el-upload>
            </el-form-item>

            <!-- 上传文件ZIP -->
            <el-form-item label="其他文件" v-if="needFile">
              <el-upload
                :auto-upload="false"
                :limit="1"
                accept=".zip"
                :file-list="fileZipList"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                drag
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件ZIP拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">
                  将所有文件打包成ZIP上传，文件ID会自动回填
                </div>
              </el-upload>
            </el-form-item>
            <div class="tips">
              选中多张图片，点右键选择生成 ZIP 压缩包。注意：压缩包中不能有文件夹
            </div>

            <el-alert type="info" :closable="false" show-icon>
              <span slot="title">下一步生成模板时，图片会自动上传并回填ID到Excel中</span>
            </el-alert>
          </el-form>
        </div>

        <!-- 步骤2: 生成并下载模板 -->
        <div v-show="batchImportStep === 2" style="text-align: center; padding: 30px 0">
          <el-button
            type="success"
            size="large"
            icon="el-icon-download"
            :loading="downloading"
            @click="downloadPayee()"
          >
            {{ downloading ? '生成中...' : '生成并下载Excel模板' }}
          </el-button>

          <div v-if="downloading" style="margin-top: 20px; color: #409eff; font-size: 14px">
            <i class="el-icon-loading"></i> 正在生成模板{{
              needQrCode || needFile ? '并上传图片' : ''
            }}，请稍候...
          </div>

          <div
            v-if="!downloading"
            style="
              margin-top: 30px;
              padding: 20px;
              background: #f5f7fa;
              border-radius: 4px;
              text-align: left;
              max-width: 500px;
              margin-left: auto;
              margin-right: auto;
            "
          >
            <div style="color: #606266; line-height: 2">
              <div v-if="needQrCode || needFile">• <b>图片ID已自动回填</b>，无需修改</div>
              <div style="color: red; font-weight: bold">• 请修改收款信息名称，防止重复!</div>
              <div>• 最多支持500条数据</div>
            </div>
          </div>

          <el-alert
            v-if="templateDownloaded"
            type="success"
            title="模板已下载，请填写后上传"
            :closable="false"
            style="margin-top: 20px; max-width: 500px; margin-left: auto; margin-right: auto"
          />
        </div>

        <!-- 步骤3: 上传Excel -->
        <div v-show="batchImportStep === 3">
          <el-form label-position="right" label-width="100px">
            <el-form-item label="上传Excel">
              <el-upload
                action="#"
                :limit="1"
                accept=".xlsx,.xls"
                :auto-upload="false"
                :on-change="handlePatchAddFileBeforeUpload"
                :file-list="patchAddFileList"
                :show-file-list="true"
                :on-remove="handlePatchAddFileRemove"
                :multiple="false"
                drag
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将填好的Excel拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">请使用刚才下载的模板填写数据，最多500条</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div slot="footer">
        <el-button size="small" @click="onPatchAddBtnCancel()">取消</el-button>
        <el-button v-if="batchImportStep > 0" size="small" @click="batchImportPrevStep()"
          >上一步</el-button
        >
        <el-button
          v-if="batchImportStep < 3"
          type="primary"
          size="small"
          :disabled="!canBatchImportNext"
          @click="batchImportNextStep()"
          >下一步</el-button
        >
        <el-button
          v-if="batchImportStep === 3"
          type="primary"
          size="small"
          :loading="importing"
          :disabled="!patchAddFileList.length"
          @click="onPatchAddBtnOk()"
          >{{ importing ? '导入中...' : '开始导入' }}</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showPatchDialogVisable"
      :title="isModAll ? '全部修改' : '批量修改'"
      width="600px"
      @close="onPatchDialogBtnCancel()"
    >
      <el-form
        ref="formPatchDataRef"
        :model="formPatchData"
        label-position="right"
        label-width="150px"
        :rules="incomeInfoRules"
        style="margin-right: 50px"
      >
        <el-form-item label="是否启用" prop="">
          <el-radio-group v-model="formPatchData.isActive" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="接单下线" prop="">
          <el-radio-group v-model="formPatchData.isOneTimeAccept" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item label="修改金额限制" prop="">
          <el-switch v-model="formPatchData.updateLimitAmountType" size="small" />
        </el-form-item>

        <el-form-item
          v-if="formPatchData.updateLimitAmountType"
          label="金额限制类型："
          prop="limitAmountType"
        >
          <el-select v-model="formPatchData.limitAmountType" placeholder="请选择" size="small">
            <el-option label="无限制" :value="0" />
            <el-option label="固定金额" :value="1" />
            <el-option label="范围金额" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="formPatchData.updateLimitAmountType && formPatchData.limitAmountType == 1"
          label="固定金额："
          prop="fixedAmount"
        >
          <el-input v-model="formPatchData.fixedAmount" placeholder="请输入" size="small" />
          <span class="text" style="color: brown">提示：多个金额用 “ , ” 分割</span>
        </el-form-item>

        <div style="display: flex">
          <el-form-item
            v-if="formPatchData.updateLimitAmountType && formPatchData.limitAmountType == 2"
            label="范围金额："
            prop="minAmount"
            :rules="updateMinAmountRules"
          >
            <el-input
              v-model="formPatchData.minAmount"
              v-number-input
              type="number"
              placeholder="请输入"
              size="small"
              style="width: 160px"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="formPatchData.updateLimitAmountType && formPatchData.limitAmountType == 2"
            label=""
            prop="maxAmount"
            :rules="updateMaxAmountRules"
            label-width="0"
          >
            <span class="symbol" style="margin: 0 5px">~</span>
            <el-input
              v-model="formPatchData.maxAmount"
              v-number-input
              type="number"
              placeholder="请输入"
              size="small"
              style="width: 160px"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </div>

        <el-form-item label="修改最大金额" prop="">
          <el-switch v-model="formPatchData.updateDailyMaxAmount" size="small" />
        </el-form-item>

        <el-form-item
          v-if="formPatchData.updateDailyMaxAmount"
          label="当日最大金额"
          prop="dailyMaxAmount"
        >
          <!-- <el-input
            v-model="formPatchData.dailyMaxAmount"
            v-number-input-positive
            type="number"
            placeholder="请输入当日最大金额"
            size="small"
          /> -->

          <el-row>
            <el-col :span="12">
              <el-input
                v-model="formPatchData.dailyMaxAmount"
                type="number"
                placeholder="请输入当日最大金额"
                size="small"
              />
            </el-col>
            <el-col :span="12">
              <span class="help-tip">【0 不限制】</span>
            </el-col>
          </el-row>

        </el-form-item>

        <el-form-item label="修改最大订单数" prop="">
          <el-switch v-model="formPatchData.updateDailyMaxCount" size="small" />
        </el-form-item>

        <el-form-item
          v-if="formPatchData.updateDailyMaxCount"
          label="当日最大订单数"
          prop="dailyMaxCount"
        >
          <!-- <el-input
            v-model="formPatchData.dailyMaxCount"
            type="number"
            placeholder="请输入当日最大订单数"
            size="small"
          /> -->

          <el-row>
            <el-col :span="12">
              <el-input
                v-model="formPatchData.dailyMaxCount"
                type="number"
                placeholder="请输入当日最大订单数"
                size="small"
              />
            </el-col>
            <el-col :span="12">
              <span class="help-tip">【0 不限制】</span>
            </el-col>
          </el-row>

        </el-form-item>

        <el-form-item label="修改过期时间" prop="">
          <el-switch v-model="formPatchData.updatePayeeAccountExpireTime" size="small" />
        </el-form-item>

        <el-form-item
          v-if="formPatchData.updatePayeeAccountExpireTime"
          label="过期时间"
          prop="payeeAccountExpireTimeType"
        >
          <el-select
            v-model="formPatchData.payeeAccountExpireTimeType"
            placeholder="请选择限制类型"
            @change="onChangePayeeAccountExpireTimeType"
            size="small"
          >
            <el-option label="无限制" :value="0" />
            <el-option label="指定时间" :value="1" />
            <el-option label="指定时长" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="
            formPatchData.payeeAccountExpireTimeType == 1 &&
            formPatchData.updatePayeeAccountExpireTime
          "
          label="指定时间"
          prop="payeeAccountExpireTime"
        >
          <el-date-picker
            v-model="formPatchData.payeeAccountExpireTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>

        <el-form-item
          v-if="
            formPatchData.payeeAccountExpireTimeType == 2 &&
            formPatchData.updatePayeeAccountExpireTime
          "
          label="指定时长"
          prop="payeeAccountExpireDuration"
        >
          <el-input
            v-model="formPatchData.payeeAccountExpireDuration"
            v-input-int-positive
            type="number"
            placeholder="请输入数值"
            size="small"
          >
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="onPatchDialogBtnCancel()"> 取消 </el-button>
        <el-button type="primary" size="small" @click="onPatchDialogBtnOk()"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="isShowTongjiDialog"
      @close="closeTongjiDialog()"
      title="统计信息"
      width="500px"
    >
      <el-form
        :model="tongjiData"
        label-position="right"
        label-width="150px"
        style="margin-right: 100px"
      >
        <el-form-item label="累计成功金额：" prop="">
          <el-input v-model="tongjiData.totalOrderAmount" disabled size="small">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="累计成功单数：" prop="">
          <el-input v-model="tongjiData.totalOrderCount" disabled size="small">
            <template slot="append">个</template>
          </el-input>
        </el-form-item>

        <el-form-item label="昨日成功金额：" prop="">
          <el-input v-model="tongjiData.yesterdayOrderAmount" disabled size="small">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="昨日成功单数：" prop="">
          <el-input v-model="tongjiData.yesterdayOrderCount" disabled size="small">
            <template slot="append">个</template>
          </el-input>
        </el-form-item>

        <el-form-item label="今日成功金额：" prop="">
          <el-input v-model="tongjiData.todayOrderAmount" disabled size="small">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="今日成功单数：" prop="">
          <el-input v-model="tongjiData.todayOrderCount" disabled size="small">
            <template slot="append">个</template>
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button size="small" @click="isShowTongjiDialog = false"> 取消 </el-button>
        <el-button type="primary" size="small" @click="isShowTongjiDialog = false">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="mobileAuthDialogVisible"
      @close="closeMobileAuth()"
      title="手机扫码授权"
      width="500px"
    >
      <div v-if="mobileAuthStr" style="text-align: center">
        <MyQrCode :value="mobileAuthStr"></MyQrCode>
        <div class="help-tip mt-10">扫码授权成功后，请手动关闭对话框</div>
      </div>

      <div v-else v-loading="true" style="width: 100%; height: 100%"></div>
      <div slot="footer" style="text-align: center">
        <el-button size="small" type="success" @click="mobileAuthDialogVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="monitorDialogVisible"
      @close="closeMonitorDialog()"
      title="获取监控地址"
      width="500px"
    >
      <div v-if="monitorData" style="text-align: center">
        <MyQrCode :value="monitorData.monitorUrl"></MyQrCode>

        <div class="" style="display: flex; padding: 10px 20px; align-items: center">
          地址：{{ monitorData.monitorUrl }}
          <el-button
            type="text"
            size="small"
            style="margin-left: 20px"
            @click="(e) => clipboard(monitorData.monitorUrl, e)"
            >复制</el-button
          >
        </div>
        <div class="" style="display: flex; padding: 10px 20px; align-items: center">
          key：{{ monitorData.monitorKey }}
          <el-button
            type="text"
            size="small"
            style="margin-left: 20px"
            @click="(e) => clipboard(monitorData.monitorKey, e)"
          >
            复制</el-button
          >
        </div>
        <div class="" style="display: flex; padding: 10px 20px; align-items: center">
          包名：{{ monitorData.monitorAppBackName }}
          <el-button
            type="text"
            size="small"
            style="margin-left: 20px"
            @click="(e) => clipboard(monitorData.monitorAppBackName, e)"
          >
            复制</el-button
          >
        </div>
      </div>

      <div v-else v-loading="true" style="width: 100%; height: 100%"></div>

      <div slot="footer" style="text-align: center">
        <el-button size="small" type="success" @click="closeMonitorDialog()"> 关闭 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showAliUid"
      title="获取支付宝UID"
      :closeOnClickModal="true"
      :loading="false"
      width="500px"
    >
      <div style="text-align: center">
        <img :src="UidImage" style="width: 300px" />
        <div style="margin-top: 10px; color: #c00; font-size: 14px">
          打开支付宝，扫描上面二维码，即可获得自己的 UID
        </div>
      </div>
    </el-dialog>

    <!-- <loginWeixinDialogVue
      :row="currRow"
      @close="(e) => (loginWeixinVisible = false)"
      v-if="loginWeixinVisible"
    /> -->

    <ImagePreviewer
      :visible="imagePreview.visible"
      :src="imagePreview.src"
      @update:visible="onImagePreviewVisibleChange"
    />

  </div>
</template>

<script>
import { templateRules, queryRules, incomeInfoRules, configOrderRules } from '../rules.js'

import { unavailableReasonOptions, remarkOptions } from '@/utils/constants.js'

import { platformInfo } from '@/utils/constants.js'

import { downloadFile, promisePool } from '@/utils'

import UidImage from '@/assets/img/aliUID.png'

import MyQrCode from '@/components/MyQrCode/MyQrCode.vue'

import {
  getPayeeAccountInfoListPage,
  deletePayeeAccountInfo,
  payeeAccountInfoNameIsExist,
  addPayeeAccountInfo,
  updatePayeeAccountInfo,
  payeeAccountInfoEnable,
  getPayeeAccountInfoByProductId,
  getAliPayAuthUrl,
  payeeAccountInfoEnableBatch,
  updateAllPayeeAccountInfo,
  updatePayeeAccountInfoBatch,
  getPayeeAccountInfoCount,
  payeeAccountInfoAddBatch,
  getProductInfoListByProviderId,
  getPayeeAccountInfoById,
  isExistCollectorderTaken,
  isOneTimeAcceptIsActive,
  getMonitorAddrInfo,
  payeeAccountBatchDelete,
  getProductById,
  exportPayeeAccountList,
  getPayeeAccountInfoListByTenantId,
  generateExcelTemplate,
  importPayeeAccountExcel
} from '@/api/service-income-info.js'
import { formatDateTime, isEmpty } from '@/utils'

import { getProductListByTenantId } from '@/api/service-list-setting.js'

import { userNickNameRules, amountCheck } from '@/utils/validate'

import { getProviderOptionList } from '@/api/service-list.js'

import { imageUploadServer } from '@/settings.js'

import RefreshIcon from '../components/RefreshIcon.vue'
import ImagePreviewer from '../components/ImagePreviewer.vue'
import clipboard from '@/utils/clipboard'

import { getProductListByProviderId } from '@/api/service-product-mananger.js'
import FileSaver from 'file-saver'
import {
  getFileById,
  uploadFileToServer,
  handleUploadParseFileToServer,
  handleUploadDataToQrCode
} from '@/api/upload'
// import loginWeixinDialogVue from '../service-income-comp/login-weixin-dialog.vue'
import ReceiveOrderConf from './components/receive-order-conf.vue'
import CreateIncomeInfo from './components/create-income-info.vue'

const createDefaultAcceptOrderForm = () => ({
  isActive: 0,
  limitAmountType: 0,
  fixedAmount: '',
  minAmount: '',
  maxAmount: '',
  dailyMaxAmount: '0',
  dailyMaxCount: '0',
  payeeAccountExpireTimeType: 0,
  payeeAccountExpireTime: '',
  payeeAccountExpireDuration: ''
})

export default {
  name: 'ServiceIncomeInfo',
  components: {
    RefreshIcon,
    // loginWeixinDialogVue,
     ImagePreviewer,
    MyQrCode,
    ReceiveOrderConf,
    CreateIncomeInfo
  },
  data() {
    return {
      unavailableReasonOptions, 
      remarkOptions,
      page: {
        pageSize: 10,
        pageNum: 1
      },
      patchAddFileList: [],
      patchAddRules: {
        providerId: [{ required: true, message: '请选择码商', trigger: 'change' }],
        productId: [{ required: true, message: '请选择产品', trigger: 'change' }],
        fileId: [{ required: true, message: '请选择文件', trigger: 'change' }]
      },
      UidImage,
      showAliUid: false,
      imageUploadServer,
      configOrderRules,
      rules: templateRules,
      incomeInfoRules: incomeInfoRules,
      queryRules: queryRules,

      minAmountRules: [
        { required: true, message: '请输入最小金额', trigger: 'blur' },
        { validator: amountCheck, trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (isEmpty(this.formData.minAmount) || isEmpty(this.formData.maxAmount)) {
              return callback()
            }

            if (Number(this.formData.minAmount) >= Number(this.formData.maxAmount)) {
              return callback(new Error('必须小于最大金额'))
            }
            callback()
          },
          trigger: 'blur'
        }
      ],
      maxAmountRules: [
        { required: true, message: '请输入最大金额', trigger: 'blur' },
        { validator: amountCheck, trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (isEmpty(this.formData.minAmount) || isEmpty(this.formData.maxAmount)) {
              return callback()
            }

            if (Number(this.formData.minAmount) >= Number(this.formData.maxAmount)) {
              return callback(new Error('必须大于最小金额'))
            }
            callback()
          },
          trigger: 'blur'
        }
      ],

      updateMinAmountRules: [
        { required: true, message: '请输入最小金额', trigger: 'blur' },
        { validator: amountCheck, trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (isEmpty(this.formPatchData.minAmount) || isEmpty(this.formPatchData.maxAmount)) {
              return callback()
            }

            if (Number(this.formPatchData.minAmount) >= Number(this.formPatchData.maxAmount)) {
              return callback(new Error('必须小于最大金额'))
            }
            callback()
          },
          trigger: 'blur'
        }
      ],
      updateMaxAmountRules: [
        { required: true, message: '请输入最大金额', trigger: 'blur' },
        { validator: amountCheck, trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (isEmpty(this.formPatchData.minAmount) || isEmpty(this.formPatchData.maxAmount)) {
              return callback()
            }

            if (Number(this.formPatchData.minAmount) >= Number(this.formPatchData.maxAmount)) {
              return callback(new Error('必须大于最小金额'))
            }
            callback()
          },
          trigger: 'blur'
        }
      ],

      payeeAccountNameRules: [
        { required: true, message: '请输入收款信息名称', trigger: 'blur' },
        // ...userNickNameRules,
        // {
        //   validator: async (rule, value, callback) => {
        //     if (isEmpty(this.formData.providerId)) {
        //       return callback(new Error('请先选择码商'))
        //     }

        //     // 如果点击确认了，就不再联网 校验了
        //     if (this.isDialogLoading) {
        //       return callback()
        //     }

        //     const ret = await payeeAccountInfoNameIsExist(value, this.formData.providerId)
        //     if (ret.data) {
        //       this.isPayeeAccountNameExist = true
        //       return callback()
        //     } else {
        //       this.isPayeeAccountNameExist = false
        //       return callback()
        //     }
        //   },
        //   trigger: 'blur'
        // }
      ],

      isPayeeAccountNameExist: false,

      activeName: 'tab1',
      tableData: [],
      dialogVisible: false,
      formData: {
        payeeAccountConfig: null
      },
      acceptOrderForm: createDefaultAcceptOrderForm(),
      queryFormData: this.getQueryForm(),
      whichLimit: '',
      isEdit: false, // 是否是编辑状态
      selectionRows: [],
      // 添加扩展数据，如 options 所需要的数据
      isShowPatchDialog: false,
      batchImportStep: 0, // 批量导入步骤：0-选择产品，1-上传ZIP，2-生成模板，3-上传Excel
      templateDownloaded: false, // 模板是否已下载
      downloading: false, // 是否正在下载模板
      importing: false, // 是否正在导入
      productConfig: null, // 产品配置
      needQrCode: false, // 是否需要二维码
      needFile: false, // 是否需要文件
      qrCodeZipList: [], // 二维码ZIP文件列表
      fileZipList: [], // 文件ZIP列表
      formPath: {},

      showPatchDialogVisable: false, // 批量修改
      formPatchData: {
        // isActive: 0, //0 保持不变  1  开启   2  关闭
        // updateLimitAmountType: false,
        // limitAmountType: '0', //0 无限制  1  固定金额   2 范围金额
        // fixedAmount: '',
        // minAmount: '',
        // maxAmount: '',
        // updateDailyMaxAmount: false,
        // dailyMaxAmount: '',
        // dailyMaxCount: '',
        // updateDailyMaxCount: false,
        // dailyMaxCount: 0,
        // updatePayeeAccountExpireTime: false,
        // payeeAccountExpireTimeType: 0, // 过期时间限制类型  1  有限制   0 无限制
        // payeeAccountExpireTime: '' // 具体时间
      },
      isModAll: false, // 是否是全部修改

      isShowTongjiDialog: false, // 是否显示统计信息
      tongjiData: {},
      productList: [],

      configOrderdialogVisible: false, // 接单配置 弹窗
      loadingInfo: false, // 加载中
      payeeAccountConfig: {}, //
      qrImageUrl: '',
      imagePreview: {
        visible: false,
        src: ''
      },
      providerList: [],
      showAccountInfoVisible: false, // 查看收款信息
      // [
      // {
      //   name: 'zhongguo-pay.png',
      //   url: 'http://192.168.12.125:8090/uploads/1745553156751-807245010-zhongguo-pay.png'
      // }
      // ]

      productLoading: false, // 产品信息加载中
      providerProductList: [], // 码商产品列表

      mobileAuthDialogVisible: false, // 手机认证弹窗
      mobileAuthStr: '', // 手机认证字符串

      monitorDialogVisible: false, // 监控地址
      monitorData: '',
      payeeAccountList: [], // 所有的收款信息
      loginWeixinVisible: false,
      currRow: null,
      isDialogLoading: false,
      firstTextMult: false, // 收款信息中，第一文本，是多文本
    }
  },
  computed: {

    isSaDan(){
      // 撒旦支付显示所有，格润 和小刘 不变还是隐藏 
      // this.$store.state.tenant.currTenantId === platformInfo["sadan"].tenantId ||
      // return this.$store.state.tenant.currTenantId === platformInfo["gerun"].tenantId || 
      //        this.$store.state.tenant.currTenantId === platformInfo["xiaoliu"].tenantId 
      return false
    },

    acceptMinAmountRules() {
      return this.buildMinAmountRules(this.acceptOrderForm)
    },
    acceptMaxAmountRules() {
      return this.buildMaxAmountRules(this.acceptOrderForm)
    },
    configMinAmountRules() {
      return this.buildMinAmountRules(this.formData)
    },
    configMaxAmountRules() {
      return this.buildMaxAmountRules(this.formData)
    },
    // 批量导入 - 是否可以进入下一步
    canBatchImportNext() {
      switch (this.batchImportStep) {
        case 0:
          // 步骤0：必须选择码商和产品
          return this.formData.providerId && this.formData.productId
        case 1:
          // 步骤1：如果需要上传ZIP，必须上传完整
          if (this.needQrCode && !this.qrCodeZipList.length) return false
          if (this.needFile && !this.fileZipList.length) return false
          return true
        case 2:
          // 步骤2：必须下载模板
          return this.templateDownloaded
        default:
          return true
      }
    }
  },
  mounted() {
    // 根据租户ID 获得所有的产品信息
    this.getOptionLists()
    this.loadAllPayeeAccountInfo()
  },
  methods: {
    handleFirstTextMultiple(e){
      this.firstTextMult = e
    },
    // 微信登录
    async loginWeiXin(row) {
      this.currRow = row
      this.loginWeixinVisible = true
    },

    async loadAllPayeeAccountInfo() {
      let res = await getPayeeAccountInfoListByTenantId(this.$store.state.tenant.currTenantId)
      this.payeeAccountList = res.data
    },

    queryRemark(queryString, cb) {
      const list = Array.isArray(this.remarkOptions) ? this.remarkOptions : []
      const keyword = (queryString || '').trim().toLowerCase()
      const seen = new Set()
      const suggestions = []

      for (const item of list) {
        const name = item?.label
        if (!name || seen.has(name)) continue
        if (!keyword || name.toLowerCase().includes(keyword)) {
          suggestions.push({ value: name })
          seen.add(name)
        }
        if (suggestions.length >= 20) break
      }

      cb(suggestions)
    },
    handleRemark(item){
      this.queryFormData.remark = item?.value || ''
    },
    handleRemarkClear() {
      this.queryFormData.remark = ''
    },


     queryUnavailableReason(queryString, cb) {
      const list = Array.isArray(this.unavailableReasonOptions) ? this.unavailableReasonOptions : []
      const keyword = (queryString || '').trim().toLowerCase()
      const seen = new Set()
      const suggestions = []

      for (const item of list) {
        const name = item?.label
        if (!name || seen.has(name)) continue
        if (!keyword || name.toLowerCase().includes(keyword)) {
          suggestions.push({ value: name })
          seen.add(name)
        }
        if (suggestions.length >= 20) break
      }

      cb(suggestions)
    },
    handleUnavailableReason(item){
      this.queryFormData.unavailableReason = item?.value || ''
    },
    handleUnavailableReasonClear() {
      this.queryFormData.unavailableReason = ''
    },

    queryPayeeAccountSuggestions(queryString, cb) {
      const list = Array.isArray(this.payeeAccountList) ? this.payeeAccountList : []
      const keyword = (queryString || '').trim().toLowerCase()
      const seen = new Set()
      const suggestions = []

      for (const item of list) {
        const name = item?.payeeAccountName
        if (!name || seen.has(name)) continue
        if (!keyword || name.toLowerCase().includes(keyword)) {
          suggestions.push({ value: name })
          seen.add(name)
        }
        if (suggestions.length >= 20) break
      }

      cb(suggestions)
    },
    handlePayeeAccountSelect(item) {
      this.queryFormData.payeeAccountName = item.value || ''
    },
    handlePayeeAccountClear() {
      this.queryFormData.payeeAccountName = ''
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

    handlePatchAddFileRemove(file, fileList) {
      console.log('---handleFileRemove---', file, fileList)
      delete this.formData.fileId
      this.patchAddFileList = []
      this.$nextTick(() => {
        this.$refs.formPatchRef.validateField(`fileId`)
      })
    },

    handlePatchAddFileBeforeUpload(obj) {
      console.log('---handlePatchAddFileBeforeUpload-----', obj)

      const file = obj.raw

      const isXlsx = file.type.includes('sheet')
      // file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 4

      if (!isXlsx) {
        this.$message.error('上传文件只能是 xlsx 或 xls 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 4MB!')
      }
      if (isXlsx && isLt2M) {
        this.formData.fileId = 'xxxx'
        this.patchAddFileList.push(file)
        this.$nextTick(() => {
          this.$refs.formPatchRef.validateField(`fileId`)
        })
        return true
      }
      return false
    },

    onPatchAddBtnCancel() {
      this.isShowPatchDialog = false
      this.batchImportStep = 0
      this.templateDownloaded = false
      this.patchAddFileList = []
      this.qrCodeZipList = []
      this.fileZipList = []
      this.productConfig = null
      this.needQrCode = false
      this.needFile = false
      this.formData = {}
      if (this.$refs.formPatchRef) {
        this.$refs.formPatchRef.resetFields()
      }
    },

    // 批量导入 - 上一步
    batchImportPrevStep() {
      if (this.batchImportStep > 0) {
        this.batchImportStep--
      }
    },

    // 批量导入 - 下一步
    batchImportNextStep() {
      if (this.batchImportStep < 3) {
        this.batchImportStep++
      }
    },

    // 产品变更 - 获取产品配置
    async onProductChange(productId) {
      if (!productId) {
        this.productConfig = null
        this.needQrCode = false
        this.needFile = false
        return
      }

      try {
        const res = await getPayeeAccountInfoByProductId(productId)
        this.productConfig = res.data

        // 获取产品名称
        const product = this.providerProductList.find((p) => p.productId === productId)
        if (product) {
          this.productConfig.productName = product.productName
        }

        // 判断是否需要上传二维码和文件
        this.needQrCode = res.data.qrConfig && res.data.qrConfig.isActive === 1
        this.needFile =
          res.data.files && res.data.files.some((f) => f.fileTitle && f.fileTitle.trim())

        console.log('产品配置:', {
          needQrCode: this.needQrCode,
          needFile: this.needFile
        })
      } catch (e) {
        this.$message.error('获取产品配置失败')
      }
    },

    // ZIP文件上传处理
    handleQrCodeChange(file, fileList) {
      this.qrCodeZipList = fileList
    },
    handleQrCodeRemove() {
      this.qrCodeZipList = []
    },
    handleFileChange(file, fileList) {
      this.fileZipList = fileList
    },
    handleFileRemove() {
      this.fileZipList = []
    },

    async onPatchAddBtnOk() {
      if (!this.patchAddFileList || !this.patchAddFileList.length) {
        this.$message.error('请先上传Excel文件！')
        return
      }

      this.importing = true

      try {
        const res = await importPayeeAccountExcel(
          this.patchAddFileList[0],
          this.formData.productId,
          this.formData.providerId,
          this.$store.state.tenant.currTenantId
        )

        console.log('导入结果:', res.data)

        // 显示导入结果
        if (res.data.failCount === 0) {
          this.$message.success(`全部导入成功！共${res.data.successCount}条`)
        } else {
          this.$message.warning(
            `导入完成：成功${res.data.successCount}条，失败${res.data.failCount}条`
          )
        }

        // 显示详细结果（可选，如果需要展示详细列表）
        if (res.data.failList && res.data.failList.length > 0) {
          let failMsg = '失败记录：\n'
          res.data.failList.forEach((item) => {
            failMsg += `${item.name}: ${item.reason}\n`
          })
          console.warn(failMsg)
        }

        this.onPatchAddBtnCancel()
        this.flushPage()
      } catch (error) {
        console.error('导入失败:', error)
        this.$message.error(
          '导入失败：' + (error.response?.data?.message || error.message || '未知错误')
        )
      } finally {
        this.importing = false
      }
    },
    async downloadPayee() {
      if (!this.formData.productId) {
        this.$message.error('请先选择产品！')
        return
      }

      // 验证必需的ZIP文件
      if (this.needQrCode && !this.qrCodeZipList.length) {
        this.$message.warning('请先上传二维码ZIP')
        return
      }
      if (this.needFile && !this.fileZipList.length) {
        this.$message.warning('请先上传文件ZIP')
        return
      }

      this.downloading = true
      try {
        // 使用新接口（支持ZIP批量上传）
        const formData = new FormData()
        formData.append('productId', this.formData.productId)

        if (this.needQrCode && this.qrCodeZipList.length) {
          formData.append('qrCodesZip', this.qrCodeZipList[0].raw)
        }

        if (this.needFile && this.fileZipList.length) {
          formData.append('filesZip', this.fileZipList[0].raw)
        }

        let res = await generateExcelTemplate(formData)
        const productName = this.productConfig.productName || '收款账户'
        const timestamp = new Date().getTime()
        FileSaver.saveAs(res, `${productName}_导入模板_${timestamp}.xlsx`)

        this.templateDownloaded = true
        this.$message.success(
          '模板已下载' + (this.needQrCode || this.needFile ? '（图片ID已自动回填）' : '')
        )
      } catch (error) {
        console.error('模板生成失败:', error)
        this.$message.error(
          '模板下载失败：' + (error.response?.data?.message || error.message || '未知错误')
        )
      } finally {
        this.downloading = false
      }
    },
    async exportReport() {
      let params = {
        tenantId: this.$store.state.tenant.currTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          // this.queryFormData[key] !== ''
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime') {
            params.dateRangeQuery = {
              startTime: this.queryFormData['createTime'][0],
              endTime: this.queryFormData['createTime'][1]
            }
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await exportPayeeAccountList(params)
      FileSaver.saveAs(res, '收款信息列表.xlsx')
    },
    copyAgentInfo(e, msg) {
      this.clipboard(`${msg}`, e)
    },
    clipboard,
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
        this.$message.error(e)
        this.closeMonitorDialog()
      }
    },
    downloadFile,

    closeMobileAuth() {
      this.mobileAuthDialogVisible = false
      this.mobileAuthStr = ''

      this.flushPage()
    },

    showMobileAuth(row) {
      this.mobileAuthDialogVisible = true
      let payeeAccountId = row ? row.payeeAccountId : this.selectionRows[0].payeeAccountId

      getAliPayAuthUrl({ 
        payeeAccountId,
         tenantId: this.$store.state.tenant.selectTenantId 
      })
        .then((res) => {
          console.log(res)
          this.mobileAuthStr = res.data.wapAuthUrl
        })
        .catch((err) => {
          console.log(err)
          this.mobileAuthStr = ''
        })
    },
    getOptionLists() {
      getProductListByTenantId(this.$store.state.tenant.currTenantId).then((res) => {
        console.log(res)
        // 只要代收的
        this.productList = res.data.filter((ele) => ele.tradeType == 0)
      })

      getProviderOptionList(this.$store.state.tenant.currTenantId).then((res) => {
        console.log(res)
        this.providerList = res.data
      })
    },

    handleProviderChanged(item) {
      console.log('---handleProviderChanged---', item, this.formData.providerId)
      this.productLoading = true

      // 新增 修改时
      if (this.$refs.formDataRef) {
        // 清空配置
        this.formData.payeeAccountConfig = null
      }

      // 清空产品
      if (this.formData.productId) {
        this.formData.productId = ''
        this.$nextTick(() => {
          // 新增 修改时
          if (this.$refs.formDataRef) {
            this.$refs.formDataRef.clearValidate('productId')
          }
          // 批量新增时
          if (this.$refs.formDataRef) {
            this.$refs.formPatchRef.clearValidate('productId')
          }
        })
      }
      this.getProductInfoListByProviderId(item)
    },
    async getProductInfoListByProviderId(item) {
      getProductInfoListByProviderId(item)
        .then((res) => {
          console.log(res)
          // this.providerProductList = res.data.filter((ele) => ele.tradeType == 0) // 只要代收的
          this.providerProductList = res.data // 只要代收的
        })
        .finally(() => {
          this.productLoading = false
        })
    },
    async oneTimeAcceptChange(e, row) {
      // if(!this.isEdit){
      //   console.log('==oneTimeAcceptChange==', this.isEdit);

      //   return
      // }
      try {
        let res = await isOneTimeAcceptIsActive(row.payeeAccountId, e)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
      // this.flushPage()
    },
    async onSwitchChange(e, row) {
      console.log(e)
      // 之前开的，现在关了
      if (e == 0) {
        // 先判断是否有使用的订单
        try {
          let ret = await isExistCollectorderTaken(row.payeeAccountId)
          if (ret.data) {
            this.$confirm('有订单正在使用，确定要关闭吗？')
              .then(async (_) => {
                // 确认
                let res = await payeeAccountInfoEnable(row.payeeAccountId, e)
                this.flushPage()
                console.log(res)
              })
              .catch((_) => {
                // 取消
                row.acceptOrderConfig.isActive = 1
              })
          } else {
            let res = await payeeAccountInfoEnable(row.payeeAccountId, e)
            console.log(res)
          }
        } catch (err) {
          // 上面出错了，直接修改
          let res = await payeeAccountInfoEnable(row.payeeAccountId, e)
          console.log(res)
        }
        this.flushPage()
      } else {
        // 从关到开，直接修改
        let res = await payeeAccountInfoEnable(row.payeeAccountId, e)
        this.flushPage()
        console.log(res)
      }
    },
    generateQrCodeImg() {
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
            this.formData.payeeAccountConfig.qrConfig.GenerQrUrl = resp.data.fileUrl
            this.$forceUpdate()
          } else {
            console.log('---generateQrCodeImg--error-')
          }
        }
      )
    },
    beforeUpload(file) {
      console.log('----beforeUpload------', file)
      const isImage = file.type.indexOf('image') !== -1
      if (!isImage) {
        this.$message.error('只能上传图片类型的文件！')
        return false
      }
      const isGt4M = file.size > 1024 * 1024 * 4
      if (isGt4M) {
        this.$message.error('上传图片大小不能超过 4MB！')
        return false
      }
      return true
    },
    beforeUploadFile(file) {
      console.log('----beforeUploadFile------', file)
      const isGt4M = file.size > 1024 * 1024 * 4
      if (isGt4M) {
        this.$message.error('文件大小不能超过 4MB！')
        return false
      }
      return true
    },

     handleQrConfigError(error, file, fileList) {

      const fileName = file.name
        const errorMessage = '解析上传二维码图片失败'
        this.$message.error(`${fileName}: ${errorMessage}`)
        
        const qrConfig = this.formData.payeeAccountConfig.qrConfig
        // 判断是否已经包含该 fileName ，如果没有，加入 数组
        const existIndex = qrConfig.failedFiles.findIndex((item) => item.name === fileName)
        if (existIndex === -1) {
          qrConfig.failedFiles.push({
            name: fileName,
            uid: file.uid,
            message: errorMessage
          })
        }

        // 更新 fileList
        this.$set(qrConfig, 'fileList', fileList)
        this.$forceUpdate()

    },

    /**
     *  二维码图片  上传成功
     */
    async handleQrConfigSuccess(response, file, fileList) {
      const fileName = file.name
      // 之前失败的再次上传，成功了
      const qrConfig = this.formData.payeeAccountConfig.qrConfig
      if(!qrConfig.failedFiles){
        this.$set(this.formData.payeeAccountConfig.qrConfig, 'failedFiles', [])
      }
      const existIndex = qrConfig.failedFiles.findIndex((item) => item.name === fileName)
      if (existIndex !== -1) {
        qrConfig.failedFiles.splice(existIndex, 1)
      }

      if (!qrConfig.uploadedFiles) {
        this.$set(qrConfig, 'uploadedFiles', [])
      }

      if (response && response.data) {
        
        const ret = await getFileById(response.data, false)
        
        console.log('===handleQrConfigSuccess==',ret)

        file.url = ret.data.fileUrl

        const uploadEntry = {
          fileId: response.data,
          url: ret.data.fileUrl,
          name: ret.data.originalName,
          uid: file.uid
        }

        const existIndex = qrConfig.uploadedFiles.findIndex((item) => item.uid === file.uid)
        if (existIndex > -1) {
          this.$set(qrConfig.uploadedFiles, existIndex, uploadEntry)
        } else {
          qrConfig.uploadedFiles.push(uploadEntry)
        }

        // 兼容旧逻辑，保留最近一次的 fileId/qrUrl
        qrConfig.fileId = response.data
        qrConfig.qrUrl = ret.data.fileUrl
        this.qrImageUrl = ret.data.fileUrl

        this.$set(qrConfig, 'fileList', fileList)
       
      } else {
        console.error('上传文件出错，data 为空')
        this.$set(qrConfig, 'fileList', fileList || [])
      }

      if (Array.isArray(qrConfig.failedFiles)) {
        this.$set(
          qrConfig,
          'failedFiles',
          qrConfig.failedFiles.filter((item) => item.uid !== file.uid)
        )
      }
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
      this.$set(this.formData.payeeAccountConfig.qrConfig, 'failedFiles', [])
      this.$set(this.formData.payeeAccountConfig.qrConfig, 'uploadedFiles', [])
      this.qrImageUrl = undefined
      this.$forceUpdate()
    },
    handleQrConfigRemove(file, fileList) {
      console.log('---handleQrConfigRemove---', file, fileList)
      const qrConfig = this.formData.payeeAccountConfig.qrConfig
      if (Array.isArray(qrConfig.uploadedFiles)) {
        const filtered = qrConfig.uploadedFiles.filter((item) => item.uid !== file.uid)
        this.$set(qrConfig, 'uploadedFiles', filtered)
      }
      if (Array.isArray(qrConfig.failedFiles)) {
        const filtered = qrConfig.failedFiles.filter((item) => item.uid !== file.uid)
        this.$set(qrConfig, 'failedFiles', filtered)
      }
 
      this.$set(qrConfig, 'fileList', fileList)
 
      if (qrConfig.uploadedFiles && qrConfig.uploadedFiles.length) {
        const last = qrConfig.uploadedFiles[qrConfig.uploadedFiles.length - 1]
        qrConfig.fileId = last.fileId
        qrConfig.qrUrl = last.url
        this.qrImageUrl = last.url
      } else {
        qrConfig.fileId = undefined
        qrConfig.qrUrl = undefined
      this.qrImageUrl = undefined
      }
    },

    async uploadImage(action) {
      // try {
        if (this.formData.payeeAccountConfig.qrConfig.parseType == 0) {
          this.$store.commit('app/setLoadingEnable', false)
          let res = await uploadFileToServer(action.file)
          console.log('----uploadFileToServer------', res)
          return res
        } else if (this.formData.payeeAccountConfig.qrConfig.parseType == 1) {
          let res = await handleUploadParseFileToServer(action.file)
          console.log('----handleUploadParseFileToServer------', res)
          return res
        } else {
          console.error('parseType 错误 ', this.formData.payeeAccountConfig.qrConfig.parseType)
        }
      // } catch (e) {
      //   console.log('uploadImage -- ',e)
      //   const fileName = action?.file?.name || '未知文件'
      //   const errorMessage =
      //     e?.response?.data?.message ||
      //     e?.message ||
      //     (typeof e === 'string' ? e : '') ||
      //     '解析上传二维码图片失败'
      //   this.$message.error(`${fileName}: ${errorMessage}`)
 
      //   const qrConfig = this.formData.payeeAccountConfig.qrConfig
      //   if (!qrConfig.failedFiles) {
      //     this.$set(qrConfig, 'failedFiles', [])
      //   }
      //   qrConfig.failedFiles.push({
      //     name: fileName,
      //     uid: action?.file?.uid || `${Date.now()+Math.floor(Math.random()*1000)}`,
      //     message: errorMessage
      //   })
 
      //   if (Array.isArray(qrConfig.fileList)) {
      //     const filtered = qrConfig.fileList.filter((item) => item.uid !== action.file.uid)
      //     this.$set(qrConfig, 'fileList', filtered)
      //   }
      //   return
      // }
    },

    async uploadConfigFile(action) {
      try {
        let res = await uploadFileToServer(action.file)
        console.log('----uploadConfigFile------', res)
        return res
      } catch (e) {
        console.log(e)
      }
    },

    async handleFileSuccess(index, response, file, fileList) {
      console.log('handleFileSuccess--', index, response, file)

      if (response && response.data) {
        let ret = await getFileById(response.data)
        console.log(ret)
        this.formData.payeeAccountConfig.files[index].fileId = response.data // fileId
        this.$set(this.formData.payeeAccountConfig.files[index], 'fileUrl', ret.data.fileUrl)
      } else {
        console.error('上传文件出错，data 为空')
        this.$set(this.formData.payeeAccountConfig.files[index], 'fileUrl', [])
      }

      this.$refs.formDataRef.clearValidate([`payeeAccountConfig.files[${index}].fileUrl`])
    },
    handleFileRemove(index, file, fileList) {
      console.log('---handleFileRemove---', index, file, fileList)
      this.formData.payeeAccountConfig.files[index].fileUrl = undefined
    },
    // async getProductById(productId) {
    //   let res = await getProductById(productId)
    //   this.formData.isOneTimeAccept = res.data.isOneTimeAccept
    // },
    handleProductChanged(e) {
      console.log(e)
      // this.getProductById(e)
      this.loadingInfo = true
      this.formData.payeeAccountConfig = null // 先清空页面
      getPayeeAccountInfoByProductId(e)
        .then((res) => {
          // this.loadingInfo = false
          // 处理按钮 空参数 问题
          if (res.data.buttons) {
            res.data.buttons = res.data.buttons.map((item) => {
              if (item.buttonParamList && item.buttonParamList.length > 0) {
                item.buttonParamList = item.buttonParamList.filter((ele) => ele.buttonParamId)
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
                fileList: [],
                uploadedFiles: []
              }
            }
          }
        })
        .catch((err) => {
          this.loadingInfo = false
        })
        .finally(() => {
          this.loadingInfo = false
        })
    },

    closeTongjiDialog() {
      this.isShowTongjiDialog = false
    },

    // async showTongJi(row) {
    //   this.isShowTongjiDialog = true
    //   this.tongjiData = {
    //     ...row,
    //     totalOrderAmount: 0,
    //     totalOrderCount: 0,
    //     yesterdayOrderAmount: 0,
    //     yesterdayOrderCount: 0,
    //     todayOrderAmount: 0,
    //     todayOrderCount: 0
    //   }

    //   let res = await getPayeeAccountInfoCount(row.payeeAccountId)
    //   this.tongjiData = {
    //     ...row,
    //     ...res.data
    //   }
    // },

    async showTongJi(row, index) {
      let payeeAccountId = row.payeeAccountId
      let res = await getPayeeAccountInfoCount(payeeAccountId)
      row = {
        ...row,
        ...res.data
      }
      // res.data 中 payeeAccountId 是 null
      row.payeeAccountId = payeeAccountId
      this.$set(this.tableData, index, row)
    },

    onChangePayeeAccountExpireTimeType() {
      this.$refs.formPatchDataRef.clearValidate([
        'payeeAccountExpireTime',
        'payeeAccountExpireDuration'
      ])
    },
    onPatchDialogBtnCancel() {
      this.showPatchDialogVisable = false
      this.$refs.formPatchDataRef.resetFields()
    },

    // 批量开关
    async patchActive(isActive) {
      const params = {
        tenantId: this.$store.state.tenant.selectTenantId,
        isActive: isActive ? 1 : 0
      }
      await updatePayeeAccountInfoBatch({
        ...params,
        payeeAccountIds: this.selectionRows.map((item) => item.payeeAccountId)
      })
      this.flushPage()
    },

    onPatchDialogBtnOk() {
      console.log('-----onPatchDialogBtnOk--hello--')
      this.$refs.formPatchDataRef.validate(async (valid) => {
        console.log('-----valid----', valid)
        if (valid) {
          const params = {
            tenantId: this.$store.state.tenant.currTenantId,
            isActive: this.formPatchData.isActive,
            // isOneTimeAccept: this.formPatchData.isOneTimeAccept,
            limitAmountType: this.formPatchData.limitAmountType,
            fixedAmount: this.formPatchData.fixedAmount,
            minAmount: Number(this.formPatchData.minAmount),
            maxAmount: Number(this.formPatchData.maxAmount),
            dailyMaxAmount: Number(this.formPatchData.dailyMaxAmount),
            dailyMaxCount: Number(this.formPatchData.dailyMaxCount),
            payeeAccountExpireTimeType: this.formPatchData.payeeAccountExpireTimeType,
            payeeAccountExpireTime: this.formPatchData.payeeAccountExpireTime,
            payeeAccountExpireDuration: Number(this.formPatchData.payeeAccountExpireDuration),

            updatePayeeAccountExpireTime: this.formPatchData.updatePayeeAccountExpireTime == 1,
            updateLimitAmountType: this.formPatchData.updateLimitAmountType == 1,
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
              payeeAccountIds: this.selectionRows.map((item) => item.payeeAccountId)
            })
          }

          this.onPatchDialogBtnCancel()
          this.flushPage()
        }
      })
    },
    showPatchDialog(isModAll) {
      this.isModAll = isModAll // 是否是全部修改

      this.formPatchData = {
        isActive: null, // 0 保持不变  1  开启   2  关闭
        limitAmountType: 0, // 0 无限制  1  固定金额   2 范围金额
        // isOneTimeAccept: null, // 0 保持不变  1  开启   2  关闭
        updateLimitAmountType: 0,
        updateDailyMaxAmount: 0,
        updateDailyMaxCount: 0,
        updatePayeeAccountExpireTime: 0,
        payeeAccountExpireTimeType: 0
      }

      this.showPatchDialogVisable = true
    },

    /**
     * 批量新增
     */
    addPatch() {
      this.isShowPatchDialog = true
      this.formData = {}
      this.patchAddFileList = []
    },
    //批量删除
    async deleteAll() {
      try {
        await this.$confirm('确定删除选中的收款信息吗？')
        // 删除选中的行
        await payeeAccountBatchDelete(this.selectionRows.map((item) => item.payeeAccountId))
        //todo 调用接口删除
        this.$message.success('删除成功')
        this.flushPage()
      } catch (e) {
        console.log('取消删除')
      }
    },

    handleSelectionChange(val) {
      // console.log(JSON.stringify(val))
      this.selectionRows = val
    },
    // open(row) {
    //   this.$alert(row ? row : '无', '原因', {
    //     confirmButtonText: '知道了',
    //     callback: (action) => {
    //       console.log('关闭')
    //     }
    //   })
    // },
    async checkIncomeInfo(row) {
      // this.$alert('查看 ' + row.payeeAccountName + ' 的详细内容', '查看', {
      //   confirmButtonText: '知道了',
      //   callback: (action) => {
      //     console.log('关闭')
      //   }
      // })

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
            url: resp.data.fileUrl,
            uid: resp.data.fileId || resp.data.fileUrl || `${Date.now()}`
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
              url: resp.data.fileUrl,
              uid: resp.data.fileId || resp.data.fileUrl || `${Date.now()}-${index}`
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
    optAll(flag) {
      this.tableData = this.tableData.map((item) => {
        item.isActive = flag
        return item
      })
    },
    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确定删除收款信息 【 ${row.userName} 】 吗？`)

        let ret = await isExistCollectorderTaken(row.payeeAccountId)
        if (ret.data) {
          this.$alert('有订单正在使用，无法删除！')
          return
        }

        await deletePayeeAccountInfo(row.payeeAccountId)
        this.$message.success('删除成功')
        this.flushPage()
      } catch (e) {
        console.log('取消删除')
      }
    },
    async showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.isDialogLoading = false
      this.firstTextMult = false

      this.formData = Object.assign({}, row)
      this.getProductInfoListByProviderId(row.providerId)
      try {
        this.loadingInfo = true
        const res = await getPayeeAccountInfoById(row.payeeAccountId)

        const qrConfig = res.data.qrConfig
        qrConfig.fileId = qrConfig.qrUrl // 其实是 fileId

        if (qrConfig.parseType == null) {
          qrConfig.parseType = 0
          qrConfig.fileList = []
          console.error('-----不应该出现的情况，-----', qrConfig.parseType)
        } else if (qrConfig.parseType != 2) {
          // 0 原图 1 上传并解析
          if (qrConfig.qrUrl) {
            let resp = await getFileById(qrConfig.qrUrl) // 其实是 fileId

            qrConfig.fileList = [
              {
                name: resp.data.originalName,
                url: resp.data.fileUrl,
                uid: resp.data.fileId || resp.data.fileUrl || `${Date.now()}`
              }
            ]
            this.qrImageUrl = resp.data.fileUrl
          }
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
                url: resp.data.fileUrl,
                uid: resp.data.fileId || resp.data.fileUrl || `${Date.now()}-${index}`
              }
            ]
          }
        }
        this.acceptOrderForm = row.acceptOrderConfig
        this.formData = {
          ...this.formData,
          payeeAccountConfig: {
            texts: res.data.texts,
            buttons: res.data.buttons,
            qrConfig: qrConfig,
            files: res.data.files
          }
        }
        this.$refs.formDataRef.clearValidate()
        this.$forceUpdate()
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingInfo = false
      }
    },
    showAddDialog() {
      this.providerProductList = []
      this.isEdit = false
      this.isDialogLoading = false
      this.firstTextMult = false
      this.dialogVisible = true
      this.formData = {
        // payeeAccountName: '',
        // limitAmountType: 0,
        // fixedAmount: '',
        // minAmount: '',
        // maxAmount: '',
        // dailyMaxAmount: '',
        // dailyMaxCount: '',
        // remark: '',
        // income_info_name: '',
        // productId: ''
        // isActive: 1
      }
      this.acceptOrderForm = this.getDefaultAcceptOrderForm()
    },
    onDialogBtnCancel() {
      this.dialogVisible = false
      this.isPayeeAccountNameExist = false
      this.qrImageUrl = undefined
      if (this.$refs.formDataRef) {
        this.$refs.formDataRef.resetFields()
      }
      if (this.$refs.acceptOrderRef) {
        this.$refs.acceptOrderRef.resetFields()
      }
      this.acceptOrderForm = this.getDefaultAcceptOrderForm()
    },
    async onDialogBtnOk() {
      
      // 如果填写了数据，但没有生成 二维码，提示，请先生成二维码
      if (
        this.formData.payeeAccountConfig &&
        this.formData.payeeAccountConfig.qrConfig.parseType == 2 &&
        !this.formData.payeeAccountConfig.qrConfig.GenerQrUrl &&
        this.formData.payeeAccountConfig.qrConfig.parseValue.length > 0
      ) {
        this.$message.error('请先生成二维码')
        this.isDialogLoading = false
        return
      }

      try {
        const basicValid = await new Promise((resolve) => {
          this.$refs.formDataRef.validate((valid) => resolve(valid))
        })

        if (!basicValid) {
          return
        }

        let acceptValid = true
        if (this.$refs.acceptOrderRef) {
          acceptValid = await new Promise((resolve) => {
            this.$refs.acceptOrderRef.validate((valid) => resolve(valid))
          })
        }
        if (!acceptValid) {
          return
        }

        this.isDialogLoading = true


        if (this.isEdit) {
          try {
            const eidtParams = this.procPayeeAccountInfoEditParams()
            eidtParams.payeeAccountName = this.formData.payeeAccountName
            const acceptParams = this.buildAcceptOrderParams(this.acceptOrderForm, [this.formData.payeeAccountId])
            
            Promise.all([
              updatePayeeAccountInfo(eidtParams),
              updatePayeeAccountInfoBatch(acceptParams)
            ]).then(() => {
              this.$message.success('修改成功')
              this.onDialogBtnCancel()
              this.flushPage()
            }).catch((error) => {
              console.error(error)
            })
          } catch (error) {
            console.error(error)
          } finally {
            this.isDialogLoading = false
          }
          return
        }

        

       

        await this.handleCreateWithAcceptConfig()
      } catch (error) {
        console.error(error)
      } finally {
        // this.isDialogLoading = false
      }
    },

    /**
     * 多行文本，批处理 创建收款码，
     * 典型如： 淘宝代付，批量上码
     */
    async handFirstTextMultConfig(formData){
      const originalName = formData.payeeAccountName
      let allNames = originalName.split('|').map((ele) => ele.trim())

      const configData = formData.payeeAccountConfig

      // 首行文本，所以 下标 固定为 0
      let textValues = configData.texts[0].textValue.trim().split('\n')

      const createdIds = []

      try{

        let allTask = []
        let providerId = formData.providerId
        let productId = formData.productId
        let remark = formData.remark

        let isFirst = true // 第一小段
        
        for (let index = 0; index < textValues.length; index++) {
          const textValue = textValues[index];
          const paramData = this.procPayeeAccountInfoParams(null, textValue)
          const payeeAccountName =  allNames[index % allNames.length] 
          
          let p = async ()=> {
            try {
              if(!isFirst){
                // 不是第一小段，显示加载中
                this.$store.commit('app/setLoadingEnable', false)
              }
              const res=await addPayeeAccountInfo({
                tenantId: this.$store.state.tenant.currTenantId,
                providerId: providerId,
                productId: productId,
                payeeAccountName,
                payeeAccountConfig: paramData,
                remark: remark
              })
              const newPayeeAccountId = this.extractPayeeAccountId(res)
              createdIds.push(newPayeeAccountId)
             
            } catch(error) {
              console.error(error)
              return
            }
          }
          allTask.push(p)
        }

       
        let isOnlyOne = true // 仅有一小段
        let acceptOrderForm = JSON.parse(JSON.stringify(this.acceptOrderForm))

        promisePool(allTask, 10, 50, 1000, async (completedCount) => {
          console.log(`已完成${completedCount}个请求`)
          let teamIds = createdIds.join(',').split(',')
          createdIds.length = 0
          if(!isFirst){
            // 不是第一小段，显示加载中
            this.$store.commit('app/setLoadingEnable', false)
          }
          await this.updatePatchCreatedPayee(teamIds, acceptOrderForm)
          // 第一小段完成了
          if(isFirst){
            isFirst = false
            this.dialogVisible = false
            this.flushPage()
          }else{
            isOnlyOne = false
          }

        }).then(() => {
         
        })

      } catch (error) {
        console.error(error)
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          (typeof error === 'string' ? error : '')
        this.$message.error(msg || '新增失败')
        return
      }

     
    },
    /**
     * 创建收款码
     */
    async handleCreateWithAcceptConfig() {

      const formData = this.formData

      // 第一个文本是多文本模式 
      if(this.firstTextMult){
        this.handFirstTextMultConfig(formData)
        return 
      }

      const createdIds = []
      // 去掉所有的 回车 换行 空格
      const originalName = formData.payeeAccountName.replace(/\s+/g, '')

      const isMutiplyQrImg = originalName.split('|').length > 1

      // 多图模式
      if(isMutiplyQrImg){
        // 2 秒后 关闭 对话框
        // setTimeout(() => {
        //   }, 2000);

        // 等待上传所有图片完成
        await new Promise((resolve) => {
          const qrConfig = formData.payeeAccountConfig.qrConfig
          // this.$refs.formDataRef.uploadAllImage()
          let tempFlag = setInterval(() => {
            if(qrConfig.uploadedFiles && qrConfig.uploadedFiles.length > 0 && qrConfig.failedFiles && qrConfig.fileList){
              // 都有值了
              console.log(`===================> ${qrConfig.uploadedFiles.length} + ${qrConfig.failedFiles.length} == ${qrConfig.fileList.length}`);
              if(qrConfig.uploadedFiles.length + qrConfig.failedFiles.length == qrConfig.fileList.length){
                
                // 且所有的 fileUrl 都已经获取到了
                if(qrConfig.uploadedFiles.every((ele) => ele.url)){
                  clearInterval(tempFlag)
                  resolve()
                }
              }
            }
          }, 200);
        })

      }
     

      const qrConfig = formData.payeeAccountConfig?.qrConfig

      let uploadedFiles = []
      if (qrConfig && qrConfig.parseType !== 2) {
        if (qrConfig.uploadedFiles && qrConfig.uploadedFiles.length) {
          uploadedFiles = qrConfig.uploadedFiles
        } else if (qrConfig.fileId) {
          uploadedFiles = [{ fileId: qrConfig.fileId, url: qrConfig.qrUrl }]
        }
      }

      const iterations = uploadedFiles.length > 0 ? uploadedFiles.length : 1
      const nameNeedSuffix = iterations > 1
      let allNames = originalName
      if (nameNeedSuffix) {
        // 书写的顺序，和上传成功的顺序可能会不一样
        allNames = originalName.split('|').map((ele) => ele.trim())
        let newNames = []
        uploadedFiles.forEach((ele, index) => {
          let i = this.$refs.formDataRef.getFileIndex(ele.name)
          newNames[index] = allNames[i % allNames.length]
        })
        allNames = newNames
      }

      try {
        let allTask = []
        let providerId = formData.providerId
        let productId = formData.productId
        let remark = formData.remark

        for (let i = 0; i < iterations; i++) {
          const fileInfo = uploadedFiles[i] || null
          // 必须有fileId 如果没有，就跳过
          if (iterations > 1 && (!fileInfo || !fileInfo.fileId)) {
            console.warn('跳过没有上传成功的图片', fileInfo)
            continue
          }

          const paramData = this.procPayeeAccountInfoParams(fileInfo)
          const payeeAccountName = nameNeedSuffix ? allNames[i % allNames.length] : originalName

          let p = async ()=> {
            try {
              this.$store.commit('app/setLoadingEnable', false)
              const res=await addPayeeAccountInfo({
                tenantId: this.$store.state.tenant.selectTenantId,
                providerId: providerId,
                productId: productId,
                payeeAccountName,
                payeeAccountConfig: paramData,
                remark: remark
              })
              const newPayeeAccountId = this.extractPayeeAccountId(res)
              createdIds.push(newPayeeAccountId)
              // this.$message.success(`新增第${i + 1}个收款账号成功`)
            } catch(error) {
              console.error(error)
              return
            }
          }
          allTask.push(p)
        }

        let isFirst = true // 第一小段

        let acceptOrderForm = JSON.parse(JSON.stringify(this.acceptOrderForm))

        promisePool(allTask, 10, 20, 1000, async (completedCount) => {
          console.log(`已完成${completedCount}个请求`)
          let teamIds = createdIds.join(',').split(',')
          createdIds.length = 0
          this.$store.commit('app/setLoadingEnable', false)
          await this.updatePatchCreatedPayee(teamIds, acceptOrderForm)
          console.log('一小段完成了', teamIds.length);
          // 第一小段完成了，
          // 不管是单个还是多个，都在此时关闭对话框
          if(isFirst ){
            isFirst = false
            this.dialogVisible = false
            this.flushPage()
            
          }

        }).then(() => {
          // 全部完成了
          console.log('全部完成了', createdIds.length);
          // this.$message.success(`成功新增${createdIds.length}个收款码`)
         
        })

      } catch (error) {
        console.error(error)
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          (typeof error === 'string' ? error : '')
        this.$message.error(msg || '新增失败')
        return
      }

    },

    async updatePatchCreatedPayee(createdIds, acceptOrderForm, isEnd=false){
       try {
        const acceptParams = this.buildAcceptOrderParams(acceptOrderForm, createdIds)
        await updatePayeeAccountInfoBatch(acceptParams)
        if(isEnd){
          this.$message.success(createdIds.length > 1 ? '批量新增成功' : '新增成功')
        }
      } catch (error) {
        console.error(error)
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          (typeof error === 'string' ? error : '')
        this.$message.error(
          msg || '接单配置保存失败，请稍后在列表中通过"接单配置"按钮重试'
        )
      } finally {
        if(isEnd){
          this.onDialogBtnCancel()
          this.flushPage()
        }
      }
    },




    getDefaultAcceptOrderForm() {
      return createDefaultAcceptOrderForm()
    },
    buildAcceptOrderParams(form, payeeAccountIds) {
      return {
        tenantId: this.$store.state.tenant.currTenantId,
        isActive: form.isActive,
        limitAmountType: form.limitAmountType,
        fixedAmount: form.limitAmountType == 1 ? form.fixedAmount : '',
        minAmount: form.limitAmountType == 2 ? Number(form.minAmount || 0) : 0,
        maxAmount: form.limitAmountType == 2 ? Number(form.maxAmount || 0) : 0,
        dailyMaxAmount: Number(form.dailyMaxAmount || 0),
        dailyMaxCount: Number(form.dailyMaxCount || 0),
        payeeAccountExpireTimeType: form.payeeAccountExpireTimeType,
        payeeAccountExpireTime:
          form.payeeAccountExpireTimeType == 1 ? form.payeeAccountExpireTime : '',
        payeeAccountExpireDuration:
          form.payeeAccountExpireTimeType == 2
            ? Number(form.payeeAccountExpireDuration || 0)
            : 0,
        updatePayeeAccountExpireTime: true,
        updateLimitAmountType: true,
        updateDailyMaxAmount: true,
        updateDailyMaxCount: true,
        payeeAccountIds
      }
    },
    extractPayeeAccountId(res) {
      if (!res) {
        return null
      }
      if (typeof res === 'number' || typeof res === 'string') {
        return res
      }
      if (res.payeeAccountId) {
        return res.payeeAccountId
      }
      if (res.id) {
        return res.id
      }
      if (res.data) {
        if (typeof res.data === 'number' || typeof res.data === 'string') {
          return res.data
        }
        if (res.data.payeeAccountId) {
          return res.data.payeeAccountId
        }
        if (res.data.id) {
          return res.data.id
        }
      }
      return null
    },
    onAcceptExpireTypeChange(refName, form) {
      const formRef = this.$refs[refName]
      if (formRef && typeof formRef.clearValidate === 'function') {
        formRef.clearValidate(['payeeAccountExpireTime', 'payeeAccountExpireDuration'])
      }
      const target = form || (refName === 'configOrderRef' ? this.formData : this.acceptOrderForm)
      if (!target) {
        return
      }
      if (target.payeeAccountExpireTimeType !== 1) {
        target.payeeAccountExpireTime = ''
      }
      if (target.payeeAccountExpireTimeType !== 2) {
        target.payeeAccountExpireDuration = ''
      }
    },

    procPayeeAccountInfoEditParams() {
      const configData = this.formData.payeeAccountConfig
      if (
        configData.qrConfig &&
        configData.qrConfig.parseType == 2 &&
        configData.qrConfig.GenerQrUrl
      ) {
        // 上传图片 得到的  二维码图片地址
        configData.qrConfig.qrUrl = configData.qrConfig.GenerQrUrl
      }

      const payeeAccountConfig = {
        payeeAccountId: this.formData.payeeAccountId,
        remark: this.formData.remark,
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
                        payeeAccountButtonParamId: param.payeeAccountButtonParamId,
                        paramCode: param.paramCode,
                        buttonParamValue: param.buttonParamValue,
                        isShow: param.isShow
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

    procPayeeAccountInfoParams(qrFileInfo = null, firstTextValue = null) {
      const configData = this.formData.payeeAccountConfig || {}

      const texts = configData.texts
        ? configData.texts.map((ele, index) => ({
                textConfigId: ele.textConfigId,
                textValue: (index == 0 && firstTextValue != null) ? firstTextValue : ele.textValue
          }))
        : configData.texts

      const buttons = configData.buttons
        ? configData.buttons.map((ele) => ({
                buttonConfigId: ele.buttonConfigId,
                buttonUrl: ele.buttonUrl,
                buttonParamList: ele.buttonParamList
              ? ele.buttonParamList.map((param) => ({
                        buttonParamId: param.buttonParamId,
                        paramCode: param.paramCode,
                        buttonParamValue: param.buttonParamValue,
                        isShow: param.isShow
                }))
                  : ele.buttonParamList
          }))
        : configData.buttons

      let qrConfigResult = null
      if (configData.qrConfig) {
        const sourceQrConfig = configData.qrConfig
        let qrFileId = sourceQrConfig.fileId

        if (qrFileInfo && qrFileInfo.fileId) {
          qrFileId = qrFileInfo.fileId
        } else if (sourceQrConfig.parseType == 2 && sourceQrConfig.GenerQrUrl) {
          qrFileId = sourceQrConfig.fileId
        }

        qrConfigResult = {
          qrConfigId: sourceQrConfig.qrConfigId,
          qrUrl: qrFileId,
          isActive: sourceQrConfig.isActive,
          parseValue: sourceQrConfig.parseValue,
          parseType: sourceQrConfig.parseType
        }
      }

      const files = configData.files
        ? configData.files.map((ele) => ({
            fileConfigId: ele.fileConfigId,
            fileUrl: ele.fileId
          }))
          : configData.files

      return {
        texts,
        buttons,
        qrConfig: qrConfigResult,
        files
      }
    },

    onConfigOrderBtnCancel() {
      this.$refs.configOrderRef.resetFields()
      this.configOrderdialogVisible = false
    },
    onConfigOrderBtnOk() {
      console.log('-----onConfigOrderBtnOk--hello--')

      this.$refs.configOrderRef.validate(async (valid) => {
        console.log('-----valid----', valid)

        if (valid) {
          const params = this.buildAcceptOrderParams(this.formData, [
            this.formData.payeeAccountId
          ])

          await updatePayeeAccountInfoBatch(params)

          this.$message.success('更新成功')

          this.onConfigOrderBtnCancel()
          this.flushPage()
        }
      })
    },

    showConfigOrderDialog(row) {
      this.configOrderdialogVisible = true
      this.formData = Object.assign({}, row.acceptOrderConfig)
      this.formData.payeeAccountId = row.payeeAccountId
    },

    async loadTableData(page) {
      const params = {
        tenantId: this.$store.state.tenant.currTenantId
      }
      this.page = page
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          // this.queryFormData[key] !== ''
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
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

      const res = await getPayeeAccountInfoListPage(page, params)
      this.tableData = res.data.list

      // setTimeout(() => {
      //   this.tableData.forEach((row, index) => {
      //     this.showTongJi(row, index)
      //   })
      // }, 2000)

      console.log(res)
      return res
    },

    flushPage() {
      // 保持当前页不变 
      this.$refs.tableRef.getTableData(this.page.pageNum)
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormDataRef.resetFields()
      this.$refs.tableRef.getTableData(1)
    },
    getQueryForm() {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 0, 0, 0)
      const nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      const todayStr = formatDateTime(today)
      return {
        isAvailable: '',
        providerId: '',
        productId: '',
        isActive: '',
        payeeAccountName: '',
        // createTime: [todayStr, nowStr]
        createTime: []
      }
    },

    queryTableData() {

      this.$refs.queryFormDataRef.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    },
    buildMinAmountRules(target) {
      return [
        { required: true, message: '请输入最小金额', trigger: 'blur' },
        { validator: amountCheck, trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (!target) {
              return callback()
            }
            if (isEmpty(target.minAmount) || isEmpty(target.maxAmount)) {
              return callback()
            }
            if (Number(target.minAmount) >= Number(target.maxAmount)) {
              return callback(new Error('必须小于最大金额'))
            }
            return callback()
          },
          trigger: 'blur'
        }
      ]
    },
    buildMaxAmountRules(target) {
      return [
        { required: true, message: '请输入最大金额', trigger: 'blur' },
        { validator: amountCheck, trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (!target) {
              return callback()
            }
            if (isEmpty(target.minAmount) || isEmpty(target.maxAmount)) {
              return callback()
            }
            if (Number(target.minAmount) >= Number(target.maxAmount)) {
              return callback(new Error('必须大于最小金额'))
            }
            return callback()
          },
          trigger: 'blur'
        }
      ]
    },
  }
}
</script>

<style lang="scss" scoped>
.text {
  color: red;
  font-size: 12px;
  margin: 0;
}
.hand {
  cursor: pointer;
}
.request {
  padding: 15px 20px;

  .req-line {
    display: flex;
    line-height: 40px;
    .req-label {
      width: 120px;
    }
  }
}


::v-deep .cell .el-tag{
  margin-right: 0px;
}

.tongji-item {
  display: flex;
  justify-content: space-between;
  // flex-wrap: wrap;
  .count,
  .amount {
    white-space: nowrap;
    font-size: 12px;
    color: red;
  }
  .count{
    width: 40px;
  }
  .amount{
    flex: 1;
  }
  .tongji-txt {
    padding: 0 3px;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

// ::v-deep .add-form .el-upload {
//   .avatar-uploader-icon {
//     border: 1px solid #ddd;
//   }
// }

// ::v-deep .add-form .el-upload--picture-card {
//   width: auto;
//   height: auto;
//   border: none;
//   line-height: 0;
//   background-color: transparent;
//   box-shadow: none;
// }

::v-deep .add-form{
  .el-form-item{
    margin-bottom: 0;
  }
  .file-config .el-upload {
    display: block;
  }
}
::v-deep .add-form .file-config .el-upload-list__item:first-child {
  margin-top: 0;
  line-height: 32px;

  display: flex;
  justify-content: space-between;
}
.help-tip2 {
  font-size: 12px;
  line-height: 16px;
  color: #cc0000;
}
</style>

