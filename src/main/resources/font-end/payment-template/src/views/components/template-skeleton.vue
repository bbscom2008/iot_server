<template>
  <div class="skeleton-container">
    <div class="indicator">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <p class="message">正在为您确认订单信息...</p>
  </div>
</template>

<style scoped>
.skeleton-container {
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  gap: 18px;
  background: #f5f7fa;
}

.indicator {
  display: flex;
  gap: 12px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #409eff;
  opacity: 0.2;
  animation: pulse 1s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.15s;
}

.dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes pulse {
  0%, 80%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  40% {
    opacity: 1;
    transform: scale(1.3);
  }
}

.message {
  font-size: 16px;
  color: #303133;
  letter-spacing: 1px;
}
</style>

