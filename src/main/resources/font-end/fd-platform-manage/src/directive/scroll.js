// directives/scroll.js
export default {
  bind(el, binding) {
    const { onReachTop, onReachBottom, threshold = 50 } = binding.value;
    
    let isAtTop = false;
    let isAtBottom = false;
    
    el.addEventListener('scroll', function(event) {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      
      // 检查顶部
      if (scrollTop <= threshold) {
        if (!isAtTop && onReachTop) {
          isAtTop = true;
          onReachTop();
        }
      } else {
        isAtTop = false;
      }
      
      // 检查底部
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      if (distanceFromBottom <= threshold) {
        if (!isAtBottom && onReachBottom) {
          isAtBottom = true;
          onReachBottom();
        }
      } else {
        isAtBottom = false;
      }
    });
  }
}