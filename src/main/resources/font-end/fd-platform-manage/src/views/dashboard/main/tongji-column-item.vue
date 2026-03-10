<template>
  <div class="panel-group" v-loading="isLoading">
    <div class="title">{{ title }}</div>

    <el-form ref="queryFormRef" label-width="0">
      <el-form-item label="" prop="platform">
        <el-select
          filterable
          clearable
          v-model="queryInput"
          @change="handleInputChange"
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in selectList"
            :key="item.merchantId"
            :label="item.userName"
            :value="item.userName"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div v-if="dataList.length == 0" class="no-data">暂无数据</div>

    <div class="tongji-body">
      <div class="card-panel-card" v-for="(item, i) in showList" :key="i">
        <div class="card-panel-description">
          <div class="card-panel-text">{{ title }}名称：</div>
          <div class="card-panel-num">
            <span> {{ item[nameKey] }} </span>
          </div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">订单数量（个）：</div>
          <div class="card-panel-num">
            <span> [ {{ `${item.successfulOrderCount}/${item.orderCount}` }} ] </span>
          </div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">订单金额（元）：</div>
          <div class="card-panel-num">
            <span> [ {{ `${item.successfulOrderAmount}/${item.orderAmount}` }} ] </span>
          </div>
        </div>

        <div class="card-panel-description">
          <!-- :text-inside="true" -->
          <el-progress
            type="line"
            :percentage="percentage(item)"
            :stroke-width="8"
            color="#008000"
            style="width: 100%"
          ></el-progress>
        </div>
      </div>
    </div>
    <el-pagination
      class="pagination"
      v-if="showList.length > 0"
      :current-page="pageNum"
      :page-size="pageSize"
      background
      :total="total"
      :page-sizes="[6, 10, 20, 30, 50, 100]"
      layout="prev, next,sizes , total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    nameKey: {
      type: String,
      default: ''
    },
    loadPageData: {
      type: Function,
      default: async () => {}
    },
    loadSelectData: {
      type: Function,
      default: async () => {}
    }
  },
  data() {
    return {
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      queryInput: '',
      selectList: [],
      dataList: [], // 所有的数据
      isLoading: false
    }
  },
  computed: {
    pageNum() {
      return this.page.pageNum
    },
    pageSize() {
      return this.page.pageSize
    },
    showList(){
        if(!this.queryInput){
          return this.dataList
        }
        return this.dataList.filter(ele => ele.merchantName == this.queryInput)
    }
  },
  mounted() {
    this.flushData()
    // 下拉框数据
    this.loadSelectData().then((res) => {
      console.log('===loadSelectData==res=====', res)
      this.selectList = res.data
    })
  },
  methods: {
    percentage(item) {
      return Number(((item.successfulOrderAmount / item.orderAmount) * 100).toFixed(2))
    },
    flushData() {
      // 列表数据
      this.isLoading = true
      this.loadPageData(this.page)
        .then((res) => {
          console.log('====loadPageData=====', res)
          this.dataList = res.data.list
          this.total = res.data.total
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    handleInputChange(e) {
      console.log('===handleInputChange==', e)
      // 对dataList中的数据进行过淲, 由计算属性完成
    },
    handleSizeChange(size) {
      this.page.pageSize = size
      this.flushData()
    },
    handleCurrentChange(page) {
      this.page.pageNum = page
      this.flushData()
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  flex: 1;
  background-color: white;
  border-radius: 20px;

  ::v-deep .el-form-item {
    margin-bottom: 10px;
  }
  ::v-deep .el-form-item__content {
    text-align: center;
  }

  .title {
    text-align: center;
    font-weight: 600;
    padding: 10px;
  }

  .pagination {
    width: 260px;
    margin: 0 auto;
  }

  ::v-deep .el-progress {
    display: flex;
    align-items: center;
  }

  .no-data {
    text-align: center;
    color: #666;
  }

  .tongji-body {
    padding: 10px;

    .card-panel-card {
      padding: 5px 15px;
      width: 100%;
      //   height: 100px;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      margin: 8px 0;

      .card-panel-description {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 20px;
        .card-panel-text {
          margin-right: 10px;
          color: #666;
        }
        .card-panel-num {
          font-size: 14px;
          font-weight: 600;
          span {
            color: #5258f4;
          }
        }
      }
    }
  }
}
</style>
