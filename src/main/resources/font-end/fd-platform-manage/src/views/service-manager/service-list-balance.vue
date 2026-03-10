<template>
  <div class="container">
    <el-dialog :visible.sync="balanceDialogVisible" title="余额划拔" width="600px">
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="150px"
        style="margin-right: 100px"
      >
        <el-form-item label="当前码商" prop="service_name">
          <el-input
            v-model="currItem.userNickName"
            placeholder="请输入当前码商"
            size="small"
            disabled
          />
        </el-form-item>

        <el-form-item label="当前可用余额" prop="can_use_money">
          <el-input
            v-model="currItem.availableBalance"
            placeholder="请输入当前可用余额"
            size="small"
            disabled
          />
        </el-form-item>

        <el-form-item label="收款码商名称" prop="receiveUserId">
          <el-select
            filterable
            v-model="formData.receiveUserId"
            placeholder="请选择收款码商"
            size="small"
          >
            <el-option
              v-for="item in receiveList"
              :label="'' + item.userNickName"
              :value="'' + item.userId"
              :key="'' + item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作" prop="operationType">
          <el-select v-model="formData.operationType" placeholder="请选择操作" size="small">
            <el-option label="扣款" :value="1"></el-option>
            <el-option label="充值" :value="0"></el-option>
          </el-select>
             <div v-if="formData.operationType == 1" class="help-tip ">
            扣款：从目标码商扣款，冲值给当前码商
          </div>
          <div v-if="formData.operationType == 0" class="help-tip ">
            充值：从当前码商扣款，冲值给目标码商
          </div>
        </el-form-item>

        <el-form-item label="变动金额" prop="changeAmount">
          <el-input
            v-number-input type="number"
            v-model="formData.changeAmount"
            placeholder="请输入变动金额"
            size="small"
          />
        </el-form-item>
        <el-form-item label="交易密码" prop="tradePassword">
          <el-input
            type="password" show-password
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
import { getPlatFromProviderByProviderId, transferBalance } from '@/api/service-list'
import { serviceRules } from './rules.js'
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
        this.getPlatFromProviderByProviderId()
        this.$nextTick(() => {
          this.$refs.formData.resetFields()
          this.$refs.formData.clearValidate()
        })
      }
    }
  },
  data() {
    return {
      rules: serviceRules,
      formData: {
        service_name: '',
        can_use_money: '',
        receiveUserId: '',
        operationType: 0,
        tradePassword: '',
        changeAmount: '',
        remark:''
      },
      receiveList: [],
      balanceDialogVisible: false
    }
  },
  methods: {
    async getPlatFromProviderByProviderId() {
      let res = await getPlatFromProviderByProviderId(this.currItem.tenantId, {
        providerId: this.currItem.providerId
      })
      this.receiveList = res.data
      console.log(res)
    },
    onDialogBtnCancel() {
      this.$refs.formData.resetFields()
      this.$refs.formData.clearValidate()
      this.balanceDialogVisible = false
    },
    async onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          // if (Number(this.formData.changeAmount) > Number(this.currItem.availableBalance)) {
          //   this.$message.error('变动金额不能大于可用余额！')
          //   return
          // }
          let res = await transferBalance({
            userId: this.currItem.userId,
            businessType: 2, //  0-代收类，1-代付类，2-业务类
            receiveUserId: this.formData.receiveUserId,
            changeAmount: Number(this.formData.changeAmount),
            operationType: this.formData.operationType,
            tradePassword: this.formData.tradePassword,
            remark: this.formData.remark
          })
          console.log(res, 'res')
          this.balanceDialogVisible = false
          this.$parent.flushPage()
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
</style>
