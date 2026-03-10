<template>
  <div class="container">
    <el-dialog
      :visible.sync="balanceDialogVisible"
      title="余额划拔"
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

        <el-form-item label="收款码商名称" prop="">
          <el-select
            disabled
            filterable
            v-model="currItem.userNickName"
            placeholder="请选择收款码商"
            size="small"
            @change="(item) => serviceChange(item)"
          >
            <el-option
              v-for="item in receiveList"
              :label="'' + item.userNickName"
              :value="'' + item.userId"
              :key="'' + item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款用户可用余额" prop="">
          <el-input
            v-model="currItem.availableBalance"
            placeholder="请先选择收款码商（获取可用余额）"
            size="small"
            disabled
          />
        </el-form-item>
        <el-form-item label="操作" prop="operationType">
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
        </el-form-item>

        <el-form-item label="变动金额" prop="changeAmount">
          <el-input
            v-number-input-positive
            type="number"
            v-model="formData.changeAmount"
            placeholder="请输入变动金额"
            size="small"
            @blur="changeAmountBlur"
          />
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
  masterProvider
} from '@/api/report-center'
export default {
  props: {
    currItem: {
      type: Object,
      default: {}
    }
  },
  watch: {
    balanceDialogVisible(newVal) {
      if (newVal) {
        // this.getTransferProviderByProviderId()
      }
    }
  },

  data() {
    return {
      rules: serviceRules,
      formData: {
        userNickName: '',
        availableBalance: '',
        receiveUserId: '',
        operationType: '0',
        changeAmount: '',
        tradePassword: '',
        availableBalanceService: ''
      },
      receiveList: [],
      balanceDialogVisible: false,
      providerId: ''
    }
  },
  methods: {
    async changeAmountBlur(e) {
      if (this.formData.changeAmount == '') {
        return
      }
      // if (Number(this.formData.changeAmount) == 0) {
      //   this.$message.error('变动金额应大于0！')
      //   this.formData.changeAmount = ''
      //   return
      // }
      // if (
      //   this.formData.operationType == 0 &&
      //   Number(this.formData.changeAmount) > Number(this.$store.state.userAccount.availableBalance)
      // ) {
      //   //充值
      //   this.$message.error('变动金额不能大于当前码商可用余额！')
      //   this.formData.changeAmount = ''
      //   return
      // } else if (
      //   this.formData.operationType == 1 &&
      //   Number(this.formData.changeAmount) > Number(this.currItem.availableBalance)
      // ) {
      //   //扣款
      //   this.$message.error('变动金额不能大于收款用户可用余额！')
      //   this.formData.changeAmount = ''
      //   return
      // }

      if (this.formData.operationType == 0) {
        //   0 充值  1 扣款
        this.getUserAccount()
      }else{
        this.masterProvider()
      }
      
    },
    async masterProvider() {
      let res = await masterProvider(this.currItem.providerId)
      this.currItem.availableBalance = res.data.availableBalance
    },
    serviceChange(e) {
      const selectedItem = this.receiveList.find((item) => item.userId === e)
      this.providerId = selectedItem.providerId
      this.masterProvider()
    },
    // async getTransferProviderByProviderId() {
    //   let res = await getTransferProviderByProviderId(this.currItem.providerId)
    //   this.receiveList = res.data
    //   console.log(res)
    // },
    async getUserAccount() {
      let res = await getUserAccount()
      this.$store.state.userAccount.availableBalance = res.data.availableBalance
      this.$store.state.userAccount.freezeBalance = res.data.freezeBalance
      console.log(res, 'res')
    },
    onDialogBtnCancel() {
      this.$refs.formData.resetFields()
      this.$refs.formData.clearValidate()
      ;(this.formData = {
        userNickName: '',
        availableBalance: '',
        receiveUserId: '',
        operationType: '0',
        changeAmount: '',
        tradePassword: '',
        availableBalanceService: ''
      }),
        (this.balanceDialogVisible = false)
    },
    async onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
        //   if (
        //     this.formData.operationType == 0 &&
        // Number(this.formData.changeAmount) > Number(this.$store.state.userAccount.availableBalance)
        //   ) {
        //     //充值
        //     this.$message.error('变动金额不能大于当前码商可用余额！')
        //     return
        //   } else if (
        //     this.formData.operationType == 1 &&
        // Number(this.formData.changeAmount) > Number(this.currItem.availableBalance)
        //   ) {
        //     //扣款
        //     this.$message.error('变动金额不能大于收款用户可用余额！')
        //     return
        //   }

          let res = await transferBalance({
            userId: this.$store.state.userAccount.userId,
            businessType: 2, //  0-代收类，1-代付类，2-业务类
            receiveUserId: this.currItem.userId,
            changeAmount: Number(this.formData.changeAmount),
            operationType: this.formData.operationType,
            tradePassword: this.formData.tradePassword,
            remark: this.formData.remark
          })
          this.balanceDialogVisible = false
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
</style>
