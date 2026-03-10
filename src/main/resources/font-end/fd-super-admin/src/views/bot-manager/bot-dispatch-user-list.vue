<template>
  <div class="container" v-loading="loginLoading" :element-loading-text="loadingTitle">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="用户名" prop="">
          <el-input
            v-model="queryFormData.botDispatchUserName"
            placeholder="请输入用户名"
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
          >搜索
          </el-button
          >
          <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-10">
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>
      <my-table
        class="mt-10"
        :tableData="tableData"
        :loadData="loadTableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="用户名" align="center" prop="botDispatchUserName" />
        <el-table-column label="登录状态" align="center" prop="botDispatchLoginStatus">
          <template slot-scope="{ row }">
            <el-tag v-if="row.botDispatchLoginStatus==0">未登录</el-tag>
            <el-tag v-if="row.botDispatchLoginStatus==1">已登录</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remark" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="更新时间" align="center" prop="updateTime" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div v-if="row.botDispatchLoginStatus === 0" class="btn" @click="handleLogin(row)"><i
                class="el-icon-edit"
              />登录
              </div>
              <div v-if="row.botDispatchLoginStatus === 1" class="btn" @click="handleLogout(row)"><i
                class="el-icon-edit"
              />退出登录
              </div>
              <div v-if="row.botDispatchLoginStatus != 1" class="btn" @click="showEditDialog(row)"><i
                class="el-icon-edit"
              />修改
              </div>
              <div v-if="row.botDispatchLoginStatus != 1" class="btn mt-5" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      @close="btnCancel"
      :title="isEdit ? '修改转发用户' : '新增转发用户'"
      width="600px"
    >
      <el-form
        ref="formData"
        :model="formData"
        label-position="right"
        :rules="rules"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="用户名" prop="botDispatchUserName">
          <el-input v-model="formData.botDispatchUserName" placeholder="请输入转发用户名" size="small" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注信息"
            size="small"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="注意">
          <span style="color: red">转发用户名不能添加@符号</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="btnCancel" size="small"> 取消</el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="登录"
      :visible.sync="showLogin"
      width="400" append-to-body
      :close-on-click-modal="false"
      @close="closeLoginDialogHandler"
    >
      <div v-if="qrCode">
        <div style="color:red; text-align: center">请用TelegramApp扫码二维码</div>
        <div style="padding-top: 20px; text-align: center">
          <img :src="qrCode" style="width: 300px;height: 300px">
        </div>
      </div>
      <div v-if="showTwoStepPassword">
        <el-form ref="loginFormRef" :model="twoStepPasswordForm" :rules="twoStepPasswordRules" label-width="180px"
                 @submit.native.prevent
        >
          <el-form-item label="请输入二步验证码密码" prop="twoStepPassword">
            <el-input placeholder="请输入二步验证密码" v-model="twoStepPasswordForm.twoStepPassword"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitPasswordHandler">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBotDispatchUserPage,
  botDispatchUserUpdate,
  botDispatchUserAdd,
  botDispatchUserDelete,
  loginBotDispatchUser,
  submitTwoStepPassword,
  logoutBotDispatchUser
} from '@/api/bot-dispatch-user-list.js'
import {
  botDispatchUserMangerRules,
  twoStepPasswordRules
} from './rules.js'
import { getToken, getTokenHead } from '@/utils/auth'

export default {
  name: 'BotDispatchUserList',
  data() {
    return {
      queryFormData: this.getQueryForm(),
      formData: {
        botDispatchUserName: '',
        remark: ''
      },
      tableData: [],
      isEdit: false, // 是否是编辑状态
      dialogVisible: false,
      rules: botDispatchUserMangerRules,
      twoStepPasswordRules: twoStepPasswordRules,
      loginLoading: false,
      websocket: null,
      loadingTitle: '登录中,请稍后',
      qrCode: null,
      showLogin: false,
      showTwoStepPassword: false,
      twoStepPasswordForm: {
        tenantId: null,
        userName: null,
        twoStepPassword: null
      },
    }
  },
  watch: {
    '$store.state.tenant.selectTenantId'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$refs.tableRef.getTableData(1)
      }
    }
  },
  methods: {
    getQueryForm() {
      return {
        botUserName: '',
        botChatId: null,
        botUserType: null
      }
    },
    queryTableData() {
      // 刷新表格
      this.$refs.tableRef.getTableData(1)
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        botUserName: '',
        remark: ''
      }
    },
    async loadTableData(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== null) {
          params[key] = this.queryFormData[key]
        }
      })
      let res = await getBotDispatchUserPage(page, params)
      this.tableData = res.data.list
      return res
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除转发用户 【 ${row.botDispatchUserName} 】 吗？`)
        let res = await botDispatchUserDelete(row.botDispatchUserId)
        console.log(res, '删除成功')
        this.$refs.tableRef.getTableData(1)
      } catch (e) {
        console.log('取消删除')
      }
    },
    btnCancel() {
      console.log('----btnCancel----')
      this.dialogVisible = false
      this.$refs.formData.resetFields()
    },
    onDialogBtnOk() {
      this.$refs.formData.validate(async(valid) => {
        if (valid) {
          if (this.isEdit) {
            //修改
            const { botDispatchUserId, botDispatchUserName, remark } = this.formData
            let res = await botDispatchUserUpdate({
              botDispatchUserId,
              botDispatchUserName,
              remark,
              tenantId: this.$store.state.tenant.selectTenantId
            })
            console.log(res, '编辑')
          } else {
            //新增
            let res = await botDispatchUserAdd({ tenantId: this.$store.state.tenant.selectTenantId, ...this.formData })
            console.log(res, '添加')
          }
          this.btnCancel()
          this.$refs.tableRef.getTableData(1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async handleLogin(row) {
      try {
        let ret = await this.$confirm(`若有已登录用户会对其自动登出，确定登录新转发用户 【 ${row.botDispatchUserName} 】 吗？`)

        if (this.websocket != null) {
          console.log("我不是空的！！！")
          this.websocket.close()
        }
        console.log("log生效")
        this.websocket = null

        this.loginLoading = true
        const tenantId = this.$store.state.tenant.selectTenantId
        const userName = this.$store.state.user.userName
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const url = `${wsProtocol}//` + location.host + '/botDispatcherWebSocket?tenantId=' + tenantId + '&userName=' + userName
        this.websocket = new WebSocket(url)
        this.websocket.onopen = () => {
          loginBotDispatchUser({ tenantId: tenantId, userName: userName, botDispatchUserId: row.botDispatchUserId }).then(res => {
            this.loadingTitle = '登录中,请耐心等待.....'
          }).catch(() => {
            this.loginLoading = false
          })
        }
        this.websocket.onmessage = (event) => {
          if (event.data) {
            const data = JSON.parse(event.data)
            if (data.resultCode === 'fail') {
              this.loginLoading = false
              this.$message.error(data.message)
            }

            if (data.resultCode === 'success') {
              if (data.messageType === 'scanQrCode') {
                this.qrCode = data.message
                this.showLogin = true
                this.showTwoStepPassword = false
                this.loginLoading = false
              }
              if (data.messageType === 'inputTwoStepPassword') {
                this.showLogin = true
                this.qrCode = null
                this.showTwoStepPassword = true
              }
              if (data.messageType === 'twoStepPasswordResult') {
                this.$message.success('二步验证密码提交成功')
              }
              if (data.messageType === 'loginSuccess') {
                this.showLogin = false
                this.$message.success('登录成功')
                this.queryTableData()
                //关闭websocket
                if (this.websocket != null) {
                  this.websocket.close()
                  this.websocket = null
                }
              }
              if(data.messageType === 'closedAuth'){
                this.showLogin = false
                this.$message.error('转发用户登录频次过高，请稍后再试！！！')
                this.queryTableData()
                if (this.websocket != null) {
                  this.websocket.close()
                  this.websocket = null
                }
              }
            }
          }
        }
        this.websocket.onclose = () => {
          this.websocket = null
          this.loginLoading = false
          //this.$message.success('连接已关闭')
        }
      } catch (e) {
        console.log('取消登录')
      }
    },
    //关闭登录弹窗事件
    closeLoginDialogHandler() {
      if (this.websocket != null) {
        this.websocket.close()
        this.websocket = null
      }
      this.twoStepPasswordForm = {
        tenantId: null,
        userName: null,
        twoStepPassword: null
      },
      this.loginLoading = false
      this.showLogin = false
    },
    submitPasswordHandler() {
      this.twoStepPasswordForm.tenantId = this.$store.state.tenant.selectTenantId
      this.twoStepPasswordForm.userName = this.$store.state.user.userName
      submitTwoStepPassword(this.twoStepPasswordForm).then(res => {
        this.getQueryForm()
      })
    },
    async handleLogout(row) {
      try {
        let ret = await this.$confirm(`确定登出转发用户 【 ${row.botDispatchUserName} 】 吗？`)
        logoutBotDispatchUser(row.botDispatchUserId).then(res => {
          this.$message.success('登出成功')
          this.$refs.tableRef.getTableData()
          this.getList()
        })
        this.$refs.tableRef.getTableData(1)
      } catch (e) {
        console.log('取消登出')
      }
    }
  },
  mounted() {

  }

}
</script>

<style scoped lang="scss">

</style>
