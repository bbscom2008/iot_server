// src/plugins/upload-override.js
import Vue from 'vue';
import EnhancedElUpload from '@/components/EnhancedElUpload';

// 保存原始的 el-upload 组件引用
const OriginalUpload = Vue.options.components.ElUpload;

const UploadOverridePlugin = {
  install(Vue, options = {}) {
    console.log('正在安装增强版 Upload 组件...');
    
    // 覆盖全局的 ElUpload 组件
    Vue.component('ElUpload', EnhancedElUpload);
    
    // 保存原始组件引用，以便需要时恢复
    Vue.prototype.$originalUpload = OriginalUpload;
    
    // 提供配置选项
    const defaultOptions = {
      showPasteHint: true,
      autoUploadPaste: false,
      pasteAccept: 'image/*'
    };
    
    Vue.prototype.$uploadConfig = { ...defaultOptions, ...options };
    
    console.log('增强版 Upload 组件安装完成');
  }
};

// 导出恢复函数
export function restoreOriginalUpload() {
  if (OriginalUpload) {
    Vue.component('ElUpload', OriginalUpload);
    console.log('已恢复原始 Upload 组件');
  }
}

export default UploadOverridePlugin;