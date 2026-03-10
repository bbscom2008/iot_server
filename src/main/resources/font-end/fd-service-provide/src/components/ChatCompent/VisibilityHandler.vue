<template>
</template>

<script>
import { webSocketService } from "@/utils/websocket";
import {startWebSocket} from '@/utils/notify'
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
      startWebSocket()
    },
    handleHidden() {
      console.log("页面隐藏了");
    },
  },
};
</script>
