<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        ref="queryFormRef"
        :rules="queryRules"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="账号" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="用户名称" prop="userNickName">
          <el-input
            v-model="queryFormData.userNickName"
            placeholder="请输入用户名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="锁定状态" prop="isLocked">
          <el-select
            filterable
            v-model="queryFormData.isLocked"
            style="width: 120px"
            placeholder="选择状态"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="锁定" :value="1"></el-option>
            <el-option label="正常" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select
            v-model="queryFormData.isActive"
            style="width: 120px"
            placeholder="请选择是否启用"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色名称" prop="roleId">
          <el-select v-model="queryFormData.roleId" placeholder="请选择角色" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in rolesOptions"
              :key="'' + item.roleId"
              :label="item.roleName"
              :value="'' + item.roleId"
            ></el-option>
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

      <el-button
        type="success"
        :disabled="selectedRows.length == 0"
        plain
        icon="el-icon-plus"
        @click="unloadSelectedRows"
        >解锁</el-button
      >

      <span style="margin-left: 20px;">
        用户类型：
      </span>
      <el-select
        v-model="selectType"
        style="width: 120px"
        placeholder="选择用户类型"
        size="small"
      >
        <el-option label="平台用户" :value="1"></el-option>
        <el-option label="超管用户" :value="0"></el-option>
      </el-select>


      <my-table
        class="mt-10"
        :loadData="getUserPage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column align="center" type="selection" width="60" />
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="账号" align="center" prop="userName" />
        <el-table-column label="用户名称" align="center" prop="userNickName" />
        <el-table-column label="用户类型" align="center" prop="userType">
          <template slot-scope="{ row }">
            <el-tag v-if="row.userType == '0'">系统用户</el-tag>
            <el-tag v-if="row.userType == '1'">平台代理</el-tag>
            <el-tag v-if="row.userType == '2'">平台</el-tag>
            <el-tag v-if="row.userType == '3'">商户代理</el-tag>
            <el-tag v-if="row.userType == '4'">商户</el-tag>
            <el-tag v-if="row.userType == '5'">码商</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="角色名称" align="center" prop="roleName">
          <template slot-scope="{ row }"> {{ row.roleName }} </template>
        </el-table-column>

        <el-table-column label="锁定状态" align="center" prop="isLocked">
          <template slot-scope="{ row }">
            <el-tag v-if="row.isLocked == 1" type="danger">{{
              row.isLocked == 1 ? '已锁定' : '未锁定'
            }}</el-tag>
            <el-tag v-else>{{ row.isLocked == 1 ? '已锁定' : '未锁定' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center" prop="remark" />

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" @change="enableChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="createBy" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="100" />
        <el-table-column label="更新人" align="center" prop="updateBy" />
        <el-table-column label="更新时间" align="center" prop="updateTime" width="100" />

        <el-table-column align="center" label="操作" width="180" fixtt="right">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showUserInfo(row)">
                <i class="el-icon-user" />开户信息
              </div>
              <!-- <div type="success" class="btn" @click="showResetPassword(row)">
                <i class="el-icon-brush" />重置密码
              </div> -->

              <!-- <el-dropdown trigger="click">
                <div type="success" class="btn">更多 <i class="el-icon-caret-bottom" /></div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item> -->
                    <div type="success" class="btn" @click="showResetPassword(row, 1)">
                      <i class="el-icon-edit" />重置登录密码
                    </div>
                  <!-- </el-dropdown-item>
                  <el-dropdown-item> -->
                    <div type="success" class="btn" @click="showResetPassword(row, 2)">
                      <i class="el-icon-edit" />重置谷歌密钥
                    </div>

                    <div type="success" class="btn" @click="showEditDialog(row)">
                      <i class="el-icon-edit" />修改
                    </div>
                    
                  <!-- </el-dropdown-item>
                  <el-dropdown-item> -->
                    <div type="success" class="btn" @click="showResetPassword(row, 3)">
                      <i class="el-icon-brush" />重置交易密码
                    </div>
                    <!-- </el-dropdown-item>
                    <el-dropdown-item> -->
                    
                    <!-- </el-dropdown-item>
                    <el-dropdown-item> -->
                    <div type="primary" class="btn" @click="showConfirmDelete(row)">
                      <i class="el-icon-delete" />删除
                    </div>
                  <!-- </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改用户' : '新增用户'"
      width="600px"
    >
      <el-form
        ref="formData"
        :model="formData"
        label-position="right"
        label-width="120px"
        :rules="rules"
        style="margin-right: 50px"
      >
        <el-form-item label="账号" prop="userName" :rules="isEdit ? [] : userNameRules">
          <el-input
            v-model="formData.userName"
            :disabled="isEdit"
            placeholder="请输入账号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="用户名称" prop="userNickName">
          <el-input v-model="formData.userNickName" placeholder="请输入用户名称" size="small" />
        </el-form-item>

        <el-form-item label="角色" prop="roleId">
          <el-select filterable v-model="formData.roleId" placeholder="请选择角色" size="small">
            <el-option
              v-for="item in rolesOptions"
              :key="'' + item.roleId"
              :label="item.roleName"
              :value="'' + item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="btnCancel" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="user_info_dialog" title="开户信息" width="500px">
      <div style="margin-left: 50px">
        <p>
          <span class="label">登录地址:</span
          ><span class="text">{{ user_info.loginAddress ? user_info.loginAddress : '空' }}</span>
        </p>
        <p>
          <span class="label">账号:</span
          ><span class="text">{{ user_info.userName ? user_info.userName : '空' }}</span>
        </p>
        <p>
          <span class="label">登录密码:</span
          ><span class="text">{{ user_info.loginPassword ? user_info.loginPassword : '空' }}</span>
        </p>
        <span class="remark red">说明：登录密码为初始密码请及时登录修改</span>
        <p>
          <el-button
            size="small"
            @click="
              (e) => {
                copyInfo(e)
              }
            "
            >复制</el-button
          >
        </p>
      </div>

      <div slot="footer">
        <el-button @click="user_info_dialog = false" size="small"> 确定 </el-button>
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

        <el-button type="primary" @click="closeResetPassword()"  >
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { sysMangerRules, queryRules } from '../rules.js'
import {
  getUserPage,
  systemUserAdd,
  systemUserUpdate,
  getRoleList,
  checkUserIsExists,
  resetGoogleAuthKeys,
  resetPassword,
  userDelete,
  userEnable,
  userUnlock,
  userAccountInfo
} from '@/api/system-manager'
import { resetTradePassword } from '@/api/tenant-manager'
import { formatDateTime } from '@/utils'
import { userNameValidate } from '@/utils/validate'
import clipboard from '@/utils/clipboard'
export default {
  name: 'UserManage',
  data() {
    return {
      selectType: 1,
      queryRules: queryRules,
      rules: sysMangerRules,
      userNameRules: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        ...userNameValidate,
        {
          validator: async (rule, value, callback) => {
            console.log(value)
            let ret = await checkUserIsExists(value)
            if (ret.data) {
              callback(new Error('账号已存在'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      tableData: [],
      showCopyBtn: false,
      dialogVisible: false,
      user_info_dialog: false,
      reset_password_dialog: false,
      formDataPassword: {
        login_code: '',
        google_key: ''
      },
      userId: '',
      user_info: {},
      formData: {
        userName: '',
        userNickName: '',
        isActive: '',
        roleId: ''
      },
      queryFormData: this.getQueryForm(),
      isEdit: false, // 是否是编辑状态
      selectedRows: [],

      // 添加扩展数据，如 options 所需要的数据
      rolesOptions: [],
      resetPwdType: 1 // 1 登录密码 2 谷歌密钥
    }
  },
  computed: {
    selectTenantd(){
      if(this.selectType == 1){ // 平台
        return this.$store.state.tenant.selectTenantId
      }else if(this.selectType == 0){ // 超管
        return this.$store.state.tenant.currTenantId
      }
    },
  },
  watch: {
    '$store.state.tenant.selectTenantId'(newV, oldV) {
      if(this.selectType == 1){
        this.queryTableData()
      }
    },
    selectType(newV,oldV){
      this.queryTableData()
    },
  },
  methods: {
    closeResetPassword() {
      this.reset_password_dialog = false
      this.showCopyBtn = false
    },
    async enableChange(row) {
      // let res = await userEnable(BigInt(row.userId), { isActive: row.isActive })
      // this.$refs.tableRef.getTableData()
      // console.log(res)

      try {
        let res = await userEnable(BigInt(row.userId), { isActive: row.isActive })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.$refs.tableRef.getTableData()
    },
    copyInfo(e) {
      clipboard(
        `
      登录地址： ${this.user_info.loginAddress}
      账号： ${this.user_info.userName}
      登录密码： ${this.user_info.loginPassword}

      说明：登录密码为初始密码请及时登录修改
      `,
        e
      )
    },
    // async roleCodeBlur(e) {
    //   console.log(e.target.value, '已经失焦')
    //   if (e.target.value) {
    //     let res = await checkUserIsExists(e.target.value)
    //     console.log(res)
    //   }
    // },
    copyPassword(e) {
      clipboard(`${this.formDataPassword.login_code}`, e)
    },
    async resetPassword(row) {
      if (row == 'password') {
        let res = await resetPassword(this.userId)
        this.$message.success('密码重置成功')
        this.showCopyBtn = true
        this.formDataPassword.login_code = res.data
      } else if (row == 'google_key') {
        let res = await resetGoogleAuthKeys(this.userId)
        this.$message.success('谷歌验证码重置成功')
      } else {
        // 交易密码
        await resetTradePassword(this.userId)
        this.$message.success('交易密码重置成功')
      }
    },
    async getRoleList() {
      let res = await getRoleList({ tenantId: this.selectTenantd })
      this.rolesOptions = res.data
      console.log(res)
    },
    async getUserPage(page) {
      let obj = { ...this.queryFormData, tenantId: this.selectTenantd }
      if (this.queryFormData.createTime) {
        obj = {
          ...obj,
          startTime: this.queryFormData.createTime ? this.queryFormData.createTime[0] : '',
          endTime: this.queryFormData.createTime ? this.queryFormData.createTime[1] : ''
        }
      }
      const { createTime, ...rest } = obj

      if(this.selectType == 1){ // 平台端用户
        rest.userType = 2
      }


      let res = await getUserPage(rest, { ...page })
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    /**
     * 解锁选定的 行
     */
    unloadSelectedRows() {
      this.$confirm('确认解锁选择的用户吗？')
        .then(async (_) => {
          // done();
          let userIdList = []
          this.selectedRows.forEach((item) => {
            userIdList.push(item.userId)
          })
          console.log(userIdList, 'this.selectedRows')

          let res = await userUnlock({ userIdList: userIdList.join(',') })
          this.$refs.tableRef.getTableData()
          console.log(res)
        })
        .catch((_) => {})
    },

    handleSelectionChange(val) {
      this.selectedRows = val
    },

    async showUserInfo(row) {
      let res = await userAccountInfo(BigInt(row.userId))
      console.log(res)
      this.user_info = res.data
      this.user_info_dialog = true
    },
    showResetPassword(row, type) {
      // console.log('重置密码')
      this.resetPwdType = type
      this.userId = row.userId

      this.formDataPassword = {
        login_code: '********',
        google_key: '**********',
        tradePwd: '********'
      }
      this.reset_password_dialog = true
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除 【 ${row.userNickName}】 吗？`)
        let res = await userDelete(BigInt(row.userId))
        console.log(res, '删除成功')
        this.$refs.tableRef.getTableData()

        //todo 调用接口删除
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },
    showEditDialog(row) {
      console.log(row, 'row')
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
      this.formData.roleId = String(this.formData.roleId)
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.getRoleList()
      this.formData = {
        userName: '',
        userNickName: '',
        isActive: 1,
        roleId: ''
      }
    },
    btnCancel() {
      console.log('----btnCancel----')
      this.dialogVisible = false
      this.$refs.formData.resetFields()
    },
    onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            //修改
            const { userId, userNickName, roleId, isActive } = this.formData
            let res = await systemUserUpdate({ userId, userNickName, userName:userNickName, roleId, isActive })
            console.log(res, '编辑')
            this.$refs.tableRef.getTableData()
          } else {
            //新增
            let res = await systemUserAdd({ ...this.formData, userType: '2' })
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
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
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
        userName: '',
        userNickName: '',
        isLocked: '',
        isActive: '',
        roleId: '',
        // createTime: [todayStr, nowStr]
        createTime: []
      }
    },

    queryTableData() {
      this.$refs.queryFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        // todo 搜索
        console.log(this.queryFormData)
        this.$refs.tableRef.getTableData(1)
      })
    }
  },
  mounted() {
    this.getRoleList()
  }
}
</script>

<style lang="scss" scoped>
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
</style>
