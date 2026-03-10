<template>
  <!-- 透传所有属性、事件、插槽到 el-date-picker -->
  <DatePicker
    v-bind="mergedProps"
    v-on="$listeners"
    :picker-options="mergedPickerOptions"
    @blur="handleBlur"
  >
    <!-- 透传所有插槽 -->
    <template v-for="(_, slotName) in $scopedSlots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </DatePicker>
</template>

<script>
import DatePicker from 'element-ui/lib/date-picker'


export default {
  name: 'MyDateTimePicker',
  inheritAttrs: false, // 防止属性绑定到根元素
  components: {
    DatePicker
  },
  props: {
    // 可添加自定义 props（可选）
    customOption: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // 合并默认 picker-options 和用户传入的 picker-options
    mergedPickerOptions() {
      // const defaultOptions = {
      //   disabledDate: (time) => {
      //     // 这里可以添加全局禁用逻辑（例如默认禁用周末）
      //     return time.getDay() === 0 || time.getDay() === 6
      //   }
      // }
      // return Object.assign({}, defaultOptions, this.$attrs['picker-options'], this.customOption)
      return Object.assign({},  this.$attrs['picker-options'], this.customOption)
    },
    // 合并所有属性（避免直接修改 $attrs）
    mergedProps() {
      return {
        ...this.$attrs
        //   'picker-options': this.mergedPickerOptions
      }
    }
  },
  methods: {
    handleBlur() {
      this.$store.commit('order/setStartTime', 0)
      this.$store.commit('order/setStartTimeOneDay', 0)
      this.$emit('blur')
    },
    // 可添加全局方法（例如统一日志记录）
    handleFocus() {
      console.log('DateTimePicker focused')
      this.$emit('focus')
    }
  }
}
</script>
