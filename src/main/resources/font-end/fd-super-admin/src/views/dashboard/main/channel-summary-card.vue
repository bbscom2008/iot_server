<template>
  <div class="card-box" v-loading="isLoading">
    <div class="title-box">
      <div class="title">通道</div>

      <el-form ref="queryFormRef" label-width="0">
        <el-form-item label="" prop="platform">
          <el-select
            filterable
            clearable
            v-model="channelName"
            placeholder="请选择通道名称"
            size="small"
          >
            <el-option
              v-for="item in allChannelList"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelName"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="date-picker">
        <el-form :inline="true" ref="queryFormData" :model="queryFormData" class="demo-form-inline">
          <el-form-item label="选择日期" prop="">
            <el-date-picker
              v-model="queryFormData.statisticDate"
              type="daterange"
              format="yyyy-MM-dd"
              @change="handleDatePickerChange"
              value-format="yyyy-MM-dd"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="myPickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="chart-box" v-for="(item, index) in showChannelList" :key="item.channelName">
      <ChannelBar
        width="100%"
        height="440px"
        :class="item.channelName + index"
        :id="item.channelName + index"
        :item="item"
      ></ChannelBar>
    </div>
    <div class="no-data" v-if="showChannelList.length === 0">暂无数据</div>
  </div>
</template>

<script>
import ChannelBar from '@/components/Charts/ChannelBar'

import { getChannelReportPage } from '@/api/report-center'

import { formatDateDate } from '@/utils'

import { getChannelByTenantId } from '@/api/merchant.js'

import changeTenant  from '@/mixins/change-tenant'
export default {
  mixins: [changeTenant],
  name: 'ChannelSummaryCard',
  props: {
    tradeType: {
      type: String,
      default: '0' // 0 代收  1代付
    }
  },
  components: {
    ChannelBar
  },
  watch: {
    tradeType() {
      this.channelDailyReportGetReportPage()
    }
  },
  data() {
    const now = new Date()
    const today_start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const today_end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

    return {
      myPickerOptions: {
        shortcuts: [
          {
            text: '近7天',
            onClick(picker) {
              const start = new Date(today_start.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', [start, today_end])
            }
          },
          {
            text: '近2周',
            onClick(picker) {
              const start = new Date(today_start.getTime() - 3600 * 1000 * 24 * 13)
              picker.$emit('pick', [start, today_end])
            }
          },
          {
            text: '近1月',
            onClick(picker) {
              const start = new Date(today_start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, today_end])
            }
          }
        ],

        disabledDate: (time) => {
          const now = new Date()
          const today_end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59) // 今天凌晨
          if (time.getTime() > today_end.getTime()) {
            return true
          }
        }
      },
      queryFormData: {
        statisticDate: [
          formatDateDate(new Date(today_start.getTime() - 3600 * 1000 * 24 * 6)),
          formatDateDate(today_end)
        ]
      },
      page: {
        pageNum: 1,
        pageSize: 10000
      },
      total: 0,
      allList: [],
      channelGroupList: [],
      isLoading: false,
      selectInput: '',
      allChannelList: [],
      channelName: ''
    }
  },
  computed: {
    showChannelList() {
      if (!this.channelName) {
        // 没有选择通道名称，默认显示第一个，即值最大的
        if (this.channelGroupList.length > 0) {
          return [this.channelGroupList[0]]
        } else {
          return []
        }
      } else {
        // 有输入，显示对应的通道
        return this.channelGroupList.filter((item) => item.channelName.includes(this.channelName))
      }
    }
  },
  mounted() {
    this.flushPage()
  },

  methods: {
    onSelectedTenantChange() {
      this.flushPage()
    },
    flushPage() {
      this.channelDailyReportGetReportPage()
      // 刷新通道数据 ，否则新增的 通道，就不在 下拉框中了。
      getChannelByTenantId(this.$store.state.tenant.selectTenantId).then((res) => {
        if (res.data && res.data.length > 0) {
          this.allChannelList = res.data
        }
      })
    },
    handleDatePickerChange(e) {
      this.channelDailyReportGetReportPage()
    },
    async channelDailyReportGetReportPage() {
      try {
        let obj = {
          tenantId: this.$store.state.tenant.selectTenantId,
          startDate: this.queryFormData.statisticDate[0],
          endDate: this.queryFormData.statisticDate[1],
          tradeType: this.tradeType
        }

        this.isLoading = true
        let res = await getChannelReportPage(obj, this.page)

        // this.tableData = res.data.list
        this.total = res.data.total
        this.allList = res.data.list
        this.parseData2options()
        console.log(res)
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    parseData2options() {
      // 第一步：按channelName分组
      const groups = {}

      this.allList.forEach((item) => {
        const key = item.channelName
        if (!groups[key]) {
          // 如果该分组不存在，则创建一个新数组
          groups[key] = []
        }
        // 将当前项添加到对应的分组中
        groups[key].push(item)
      })

      // 第二步：计算每个分组的总和并排序
      const result = Object.entries(groups)
        // 转换为包含总和信息的数组
        .map(([channelName, items]) => ({
          channelName,
          items,
          totalAmount: items.reduce((sum, item) => sum + item.successfulOrderAmount, 0)
        }))
        // 按总金额从大到小排序
        .sort((a, b) => b.totalAmount - a.totalAmount)

      // 输出结果
      console.log('====channelGroupList=====')

      console.log(result)
      this.channelGroupList = result
    }
  }
}
</script>

<style lang="scss" scoped>
.card-box {
  flex: 2;
  background-color: white;
  border-radius: 20px;
  padding: 15px;
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    padding-left: 20px;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
  .chart-box {
    margin-top: 20px;
  }
}
.no-data {
  margin-top: 20px;
  text-align: center;
  color: #666;
}
</style>
