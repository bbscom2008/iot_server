<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" :rules="queryRules" class="demo-form-inline">
        <el-form-item label="账号" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>
        <el-form-item label="码商名称" prop="userNickName">
          <el-input
            v-model="queryFormData.userNickName"
            placeholder="请输入码商名称"
            size="small"
          />
        </el-form-item>

        <!-- <el-form-item label="产品名称" prop="">
          <el-select
            filterable
            v-model="queryFormData.productId"
            placeholder="请选择产品"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
          
          </el-select>
        </el-form-item> -->

        <el-form-item label="是否启用" prop="isActive">
          <el-select
            filterable
            v-model="queryFormData.isActive"
            placeholder="请选择是否启用"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="">
          <el-date-picker
            v-model="queryFormData.createTime"
            type="datetimerange"
            unlink-panels
            :picker-options="myPickerOptionsAll"
            range-separator="至"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd HH:mm:ss"
            end-placeholder="结束日期"
            align="right"
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

    <el-card class="mt-10">
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>
      <el-button type="warning" plain icon="el-icon-download" @click="exportReport()"
        >导出</el-button
      >
      <el-button type="primary" plain icon="el-icon-plus" @click="showCopyDialog()">复制</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="showTransferDialog()"
        >转账</el-button
      >
      <div class="tips mt-10">
        该码商下汇总:
        <span class="mr-10"
          >码商总数: {{ summaryData.totalCount ? summaryData.totalCount : 0 }}
        </span>
        <span class="mr-10"
          >可用余额总和: {{ summaryData.availableBalance ? summaryData.availableBalance : 0 }}
        </span>
        <span class="mr-10"
          >冻结金额总和: {{ summaryData.freezeBalance ? summaryData.freezeBalance : 0 }}
        </span>
      </div>
      <my-table
        class="mt-10"
        ref="tableRef"
        style="width: 100%"
        border
        :loadData="getProviderListPage"
        :tableData="tableData"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55" align="center"> </el-table-column> -->
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column label="账号" align="center" prop="userName" />
        <el-table-column label="码商名称" align="center" prop="userNickName" />

        <el-table-column label="团队" align="center">
          <template slot-scope="{ row }">
            <!-- {{ row.level }}级 -->
             <el-button type="text" @click="showLevelTree(row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column
          class-name="balance"
          label="可用余额(元)"
          align="center"
          prop="availableBalance"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ Number(row.availableBalance) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          class-name="balance"
          label="冻结金额(元)"
          align="center"
          prop="freezeBalance"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ Number(row.freezeBalance) }}</span>
            </div>
          </template></el-table-column
        >
        <el-table-column
          label="最低接单金额"
          align="center"
          prop="minAllowableCollectAmount"
          min-width="130"
        >
          <template slot="header">
            <div>
              最低接单金额
              <el-tooltip
                class="item"
                effect="dark"
                content="相当于押金。匹配订单时，可用余额减去最低接单金额大于或等于订单金额才可以匹配成功。"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </template>
          <template slot-scope="{ row }">
            {{ Number(row.minAllowableCollectAmount) }}
          </template>
        </el-table-column>
        <el-table-column label="最大同时接单数量" align="center" min-width="160">
          <template slot="header" >
            <div>
              最大同时接单数量
              <el-tooltip
                class="item"
                effect="dark"
                content="代收订单：码商单个收款信息同时可以接多少单；代付订单：一个码商同时可以接多少单。当前订单完成或者失败后，才可以接下一个订单。"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </template>

          <el-table-column label="代收接单数量" align="center" width="80">
            <template slot-scope="{ row }">
              {{ row.maxConcurrentCollectOrdersCount }}
            </template>
          </el-table-column>
          <el-table-column label="代付接单数量" align="center" width="80">
            <template slot-scope="{ row }">
              {{ row.maxConcurrentPaymentOrdersCount }}
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.isActive">{{ row.isActive ? '启用' : '关闭' }}</el-tag>
            <el-tag v-else style="color: red">{{ row.isActive ? '启用' : '关闭' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remark">
          <template slot-scope="{ row }">
            {{ row.remark ? row.remark : '' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="135" />
        <el-table-column label="更新时间" align="center" prop="updateTime" width="135" />
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="{ row }">
            <div class="opt">
              <div type="success" class="btn" @click="showPeizhiDialog(row)">
                <i class="el-icon-setting" /> 配置产品
              </div>
              <div
                v-if="row.isBalanceTransfer"
                type="success"
                class="btn"
                @click="showBalanceDialog(row)"
              >
                <i class="el-icon-thumb" /> 余额划拨
              </div>
              <div type="success" class="btn" @click="showUserInfo(row)">
                <i class="el-icon-user" />开户信息
              </div>
              <div type="success" class="btn" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      @close="onDialogBtnCancel"
      :title="isEdit ? '修改码商' : '新增码商'"
      width="600px"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="180px"
        style="margin-right: 50px"
      >
        <el-form-item
          label="账号【建议用中文】"
          :prop="isEdit ? '' : 'userName'"
          :rules="isEdit ? [] : userNameRule"
        >
          <el-input
            v-model="formData.userName"
            :disabled="isEdit"
            placeholder="请输入账号【建议用中文】"
            size="small"
          />
        </el-form-item>

        <el-form-item label="码商名称" prop="userNickName">
          <el-input v-model="formData.userNickName" placeholder="请输入码商名称" size="small" />
        </el-form-item>
        
        <el-form-item label="最大接单数（代收）" prop="maxConcurrentCollectOrdersCount">
          <el-row :gutter="10" >
            <el-col :span="12">
              <el-input
                v-number-input-positive
                type="number"
                v-model="formData.maxConcurrentCollectOrdersCount"
                placeholder="最大同时代收接单数量"
                size="small"
              />
            </el-col>
            <el-col :span="8" >
              <span style="color: red;">0 无限制</span>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="最大接单数（代付）" prop="maxConcurrentPaymentOrdersCount">
          
          <el-row :gutter="10" >
            <el-col :span="12">
              <el-input
                v-number-input-positive
                type="number"
                v-model="formData.maxConcurrentPaymentOrdersCount"
                placeholder="最大同时代付接单数量"
                size="small"
              />
            </el-col>
            <el-col :span="8" >
              <span style="color: red;">0 无限制</span>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="help-tip2" style="padding-left:120px;margin-bottom:20px;">
          <span  >
            最大接单数：一个码商同时最大可以接多少单，当前订单完成或者失败后，才可以接下一个订单，当设置为 0 时，接单数量不受限制
          </span>
        </div>

        <!-- <el-form-item label="最小允许接单金额" prop="minAllowableCollectAmount">
          <el-input
            v-model="formData.minAllowableCollectAmount"
            placeholder="请输入最小允许接单金额"
            size="small"
          />
        </el-form-item> -->

        <el-form-item label="最低接单金额" prop="minAllowableCollectAmount">
          <el-input
            v-number-input
            type="number"
            v-model="formData.minAllowableCollectAmount"
            placeholder="最低接单金额"
            disabled
            size="small"
          />
          <div class="help-tip">
            说明：一个码商同时可以接多少单，当前订单完成或者失败后，才可以接下一个订单
          </div>
        </el-form-item>

        <el-form-item label="码商飞机号" prop="botUserName">
          <el-input v-model="formData.botUserName" placeholder="输入码商飞机号" size="small" />
        </el-form-item>

        <el-form-item label="群组ID" prop="groupIdList">
          <el-input
            v-model="formData.groupIdList"
            placeholder="输入群组ID，不能有空格，以负号开头，多个ID以逗号间隔"
            size="small"
          />
        </el-form-item>

        <el-form-item label="授权审核人ID" prop="personOperatorAuthList">
          <el-input
            v-model="formData.personOperatorAuthList"
            placeholder="输入机器人用户ID，不能有空格，多个ID以逗号间隔"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showPatchDialogVisable"
      :title="isModAll ? '全部修改' : '批量修改'"
      width="600px"
    >
      <el-form
        :model="formPatchData"
        label-position="right"
        label-width="150px"
        style="margin-right: 100px"
      >
        <el-form-item label="最大同时接单数量" prop="maxConcurrentOrdersCount">
          <el-input
            v-model="formPatchData.maxConcurrentOrdersCount"
            placeholder="请输入最大同时接单数量"
            size="small"
          />
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-radio-group v-model="formPatchData.isActive" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showPatchDialogVisable = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onPatchDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showLevelTreeVisual" title="查看码商团队" width="500px">
      <my-table
        class="mt-10"
        :loadData="() => {}"
        :tableData="levelTreeData"
        ref="levelTreeDataRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="码商账号" prop="userName" />
        <el-table-column label="码商名称" prop="userNickName" />
        <!-- <el-table-column label="级别" width="80" prop="level" align="center" /> -->
        <el-table-column label="是否启用" width="80" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.isActive ? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
      </my-table>

      <div slot="footer">
        <el-button @click="showLevelTreeVisual = false" type="primary" size="small">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="peizhiDialogVisible"
      :title="`配置 【 ${formData.userNickName} 】 的产品`"
      width="1100px"
    >
      <div style="max-height: 600px; overflow: auto" v-if="peizhiDialogVisible">
        <Peizhi :currItem="formData" :parentVisible="peizhiDialogVisible"></Peizhi>
      </div>
    </el-dialog>

    <!-- 复制码商 -->
    <el-dialog
      :visible.sync="showCopyDialogVisable"
      @close="copyDialogCancel()"
      title="复制码商"
      width="600px"
    >
      <div class="help-tip txt-center mb-10">
        复制码商就是根据已有的码商相关配置，快速创建新的码商。
      </div>
      <el-form
        ref="copyFormData"
        :rules="rules"
        :model="copyFormData"
        label-position="right"
        label-width="100px"
        style="margin-right: 50px"
      >
        <el-form-item label="账号" prop="userName" :rules="userNameRule">
          <el-input v-model="copyFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="码商名称" prop="userNickName">
          <el-input
            v-model="copyFormData.userNickName"
            placeholder="请输入码商名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="码商模板" prop="providerId">
          <el-select
            filterable
            v-model="copyFormData.providerId"
            placeholder="请选择码商模板"
            size="small"
          >
            <el-option
              v-for="item in serviceList"
              :label="'' + item.userNickName"
              :value="'' + item.providerId"
              :key="'' + item.providerId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="copyDialogCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="copyDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- 开户信息 -->
    <el-dialog :visible.sync="user_info_dialog" title="开户信息" width="600px">
      <div style="margin-left: 10px">
        <div class="request">
          <!-- <h3>基本信息</h3> -->
          <div class="req-line">
            <span class="req-label">账号</span>
            <span class="req-value">
              <el-input :value="user_info.userName" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">初始登录密码</span>

            <span class="req-value">
              <el-input :value="user_info.loginPassword" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">码商管理后台（PC端）</span>
            <span class="req-value">
              <el-input :value="user_info.loginAddress" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">码商管理后台（手机端）</span>
            <span class="req-value">
              <el-input :value="user_info.serverMobileUrl" disabled></el-input>
            </span>
          </div>
        </div>

        <div
          style="
            color: red;
            font-size: 12px;
            line-height: 20px;
            margin-left: 10px;
            margin-top: 20px;
          "
        >
          说明：（主要针对账号安全设定）
        </div>
        <div style="color: red; font-size: 12px; line-height: 20px; margin-left: 10px">
          1、平台、商户、码商开户时都会生成临时密码，账号初次登录时会强制进行修改
        </div>
        <div style="color: red; font-size: 12px; line-height: 20px; margin-left: 10px">
          2、若开户后忘记临时密码需要跟后台申请重置
        </div>
        <div style="color: red; font-size: 12px; line-height: 20px; margin-left: 10px">
          3、初次登录后，请及时设置交易密码
        </div>
      </div>

      <div slot="footer" style="text-align: center">
        <el-button type="success" size="small" style="margin-right: 30px" @click="copyAgentInfo"
          >复制</el-button
        >
        <el-button @click="user_info_dialog = false" size="small"> 关闭 </el-button>
      </div>
    </el-dialog>

    <service :currItem="formData" ref="serviceDialog"></service>
    <balance :currItem="formData" ref="balanceDialog"></balance>
    <transfer :currItem="formData" ref="transferDialog"></transfer>
  </div>
</template>

<script>
import Peizhi from './service-list-setting.vue'
import service from './merchant_service_setting.vue'
import balance from './service-list-balance.vue'
import transfer from './service-list-transfer.vue'
import {
  getProviderListPage,
  masterProviderAdd,
  masterProviderCopy,
  getProviderOpenInfo,
  getProviderLevel,
  isExistProviderName,
  getProviderOptionList,
  isExistProviderUserName,
  updateSingleProvider
} from '@/api/report-center'

import {
  getProviderInfoDetailByProviderId,
  getProviderSum,
  getProviderMinAllowableCollectAmount,
  providerExport
} from '@/api/service-list'

import { getProductListByTenantId } from '@/api/service-product-mananger'

import { getProviderChildListByUserId } from '@/api/user'
import FileSaver from 'file-saver'
import clipboard from '@/utils/clipboard'
import { serviceRules, queryRules } from './rules.js'
import { userName, rulesName } from '@/utils/validate'
import { formatDateTime } from '@/utils'
export default {
  components: {
    Peizhi,
    service,
    balance,
    transfer
  },
  name: 'ServiceList',
  data() {
    const isNameOnly = async (rule, value, callback) => {
      let ret = await isExistProviderUserName(this.tenantId, {
        providerUserName: value
      })
      if (ret.data) {
        callback(new Error('账号已存在'))
      } else {
        callback()
      }
    }
    const isNickNameOnly = async (rule, value, callback) => {
      let ret = await isExistProviderName(value)
      if (ret.data) {
        callback(new Error('码商名称已存在'))
      } else {
        callback()
      }
    }
    return {
      copyFormData: {
        userName: '',
        userNickName: '',
        providerId: ''
      },
      userNameRule: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        ...userName,
        { validator: isNameOnly, trigger: 'blur' }
      ],
      userNickNameRule: [
        { required: true, message: '请输入码商名称', trigger: 'blur' },
        ...rulesName,
        { validator: isNickNameOnly, trigger: 'blur' }
      ],
      levelTreeData: [],
      queryRules: queryRules,
      rules: serviceRules,
      tableData: [],
      dialogVisible: false,
      isEdit: false,
      user_info_dialog: false,
      user_info: {},
      serviceList: [],
      summaryData: [],
      formData: {
        userName: '',
        userNickName: ''
      },
      queryFormData: this.getQueryForm(),
      peizhiDialogVisible: false, // 配置通道
      feeDialogTitle: '默认标题',
      feeChangeFormData: {
        userName: '',
        userNickName: '',
        banlance_type: '', //
        balance: '',
        opt_type: '', // 1 充值 2 扣款
        money: '', // 变动金额
        password: '', // 交易密码
        remark: ''
      },
      merchant_key: '',
      delay_payment_time_options: [
        // {
        //   value: 0,
        //   label: '实时回款'
        // },
        {
          value: 1,
          label: '1分钟'
        },
        {
          value: 6,
          label: '2分钟'
        },
        {
          value: 9,
          label: '5分钟'
        },
        {
          value: 14,
          label: '10分钟'
        },
        {
          value: 16,
          label: '30分钟'
        },
        {
          value: 17,
          label: '1小时'
        },
        {
          value: 18,
          label: '2小时'
        }
      ],
      selectionRows: [], // 选中的行数据

      showLevelTreeVisual: false,
      showCopyDialogVisable: false,

      showPatchDialogVisable: false, // 批量修改
      formPatchData: {
        isActive: 0, //0 保持不变  1  开启   2  关闭
        maxConcurrentOrdersCount: ''
      },
      isModAll: false, // 是否是全部修改

      allProductList: [] // 当前平台下的所有产品
    }
  },
  methods: {
    async exportReport() {
      let params = {
        tenantId: this.tenantId
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
      let res = await providerExport(params)
      console.log(res, 'res')
      FileSaver.saveAs(res, '码商列表.xlsx')
    },
    async getProviderMinAllowableCollectAmount() {
      let res = await getProviderMinAllowableCollectAmount(this.tenantId)
      this.formData.minAllowableCollectAmount = res.data ? Number(res.data) : 0
    },
    async getProviderSum() {
      let params = {
        tenantId: this.tenantId
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
      let res = await getProviderSum(params)
      this.summaryData = res.data
      console.log(res, 'res')
    },
    copyAgentInfo(e) {
      this.clipboard(
        `
账号：${this.user_info.userName}
初始登录密码：${this.user_info.loginPassword}
码商管理后台：${this.user_info.loginAddress}

说明：（主要针对账号安全设定）
  1、平台、商户、码商开户时都会生成临时密码，账号初次登录时会强制进行修改
  2、若开户后忘记临时密码需要跟后台申请重置
  3、初次登录后，请及时设置交易密码

      `,
        e
      )
    },
    clipboard,
    async getProviderListPage(page) {
      let params = {
        tenantId: this.tenantId
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

      let res = await getProviderListPage(params, page)
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async getProviderOptionList() {
      // 获取上级码商--码商模板
      // let res = await getProviderOptionList(this.tenantId)

      let res = await getProviderChildListByUserId(this.$store.state.userAccount.userId)

      this.serviceList = res.data
      console.log(res)
    },
    onPatchDialogBtnOk() {
      if (this.isModAll) {
        this.tableData = this.tableData.map((item) => {
          // 批量修改
          //todo 实际操作要 联网，刷新。
          if (this.formPatchData.isActive !== 0) {
            item.isActive = this.formPatchData.isActive == 1 ? true : false
          }
          if (this.formPatchData.maxConcurrentOrdersCount) {
            item.maxConcurrentOrdersCount = this.formPatchData.maxConcurrentOrdersCount
          }
          return item
        })
      } else {
        // 批量修改

        this.selectionRows.forEach((row) => {
          // 批量修改
          if (this.formPatchData.isActive !== 0) {
            row.isActive = this.formPatchData.isActive == 1 ? true : false
          }

          if (this.formPatchData.maxConcurrentOrdersCount) {
            row.maxConcurrentOrdersCount = this.formPatchData.maxConcurrentOrdersCount
          }
        })
      }

      this.showPatchDialogVisable = false
    },
    // showPatchDialog(isModAll) {
    //   this.isModAll = isModAll // 是否是全部修改

    //   this.formPatchData = {
    //     isActive: 0, //0 保持不变  1  开启   2  关闭
    //     maxConcurrentOrdersCount: ''
    //   }

    //   this.showPatchDialogVisable = true
    // },
    async showUserInfo(row) {
      console.log('开户信息')
      this.user_info_dialog = true
      let res = await getProviderOpenInfo(row.providerId)
      this.user_info = res.data

      console.log(res)
    },

    async showLevelTree(row) {
      let res = await getProviderLevel(row.providerId)
      console.log(res, 'res')
      this.levelTreeData = res.data
      this.showLevelTreeVisual = true
    },
    showPeizhiDialog(row) {
      this.formData = Object.assign({}, row)
      this.peizhiDialogVisible = true
    },
    showTransferDialog() {
      this.$refs.transferDialog.transferDialogVisible = true
    },
    showBalanceDialog(row) {
      this.formData = Object.assign({}, row)
      this.$refs.balanceDialog.balanceDialogVisible = true
    },
    handleSelectionChange(val) {
      console.log(JSON.stringify(val))
      this.selectionRows = val
    },
    showCopyDialog() {
      this.getProviderOptionList()
      this.showCopyDialogVisable = true
      this.copyFormData = {
        userName: '',
        userNickName: '',
        providerId: ''
      }
      this.$nextTick(() => {
        this.$refs.copyFormData.resetFields()
        this.$refs.copyFormData.clearValidate()
      })
    },
    showAddDialog() {
      this.dialogVisible = true
      this.isEdit = false
      this.formData = {
        maxConcurrentCollectOrdersCount: 0,
        maxConcurrentPaymentOrdersCount: 0,
        minAllowableCollectAmount: 0
      }
      this.getProviderMinAllowableCollectAmount()
    },
    async showEditDialog(row) {
      // this.getServiceListByTenantId()
      // row.parentId=row.parentId=='0'?'':row.parentId
      this.isEdit = true
      this.dialogVisible = true

      let res = await getProviderInfoDetailByProviderId(row.providerId)
      this.formData = Object.assign({}, res.data)

      this.formData.minAllowableCollectAmount = row.minAllowableCollectAmount

      this.formData.botUserName = res.data.botUserName
      this.formData.groupIdList = res.data.groupIdList ? res.data.groupIdList.join(',') : ''
      this.formData.personOperatorAuthList = res.data.personOperatorAuthList
        ? res.data.personOperatorAuthList.join(',')
        : ''
    },
    copyDialogCancel() {
      this.showCopyDialogVisable = false
      this.$refs.copyFormData.resetFields()
    },
    copyDialogBtnOk() {
      this.$refs.copyFormData.validate(async (valid) => {
        if (valid) {
          let res = await masterProviderCopy(this.copyFormData)
          console.log(res, 'res')
          this.copyDialogCancel()
          this.flushPage()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onDialogBtnCancel() {
      this.dialogVisible = false
      this.$refs.formData.resetFields()
    },
    onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
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
              groupIdList: this.formData.groupIdList ? this.formData.groupIdList.split(',') : [],
              personOperatorAuthList: this.formData.personOperatorAuthList
                ? this.formData.personOperatorAuthList.split(',')
                : []
            })
          } else {
            let res = await masterProviderAdd({
              ...this.formData,
              tenantId: this.tenantId,
              userName: this.formData.userName,
              userNickName: this.formData.userNickName,
               maxConcurrentCollectOrdersCount: Number(this.formData.maxConcurrentCollectOrdersCount),
              maxConcurrentPaymentOrdersCount: Number(this.formData.maxConcurrentPaymentOrdersCount),
              botUserName: this.formData.botUserName,
              groupIdList: this.formData.groupIdList ? this.formData.groupIdList.split(',') : [],
              personOperatorAuthList: this.formData.personOperatorAuthList
                ? this.formData.personOperatorAuthList.split(',')
                : []
            })
            console.log(res, 'res')
          }

          this.$refs.tableRef.getTableData(1)
          this.onDialogBtnCancel()
        }
      })
    },
    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let todayStr = formatDateTime(today)
      return {
        userName: '',
        userNickName: '',
        isActive: '',
        // createTime: [todayStr, nowStr],
        createTime: [],
      }
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.queryTableData()
    },

    flushPage() {
      this.queryTableData()
    },
    queryTableData() {
      // todo 搜索
      this.$refs.tableRef.getTableData(1)
      this.getProviderSum()
    }
  },
  mounted() {
    this.getProviderSum()
  }
}
</script>

<style lang="scss" scoped>
::v-deep td.balance {
  .cell {
    // background-color: pink;
    height: 85px;
  }
}

.line {
  display: flex;
  flex-direction: row;
  align-items: center;

  .el_btn {
    margin-left: 5px;
    width: 40px;
    padding: 6px;
  }
}

.red {
  color: red;
}

// .fee-box {
//   position: relative;
//   width: 100%;
//   height: 100%;
//   .val,
//   .plus,
//   .sub {
//     position: absolute;
//     padding: 5px;
//     // background-color: aquamarine;
//   }
//   .val {
//     left: 50%;
//     top: 50%;
//     transform: translate(-50%, -50%);
//   }
//   .plus {
//     font-size: 18px;
//     color: skyblue;
//     cursor: pointer;
//     top: 0px;
//     right: 0px;
//     &:hover {
//       color: red;
//     }
//   }
//   .sub {
//     font-size: 18px;
//     color: skyblue;
//     cursor: pointer;
//     right: 0px;
//     bottom: 0px;
//     &:hover {
//       color: red;
//     }
//   }
// }
.tag-pink {
  cursor: pointer;
  margin-left: 5px;
  color: #eb2f96;
  background: #fff0f6;
  border-color: #ffadd2;
}

.label {
  font-size: 18px;
  margin-right: 10px;
  line-height: 20px;
}

.text {
  font-size: 16px;
  // color: green;
  line-height: 20px;
}

.remark {
  font-size: 12px;
}

.request {
  padding: 0 20px;

  h3 {
    text-align: center;
  }

  .req-line {
    margin-top: 5px;
    display: flex;
    align-items: center;
    line-height: 20px;

    .req-label {
      width: 180px;
      margin-left: 15px;
      font-size: 14px;
      font-weight: bold;
      text-align: right;
      padding-right: 10px;
    }

    .req-value {
      flex: 1;
    }
  }
}
.help-tip2 {
  font-size: 12px;
  line-height: 17px;
  color: #cc0000;
}
</style>
