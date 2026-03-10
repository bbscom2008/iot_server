<template>
  <div class="custom-form">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CustomForm',
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: Object,
    labelWidth: String,
    labelPosition: {
      type: String,
      default: 'right'
    }
  },
  provide() {
    return {
      form: this
    }
  },
  data() {
    return {
      fields: []
    }
  },
  methods: {
    validate(callback) {
      const promises = this.fields.map(field => field.validate())
      Promise.all(promises).then(() => {
        callback(true)
      }).catch(() => {
        callback(false)
      })
    },
    resetFields() {
      this.fields.forEach(field => {
        field.resetField()
      })
    }
  }
}
</script>

<style scoped>
.custom-form {
  position: relative;
}
</style>

