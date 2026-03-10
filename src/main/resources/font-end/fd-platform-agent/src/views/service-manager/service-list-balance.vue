<template>
  <div class="container">
    <el-dialog :visible.sync="balanceDialogVisible" title="余额划拔" width="600px">
      <el-form
        ref="form"
        :model="formData"
        :rules="myRules"
        label-position="right"
        label-width="150px"
        style="margin-right: 100px"
      >
        <el-form-item label="当前码商" prop="service_name">
          <el-input
            v-model="currItem.service_name"
            placeholder="请输入当前码商"
            size="small"
            disabled
          />
        </el-form-item>

        <el-form-item label="当前可用余额" prop="can_use_money">
          <el-input
            v-model="currItem.can_use_money"
            placeholder="请输入当前可用余额"
            size="small"
            disabled
          />
        </el-form-item>

        <el-form-item label="收款用户名" prop="income_use_name">
          <el-select filterable  v-model="formData.income_use_name" placeholder="请选择收款用户名" size="small">
            <el-option label="收款用户名" value="1"></el-option>
            <el-option label="收款用户名" value="2"></el-option>
            <el-option label="收款用户名" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作" prop="handle">
          <el-select filterable  v-model="formData.handle" placeholder="请选择操作" size="small">
            <el-option label="充值" value="1"></el-option>
            <el-option label="扣款" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="变动金额" prop="change_money">
          <el-input
            v-model="formData.change_money"
            placeholder="请输入变动金额"
            size="small"
          />
        </el-form-item>
        <el-form-item label="支付密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入支付密码"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="balanceDialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    currItem: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      formData: {
        service_name: this.currItem.merchant_nickname,
        can_use_money: '',
        income_use_name: '',
        handle: '',
        password: '',
        change_money: ''
      },
      balanceDialogVisible: false,
    }
  },
  methods: {
    onDialogBtnOk() {
      this.balanceDialogVisible = false
    }
  },
  mounted() {
    
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 20px;
  display: flex;
  justify-content: right;
}
</style>
