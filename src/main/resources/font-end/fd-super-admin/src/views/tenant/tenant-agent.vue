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

      <el-button type="primary" plain icon="el-icon-plus" @click="showCopyDialog()">复制</el-button>

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
        <el-table-column label="分润比例(%)" align="center">
          <template slot-scope="{ row }">
            {{ row.tenantProfitRate }}
          </template>
        </el-table-column>
        <el-table-column label="平台信息" align="center" prop="tenantCount">
          <template slot-scope="{ row }">
            {{ row.tenantCount }}
            <el-button type="text" @click="look_tenent_info(row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          class-name="balance"
          label="可用余额"
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
        <el-table-column class-name="balance" label="冻结金额" align="center" prop="freezeBalance">
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
                    <div type="primary" class="btn" @click="showConfirmDelete(row)">
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
      @close="onBtnCancel()"
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改代理' : '新增代理'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 50px"
      >
        <el-form-item label="账号" prop="userName" :rules="isEdit ? [] : userNameRule">
          <el-input
            v-model="formData.userName"
            :disabled="isEdit"
            placeholder="请输入账号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="代理名称" prop="userNickName">
          <el-input v-model="formData.userNickName" placeholder="请输入代理名称" size="small" />
        </el-form-item>

        <el-form-item label="分润比例" prop="tenantProfitRate">
          <el-input
            v-model="formData.tenantProfitRate"
            placeholder="请输入分润比例"
            size="small"
            v-number-input
            type="number"
          >
            <template slot="append"> % </template>
          </el-input>
          <div class="help-tip">如：3% 表示平台代理可得平台利润的 3%</div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <AgentInfo :currItem="infoRow" ref="agentInfoDialog"></AgentInfo>

    <!-- <el-dialog :visible.sync="tenent_info_dialog" title="平台信息" width="700px">
      <my-table
        ref="tableRefTenant"
        class="mt-10"
        :tableData="infoTableData"
        :loadData="getTenantListByAgentId"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column label="平台名称" align="center" width="180">
          <template slot-scope="{ row }">
            <div>{{ row.tenantName }}</div>
          </template>
        </el-table-column>

        <el-table-column label="平台可用余额" align="center">
          <template slot-scope="{ row }">{{ row.availableBalance }} </template>
        </el-table-column>

        <el-table-column label="平台冻结金额" align="center">
          <template slot-scope="{ row }">
            {{ row.freezeBalance }}
          </template>
        </el-table-column>
      </my-table>

      <div slot="footer">
        <el-button @click="tenent_info_dialog = false" size="small"> 确定 </el-button>
      </div>
    </el-dialog> -->

    <el-dialog :visible.sync="user_info_dialog" title="开户信息" width="500px">
      <div style="margin-left: 10px">
        <div class="request">
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
            <span class="req-label">平台代理管理后台</span>
            <span class="req-value">
              <el-input :value="user_info.platformUrl" disabled></el-input>
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

    <el-dialog
      :visible.sync="reset_password_dialog"
      :title="
        resetPwdType == 1 ? '重置登录密码' : resetPwdType == 2 ? '重置谷歌密钥' : '重置交易密码'
      "
      width="600px"
      @close="closeResetPassword"
    >
      <el-form
        ref="form"
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
            <!-- <el-button size="small" class="el_btn" @click="resetPassword('password')"
              >重置</el-button
            > -->
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
            <!-- <el-button size="small" class="el_btn" @click="resetPassword('google_key')"
              >重置</el-button
            > -->
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
            <!-- <el-button size="small" class="el_btn" @click="resetPassword('tradePwd')"
              >重置</el-button
            > -->
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
         <el-button
          type="success"
          @click="
            resetPassword(
              resetPwdType == 1 ? 'password' : resetPwdType == 2 ? 'google_key' : 'tradePwd'
            )
          "
          >重置</el-button
        >
        <el-button type="primary" @click="closeResetPassword()" size="small"> 关闭 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      @close="onCopyBtnCancel()"
      :visible.sync="showCopyDialogVisable"
      title="复制平台代理"
      width="600px"
    >
      <div class="help-tip txt-center mb-10">
        复制平台代理就是根据已有的平台代理相关配置，快速创建新的平台代理。
      </div>
      <el-form
        ref="formCopyRef"
        :model="copyFormData"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 50px"
      >
        <el-form-item label="账号" prop="userName" :rules="userNameRule">
          <el-input v-model="copyFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="代理名称" prop="userNickName">
          <el-input v-model="copyFormData.userNickName" placeholder="请输入代理名称" size="small" />
        </el-form-item>

        <el-form-item label="代理模板" prop="agentTemplateId">
          <el-select
            filterable
            v-model="copyFormData.agentTemplateId"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in allAgentList"
              v-bind:key="item.id"
              :label="item.userName"
              :value="item.tenantAgentId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCopyBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onCopyBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="feeDialogVisible"
      @close="onFeeDialogBtnCancel()"
      :title="feeDialogTitle"
      width="500px"
    >
      <el-form
        ref="feeChangeFormDataRef"
        :model="feeChangeFormData"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号" prop="userName">
          <el-input
            v-model="feeChangeFormData.userName"
            :disabled="true"
            placeholder="请输入账号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="代理名称" prop="userNickName">
          <el-input
            v-model="feeChangeFormData.userNickName"
            :disabled="true"
            placeholder="请输入码商名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="余额类型" prop="banlance_type">
          <el-input
            v-model="feeChangeFormData.banlance_type"
            :disabled="true"
            placeholder="请输入余额类型"
            size="small"
          />
        </el-form-item>

        <el-form-item label="当前余额" prop="balance">
          <el-input v-model="feeChangeFormData.balance" :disabled="true" size="small" />
        </el-form-item>

        <el-form-item label="操作类型" prop="operationType">
          <el-input v-model="feeChangeFormData.operationType" :disabled="true" size="small" />
        </el-form-item>

        <el-form-item label="变动金额" prop="amount">
          <el-input
            v-number-input
            type="number"
            v-model="feeChangeFormData.amount"
            placeholder="请输入金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="交易密码" prop="tradePassword">
          <el-input
            type="password"
            show-password
            v-model="feeChangeFormData.tradePassword"
            placeholder="请输入交易密码"
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
import { tenantRules, queryRules } from './rules'

import clipboard from '@/utils/clipboard'

import {
  getTenantAgentPage,
  addTenantAgent,
  updateTenantAgent,
  deleteTenantAgent,
  copyTenantAgent,
  getAllTenantAgentList,
  isActiveTenantAgent,
  isTenantAgentUserNameExists,
  isTenantAgentUserNickNameExists,
  getTenantListByAgentId,
  getTenantAgentOpenInfo,
  availableBalance,
  freezeBalance,
  resetTenantAgentSecretKey,
  resetTenantAgentGoogleAuthKey,
  getTenantAgentById
} from '@/api/tenant-agent'
import { systemUserIsLock } from '@/api/system-manager'
import { patchUnlockUser } from '@/api/service-list.js'

import { resetTradePassword } from '@/api/tenant-manager'
import { userName, rulesName } from '@/utils/validate'
import { formatDateTime } from '@/utils'

import AgentInfo from './tenant-agent-info.vue'
export default {
  name: 'TenantAgent',
  components: {
    AgentInfo
  },

  data() {
    const isNameOnly = async (rule, value, callback) => {
      try {
        let ret = await isTenantAgentUserNameExists(value)
        if (ret.data) {
          callback(new Error('账号已存在'))
        } else {
          callback()
        }
      } catch (e) {
        console.log(e)
        callback()
      }
    }
    const isNickNameOnly = async (rule, value, callback) => {
      try {
        let ret = await isTenantAgentUserNickNameExists(this.userId == '' ? '0' : this.userId, {
          userNickName: value
        })
        if (ret.data) {
          callback(new Error('代理名称已存在'))
        } else {
          callback()
        }
      } catch (e) {
        console.log(e)
        callback()
      }
    }
    return {
      queryRules: queryRules,
      rules: tenantRules,
      userNameRule: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        ...userName,
        { validator: isNameOnly, trigger: 'blur' }
      ],
      userNickNameRule: [
        { required: true, message: '请输入代理名称', trigger: 'blur' },
        ...rulesName,
        { validator: isNickNameOnly, trigger: 'blur' }
      ],
      code: '',
      tableData: [],
      tenent_info_tableData: [],
      dialogVisible: false,
      tenent_info_dialog: false,
      user_info_dialog: false,
      reset_password_dialog: false,
      formData: {},
      feeDialogVisible: false, // 增减余额对话框
      feeDialogTitle: '默认标题',
      feeChangeFormData: {},
      formDataPassword: {},
      queryFormData: this.getQueryForm(),
      user_info: [],
      isEdit: false, // 是否是编辑状态
      showCopyDialogVisable: false,
      copyFormData: {},
      allAgentList: [],
      // 添加扩展数据，如 options 所需要的数据
      infoTableData: [],
      infoRow: {}, // 当前查看信息的 row
      resetPwdType: 1, // 重置密码类型 1:重置登录密码 2:重置谷歌密钥
      userId: '',
      showCopyBtn: false
    }
  },
  methods: {
    copyPassword(e) {
      this.clipboard(`${this.formDataPassword.login_code}`, e)
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

    async switchEnable(row) {
      try {
        let res = await isActiveTenantAgent(row.userId, row.isActive)
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.flushPage()
    },

    copyAgentInfo(e) {
      this.clipboard(
        `
账号：${this.user_info.userName}
初始登录密码：${this.user_info.initialLoginPassword}
平台代理管理后台：${this.user_info.platformUrl}

说明：（主要针对账号安全设定）
  1、平台、商户、码商开户时都会生成临时密码，账号初次登录时会强制进行修改
  2、若开户后忘记临时密码需要跟后台申请重置
  3、初次登录后，请及时设置交易密码

      `,
        e
      )
    },
    clipboard,
    onBtnCancel() {
      this.dialogVisible = false
      this.userId = ''
      this.$refs.formRef.resetFields()
    },

    showCopyDialog() {
      this.showCopyDialogVisable = true
      this.copyFormData = {
        userName: '',
        userNickName: '',
        agentTemplateId: ''
      }
    },
    async showUserInfo(row) {
      console.log(row, '开户信息')
      this.user_info_dialog = true
      let res = await getTenantAgentOpenInfo(row.tenantAgentId)
      console.log(res, 'res')
      this.user_info = res.data
    },
    closeResetPassword() {
      this.reset_password_dialog = false
      this.showCopyBtn = false
    },
    showResetPassword(row, type) {
      console.log('重置密码')
      this.resetPwdType = type
      this.userId = row.userId

      this.formDataPassword = {
        login_code: '********',
        google_key: '**********',
        tradePwd: '********'
      }
      this.reset_password_dialog = true
    },

    async resetPassword(row) {
      if (row == 'password') {
        let res = await resetTenantAgentSecretKey(this.userId)
        this.$message.success('密码重置成功')
        this.showCopyBtn = true
        this.formDataPassword.login_code = res.data
      } else if (row == 'google_key') {
        let res = await resetTenantAgentGoogleAuthKey(this.userId)
        this.$message.success('谷歌密钥重置成功')
      } else {
        // 交易密码
        await resetTradePassword(this.userId)
        this.$message.success('交易密码重置成功')
      }
      // this.userId = ''
    },

    look_tenent_info(row) {
      this.$refs.agentInfoDialog.tenent_info_dialog = true
      this.infoRow = Object.assign({}, row)
    },
    async getTenantListByAgentId(page) {
      let res = await getTenantListByAgentId(this.infoRow.tenantAgentId, { ...page })
      this.infoTableData = res.data.list
      console.log(res)
      return res
    },
    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确定解绑当前绑定的平台【 ${row.userNickName} 】吗？`)

        let res = await deleteTenantAgent(row.tenantAgentId)
        if (res.data) {
          this.$message.success('删除成功')
        }

        this.flushPage()
        this.getAllTenantAgentList()
      } catch (e) {
        console.log('取消删除')
      }
    },

    onCopyBtnCancel() {
      this.$refs.formCopyRef.resetFields()
      this.showCopyDialogVisable = false
    },
    onCopyBtnOk() {
      this.$refs.formCopyRef.validate(async (valid) => {
        if (valid) {
          await copyTenantAgent(this.copyFormData)
          this.$message.success('复制成功')

          this.onCopyBtnCancel()
          this.flushPage()
        }
      })
    },

    async showEditDialog(row) {
      console.log(row, 'edit')
      this.isEdit = true
      this.userId = row.userId
      let res = await getTenantAgentById(row.userId)
      console.log(res, '--')
      this.dialogVisible = true

      this.formData = res.data
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        userName: '',
        userNickName: '',
        tenantProfitRate: 0
      }
    },
    onFeeDialogBtnCancel() {
      this.feeDialogVisible = false
      this.$refs.feeChangeFormDataRef.resetFields()
    },

    onDialogBtnOk() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            console.log(this.formData, 'this.formData')
            // 编辑
            let obj = {
              tenantAgentId: this.formData.tenantAgentId,
              userId: this.formData.userId,
              userNickName: this.formData.userNickName,
              tenantProfitRate: this.formData.tenantProfitRate
            }

            await updateTenantAgent(obj)
            this.$message.success('修改成功')
          } else {
            // 新增
            await addTenantAgent(this.formData)
            this.$message.success('添加成功')
          }

          this.onBtnCancel()
          this.$refs.tableRef.getTableData(1)
          this.getAllTenantAgentList()
        }
      })
    },

    async loadTableData(page) {
      let params = {}
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== undefined && this.queryFormData[key] !== null) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await getTenantAgentPage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    checkMountNumber(type, balance, changeAmount) {
      if (
        (type == 1 || type == 3 || type == 5) &&
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
        (type == 2 || type == 4 || type == 6) &&
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
        if (valid) {
          // 提交
          let changeAmount = Number(this.feeChangeFormData.amount)
          let balance = Number(this.feeChangeFormData.balance)
          let freezeBalanceAmount = Number(this.feeChangeFormData.freezeBalance)
          
          if (this.feeChangeFormData.type == '1' || this.feeChangeFormData.type == '2') {
            //可用余额
            let changeType = this.feeChangeFormData.operationType == '充值' ? 0 : 1
            // if (this.feeChangeFormData.operationType == '扣款') {
            //   if (Number(this.feeChangeFormData.amount) > Number(this.feeChangeFormData.balance)) {
            //     this.$message.error('变动金额不能大于可用余额！')
            //     return
            //   }
            // }
            if (this.checkMountNumber(this.feeChangeFormData.type, balance, changeAmount) == false) {
              return
            }
            let res = await availableBalance({
              userId: this.feeChangeFormData.userId,
              businessType: 2, //  0-代收类，1-代付类，2-业务类
              changeType: changeType, // 账变类型（0-充值、1-扣款）
              changeAmount: Number(this.feeChangeFormData.amount),
              tradePassword: this.feeChangeFormData.tradePassword,
              remark: this.feeChangeFormData.remark
            })
          } else if (this.feeChangeFormData.type == '3' || this.feeChangeFormData.type == '4') {
            //冻结金额
            let changeType = this.feeChangeFormData.operationType == '冻结' ? 10 : 11
             if (
                this.checkMountNumber(this.feeChangeFormData.type, freezeBalanceAmount, changeAmount) == false
              ) {
                return
              }
           
            // if (
            //   Number(this.feeChangeFormData.amount) > Number(this.feeChangeFormData.balance) &&
            //   this.feeChangeFormData.operationType == '冻结'
            // ) {
            //   this.$message.error('变动金额不能大于可用余额！')
            //   return
            // } else if (
            //   Number(this.feeChangeFormData.amount) > Number(this.feeChangeFormData.balance) &&
            //   this.feeChangeFormData.operationType == '解冻'
            // ) {
            //   this.$message.error('变动金额不能大于冻结余额！')
            //   return
            // }
            let res = await freezeBalance({
              userId: this.feeChangeFormData.userId,
              businessType: 2, //  0-代收类，1-代付类，2-业务类
              changeType: changeType, // 账变类型（0-充值、1-扣款）
              changeAmount: Number(this.feeChangeFormData.amount),
              tradePassword: this.feeChangeFormData.tradePassword,
              remark: this.feeChangeFormData.remark
            })
            console.log(res, 'res')
          }

          this.$message.success('修改成功')
          this.onFeeDialogBtnCancel()
          this.flushPage()
        }
      })
    },
    showChangeFeeDialog(row, type) {
      console.log(row, 'row')
      this.feeDialogVisible = true
      // this.feeChangeFormData = Object.assign(this.feeChangeFormData, row)
      if (type == 1) {
        // 余额充值
        this.feeDialogTitle = '余额充值'
        this.feeChangeFormData = {
          banlance_type: '可用余额',
          balance: row.availableBalance,
          operationType: '充值'
        }
      } else if (type == 2) {
        this.feeDialogTitle = '余额扣除'
        this.feeChangeFormData = {
          banlance_type: '可用余额',
          balance: row.availableBalance,
          operationType: '扣款'
        }
      } else if (type == 3) {
        // 冻结金额 +
        this.feeDialogTitle = '增加冻结金额'

        this.feeChangeFormData = {
          banlance_type: '冻结余额',
          balance: row.availableBalance,
          operationType: '冻结'
        }
      } else if (type == 4) {
        // 冻结金额 -
        this.feeDialogTitle = '减少冻结金额'
        this.feeChangeFormData = {
          banlance_type: '冻结余额',
          balance: row.freezeBalance,
          operationType: '解冻'
        }
      }
      console.log(JSON.stringify(this.feeChangeFormData))
      this.feeChangeFormData.type = type
      this.feeChangeFormData.userId = row.userId
      this.feeChangeFormData.userName = row.userName
      this.feeChangeFormData.userNickName = row.userNickName
      this.feeChangeFormData.freezeBalance = row.freezeBalance
    },

    flushPage() {
      this.$refs.tableRef.getTableData()
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormDataRef.resetFields()
      this.$refs.tableRef.getTableData(1)
    },

    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let todayStr = formatDateTime(today)
      return {
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
    async getAllTenantAgentList() {
      let res = await getAllTenantAgentList()
      this.allAgentList = res.data
    }
  },
  mounted() {
    this.getAllTenantAgentList()
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
</style>
