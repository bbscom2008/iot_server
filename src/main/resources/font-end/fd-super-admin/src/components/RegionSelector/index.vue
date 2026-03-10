<template>
  <div class="region-selector">
    <el-tree
      ref="regionTree"
      :data="treeData"
      :props="defaultProps"
      :default-expanded-keys="expandedKeys"
      :default-checked-keys="checkedKeys"
      show-checkbox
      check-strictly
      node-key="id"
      highlight-current
      @check="handleNodeCheck"
    >
      <span slot-scope="{ node, data }" class="tree-node-label">
        <span v-if="data.isProvince" class="province-label">{{ node.label }}</span>
        <span v-else class="city-label">{{ node.label }}</span>
      </span>
    </el-tree>

    <!-- 选中的地区预览 -->
    <div class="region-preview">
      <div class="preview-title">已选地区：</div>
      <div v-if="selectedRegions.length === 0" class="preview-empty">暂未选择任何地区 - 默认全部省份</div>
      <div v-else class="preview-list">
        <div v-for="region in selectedRegions" :key="region.province" class="region-item">
          <span class="region-province">{{ region.province }}</span>
          <span v-if="region.cities.length > 0" class="region-cities">
            ({{ region.cities.join('、') }})
          </span>
          <span v-else class="region-all">全部市</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { buildTreeData, convertToRegionConfig, restoreTreeCheckedNodes } from '@/utils/provinceCity'
import { provinceCityData } from '@/utils/provinceCity'

export default {
  name: 'RegionSelector',
  props: {
    // 初始值，格式为 [{province: '广东省', cities: ['广州市']}, ...]
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkedKeys: [],
      expandedKeys: [],
      selectedRegions: []
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.restoreCheckedState(newVal)
        }
      },
      deep: true
    }
  },
  methods: {
    initTreeData() {
      this.treeData = buildTreeData(provinceCityData)
      // 默认折叠所有省份
      this.expandedKeys = []
    },
    handleNodeCheck(data, checked, indeterminate) {
      // 获取树中所有选中的节点
      const checkedNodes = this.$refs.regionTree.getCheckedNodes()
      // 转换为目标格式
      this.selectedRegions = convertToRegionConfig(checkedNodes)
      // 向父组件发送数据
      this.$emit('input', this.selectedRegions)
      this.$emit('change', this.selectedRegions)
    },
    restoreCheckedState(regionConfig) {
      const { checkedNodes, checkedKeys } = restoreTreeCheckedNodes(regionConfig, this.treeData)
      this.$nextTick(() => {
        this.$refs.regionTree.setCheckedKeys(checkedKeys)
        this.selectedRegions = regionConfig
      })
    },
    // 暴露给父组件的方法，获取选中的数据
    getSelectedRegions() {
      return this.selectedRegions
    },
    // 清空选择
    clearSelection() {
      this.$refs.regionTree.setCheckedKeys([])
      this.selectedRegions = []
      this.$emit('input', [])
      this.$emit('change', [])
    }
  },
  mounted() {
    this.initTreeData()
    if (this.value && this.value.length > 0) {
      this.restoreCheckedState(this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.region-selector {
  display: flex;
  gap: 30px;

  .el-tree {
    flex: 1;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    max-height: 400px;
    overflow-y: auto;

    .tree-node-label {
      display: flex;
      align-items: center;
      width: 100%;

      .province-label {
        font-weight: 600;
        color: #303133;
      }

      .city-label {
        color: #606266;
        font-size: 14px;
      }
    }
  }

  .region-preview {
    flex: 0 0 280px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 12px;
    background-color: #fafbfc;
    max-height: 400px;
    overflow-y: auto;

    .preview-title {
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
      font-size: 14px;
    }

    .preview-empty {
      color: #909399;
      font-size: 12px;
      text-align: center;
      padding: 20px 0;
    }

    .preview-list {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .region-item {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 8px;
        background-color: #fff;
        border-radius: 3px;
        border-left: 3px solid #409eff;
        font-size: 12px;

        .region-province {
          font-weight: 600;
          color: #303133;
          min-width: 60px;
        }

        .region-cities {
          color: #606266;
          flex: 1;
          word-break: break-all;
        }

        .region-all {
          color: #909399;
          font-style: italic;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .region-selector {
    flex-direction: column;

    .region-preview {
      flex: 1;
    }
  }
}
</style>
