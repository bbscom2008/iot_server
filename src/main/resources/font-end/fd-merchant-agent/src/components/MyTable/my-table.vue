<template>
  <div class="table-box" style="width: 100%">
    <!-- el-table -->
    <!-- border -->
    <el-table
      v-loading="loading"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      :stripe="!isShowUi"
      @selection-change="(e) => $emit('selection-change', e)"
    >
      <!-- 使用默认插槽渲染 my-table-column -->
      <slot />
    </el-table>

    <!-- el-pagination -->
    <el-pagination
      :class="{ pagination: isShowUi }"
      style="margin-top: 20px; text-align: right"
      :current-page="pageNum"
      :page-size="pageSize"
      background
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="prev, pager, next, sizes, jumper , total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'MyTable',
  props: {
    // 表格数据
    tableData: {
      type: Array,
      required: true
    },
    loadData: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      pageSize: 10, // 每页显示条数
      pageNum: 1, // 当前页码
      total: 0 // 总条数
    }
  },
  async mounted() {
    await this.getTableData()
  },
  methods: {
    // 每页条数变化
    handleSizeChange(size) {
      this.pageSize = size
      this.pageNum = 1 // 重置到第一页
      this.getTableData()
    },
    // 当前页码变化
    handleCurrentChange(page) {
      this.pageNum = page
      this.getTableData()
    },

    async getTableData(pageNum) {
      this.loading = true
      this.pageNum = pageNum || this.pageNum
      try {
        const res = await this.loadData({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        if (res && res.data) {
          this.total = res.data.total
        }
      } catch (error) {
        console.error('获取表格数据失败', error)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .pagination-container {
  background: #fff;
  padding: 32px 16px;
}
::v-deep .pagination-container.hidden {
  display: none;
}
::v-deep .el-pagination__jump {
  margin: 0 15px 0 0;
}
.table-box {
  position: relative;
  padding-bottom: 10px;

  .pagination {
    position: absolute;
    right: 0;
    bottom: -66px;
    width: 100%;

    .el-pager li {
      background-color: transparent;
    }
  }
}
</style>
