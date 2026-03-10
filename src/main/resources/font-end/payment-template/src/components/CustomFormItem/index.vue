<template>
  <div class="custom-form-item" :class="{ 'is-error': validateState === 'error' }">
    <span
      v-if="label"
      class="custom-form-item-label"
      :style="{ width: labelWidth }"
    >
      {{ label }}
    </span>
    <div class="custom-form-item-content" :style="{ marginLeft: labelWidth }">
      <slot></slot>
      <div v-if="validateState === 'error'" class="custom-form-item-error">
        {{ validateMessage }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomFormItem',
  inject: ['form'],
  props: {
    label: String,
    prop: String,
    rules: Array,
    labelWidth: String
  },
  data() {
    return {
      validateState: '',
      validateMessage: ''
    }
  },
  mounted() {
    if (this.prop) {
      this.form.fields.push(this)
    }
  },
  beforeDestroy() {
    if (this.prop) {
      const index = this.form.fields.indexOf(this)
      if (index > -1) {
        this.form.fields.splice(index, 1)
      }
    }
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        const rules = this.rules || (this.form.rules && this.form.rules[this.prop])
        if (!rules || rules.length === 0) {
          resolve()
          return
        }
        
        const value = this.form.model[this.prop]
        let error = null
        
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i]
          
          if (rule.required && (!value || value === '')) {
            error = rule.message || `${this.label}不能为空`
            break
          }
          
          if (rule.validator) {
            rule.validator(rule, value, (err) => {
              if (err) {
                error = err
              }
            })
            if (error) break
          }
        }
        
        if (error) {
          this.validateState = 'error'
          this.validateMessage = error
          reject(error)
        } else {
          this.validateState = ''
          this.validateMessage = ''
          resolve()
        }
      })
    },
    resetField() {
      this.validateState = ''
      this.validateMessage = ''
      if (this.form.model && this.prop) {
        this.form.model[this.prop] = ''
      }
    }
  }
}
</script>

<style scoped>
.custom-form-item {
  margin-bottom: 22px;
}

.custom-form-item-label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 16px;
  /* color: #606266; */
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}

.custom-form-item-content {
  line-height: 40px;
  position: relative;
  font-size: 14px;
}

.custom-form-item-error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}

.custom-form-item.is-error .custom-form-item-content {
  margin-bottom: 22px;
}
</style>

