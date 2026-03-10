<template>
  <div class="emoji-panel">
    <div class="emoji-list">
      <div class="emoji-box">
        <div
          class="item"
          v-for="(emoji, index) in emojiList"
          :key="index"
          @click="insertEmoji(emoji)"
        >
          {{ emoji }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    inputBox: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selectionStart: 0,
      selectionEnd: 0,

      inputDom: null,
      inputValue: '',
      emojiList: [
        '😂',
        '👍',
        '👏',
        '😄',
        '😁',
        '😆',
        '😅',
        '😉',
        '😊',
        '😇',
        '😋',
        '😭',
        '😜',
        '😝',
        '😱',
        '😳',
        '😵',
        '😶',
        '😷',
        '🙃',
        '🙄',
        '🎄',
        '🎇',
        '🧨',
        '✨',
        '🎈',
        '🎉',
        '🧧',
        '🎀',
        '🎁',
        '🃏',
        '🀄',
        '🍺',
        '🍻',
        '🥂',
        '🤝',
        '🙏',
        '😸',
        '😹',
        '😺',
        '😻',
        '😼',
        '😽',
        '😾',
        '😿',
        '🙀',
        '🙅',
        '🙆'
        // "🙇",
        // "🙈",
        // "🙉",
        // "🙊",
        // "🙋",
        // "🙌",
      ] // 完整列表可扩展
    }
  },
  mounted() {
    console.log('-----inputBox-----')
    console.log(this.inputBox)

    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.inputDom = this.inputBox.$el.querySelector('#textinput')

      this.inputDom.addEventListener('blur', (e) => {
        this.selectionStart = this.inputDom.selectionStart
        this.selectionEnd = this.inputDom.selectionEnd
      })
    },
    changeValue() {
      this.$emit('changeValue', this.inputValue)
    },

    // 插入表情的核心方法
    insertEmoji(emoji) {
      // 插入emoji前先隐藏键盘

      this.inputValue = this.inputDom.value

      // 使用Array.from确保正确处理Unicode字符
      let pre = this.inputValue.substring(0, this.selectionStart)
      let after = this.inputValue.substring(this.selectionEnd)

      this.inputValue = pre + emoji + after

      this.selectionStart += emoji.length
      this.selectionEnd = this.selectionStart

      this.changeValue()
      this.inputDom.focus()

      this.$nextTick(() => {
        // 调整光标位置
        this.inputDom.setSelectionRange(this.selectionStart, this.selectionEnd)
      })

     
    }
  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.01);
  width: 100%;
  height: 100%;
}

.emoji-panel {
  // position: fixed;
  width: 100%;
  background: #fff;
  border-top: 1rpx solid #eee;
}

.emoji-box {
  height: 150px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  font-size: 25px;
  padding: 8px;

  .item {
    padding: 2px;
    overflow-y: auto;
  }
}
</style>
