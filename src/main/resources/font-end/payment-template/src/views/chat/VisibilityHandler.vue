<template>
  <div>
    <!-- <p style="font-size: 4.2667rem">当前页面状态: {{ status }}</p> -->
  </div>
</template>

<script>
import { webSocketService } from "@/utils/websocket";

export default {
  name: "VisibilityHandler",
  data() {
    return {
      status: document.visibilityState, // 初始化状态
    };
  },
  mounted() {
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  beforeDestroy() {
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
  },
  methods: {
    handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        this.status = "visible";
        this.handleVisible();
      } else if (document.visibilityState === "hidden") {
        this.status = "hidden";
        this.handleHidden();
      }
    },
    handleVisible() {
      console.log("页面可见了");
      webSocketService.connentIfy();
      this.$parent.loadHistoreMsg(true)
    },
    handleHidden() {
      console.log("页面隐藏了");
    },
  },
};
</script>
