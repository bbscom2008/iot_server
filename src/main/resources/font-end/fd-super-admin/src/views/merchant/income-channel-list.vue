<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :rules="queryRules" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="通道名称" prop="channelName">
          <el-select
            filterable
            v-model="queryFormData.channelName"
            placeholder="请选择通道名称"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in allChannelList"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道编码" prop="channelCode">
          <el-select
            filterable
            v-model="queryFormData.channelCode"
            placeholder="请选择通道编码"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in allChannelList"
              :key="item.channelId"
              :label="item.channelCode"
              :value="item.channelCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易类型" prop="tradeType">
          <el-select
            filterable
            v-model="queryFormData.tradeType"
            placeholder="请选择交易类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="金额" style="" prop="queryAmount">
          <el-input
            v-model="queryFormData.queryAmount"
            v-number-input
            type="number"
            placeholder="请输入"
            size="small"
          >
            <template slot="append">元</template>
          </el-input>
          <!-- <el-col class="line" style="text-align: center" :span="2">至</el-col>
          <el-col :span="9">
            <el-input v-model="queryFormData.maxValue" placeholder="请输入" size="small">
              <template slot="append">元</template>
            </el-input>
          </el-col> -->
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select v-model="queryFormData.isActive" placeholder="请选择是否启用" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="访问后匹配" prop="isMatchOrderAfterVisit">
          <el-select
            v-model="queryFormData.isMatchOrderAfterVisit"
            placeholder="请选择"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
            >搜索</el-button
          >
          <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-10">
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>
      <el-button type="success" plain icon="el-icon-download" @click="exportReport()"
        >导出</el-button
      >
      <el-button type="primary" plain icon="el-icon-plus" @click="showCopyDialog()">复制</el-button>

      <el-button
        type="primary"
        :disabled="selectionRows.length == 0"
        plain
        icon="el-icon-plus"
        @click="showPatchDialog(false)"
        >批量修改</el-button
      >
      <el-button type="primary" plain icon="el-icon-plus" @click="showPatchDialog(true)"
        >全部修改</el-button
      >

       <el-button type="danger" icon="el-icon-download" @click="deleteAll()"
            >全部删除[超管专用]</el-button
          >


      

      <my-table
        class="mt-10"
        :loadData="getChannelListPage"
        ref="tableRef"
        style="width: 100%"
        border
        :tableData="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="通道名称" align="center" prop="channelName" />
        <el-table-column label="通道编码" align="center" prop="channelCode" />
        <el-table-column label="交易类型" align="center" prop="tradeType">
          <template slot-scope="{ row }">
            <el-tag  :type="row.tradeType == 0 ? 'success' : 'primary'" size="small">{{ row.tradeType == 0 ? '代收' : '代付' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="金额值" align="center" min-width="130">
          <template slot-scope="{ row }">
            <span v-if="row.limitAmountType == 0">无限制</span>

            <div
              v-if="row.limitAmountType == 1"
              style="display: flex; flex-wrap: wrap; gap: 5px; justify-content: center"
            >
              <span v-if="row.fixedAmount">
                <el-tag
                  :key="index"
                  v-for="(item, index) in row.fixedAmount.split(',')"
                  size="small"
                  >{{ item }}</el-tag
                >
              </span>
            </div>

            <span v-if="row.limitAmountType == 2">
              <el-tag size="small">{{ row.minAmount }}</el-tag> ~
              <el-tag size="small">{{ row.maxAmount }}</el-tag>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="可用商户数量" align="center" prop="enableMerchantCount" />
        <el-table-column label="可用产品数量" align="center" prop="enableProductCount" />

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" @change="(e) => isActiveSwitch(e, row)" />
          </template>
        </el-table-column>

        <el-table-column label="匹配模式" align="center" width="160">
          <template slot="header">
            匹配模式
            <el-tooltip
              class="item"
              effect="dark"
              content="等用户访问收银台后，再将订单分配给码商"
              placement="top"
              ><i class="el-icon-question"></i>
            </el-tooltip>
          </template>

          <template slot-scope="{ row }">
            <!-- <el-switch
              v-if="row.tradeType == 0"
              v-model="row.isMatchOrderAfterVisit"
              @change="(e) => isMarchOrderAfterVisitSwitch(e, row)"
            /> -->
            <el-select
              v-if="row.tradeType == 0"
              v-model="row.isMatchOrderAfterVisit"
              @change="(e) => isMarchOrderAfterVisitSwitch(e, row)"
              placeholder="请选择"
              size="small"
            >
              <el-option label="直接匹配" :value="0"></el-option>
              <el-option label="访问后匹配" :value="1"></el-option>
              <!-- <el-option label="提交订单后匹配" :value="2"></el-option> -->
              <el-option label="访问后匹配【无预匹配】" :value="3"></el-option>
            </el-select>

          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="250" fixtt="right">
          <template slot-scope="{ row }">
            <div class="opt">
              <div type="success" class="btn" @click="showPeizhiDialog(row)">
                <i class="el-icon-setting" /> 配置商户
              </div>
              <div type="primary" class="btn" @click="showConfirmPeizhi(row)">
                <i class="el-icon-setting" /> 配置产品
              </div>
              <div type="primary" class="btn" @click="showTestOrder(row)">
                <i class="el-icon-setting" /> 测试订单
              </div>
              <div type="success" class="btn" style="margin: 5px 0" @click="showEditDialog(row)">
                <i class="el-icon-edit" /> 修改
              </div>
              <div type="primary" class="btn" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" /> 删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>
    <el-dialog
      :visible.sync="showCopyDialogVisable"
      @close="onCopyDialogClose()"
      title="复制通道"
      width="500px"
    >
      <div class="help-tip txt-center mb-10">
        复制通道就是根据已有的通道相关配置，快速创建新的通道。
      </div>

      <el-form
        ref="copyFormData"
        :rules="rules"
        :model="copyFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="通道名称" prop="channelName">
          <el-input v-model="copyFormData.channelName" placeholder="请输入通道名称" size="small" />
        </el-form-item>

        <el-form-item label="通道编码" prop="channelCode" :rules="channelCodeRules">
          <el-input v-model="copyFormData.channelCode" placeholder="请输入通道名称" size="small" />
        </el-form-item>

        <el-form-item label="通道模板" prop="channelId">
          <el-select v-model="copyFormData.channelId" placeholder="请选择" size="small">
            <el-option
              v-for="item in allChannelList"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCopyDialogClose()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onCopyDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      @close="onDialogBtnCancel()"
      :title="isEdit ? '修改通道' : '新增通道'"
      width="600px"
    >
      <el-form
        ref="formDataRef"
        :rules="rules"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="通道名称" :prop="isEdit ? '' : 'channelName'">
          <!-- :rules="isEdit ? {} : channelNameRules" -->
          <el-input
            :disabled="isEdit"
            v-model="formData.channelName"
            placeholder="请输入通道名称"
            size="small"
          />
        </el-form-item>

        <el-form-item
          label="通道编码"
          :prop="isEdit ? '' : 'channelCode'"
          :rules="isEdit ? {} : channelCodeRules"
        >
          <el-input
            v-model="formData.channelCode"
            placeholder="请输入通道编码"
            size="small"
            :disabled="isEdit"
          />
        </el-form-item>

        <el-form-item label="交易类型" :prop="isEdit ? '' : 'tradeType'">
          <el-input
            v-if="isEdit"
            disabled
            :value="formData.tradeType == 0 ? '代收' : '代付'"
            size="small"
          />

          <el-select v-else v-model="formData.tradeType" placeholder="请选择交易类型" size="small">
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="金额限制类型" prop="limitAmountType">
          <el-select v-model="formData.limitAmountType" placeholder="请选择" size="small">
            <el-option label="无限制" :value="0" />
            <el-option label="固定金额" :value="1" />
            <el-option label="范围金额" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="固定金额：" prop="fixedAmount" v-if="formData.limitAmountType == 1">
          <el-input v-model="formData.fixedAmount" placeholder="请输入" size="small" />
          <span class="help-tip">提示：多个金额用 “ , ” 分割</span>
        </el-form-item>

        <div style="display: flex">
          <el-form-item
            label="范围金额："
            prop="minAmount"
            :rules="minAmounFormtRules"
            v-if="formData.limitAmountType == 2"
          >
            <el-input
              v-model="formData.minAmount"
              v-number-input
              type="number"
              placeholder="最小值"
              size="small"
              style="width: 120px"
            />
          </el-form-item>

          <el-form-item
            label=""
            prop="maxAmount"
            :rules="maxAmounFormtRules"
            v-if="formData.limitAmountType == 2"
            label-width="0"
          >
            <span class="symbol" style="margin: 0 10px">~</span>
            <el-input
              v-number-input
              type="number"
              v-model="formData.maxAmount"
              placeholder="最大值"
              size="small"
              style="width: 120px"
            />
            <span class="symbol" style="margin: 0 10px">元</span>
          </el-form-item>
        </div>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>

        <el-form-item
          v-if="formData.tradeType == 0"
          label="访问后匹配"
          prop="isMatchOrderAfterVisit"
        >
          <el-switch v-model="formData.isMatchOrderAfterVisit" />
          <p class="help-tip">说明：是否等用户访问收银台后，再将订单分配给码商</p>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="testOrderDialogVistual"
      @close="testDialogCancel()"
      title="测试订单"
      width="600px"
    >
      <el-form
        ref="testFormRef"
        :model="formData"
        label-position="right"
        :rules="testRules"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="商户：" prop="merchantNo">
          <el-select
            v-model="formData.merchantNo"
            placeholder="请选择商户"
            size="small"
            filterable
            @change="merchantChange"
          >
            <el-option
              v-for="item in testMerchantList"
              :key="item.merchantId"
              :label="item.userNickName"
              :value="item.merchantNo"
            >
            </el-option>
          </el-select>
          <div class="help-tip" >配置了当前通道的所有商户</div>
        </el-form-item>
        <el-form-item label="产品：" prop="productId">
          <el-select
            v-model="formData.productId"
            placeholder="请选择产品"
            size="small"
            filterable
            @change="productChange"
          >
            <el-option label="全部" value="null"></el-option>
            <el-option
              v-for="item in testProductList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            >
            </el-option>
          </el-select>
          <div class="help-tip" >当前通道配置的所有产品</div>
        </el-form-item>

        <!-- 代收有码商，代付没有码商，默认 全部 ""  -->
        <el-form-item label="码商：" prop="providerId" v-if="testOrderType == 0">
          <el-select v-model="formData.providerId"  filterable  placeholder="请选择码商" size="small">
            <el-option label="全部" value="null"></el-option>
            <el-option
              v-for="item in testProviderList"
              :key="item.providerId"
              :label="item.userName"
              :value="item.providerId"
            ></el-option>
          </el-select>
          <div class="help-tip" >配置了所选产品的码商，并且是商户允许的码商</div>
        </el-form-item>

        <el-form-item label="收款人姓名：" prop="payee" v-if="testOrderType == 1">
          <el-input v-model="formData.payee" placeholder="请输入收款人姓名：" size="small" />
        </el-form-item>
        <el-form-item label="收款人账号：" prop="payeeNo" v-if="testOrderType == 1">
          <el-input v-model="formData.payeeNo" placeholder="请输入账号" size="small" />
        </el-form-item>
        <el-form-item label="收款人地址：" prop="payeeAddress" v-if="testOrderType == 1">
          <el-input v-model="formData.payeeAddress" placeholder="请输入地址" size="small" />
        </el-form-item>

        <el-form-item label="金额：" prop="orderAmount">
          <el-input
            v-model="formData.orderAmount"
            v-number-input
            placeholder="请输入金额"
            size="small"
          />
        </el-form-item>
        <div class="tips">注意：
          1- 确保商户、产品、码商以及代收（或代付）都是启用状态。
          2- 确保通道和收款信息金额限制配置一致。
          3- 确保码商下该产品的收款信息配置正确，并启用。
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="testDialogCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="btnTextCollectOrder()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="peizhiDialogVisible"
      @close="flushPage()"
      :title="`配置通道【${formData.channelName}】的产品`"
    >
      <div style="max-height: 600px; overflow: auto">
        <Peizhi v-if="peizhiDialogVisible" :currItem="formData"></Peizhi>
      </div>
      <!-- <div slot="footer">
        <el-button @click="peizhiDialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="peizhiDialogVisible = false" size="small">
          确定
        </el-button>
      </div> -->
    </el-dialog>

    <el-dialog
      :visible.sync="showPatchDialogVisable"
      @close="onPatchDialogBtnCancel()"
      :title="isModAll ? '全部修改' : '批量修改'"
      width="600px"
    >
      <el-form
        :rules="patchRules"
        :model="formPatchData"
        label-position="right"
        ref="formPatchData"
        label-width="150px"
        style="margin-right: 100px"
      >
        <el-form-item label="是否启用" prop="isActive">
          <el-radio-group v-model="formPatchData.isActive" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="访问后匹配" prop="isMatchOrderAfterVisit">
          <el-radio-group v-model="formPatchData.isMatchOrderAfterVisit" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="修改金额限制" prop="isUpdateLimitAmountType">
          <el-switch v-model="formPatchData.isUpdateLimitAmountType" size="small"> </el-switch>
        </el-form-item>

        <el-form-item
          v-if="formPatchData.isUpdateLimitAmountType"
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
          label="固定金额："
          prop="fixedAmount"
          v-if="formPatchData.isUpdateLimitAmountType && formPatchData.limitAmountType == 1"
        >
          <el-input
            v-model="formPatchData.fixedAmount"
            placeholder="请输入金额，多个金额用 “ , ” 分割"
            size="small"
          />
          <!-- <span class="text">提示：</span> -->
        </el-form-item>
        <div style="display: flex">
          <el-form-item
            label="范围金额："
            prop="minAmount"
            :rules="minAmountRules"
            v-if="formPatchData.isUpdateLimitAmountType && formPatchData.limitAmountType == 2"
          >
            <el-input
              v-model="formPatchData.minAmount"
              placeholder="请输入"
              size="small"
              style="width: 120px"
              v-number-input
              type="number"
            />
          </el-form-item>
          <el-form-item
            label=""
            prop="maxAmount"
            :rules="maxAmountRules"
            v-if="formPatchData.isUpdateLimitAmountType && formPatchData.limitAmountType == 2"
            label-width="0"
          >
            <span class="symbol" style="margin: 0 10px">~</span>
            <el-input
              v-model="formPatchData.maxAmount"
              placeholder="请输入"
              size="small"
              style="width: 120px"
              v-number-input
              type="number"
            />
            <span class="symbol" style="margin: 0 10px">元</span>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="onPatchDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onPatchDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <!-- 通道配置商户 -->
    <el-dialog
      :visible.sync="merchantSettingDialog"
      :title="'配置通道【' + formMerchant.channelName + '】的商户'"
      width="900px"
    >
      <div style="max-height: 600px; overflow: auto">
        <Peizhi-merchant
          v-if="merchantSettingDialog"
          :currItem="formMerchant"
          :parentV="merchantSettingDialog"
        ></Peizhi-merchant>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Peizhi from './income_channel_setting.vue'
import PeizhiMerchant from './income-channe-list-settingMerchant.vue'
import { merchantRules, queryRules } from './rules'
import { patchRules } from './patchRules'

import { codeRule, userNickNameRules } from '@/utils/validate.js'

import { isEmpty, processFixAmountString } from '@/utils'

import { getChannelByTenantId } from '@/api/merchant.js'

import {
  getChannelListPage,
  channelActive,
  channelMatchAfterVisit,
  channelCreate,
  channelCopy,
  // channelOptions,
  channelDelete,
  channelUpdateBatch,
  channelUpdateAll,
  checkChannelCode,
  getMerchantListByChannelIdTest,
  getProviderListByChannelIdForTest,
  testCollectOrder,
  testPaymentOrder,
  getProductListByChannelId,
  channelExport
} from '@/api/merchant'
import FileSaver from 'file-saver'
import { amountCheck } from '@/utils/validate.js'
export default {
  components: {
    Peizhi,
    PeizhiMerchant
  },
  name: 'IncomeChannelList',
  data() {
    return {
     
      queryRules,
      testRules: {
        merchantNo: [{ required: true, message: '请选择商户', trigger: 'change' }],
        providerId: [{ required: true, message: '请选择码商', trigger: 'change' }],
        productId: [{ required: true, message: '请选择产品', trigger: 'change' }],
        payee: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        payeeNo: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        payeeAddress: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        orderAmount: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          // { validator: amountCheck, trigger: 'blur' }
        ]
      },
      minAmountRules: [
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
      maxAmountRules: [
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

      minAmounFormtRules: [
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
      maxAmounFormtRules: [
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

      rules: merchantRules,
      patchRules: patchRules,
      testProductList: [], // 测试订单  产品列表
      channelCodeRules: [
        { required: true, message: '请输入通道编码', trigger: 'blur' },
        // codeRule,
        {
          validator: async (rule, value, callback) => {
            console.log(value)

            // 如果修改的时候，新名与旧名相同，不校验
            // if (this.isEdit && this.oldFormData.userNickName == this.formData.userNickName) {
            //   return callback()
            // }

            let ret = await checkChannelCode(value)
            if (ret.data) {
              callback(new Error('编码已存在'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      // channelNameRules: [
      //   { required: true, message: '请输入通道名称', trigger: 'blur' },
      //   ...userNickNameRules,
      //   {
      //     validator: async (rule, value, callback) => {
      //       console.log(value)

      //       // 如果修改的时候，新名与旧名相同，不校验
      //       // if (this.isEdit && this.oldFormData.userNickName == this.formData.userNickName) {
      //       //   return callback()
      //       // }

      //       let ret = await checkChannelCode(value)
      //       if (ret.data) {
      //         callback(new Error('名称已存在'))
      //       } else {
      //         callback()
      //       }
      //     },
      //     trigger: 'blur'
      //   }
      // ],

      tableData: [],
      dialogVisible: false,
      showCopyDialogVisable: false,
      peizhiDialogVisible: false,
      formData: {
        tradeType: 0,
        limitAmountType: 0,
        isActive: 1,
        isMatchOrderAfterVisit: 1
      },
      selectionRows: [], // 选中的行数据
      copyFormData: {},
      queryFormData: this.getQueryForm(),
      isEdit: false, // 是否是编辑状态

      testOrderDialogVistual: false,
      merchantSettingDialog: false,

      showPatchDialogVisable: false, // 批量修改
      formPatchData: {},
      isModAll: false, // 是否是全部修改
      // channelList: [],
      allChannelList: [],
      formMerchant:{},
      testMerchantList: [], // 测试订单  商户列表
      testProviderList: [], // 测试订单  码商列表
      testOrderType: '' //  测试订单类型
    }
  },
  watch: {
    '$store.state.tenant.selectTenantId'(newV, oldV) {
      this.flushData()
      this.flushPage()
    }
  },
  methods: {
     async deleteAll() {
      this.$confirm(`确定删除所有的通道吗？`).then(() => {
        this.tableData.forEach((row) => {
          channelDelete(row.channelId)
        })
      })
    },
    showPeizhiDialog(row) {
      this.formMerchant = Object.assign({}, row)
      this.merchantSettingDialog = true
    },
    async exportReport() {
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
      let res = await channelExport(params)
      FileSaver.saveAs(res, '通道列表.xlsx')
    },
    async productChange(e) {
      this.getProviderListByChannelIdForTest(e)
      this.formData.providerId = 'null'
    },
    async merchantChange(e) {
      this.formData.providerId = 'null'
      this.formData.productId = 'null'
      this.getProviderListByChannelIdForTest('null')
    },
    async channelOptions() {
      // let res = await channelOptions()
      // this.channelList = res.data.list
      // console.log(res, 'res')
    },
    async getChannelListPage(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
          // && this.queryFormData[key] !== ''
        ) {
          // if (key == 'createTime') {
          //   params['startTime'] = this.queryFormData['createTime'][0]
          //   params['endTime'] = this.queryFormData['createTime'][1]
          // } else {
          params[key] = this.queryFormData[key]
          // }
        }
      })

      let res = await getChannelListPage(params, page)
      this.tableData = res.data.list
      console.log(res, 'res')

      // 刷新通道数据 ，否则新增的 通道，就不在 下拉框中了。
      // getChannelByTenantId(this.$store.state.tenant.currTenantId).then((res) => {
      //   if (res.data && res.data.length > 0) {
      //     this.allChannelList = res.data
      //     this.$store.state.order.allChannelList = res.data
      //   }
      // })
      this.flushData()
      return res
    },
    flushData() {
      getChannelByTenantId(this.$store.state.tenant.selectTenantId).then((res) => {
        if (res.data && res.data.length > 0) {
          this.allChannelList = res.data
          this.$store.state.order.allChannelList = res.data
        }
      })
    },
    async isActiveSwitch(e, row) {
      try {
        let res = await channelActive(row.channelId, e)
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.$refs.tableRef.getTableData()
    },
    async isMarchOrderAfterVisitSwitch(e, row) {
      try {
        let res = await channelMatchAfterVisit(row.channelId, e)
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.$refs.tableRef.getTableData()
    },

    onPatchDialogBtnCancel() {
      this.showPatchDialogVisable = false
      this.$refs.formPatchData.resetFields()
    },
    async onPatchDialogBtnOk() {
      this.$refs.formPatchData.validate(async (valid) => {
        if (valid) {
          if (
            this.formPatchData.isUpdateLimitAmountType &&
            this.formPatchData.limitAmountType == 1
          ) {
            this.formPatchData.fixedAmount = processFixAmountString(this.formPatchData.fixedAmount)
          }
          if (
            this.formPatchData.isUpdateLimitAmountType &&
            this.formPatchData.limitAmountType == 2
          ) {
            this.formPatchData.minAmount = Number(this.formPatchData.minAmount)
            this.formPatchData.maxAmount = Number(this.formPatchData.maxAmount)
          }
          if (this.isModAll) {
            //全部修改
            let res = await channelUpdateAll({
              tenantId: this.$store.state.tenant.selectTenantId,
              ...this.formPatchData,
              isUpdateLimitAmountType: this.formPatchData.isUpdateLimitAmountType == 1
            })

            console.log(res, 'res')
          } else {
            // 批量修改
            let res = await channelUpdateBatch({
              channelIdList: this.selectionRows.map((item) => item.channelId),
              tenantId: this.$store.state.tenant.selectTenantId,
              ...this.formPatchData,
              isUpdateLimitAmountType: this.formPatchData.isUpdateLimitAmountType == 1
            })
            console.log(res, 'res')
          }

          this.onPatchDialogBtnCancel()
          this.flushPage()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showPatchDialog(isModAll) {
      this.isModAll = isModAll // 是否是全部修改

      this.formPatchData = {
        isActive: null,
        isMatchOrderAfterVisit: null,
        isUpdateLimitAmountType: 0,
        limitAmountType: 0
      }
      this.showPatchDialogVisable = true
    },

    handleSelectionChange(val) {
      console.log(JSON.stringify(val))
      this.selectionRows = val
    },

    async showTestOrder(row) {
      this.testOrderDialogVistual = true
      this.testOrderType = row.tradeType
      this.formData = {
        merchantNo: '',
        productId: 'null',
        providerId: 'null',
        orderAmount: '',
        channelCode: row.channelCode
      }
      this.channelId = row.channelId
      let ref = await getProductListByChannelId(row.channelId)
      this.testProductList = ref.data
      // this.allProductList = this.testProductList.map((ele) => ele.productId)
      let res = await getMerchantListByChannelIdTest(row.channelId)

      this.testMerchantList = res.data
      if (this.testMerchantList && this.testMerchantList.length > 0) {
        this.formData.merchantNo = this.testMerchantList[0].merchantNo
      }
      this.getProviderListByChannelIdForTest('null')
    },
    async getProviderListByChannelIdForTest(e) {
      if (e == 'null') {
        let ret = await getProviderListByChannelIdForTest(this.channelId)
        this.testProviderList = ret.data
      } else {
        let ret = await getProviderListByChannelIdForTest(this.channelId, {
          productId: e == 'null' ? 'null' : e
        })
        this.testProviderList = ret.data
      }

      // if (this.testProviderList && this.testProviderList.length > 0) {
      //   this.formData.providerId = this.testProviderList[0].providerId
      // }
    },

    testDialogCancel() {
      this.testOrderDialogVistual = false
      this.$refs.testFormRef.resetFields()
    },
    btnTextCollectOrder() {
      this.$refs.testFormRef.validate(async (isok) => {
        if (isok) {
          // 区分代收，还是代付
          console.log(JSON.stringify(this.formData))

          let ret = ''

          if (this.testOrderType == 0) {
            // 0 代收， 1 代付
            ret = await testCollectOrder({
              ...this.formData,
              providerId: this.formData.providerId == 'null' ? '' : this.formData.providerId,
              productId: this.formData.productId == 'null' ? '' : this.formData.productId
            })

            // 代收 打开新页面前提示
            const cashUrl = ret.data.cashPageUrl
            if (cashUrl) {
              //  cashUrl 太长显示不全，希望能自动换行，使用 CSS  white-space: pre-wrap;
              // input 改为 textarea
              this.$confirm(
                `即将打开新的页面：<br /><textarea rows="3" cols="50" style="width: 100%; white-space: pre-wrap;">${cashUrl}</textarea>`,
                '提示',
                {
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }
              )
                .then(() => {
                  window.open(cashUrl, '_blank')
                })
                .catch(() => {})
            }
 
             
           } else {
            // 代付 全部码商
            console.log(this.formData, 'this.formData')
            ret = await testPaymentOrder({
              ...this.formData,
              providerId: '' // 代付 全部码商
            })
          }

          console.log('-----testCollectOrder------', ret)
          this.$message.success('测试成功')

          this.testDialogCancel()
        }
      })
    },

    showCopyDialog() {
      this.channelOptions()
      this.showCopyDialogVisable = true

      this.copyFormData = {
        channelName: '',
        channelCode: '',
        channelId: ''
      }
    },

    onCopyDialogClose() {
      this.showCopyDialogVisable = false
      this.$refs.copyFormData.resetFields()
    },

    onCopyDialogBtnOk() {
      this.$refs.copyFormData.validate(async (valid) => {
        if (valid) {
          let res = await channelCopy(this.copyFormData)
          console.log(res)
          this.showCopyDialogVisable = false
          this.flushPage()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showConfirmPeizhi(row) {
      this.formData = Object.assign({}, row)
      this.peizhiDialogVisible = true
    },
    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确定删除通道 【 ${row.channelName} 】吗？`)
        await channelDelete(row.channelId)

        this.$message.success('删除成功')
        this.flushPage()
      } catch (e) {
        console.log('取消删除')
      }
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        // channelName: '',
        // channelCode: '',
        tradeType: 0,
        limitAmountType: 0,
        // fixedAmount: '',
        // minAmount: '',
        // maxAmount: '',
        isActive: 1,
        isMatchOrderAfterVisit: 1
      }
    },
    onDialogBtnCancel() {
      this.$refs.formDataRef.resetFields()
      this.dialogVisible = false
    },
    onDialogBtnOk() {
      this.$refs.formDataRef.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            // 编辑

            // await channelCopy(this.formData)
            await channelUpdateBatch({
              tenantId: this.$store.state.tenant.selectTenantId,
              channelIdList: [this.formData.channelId],
              isUpdateLimitAmountType: true,

              isMatchOrderAfterVisit: this.formData.isMatchOrderAfterVisit,
              isActive: this.formData.isActive,
              limitAmountType: this.formData.limitAmountType,
              fixedAmount: this.formData.fixedAmount,
              minAmount: this.formData.minAmount ? Number(this.formData.minAmount) : null,
              maxAmount: this.formData.maxAmount ? Number(this.formData.maxAmount) : null
            })

            this.$message.success('修改成功')
          } else {
            // 新增
            let res = await channelCreate({
              ...this.formData,
              tenantId: this.$store.state.tenant.selectTenantId,
              minAmount: this.formData.minAmount ? Number(this.formData.minAmount) : null,
              maxAmount: this.formData.maxAmount ? Number(this.formData.maxAmount) : null
            })
            this.$message.success('添加成功')
          }
          this.onDialogBtnCancel()
          this.$refs.tableRef.getTableData(1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
    },

    flushPage() {
      this.$refs.tableRef.getTableData()
    },

    getQueryForm() {
      return {
        channelName: '',
        channelCode: '',
        tradeType: '',
        // queryAmount: null,
        isActive: '',
        isMatchOrderAfterVisit: ''
      }
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.$refs.tableRef.getTableData(1)
    }
  },
  mounted() {
    console.log('-11111111111111--')
    this.flushData()
  }
}
</script>

<style lang="scss" scoped>
.text {
  color: red;
  font-size: 12px;
  margin: 0;
}
</style>
