<template>
  <view class="emoji-panel">
    <scroll-view scroll-y class="emoji-list" @touchmove.prevent>
      <view class="emoji-box">
        <view class="item" v-for="(emoji, index) in emojiList" :key="index" @click.stop="selectEmoji(emoji)">
          {{ emoji }}
        </view>
      </view>

    </scroll-view>
    <!-- <button @click="$emit('close')">关闭</button> -->
  </view>
</template>

<script>
  export default {
    data() {
      return {
        emojiList: [
          "😂",
          "👍",
          "👏",
          "😄",
          "😁",
          "😆",
          "😅",
          "😉",
          "😊",
          "😇",
          "😋",
          "😭",
          "😜",
          "😝",
          "😱",
          "😳",
          "😵",
          "😶",
          "😷",
          "🙃",
          "🙄",
          "🎄",
          "🎇",
          "🧨",
          "✨",
          "🎈",
          "🎉",
          "🧧",
          "🎀",
          "🎁",
          "🃏",
          "🀄",
          "🍺",
          "🍻",
          "🥂",
          "🤝",
          "🙏",
          "😸",
          "😹",
          "😺",
          "😻",
          "😼",
          "😽",
          "😾",
          "😿",
          "🙀",
          "🙅",
          "🙆",
          "🙇",
          // "🙈",
          // "🙉",
          // "🙊",
          // "🙋",
          // "🙌",
        ] // 完整列表可扩展
      }
    },
    methods: {
      selectEmoji(emoji) {
        this.$emit('select', emoji)
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
    width: 100vw;
    height: 100vh;
  }

  .emoji-panel {
    position: fixed;
    bottom: 0rpx;
    width: 100%;
    background: #fff;
    border-top: 1rpx solid #eee;
  }

  .emoji-box {
    height: 300rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    font-size: 50rpx;
    padding: 15rpx;

    .item {
      padding: 15rpx;
      overflow-y: auto;

    }
  }

  // .emoji-list view {
  // }
</style>