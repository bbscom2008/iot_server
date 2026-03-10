// directives/drag.js
export default {
  bind(el, binding, vnode) {
    let isDragging = false;
    let startX, startY;
    let originalLeft, originalTop;
    let hasMoved = false;
    
    // 获取配置参数
    const config = {
      boundary: binding.value?.boundary || 'parent',
      direction: binding.value?.direction || 'both',
      handle: binding.value?.handle,
      disabled: binding.value?.disabled || false,
      onStart: binding.value?.onStart,
      onMove: binding.value?.onMove,
      onEnd: binding.value?.onEnd
    };

    // 如果是拖拽手柄模式
    let dragHandle = el;
    if (config.handle) {
      dragHandle = el.querySelector(config.handle);
      if (!dragHandle) {
        console.warn('拖拽手柄元素未找到:', config.handle);
        dragHandle = el;
      }
    }

    // 设置元素样式 - 保持你原有的定位方式
    el.style.position = 'fixed';
    el.style.cursor = config.disabled ? 'pointer' : 'move';
    el.style.userSelect = 'none';
    el.style.zIndex = 2100;

    // 记录初始位置（基于 left/top）
    const rect = el.getBoundingClientRect();
    originalLeft = rect.left;
    originalTop = rect.top;

    // 鼠标按下事件
    const handleMouseDown = (e) => {
      if (config.disabled) return;
      if (e.button !== 0) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      isDragging = true;
      hasMoved = false;
      
      // 计算初始位置（转换为 left/top 用于计算）
      const rect = el.getBoundingClientRect();
      const currentLeft = rect.left;
      const currentTop = rect.top;
      
      startX = e.clientX - currentLeft;
      startY = e.clientY - currentTop;
      
      // 添加拖拽样式
      el.classList.add('dragging');
      el.style.pointerEvents = 'none';
      
      // 绑定事件
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // 调用开始回调
      if (config.onStart) {
        config.onStart({ el, x: currentLeft, y: currentTop });
      }
    };

    // 鼠标移动事件
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      e.preventDefault();
      
      // 计算移动距离，只有超过阈值才认为是移动
      const deltaX = Math.abs(e.clientX - (startX + el.getBoundingClientRect().left));
      const deltaY = Math.abs(e.clientY - (startY + el.getBoundingClientRect().top));
      
      if (deltaX > 5 || deltaY > 5) {
        hasMoved = true;
      }
      
      // 计算新位置（基于 left/top）
      let newLeft = e.clientX - startX;
      let newTop = e.clientY - startY;
      
      // 根据方向限制
      if (config.direction === 'horizontal') {
        newTop = originalTop;
      } else if (config.direction === 'vertical') {
        newLeft = originalLeft;
      }
      
      // 边界限制
      const boundedPos = applyBoundaryConstraint(newLeft, newTop, el, config.boundary);
      
      // 更新位置 - 使用 left/top
      el.style.left = boundedPos.x + 'px';
      el.style.top = boundedPos.y + 'px';
      
      // 调用移动回调
      if (config.onMove) {
        config.onMove({ el, x: boundedPos.x, y: boundedPos.y, originalLeft, originalTop });
      }
    };

    // 鼠标抬起事件
    const handleMouseUp = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      
      // 移除样式和事件监听
      el.classList.remove('dragging');
      el.style.pointerEvents = '';
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // 更新当前位置
      const rect = el.getBoundingClientRect();
      originalLeft = rect.left;
      originalTop = rect.top;
      
      // 调用结束回调
      if (config.onEnd) {
        config.onEnd({ 
          el, 
          x: rect.left, 
          y: rect.top,
          hasMoved,
          event: e 
        });
      }
      
      // 如果只是点击没有拖拽，触发点击
      if (!hasMoved && binding.value?.onClick) {
        binding.value.onClick(e);
      }
    };

    // 边界约束函数
    const applyBoundaryConstraint = (x, y, element, boundaryType) => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      let minX = 0, minY = 0, maxX = window.innerWidth - width, maxY = window.innerHeight - height;
      
      if (boundaryType === 'parent' && el.parentNode) {
        const parentRect = el.parentNode.getBoundingClientRect();
        minX = parentRect.left;
        minY = parentRect.top;
        maxX = parentRect.right - width;
        maxY = parentRect.bottom - height;
      }
      
      // 应用边界限制
      x = Math.max(minX, Math.min(x, maxX));
      y = Math.max(minY, Math.min(y, maxY));
      
      return { x, y };
    };

    // 绑定事件
    dragHandle.addEventListener('mousedown', handleMouseDown);
    
    // 保存清理函数
    el._dragCleanup = () => {
      dragHandle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  },
  
  update(el, binding) {
    // 更新禁用状态
    if (binding.value?.disabled !== binding.oldValue?.disabled) {
      el.style.cursor = binding.value?.disabled ? 'pointer' : 'move';
    }
  },
  
  unbind(el) {
    if (el._dragCleanup) {
      el._dragCleanup();
    }
  }
};