<template>
  <div class="btn-change">
    <el-radio-group :value="value" @input="onTradeTypeChange">
      <el-radio-button label="0">代收</el-radio-button>
      <el-radio-button label="1">代付</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'TradeTypeSwitch',
  props: {
    value: {
      type: Number | Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },

  methods: {
    onTradeTypeChange(e){
        this.$emit('input', e)
        this.$emit('change', e)
        this.$emit('update:value', e)
    }
  }
}
</script>
<style lang="scss" scoped>

.btn-change{
   ::v-deep .el-radio-button__inner{
        width: 80px;
    }
}



</style>
