<template>
  <el-form
    ref="innerForm"
    :model="formData"
    :rules="formRules"
    label-position="right"
    :label-width="labelWidth"
    :style="formStyle"
  >
    <el-form-item v-if="showIsActive" label="是否启用" prop="isActive">
      <el-switch v-model="formData.isActive" :active-value="1" :inactive-value="0" />
    </el-form-item>

    <el-form-item label="金额限制类型" prop="limitAmountType">
      <el-select
        v-model="formData.limitAmountType"
        filterable
        placeholder="请选择金额限制类型"
        size="small"
        @change="handleLimitAmountTypeChange"
      >
        <el-option label="无限制" :value="0" />
        <el-option label="固定金额" :value="1" />
        <el-option label="范围金额" :value="2" />
      </el-select>
    </el-form-item>

    <el-form-item v-if="formData.limitAmountType == 1" label="固定金额：" prop="fixedAmount">
      <el-input
        v-model="formData.fixedAmount"
        placeholder="请输入金额，多个金额用 “ , ” 分割"
        size="small"
      />
    </el-form-item>

    <div style="display: flex">
      <el-form-item
        v-if="formData.limitAmountType == 2"
        label="范围金额："
        prop="minAmount"
        :rules="innerMinAmountRules"
      >
        <el-input
          v-model="formData.minAmount"
          placeholder="请输入"
          size="small"
          style="width: 120px"
        />
      </el-form-item>
      <el-form-item
        v-if="formData.limitAmountType == 2"
        label=""
        prop="maxAmount"
        :rules="innerMaxAmountRules"
        label-width="0"
      >
        <span class="symbol" style="margin: 0 10px">~</span>
        <el-input
          v-model="formData.maxAmount"
          placeholder="请输入"
          size="small"
          style="width: 120px"
        />
        <span class="symbol" style="margin: 0 10px">元</span>
      </el-form-item>
    </div>

    <el-form-item label="当日最大金额" prop="dailyMaxAmount">
      <el-row>
        <el-col :span="12">
          <el-input
            v-model="formData.dailyMaxAmount"
            type="number"
            placeholder="请输入当日最大金额"
            size="small"
          />
        </el-col>
        <el-col :span="12">
          <span class="help-tip">【0 不限制】</span>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item label="当日最大订单数" prop="dailyMaxCount">
      <el-row>
        <el-col :span="12">
          <el-input
            v-model="formData.dailyMaxCount"
            type="number"
            placeholder="请输入当日最大订单数"
            size="small"
          />
        </el-col>
        <el-col :span="12">
          <span class="help-tip">【0 不限制】</span>
        </el-col>
      </el-row>
    </el-form-item>

    <!-- 大多数用不到，先注掉  -->
    <!-- <el-form-item label="过期时间" prop="payeeAccountExpireTimeType">
      <el-select
        v-model="formData.payeeAccountExpireTimeType"
        placeholder="请选择限制类型"
        size="small"
        @change="handleExpireTypeChange"
      >
        <el-option label="无限制" :value="0" />
        <el-option label="指定时间" :value="1" />
        <el-option label="指定时长" :value="2" />
      </el-select>
    </el-form-item> -->

    <el-form-item
      v-if="formData.payeeAccountExpireTimeType == 1"
      label="指定时间"
      prop="payeeAccountExpireTime"
    >
      <el-date-picker
        v-model="formData.payeeAccountExpireTime"
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期时间"
      />
    </el-form-item>

    <el-form-item
      v-if="formData.payeeAccountExpireTimeType == 2"
      label="指定时长"
      prop="payeeAccountExpireDuration"
    >
      <el-input
        v-model="formData.payeeAccountExpireDuration"
        v-input-int-positive
        type="number"
        placeholder="请输入数值"
        size="small"
      >
        <template slot="append">分钟</template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { amountCheck } from '@/utils/validate'
import { isEmpty } from '@/utils'

export default {
  name: 'ReceiveOrderConf',
  props: {
    formData: {
      type: Object,
      required: true
    },
    formRules: {
      type: Object,
      default: () => ({})
    },
    minAmountRules: {
      type: Array,
      default: () => []
    },
    maxAmountRules: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: String,
      default: '140px'
    },
    formStyle: {
      type: String,
      default: ''
    },
    showIsActive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    innerMinAmountRules() {
      if (this.minAmountRules && this.minAmountRules.length > 0) {
        return this.minAmountRules
      }
      return this.getDefaultMinAmountRules()
    },
    innerMaxAmountRules() {
      if (this.maxAmountRules && this.maxAmountRules.length > 0) {
        return this.maxAmountRules
      }
      return this.getDefaultMaxAmountRules()
    }
  },
  methods: {
    validate(callback) {
      if (!this.$refs.innerForm) {
        return callback ? callback(false) : false
      }
      return this.$refs.innerForm.validate(callback)
    },
    resetFields() {
      if (this.$refs.innerForm) {
        this.$refs.innerForm.resetFields()
      }
    },
    clearValidate(props) {
      if (!this.$refs.innerForm) {
        return
      }
      if (Array.isArray(props)) {
        props.forEach((prop) => this.$refs.innerForm.clearValidate(prop))
      } else if (typeof props === 'string') {
        this.$refs.innerForm.clearValidate(props)
      } else {
        this.$refs.innerForm.clearValidate()
      }
    },
    handleLimitAmountTypeChange(value) {
      this.$emit('limit-amount-type-change', value)
      if (value !== 1) {
        this.formData.fixedAmount = ''
        this.clearValidate('fixedAmount')
      }
      if (value !== 2) {
        this.formData.minAmount = ''
        this.formData.maxAmount = ''
        this.clearValidate(['minAmount', 'maxAmount'])
      }
    },
    handleExpireTypeChange() {
      this.$emit('expire-type-change', this.formData)
      if (this.formData.payeeAccountExpireTimeType !== 1) {
        this.formData.payeeAccountExpireTime = ''
      }
      if (this.formData.payeeAccountExpireTimeType !== 2) {
        this.formData.payeeAccountExpireDuration = ''
      }
      this.$nextTick(() => {
        this.clearValidate(['payeeAccountExpireTime', 'payeeAccountExpireDuration'])
      })
    },
    getDefaultMinAmountRules() {
      return [
        { required: true, message: '请输入最小金额', trigger: 'blur' },
        { validator: amountCheck, trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (!this.formData) {
              return callback()
            }
            if (isEmpty(this.formData.minAmount) || isEmpty(this.formData.maxAmount)) {
              return callback()
            }
            if (Number(this.formData.minAmount) >= Number(this.formData.maxAmount)) {
              return callback(new Error('必须小于最大金额'))
            }
            return callback()
          },
          trigger: 'blur'
        }
      ]
    },
    getDefaultMaxAmountRules() {
      return [
        { required: true, message: '请输入最大金额', trigger: 'blur' },
        { validator: amountCheck, trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (!this.formData) {
              return callback()
            }
            if (isEmpty(this.formData.minAmount) || isEmpty(this.formData.maxAmount)) {
              return callback()
            }
            if (Number(this.formData.minAmount) >= Number(this.formData.maxAmount)) {
              return callback(new Error('必须大于最小金额'))
            }
            return callback()
          },
          trigger: 'blur'
        }
      ]
    }
  }
}
</script>