<!-- src/components/EnhancedElUpload/index.vue -->
<template>
  <div class="enhanced-el-upload" style="width: 100%;" >
    <!-- 渲染原始的 el-upload 组件 -->
    <ElUpload
      ref="elUpload"
      v-bind="$attrs"
      v-on="listeners"
    >
      <!-- 传递所有插槽 -->
      <!-- <template v-for="slotName in Object.keys($slots)" #[slotName]="scope">
        <slot :name="slotName" v-bind="scope" />
      </template> -->

      <slot name="default"   />
      <slot name="trigger"   />
      <!-- <slot name="tip"   /> -->
     
    </ElUpload>

    <!-- 粘贴提示 -->
    <div v-if="showPasteHint" class="paste-hint">
      <i class="el-icon-picture"></i>
      支持粘贴图片 (Ctrl+V)
    </div>

    <!-- 粘贴确认对话框 -->
    <el-dialog
      :title="pasteDialog.title"
      :visible.sync="pasteDialog.visible"
      width="400px"
      :before-close="handleDialogClose"
    >
      <div class="paste-preview">
        <img v-if="pasteDialog.imageUrl" :src="pasteDialog.imageUrl" class="preview-image" />
        <div v-else class="preview-loading">图片加载中...</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pasteDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="confirmPaste" :loading="pasteDialog.loading">
          确认上传
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入原始的 el-upload 组件
import { Upload } from 'element-ui';

export default {
  name: 'EnhancedElUpload',
  
  // 继承原始组件的所有属性
  inheritAttrs: false,

  components: {
    ElUpload: Upload
  },

  props: {
    // 是否显示粘贴提示
    // showPasteHint: {
    //   type: Boolean,
    //   default: true
    // },
    pasteEnable:{
      type: Boolean,
      default: true
    },
    // 粘贴后自动上传
    autoUploadPaste: {
      type: Boolean,
      default: true
    },
    // 支持的粘贴文件类型
    pasteAccept: {
      type: String,
      default: 'image/*'
    }
  },

  data() {
    return {
      pasteDialog: {
        visible: false,
        title: '粘贴图片',
        imageUrl: null,
        file: null,
        loading: false
      }
    };
  },

  computed: {
    showPasteHint(){
      // 只有图片才允许粘贴
      // 如果没有设置 accept 属性，默认是 image/*
      if(!this.$attrs.accept){
        this.$attrs.accept="image/*"
        this.$forceUpdate()
        return true && this.pasteEnable
      }

      return this.$attrs.accept.includes('image') && this.pasteEnable
    },
    // 处理事件监听器，避免重复触发
    listeners() {
      const listeners = { ...this.$listeners };
      // 移除我们自定义的事件，避免循环触发
      delete listeners.paste;
      return listeners;
    }
  },

  mounted() {
    // 添加全局粘贴监听作为备用
    if(this.showPasteHint){
      this.addGlobalPasteListener();
    }
  },

  beforeDestroy() {
    this.removeGlobalPasteListener();
    // 清理URL对象
    if (this.pasteDialog.imageUrl) {
      URL.revokeObjectURL(this.pasteDialog.imageUrl);
    }
  },

  methods: {
    // 处理粘贴事件
    handlePaste(event) {
      const items = event.clipboardData?.items;
      if (!items) return;


      if (this.wouldExceedLimit(1)) {
        this.handleExceed([], this.$refs.elUpload.uploadFiles);
        return;
      }


      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          event.preventDefault();
          event.stopPropagation();

          const file = item.getAsFile();
          if (file && this.validateFile(file)) {
            this.processPastedFile(file);
          }
          break;
        }
      }
    },

    // 检查是否会超过限制
    wouldExceedLimit(additionalFiles = 1) {
      const upload = this.$refs.elUpload;
      if (!upload) return false;

      const { uploadFiles, limit } = upload;
      
      // 如果没有限制，直接返回
      if (!limit || limit <= 0) return false;
      
      // 计算当前文件数量 + 新增文件数量
      const currentCount = uploadFiles.length;
      const wouldExceed = currentCount + additionalFiles > limit;
      
      return wouldExceed;
    },

    // 处理文件数量超出限制
    handleExceed(files, fileList) {
      const { limit } = this.$refs.elUpload;
      
      // 触发原始的超限事件
      if (this.$listeners.exceed) {
        this.$listeners.exceed(files, fileList);
      } else {
        // 默认的超限提示
        this.$message.error(
          `最多只能上传 ${limit} 个文件，当前已选择 ${fileList.length} 个文件`
        );
      }
      
      // 触发超限事件
      this.$emit('exceed', files, fileList);
    },


    // 验证文件
    validateFile(file) {
      // 验证文件类型
      if (this.pasteAccept && this.pasteAccept !== '*/*') {
        const acceptTypes = this.pasteAccept.split(',').map(type => type.trim());
        const isValidType = acceptTypes.some(acceptType => {
          if (acceptType.endsWith('/*')) {
            return file.type.startsWith(acceptType.split('/')[0] + '/');
          }
          return file.type === acceptType;
        });

        if (!isValidType) {
          this.$message.warning(`不支持 ${file.type} 格式的图片`);
          return false;
        }
      }

      // 验证文件大小（使用el-upload的max-size或默认10MB）
      const maxSize = this.$attrs['max-size'] || 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.warning(`图片大小不能超过 ${this.formatFileSize(maxSize)}`);
        return false;
      }

      return true;
    },

    // 处理粘贴的文件
    async processPastedFile(file) {
      try {
        // 创建预览URL
        const previewUrl = URL.createObjectURL(file);
        
        this.pasteDialog = {
        //   visible: true,
          title: '粘贴图片确认',
          imageUrl: previewUrl,
          file: file,
          loading: false
        };
        this.confirmPaste()
      } catch (error) {
        console.error('处理粘贴图片失败:', error);
        this.$message.error('处理图片失败');
      }
    },

    // 确认粘贴上传
    async confirmPaste() {
      if (!this.pasteDialog.file) return;

      this.pasteDialog.loading = true;

      try {
        // 创建标准的File对象
        const file = new File(
          [this.pasteDialog.file],
          `pasted-image-${Date.now()}.${this.getFileExtension(this.pasteDialog.file)}`,
          { type: this.pasteDialog.file.type }
        );

        // 调用原始el-upload的方法添加文件
        this.$refs.elUpload.handleStart(file);

        // 如果设置了自动上传，则触发上传
        if (this.autoUploadPaste) {
          await this.$refs.elUpload.submit();
        }

        this.$emit('paste-success', file);
        this.pasteDialog.visible = false;
        this.$message.success('图片粘贴成功');

      } catch (error) {
        console.error('上传粘贴图片失败:', error);
        this.$message.error('上传失败');
      } finally {
        this.pasteDialog.loading = false;
      }
    },

    // 处理对话框关闭
    handleDialogClose(done) {
      // 清理URL对象
      if (this.pasteDialog.imageUrl) {
        URL.revokeObjectURL(this.pasteDialog.imageUrl);
      }
      done();
    },

    // 添加全局粘贴监听（备用）
    addGlobalPasteListener() {
      window.addEventListener('paste', this.handleGlobalPaste);
    },

    removeGlobalPasteListener() {
      window.removeEventListener('paste', this.handleGlobalPaste);
    },

    handleGlobalPaste(event) {
      // 只在当前组件内触发
      // if (this.$el.contains(event.target)) {
        this.handlePaste(event);
      // }
    },

    // 工具方法
    getFileExtension(file) {
      return file.name.split('.').pop() || 'png';
    },

    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    // 暴露原始el-upload的所有方法
    abort(file) {
      this.$refs.elUpload.abort(file);
    },

    clearFiles() {
      this.$refs.elUpload.clearFiles();
    },

    submit() {
      this.$refs.elUpload.submit();
    }
  }
};
</script>

<style scoped>
.enhanced-el-upload {
  position: relative;
  display: inline-block;
}

.paste-hint {
  /* margin-top: 8px;  */
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.paste-preview {
  text-align: center;
  padding: 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

.preview-loading {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
}
</style>