<template>
  <picker
    :range="pickOptions.map((ele) => ele.label)"
    :value="selectedIndex"
    @change="onPickerChange"
  >
    <view class="picker-label">
      <text v-if="selectedOption">{{ selectedOption }}</text>
      <text v-else style="color: #a9a199">{{ placeholder }}</text>
      <uni-icons type="down"></uni-icons>
    </view>
  </picker>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    options: {
      type: Array,
      default: () => []
    },
    haveAll: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    valueKey: {
      type: String,
      default: 'value'
    }
  },
  data() {
    return {
      selectedIndex: 0
    }
  },
  computed: {
    selectedOption() {
      if (this.selectedIndex >= 0) {
        return this.pickOptions[this.selectedIndex].label
      } else {
        return ''
      }
    },
    pickOptions() {
      const useOptions = this.options.map((ele) => {
        return {
          label: ele[this.labelKey],
          value: ele[this.valueKey]
        }
      })

      if (this.haveAll) {
        return [
          {
            label: '全部',
            value: ''
          },
          ...useOptions
        ]
      } else {
        return useOptions
      }
    }
  },
  watch: {
    value(newValue) {
      this.selectedIndex = this.pickOptions.findIndex(
        (ele) => ele.value === newValue
      )
    }
  },
  created() {
    let index = this.pickOptions.findIndex((ele) => ele.value === this.value)
    // this.selectedIndex = index == -1 ? 0 : index
    this.selectedIndex = index
  },
  methods: {
    onPickerChange(e) {
      this.selectedIndex = e.detail.value
      this.$emit('input', this.pickOptions[this.selectedIndex].value)
      this.$emit('change', this.pickOptions[this.selectedIndex].value) // 必须触发 change 事件以触发校验
    },
    validate() {
      console.log('---validate------')
      if (this.value === null || this.value === '') {
        return {
          valid: false,
          errMsg: '请选择产品名称'
        }
      }
      return {
        valid: true,
        errMsg: ''
      }
    }
  }
}
</script>

<style scoped>
.picker-label {
  display: flex;
  justify-content: space-between;
  padding: 10rpx;
  border: 1px solid #ccc;
  padding-left: 10px;
  border-color: rgb(229, 229, 229);
  background-color: rgb(255, 255, 255);
}
</style>
