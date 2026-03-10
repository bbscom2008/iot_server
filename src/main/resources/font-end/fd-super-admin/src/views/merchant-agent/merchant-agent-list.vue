<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        :rules="queryRules"
        ref="queryFormDataRef"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="账号" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="代理名称" prop="userNickName">
          <el-input
            v-model="queryFormData.userNickName"
            placeholder="请输入代理名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select v-model="queryFormData.isActive" placeholder="请选择是否启用" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
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
      <el-button type="success" plain icon="el-icon-download" @click="exportReport()"
        >导出</el-button
      >

      <!-- <el-button type="primary" plain icon="el-icon-plus" @click="showCopyDialog()">复制</el-button> -->

      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="loadTableData"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="账号" align="center" prop="userName" />
        <el-table-column label="代理名称" align="center" prop="userNickName" />

        <el-table-column label="商户信息" align="center" prop="">
          <template slot-scope="{ row }">
            {{ row.merchantCount }}
            <el-button type="text" @click="look_item_nfo(row)">查看</el-button>
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
              <span class="plus" @click="showChangeFeeDialog(row, 1)">+</span>
              <span class="sub" @click="showChangeFeeDialog(row, 2)">-</span>
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
              <span class="plus" @click="showChangeFeeDialog(row, 3)">+</span>
              <span class="sub" @click="showChangeFeeDialog(row, 4)">-</span>
            </div>
          </template></el-table-column
        >
        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch @change="switchEnable(row)" v-model="row.isActive" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime">
          <template slot-scope="{ row }">
            {{ row.updateTime }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showUserInfo(row)">
                <i class="el-icon-user" />开户信息
              </div>

              <el-dropdown trigger="click">
                <div type="success" class="btn">更多 <i class="el-icon-caret-bottom" /></div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showResetPassword(row, 1)">
                      <i class="el-icon-brush" />重置登录密码
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showResetPassword(row, 2)">
                      <i class="el-icon-brush" />重置谷歌密钥
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showResetPassword(row, 3)">
                      <i class="el-icon-brush" />重置交易密码
                    </div>
                  </el-dropdown-item>

                  <el-dropdown-item>
                    <div type="success" class="btn" @click="unlockUser(row)">
                      <i class="el-icon-unlock" />解锁
                    </div>
                  </el-dropdown-item>

                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showEditDialog(row)">
                      <i class="el-icon-edit" />修改
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div type="primary" class="btn mt-5 red" @click="showConfirmDelete(row)">
                      <i class="el-icon-delete" />删除
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      @close="onDialogBtnCancel()"
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改' : '新增'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :rules="rules"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item
          label="账号"
          :prop="isEdit ? '' : 'userName'"
          :rules="isEdit ? {} : userNameRules"
        >
          <el-input
            v-model="formData.userName"
            :disabled="isEdit"
            placeholder="账号"
            size="small"
          />
        </el-form-item>
        <!-- :rules="userNickNameRules" -->
        <el-form-item label="代理名称" prop="userNickName">
          <el-input v-model="formData.userNickName" placeholder="请输入代理名称" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-if="tenent_info_dialog"
      :visible.sync="tenent_info_dialog"
      title="商户信息"
      width="760px"
    >
      <my-table
        :tableData="merchantInfoTableData"
        :loadData="loadInfoTableData"
        :total="50"
        class="mt-10"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="账号" align="center">
          <template slot-scope="{ row }">
            <div>{{ row.userName }}</div>
          </template>
        </el-table-column>

        <el-table-column label="商户名称" align="center" width="160">
          <template slot-scope="{ row }">
            <div>{{ row.userNickName }}</div>
          </template>
        </el-table-column>

        <el-table-column label="商户可用余额" align="center">
          <template slot-scope="{ row }">{{ Number(row.availableBalance) }} </template>
        </el-table-column>

        <el-table-column label="商户冻结金额" align="center">
          <template slot-scope="{ row }">
            {{ row.freezeBalance }}
          </template>
        </el-table-column>

        <el-table-column label="预付商户金额" align="center">
          <template slot-scope="{ row }">
            {{ row.collectDeposit }}
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center" width="80">
          <template slot-scope="{ row }">
            {{ row.isActive ? '启用' : '禁用' }}
          </template>
        </el-table-column>
      </my-table>

      <!-- <div style="text-align: center">
        <el-button @click="tenent_info_dialog = false" type="success"> 关闭 </el-button>
      </div> -->
    </el-dialog>

    <el-dialog :visible.sync="user_info_dialog" title="开户信息" width="500px">
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
              <el-input :value="user_info.initialLoginPassword" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">商户代理管理后台</span>
            <span class="req-value">
              <el-input :value="user_info.loginAddress" disabled></el-input>
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
        <el-button type="success" size="small" @click="copyAgentInfo" style="margin-right: 30px"
          >复制</el-button
        >
        <el-button @click="user_info_dialog = false" size="small"> 关闭 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="reset_password_dialog"
      :title="
        resetPwdType == 1 ? '重置登录密码' : resetPwdType == 2 ? '重置谷歌密钥' : '重置交易密码'
      "
      width="600px"
      @close="closeResetPassword"
    >
      <el-form
        ref="form_reset"
        :model="formDataPassword"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="登录密码" prop="login_code" v-if="resetPwdType == 1">
          <div class="line">
            <el-input
              v-model="formDataPassword.login_code"
              placeholder="请输入登录密码"
              size="small"
              disabled
            />
            <!-- <el-button size="small" class="el_btn" @click="resetPassword(1)">重置</el-button> -->
            <el-button
              v-if="showCopyBtn"
              type="primary"
              plain
              size="small"
              class="el_btn"
              @click="copyPassword"
              >复制</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="谷歌密钥" prop="google_key" v-if="resetPwdType == 2">
          <div class="line">
            <el-input
              v-model="formDataPassword.google_key"
              placeholder="请输入谷歌密钥"
              size="small"
              disabled
            />
            <!-- <el-button size="small" class="el_btn" @click="resetPassword(2)">重置</el-button> -->
          </div>
        </el-form-item>
        <el-form-item label="交易密码" prop="tradePwd" v-if="resetPwdType == 3">
          <div class="line">
            <el-input
              v-model="formDataPassword.tradePwd"
              placeholder="请输入交易密码"
              size="small"
              disabled
            />
            <!-- <el-button size="small" class="el_btn" @click="resetPassword(3)">重置</el-button> -->
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button
          type="success"
          @click="
            resetPassword(resetPwdType)
          "
          >重置</el-button
        >
        <el-button  @click="closeResetPassword()" type="primary"> 关闭 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      @close="onCopyBtnCancel()"
      :visible.sync="showCopyDialogVisable"
      title="复制商户代理"
      width="500px"
    >
      <el-form
        ref="formCopyRef"
        :model="copyFormData"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号" prop="userName" :rules="userNameRules">
          <el-input v-model="copyFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <!-- :rules="userNickNameRules" -->
        <el-form-item label="代理名称" prop="userNickName">
          <el-input v-model="copyFormData.userNickName" placeholder="请输入代理名称" size="small" />
        </el-form-item>

        <el-form-item label="代理模板" prop="merchantAgentId">
          <el-select
            filterable
            v-model="copyFormData.merchantAgentId"
            placeholder="请选择代理模板"
            size="small"
          >
            <!-- <el-option :label="item.tenant_name" :value="item.id" v-for="item in tableData" :key="item.id"  ></el-option> -->
            <el-option
              v-for="item in merchantAgentList"
              :key="item.merchantAgentId"
              :label="item.userName"
              :value="item.merchantAgentId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCopyBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onCopyBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="feeDialogVisible" :title="feeDialogTitle" width="500px">
      <el-form
        ref="feeChangeFormDataRef"
        :model="feeChangeFormData"
        label-position="right"
        :rules="rules"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号" prop="">
          <el-input
            v-model="feeChangeFormData.userName"
            :disabled="true"
            placeholder="请输入账号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="商户昵称" prop="userNickName">
          <el-input
            v-model="feeChangeFormData.userNickName"
            :disabled="true"
            placeholder="请输入商户昵称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="余额类型" prop="type">
          <el-input
            v-model="feeChangeFormData.banlance_type"
            :disabled="true"
            placeholder="请输入租户域名"
            size="small"
          />
        </el-form-item>

        <el-form-item label="当前余额" prop="balance">
          <el-input v-model="feeChangeFormData.balance" :disabled="true" size="small" />
        </el-form-item>

        <el-form-item label="操作类型" prop="opt_type">
          <el-input v-model="feeChangeFormData.opt_type" :disabled="true" size="small" />
        </el-form-item>

        <el-form-item label="变动金额" prop="amount">
          <el-input
            v-model="feeChangeFormData.amount"
            v-number-input
            type="number"
            placeholder="请输入金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="交易密码" prop="tradePassword">
          <el-input
            v-model="feeChangeFormData.tradePassword"
            type="password"
            show-password
            placeholder="请输入交易密码，可在安全中心设置"
            size="small"
          />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="feeChangeFormData.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onFeeDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onFeeDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'

import {
  merchantAgentPage,
  createMerchantAgent,
  updateMerchantAgent,
  deleteMerchantAgent,
  merchantAgentIsEnable,
  getMerchantAgentList,
  copyMerchantAgent,
  resetLoginPassword,
  resetGoogleKey,
  getMerchantAgentAccountInfo,
  getMerchantListByAgentId,
  rechargeBalance,
  isExistMerchantAgentAccount,
  resetTradePassword,
  merchantAgentExport
} from '@/api/merchant-agent-list'
import { systemUserIsLock } from '@/api/system-manager'
import { adjustAvailableBalance, adjustFreezeBalance } from '@/api/service-list'

import { merchantRules, queryRules } from './rules'

import { userNameValidate, userNickNameRules } from '@/utils/validate'

import { formatDateTime } from '@/utils'
import FileSaver from 'file-saver'
import { patchUnlockUser } from '@/api/service-list.js'

export default {
  name: 'MerchantAgentList',
  data() {
    return {
      rules: merchantRules,
      queryRules: queryRules,
      userNameRules: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        ...userNameValidate,
        {
          validator: async (rule, value, callback) => {
            console.log(value)
            let ret = await isExistMerchantAgentAccount(value)
            if (ret.data) {
              callback(new Error('账号已存在'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],

      userNickNameRules: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        ...userNickNameRules,
        {
          validator: async (rule, value, callback) => {
            console.log(value)

            // 如果修改的时候，新名与旧名相同，不校验
            if (this.isEdit && this.oldFormData.userNickName == this.formData.userNickName) {
              return callback()
            }

            let ret = await isExistMerchantAgentAccount(value)
            if (ret.data) {
              callback(new Error('账号已存在'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],

      showCopyDialogVisable: false,
      copyFormData: {},
      code: '',
      tableData: [],
      showCopyBtn: false,
      merchantInfoTableData: [],
      dialogVisible: false,
      tenent_info_dialog: false,
      feeDialogVisible: false, // 增减余额对话框
      feeDialogTitle: '默认标题',
      feeChangeFormData: {},
      user_info_dialog: false,
      reset_password_dialog: false,
      formData: {},
      oldFormData: {},
      formDataPassword: {},
      queryFormData: this.getQueryForm(),
      user_info: [],
      isEdit: false, // 是否是编辑状态
      merchantAgentList: [], // 代理模板列表
      resetRow: {}, // 重置密码的行数据
      item_row: {}, // 查看商户信息的行数据
      // 添加扩展数据，如 options 所需要的数据

      resetPwdType: 1 // 重置密码的类型，1：登录密码，2：谷歌密钥
    }
  },
  watch: {
    '$store.state.tenant.selectTenantId'(newV, oldV) {
      this.flushData()
      this.flushPage()
    }
  },
  methods: {
    closeResetPassword() {
      this.reset_password_dialog = false
      this.showCopyBtn = false
    },
    copyPassword(e) {
      this.clipboard(`${this.formDataPassword.login_code}`, e)
    },
    async exportReport() {
      let obj = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime') {
            obj['startTime'] = this.queryFormData['createTime'][0]
            obj['endTime'] = this.queryFormData['createTime'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await merchantAgentExport(obj)
      console.log(res, 'res')
      FileSaver.saveAs(res, '商户代理.xlsx')
    },
    async unlockUser(row) {
      let res = await systemUserIsLock(row.userId)
      if (res.data.isLocked == 0) {
        //0 未锁定 1锁定
        this.$message.error('无须解锁')
        return
      }

      try {
        let ret = await this.$confirm(`确定解锁账号为【 ${row.userName} 】的用户吗？`)
        await patchUnlockUser([row.userId])
        this.$message.success('解锁成功')
      } catch (e) {
        console.log('取消操作')
      }
    },

    async resetPassword(type) {
      if (type == 1) {
        // 登录密码
        let ret = await resetLoginPassword(this.resetRow.merchantAgentId)
        this.$message.success('登录密码重置成功')
        this.showCopyBtn = true
        this.formDataPassword.login_code = ret.data
      } else if (type == 2) {
        // 谷歌密钥
        await resetGoogleKey(this.resetRow.merchantAgentId)
        this.$message.success('谷歌密钥重置成功')
      } else {
        // 交易密码
        await resetTradePassword(this.resetRow.userId)
        this.$message.success('交易密码重置成功')
      }
    },

    flushPage() {
      this.$refs.tableRef.getTableData()
      // 更新模板列表
      getMerchantAgentList({
        tenantId: this.$store.state.tenant.selectTenantId
      }).then((res) => {
        this.merchantAgentList = res.data
      })
    },

    async loadInfoTableData(page) {
      let res = await getMerchantListByAgentId(
        page,
        this.item_row.merchantAgentId,
        this.$store.state.tenant.selectTenantId
      )
      this.merchantInfoTableData = res.data.list
      console.log(res)
      return res
    },

    async loadTableData(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime' && this.queryFormData['createTime']) {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await merchantAgentPage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    queryTableData() {
      this.$refs.queryFormDataRef.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
      this.$refs.queryFormDataRef.resetFields()
    },
    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getTime() - 24 * 60 * 60 * 1000 * 30)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let todayStr = formatDateTime(today)
      return {
        isActive: '',
        // createTime: [todayStr, nowStr]
        createTime: []
      }
    },

    showCopyDialog() {
      this.showCopyDialogVisable = true
      this.copyFormData = {
        userName: '',
        userNickName: '',
        merchantAgentId: ''
      }
    },
    onCopyBtnCancel() {
      this.$refs.formCopyRef.resetFields()
      this.showCopyDialogVisable = false
    },
    onCopyBtnOk() {
      this.$refs.formCopyRef.validate(async (valid) => {
        if (valid) {
          await copyMerchantAgent({
            ...this.copyFormData,
            tenantId: this.$store.state.tenant.selectTenantId
          })
          this.$message.success('复制成功')
          this.onCopyBtnCancel()
          this.flushPage()
        }
      })
    },



    showChangeFeeDialog(row, type) {
      this.feeDialogVisible = true

      if (type == 1) {
        // 余额充值
        this.feeDialogTitle = '余额充值'
        this.feeChangeFormData = {
          banlance_type: '可用余额',
          balance: row.availableBalance,
          opt_type: '充值',
          operationType: 0, // 操作类型(0.充值/增加，1.扣除/减少)
          operationObject: 0 // 操作对象(0.可用余额，1.冻结金额)
        }
      } else if (type == 2) {
        this.feeDialogTitle = '余额扣除'
        this.feeChangeFormData = {
          banlance_type: '可用余额',
          balance: row.availableBalance,
          operationType: 1, // 操作类型(0.充值/增加，1.扣除/减少)
          operationObject: 0, // 操作对象(0.可用余额，1.冻结金额)
          opt_type: '扣款'
        }
      } else if (type == 3) {
        // 冻结金额 +
        this.feeDialogTitle = '增加冻结金额'
        this.feeChangeFormData = {
          banlance_type: '冻结余额',
          balance: row.availableBalance,
          opt_type: '增加',
          operationType: 0, // 操作类型(0.充值/增加，1.扣除/减少)
          operationObject: 1 // 操作对象(0.可用余额，1.冻结金额)
        }
      } else if (type == 4) {
        // 冻结金额 -
        this.feeDialogTitle = '减少冻结金额'
        this.feeChangeFormData = {
          banlance_type: '冻结余额',
          balance: row.availableBalance,
          operationType: 1, // 操作类型(0.充值/增加，1.扣除/减少)
          operationObject: 1, // 操作对象(0.可用余额，1.冻结金额)
          opt_type: '减少 '
        }
      }

      this.feeChangeFormData = {
        ...this.feeChangeFormData,
        userNickName: row.userNickName,
        userName: row.userName,
        amount: '',
        tradePassword: '',
        merchantAgentId: row.merchantAgentId,
        userId: row.userId,
        freezeBalance:row.freezeBalance
      }
    },
    onFeeDialogBtnCancel() {
      this.$refs.feeChangeFormDataRef.resetFields()
      this.feeDialogVisible = false
    },
    checkMountNumber(type, balance, changeAmount) {
      if (
        type == 0 &&
        (balance + changeAmount > '999999999999.99' || balance + changeAmount < '-999999999999.99')
      ) {
        //充值
        //变动后金额
        this.$message.error(
          '变动后金额不能超过最大值999999999999.99,不能低于最小值-999999999999.99'
        )
        return false
      }
      if (
        type == 1 &&
        (balance - changeAmount > '999999999999.99' || balance - changeAmount < '-999999999999.99')
      ) {
        //扣款
        //变动后金额
        this.$message.error(
          '变动后金额不能超过最大值999999999999.99,不能低于最小值-999999999999.99'
        )
        return false
      }
    },
    onFeeDialogBtnOk() {
      this.$refs.feeChangeFormDataRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        this.$confirm(
          `确认为 【${this.feeChangeFormData.userNickName}】 ${this.feeChangeFormData.opt_type} ${this.feeChangeFormData.banlance_type} ${this.feeChangeFormData.amount} 元吗？`
        ).then(async (_) => {
          let changeAmount = Number(this.feeChangeFormData.amount)
          let balance = Number(this.feeChangeFormData.balance)
          let freezeBalance = Number(this.feeChangeFormData.freezeBalance)
          if (this.feeChangeFormData.operationObject == 0) {
            // 操作对象(0.可用余额，1.冻结金额)
            if (
              this.checkMountNumber(this.feeChangeFormData.operationType, balance, changeAmount) ==
              false
            ) {
              return
            }

            await adjustAvailableBalance({
              userId: this.feeChangeFormData.userId,
              businessType: 2, // 业务类型业务类型（ 0-代收类，1-代付类，2-业务类）
              changeType:  this.feeChangeFormData.operationType == 0 ? 0 : 1, // 账变类型（0-充值、1-扣款）
              changeAmount: Number(this.feeChangeFormData.amount), // 账变金额，正数表示增加，负数表示减少
              tradePassword: this.feeChangeFormData.tradePassword,
              remark: this.feeChangeFormData.remark
            })
          } else {
            // 冻结金额
            if (
              this.checkMountNumber(this.feeChangeFormData.operationType, freezeBalance, changeAmount) ==
              false
            ) {
              return
            }
            await adjustFreezeBalance({
              userId: this.feeChangeFormData.userId,
              businessType: 2, // 业务类型业务类型（ 0-代收类，1-代付类，2-业务类）
              changeType: this.feeChangeFormData.operationType == 0 ? 10 : 11, // 账变类型（0-充值、1-扣款）
              changeAmount: Number(this.feeChangeFormData.amount), // 账变金额，正数表示增加，负数表示减少
              tradePassword: this.feeChangeFormData.tradePassword,
              remark: this.feeChangeFormData.remark
            })
          }

          this.$message.success('操作成功')
          this.onFeeDialogBtnCancel()
          this.flushPage()
        })
      })
    },
    async switchEnable(row) {
      try {
        let res = await merchantAgentIsEnable(row.merchantAgentId, row.isActive)
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.$refs.tableRef.getTableData()
    },

    clipboard,
    copyAgentInfo(e) {
      this.clipboard(
        `账号： ${this.user_info.userName}
初始登录密码：  ${this.user_info.initialLoginPassword}
商户代理管理后台：  ${this.user_info.loginAddress ? this.user_info.loginAddress : '无'}

说明：（主要针对账号安全设定）
1、平台、商户、码商开户时都会生成临时密码，账号初次登录时会强制进行修改
2、若开户后忘记临时密码需要跟后台申请重置
3、初次登录后，请及时设置交易密码`,
        e
      )
    },

    showUserInfo(row) {
      console.log('开户信息')
      this.user_info_dialog = true
      this.user_info = row

      getMerchantAgentAccountInfo(
        row.merchantAgentId,
        this.$store.state.tenant.selectTenantId
      ).then((res) => {
        this.user_info = res.data
        console.log(this.user_info)
      })
    },
    showResetPassword(row, type) {
      console.log('重置密码')
      this.resetPwdType = type

      this.formDataPassword = {
        login_code: '********',
        google_key: '**********',
        tradePwd: '********'
      }
      this.resetRow = row
      this.reset_password_dialog = true
    },
    look_item_nfo(row) {
      this.tenent_info_dialog = true
      this.item_row = row
    },
    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确定删除当前商户代理【 ${row.userNickName} 】吗？`)
        await deleteMerchantAgent(row.merchantAgentId)
        this.$message.success('删除成功')
        this.flushPage()
        this.updateMerchantAgentList()
      } catch (e) {
        console.log('取消删除')
      }
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.oldFormData = JSON.parse(JSON.stringify(row))
      this.formData = {
        merchantAgentId: row.merchantAgentId,
        userNickName: row.userNickName,
        userName: row.userName,
        isActive: row.isActive
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        userName: '', //	账号,示例值(zhangsan)
        userNickName: '' //
      }
    },
    onDialogBtnCancel() {
      this.$refs.formRef.resetFields()
      this.dialogVisible = false
    },
    onDialogBtnOk() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            // 编辑
            const { userName, ...data } = this.formData
            await updateMerchantAgent(data)
            this.$message.success('更新成功')
          } else {
            // 新增
            await createMerchantAgent({
              ...this.formData,
              tenantId: this.$store.state.tenant.selectTenantId
            })

            this.$message.success('新增成功')
          }

          this.onDialogBtnCancel()
          this.flushPage()
          this.updateMerchantAgentList()
        }
      })
    },
    /**
     * 更新模板列表, 新增，修改，删除时，调用该方法更新模板列表
     */
    updateMerchantAgentList() {
      getMerchantAgentList({
        tenantId: this.$store.state.tenant.selectTenantId
      }).then((res) => {
        this.merchantAgentList = res.data
      })
    },
    flushData() {
      this.updateMerchantAgentList()
    }
  },
  mounted() {
    this.flushData()
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
      width: 140px;
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
::v-deep .el-dropdown {
  font-size: 12px;
}
</style>
