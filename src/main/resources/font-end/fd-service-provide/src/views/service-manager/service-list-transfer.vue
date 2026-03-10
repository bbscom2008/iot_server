<template>
  <div class="container">
    <el-dialog
      :visible.sync="transferDialogVisible"
      title="转账"
      width="600px"
      @close="onDialogBtnCancel"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="150px"
        style="margin-right: 50px"
      >
        <el-form-item label="当前码商" prop="">
          <el-input
            v-model="$store.state.user.userName"
            placeholder="请输入当前码商"
            size="small"
            disabled
          />
        </el-form-item>
        <el-form-item label="当前可用余额" prop="">
          <el-input
            v-model="$store.state.userAccount.availableBalance"
            placeholder="请输入当前可用余额"
            size="small"
            disabled
          />
        </el-form-item>
        <el-form-item label="收款账号" prop="userName">
          <div class="line">
            <el-input v-model="formData.userName" placeholder="请输入收款账号" size="small" />
            <el-button class="el_btn" size="mini" type="primary" @click="checkUserName()">
              查询
            </el-button>
            <el-button class="el_btn" size="mini" @click="deleteUserName()"> 清除 </el-button>
          </div>
        </el-form-item>
        <el-form-item label="目标码商名称" prop="">
          <el-input
            v-model="formData.receiveUserNickName"
            placeholder="请先输入收款账号（获取目标码商名称）"
            size="small"
            disabled
          />
        </el-form-item>
        <!-- <el-form-item label="操作" prop="operationType">
          <el-select
            filterable
            v-model="formData.operationType"
            placeholder="请选择操作"
            size="small"
          >
            <el-option label="充值" value="0"></el-option>
            <el-option label="扣款" value="1"></el-option>
          </el-select>
          <div v-if="formData.operationType == 1" class="help-tip line-height5">
            <p>扣款：从目标码商扣款，充值给当前码商</p>
            <p>变动金额小于目标码商可用余额且大于0</p>
          </div>
          <div v-if="formData.operationType == 0" class="help-tip line-height5">
            <p>充值：从当前码商扣款，充值给目标码商</p>
            <p>变动金额小于当前码商可用余额且大于0</p>
          </div>
        </el-form-item> -->

        <el-form-item label="转账金额" prop="changeAmount">
          <el-input
            v-number-input-positive
            type="number"
            v-model="formData.changeAmount"
            placeholder="请输入变动金额"
            size="small"
            @blur="changeAmountBlur"
          />
          <div class="help-tip line-height5">
            <p>转账金额小于等于当前码商当前可用余额，且大于0</p>
          </div>
        </el-form-item>

        <el-form-item label="交易密码" prop="tradePassword">
          <el-input
            type="password"
            show-password
            v-model="formData.tradePassword"
            placeholder="请输入交易密码"
            size="small"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { serviceRules } from './rules.js'
import { getUserAccount } from '@/api/user'
import {
  transferBalance,
  getTransferProviderByProviderId,
  masterProvider,
  getProviderByUserName,
  getProviderListPage
} from '@/api/report-center'
export default {
  props: {
    currItem: {
      type: Object,
      default: {}
    }
  },
  watch: {
    transferDialogVisible(newVal) {
      if (newVal) {
        // this.getTransferProviderByProviderId()
      }
    }
  },

  data() {
    return {
      rules: serviceRules,
      formData: {
        userName: '',
        availableBalance: '',
        receiveUserId: '',
        operationType: '',
        changeAmount: '',
        tradePassword: '',
        receiveUserNickName: ''
      },
      receiveInfo: {},
      transferDialogVisible: false,
      providerId: ''
    }
  },
  methods: {
    deleteUserName() {
      this.formData.userName = ''
      this.formData.receiveUserNickName = ''
    },
    async checkUserName() {
      if (this.formData.userName == '') {
        this.$message.error('请先输入收款账号！')
        return
      }
      let res = await getProviderByUserName({ userName: this.formData.userName })
      if (res.data == null) {
        this.$message.error('请输入正确的收款账号！')
        return
      }
      this.receiveInfo = res.data
      this.formData.receiveUserNickName = res.data.userNickName
    },
    onDialogBtnCancel() {
      this.$refs.formData.resetFields()
      this.$refs.formData.clearValidate()
      ;(this.formData = {
        userNickName: '',
        availableBalance: '',
        receiveUserId: '',
        operationType: '',
        changeAmount: '',
        tradePassword: '',
        receiveUserNickName: ''
      }),
        (this.transferDialogVisible = false)
    },
    async getUserAccount() {
      let res = await getUserAccount()
      this.$store.state.userAccount.availableBalance = res.data.availableBalance
      this.$store.state.userAccount.freezeBalance = res.data.freezeBalance
      console.log(res, 'res')
    },
    changeAmountBlur(e) {
      if (Number(this.formData.changeAmount) == 0) {
        this.$message.error('转账金额应大于0！')
        this.formData.changeAmount = ''
        return
      }
      if (
        Number(this.formData.changeAmount) > Number(this.$store.state.userAccount.availableBalance)
      ) {
        //充值
        this.$message.error('转账金额不能大于当前码商可用余额！')
        this.formData.changeAmount = ''
        return
      }
      this.getUserAccount()
    },
    async onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          if (this.formData.receiveUserNickName == '') {
            this.$message.error('请先确认目标码商名称！')
            return
          }
          if (
            Number(this.formData.changeAmount) >
            Number(this.$store.state.userAccount.availableBalance)
          ) {
            //充值
            this.$message.error('转账金额不能大于当前码商可用余额！')
            this.formData.changeAmount = ''
            return
          }
          let res = await transferBalance({
            userId: this.$store.state.userAccount.userId,
            businessType: 2, //  0-代收类，1-代付类，2-业务类
            receiveUserId: this.receiveInfo.userId,
            changeAmount: Number(this.formData.changeAmount),
            operationType: 0,
            tradePassword: this.formData.tradePassword,
            remark: this.formData.remark,
            isTransfer: true
          })
          this.transferDialogVisible = false
          this.$parent.flushPage()
          this.getUserAccount()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 20px;
  display: flex;
  justify-content: right;
}
.line-height5 {
  line-height: 5px;
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
</style>
