<template>
  <view class="pagination-container">
    <!-- 分页信息 -->
    <text class="page-info">共 {{total}} 条</text>
    
    <!-- 每页条数选择 -->
<!--    <picker 
      class="page-size-picker" 
      :range="pageSizeOptions" 
      :value="pageSizeIndex"
      @change="changePageSize"
    >
      <view class="picker-text">{{pageSize}} 条/页</view>
    </picker> -->
    
    <!-- 分页控制 -->
    <view class="page-control">
      <!-- 上一页 -->
      <view 
        class="page-arrow" 
        :class="{disabled: currentPage === 1}"
        @click="prevPage"
      >
        <uni-icons type="left" size="16" color="#333"></uni-icons>
      </view>
      
      <!-- 页码 -->
      <view 
        v-for="page in visiblePages" 
        :key="page"
        class="page-number"
        :class="{active: page === currentPage}"
        @click="goToPage(page)"
      >
        {{page}}
      </view>
      
      <!-- 省略号 -->
      <view 
        class="page-ellipsis"
        v-if="showPageEllipsis"
      >
        ...
      </view>
      
      <!-- 最后一页 -->
      <view 
        class="page-number"
        :class="{active: totalPages === currentPage}"
        @click="goToPage(totalPages)"
        v-if="showLastPage"
      >
        {{totalPages}}
      </view>
      
      <!-- 下一页 -->
      <view 
        class="page-arrow" 
        :class="{disabled: currentPage === totalPages}"
        @click="nextPage"
      >
        <uni-icons type="arrowright" size="16" color="#333"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    // 总条数
    total: {
      type: Number,
      default: 0
    },
    // 当前页码
    value: {
      type: Number,
      default: 1
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      currentPage: this.value,
      pageSizeIndex: 0,
      pageSizeOptions: [10, 20, 50, 100],
      maxVisiblePages: 5 // 最多显示5个页码
    }
  },
  computed: {
    // 总页数
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    },
    
    // 显示的页码数组
    visiblePages() {
      const pages = []
      let start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2))
      let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1)
      
      start = Math.max(1, end - this.maxVisiblePages + 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    },
    
    // 是否显示省略号
    showPageEllipsis() {
      return this.totalPages > this.maxVisiblePages && 
             this.currentPage < this.totalPages - Math.floor(this.maxVisiblePages / 2)
    },
    
    // 是否显示最后一页
    showLastPage() {
      return this.totalPages > this.maxVisiblePages && 
             this.currentPage < this.totalPages - Math.floor(this.maxVisiblePages / 2)
    }
  },
  watch: {
    value(newVal) {
      this.currentPage = newVal
    },
    pageSize(newVal) {
      this.pageSizeIndex = this.pageSizeOptions.indexOf(newVal)
    }
  },
  methods: {
    // 上一页
    prevPage() {
      if (this.currentPage <= 1) return
      this.changePage(this.currentPage - 1)
    },
    
    // 下一页
    nextPage() {
      if (this.currentPage >= this.totalPages) return
      this.changePage(this.currentPage + 1)
    },
    
    // 跳转到指定页
    goToPage(page) {
      if (page === this.currentPage) return
      this.changePage(page)
    },
    
    // 改变每页条数
    changePageSize(e) {
      const newSize = this.pageSizeOptions[e.detail.value]
      this.$emit('update:pageSize', newSize)
      this.$emit('change', {
        pageNum: 1,
        pageSize: newSize
      })
    },
    
    // 改变页码
    changePage(page) {
      this.currentPage = page
      this.$emit('input', page)
      this.$emit('change', {
        pageNum: page,
        pageSize: this.pageSize
      })
    }
  }
}
</script>

<style scoped lang="scss" >
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
}

.page-info {
  flex: 1;
}

.page-size-picker {
  width: 150rpx;
  margin: 0 20rpx;
}

.picker-text {
  color: #409EFF;
  text-align: center;
}

.page-control {
  display: flex;
  align-items: center;
}

.page-arrow, .page-number, .page-ellipsis {
  min-width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5rpx;
  border-radius: 6rpx;
}

.page-arrow {
  background-color: #f5f5f5;
}

.page-number {
  background-color: #f5f5f5;
  color: #666;
}

.page-number.active {
  background-color: #409EFF;
  color: #fff;
}

.page-ellipsis {
  background-color: transparent;
}

.page-arrow.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>