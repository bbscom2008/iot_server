<template>
  <div>
    <div class="title">
      <div> </div>
      <div>{{ this.item.channelName }} </div>
      <div><span style="font-size:12px; color:#ccc;">总成功实付金额：</span>
      <span style="color:red; " >￥{{ this.item.totalAmount }}</span>
      </div>
    </div>

    <div :id="id" :class="className" :style="{ height: height, width: width }" />
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '400px'
    },
    height: {
      type: String,
      default: '300px'
    },
    item: {
      type: Object,
      default: null
    }
  },
  watch: {
    item: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.initChart()
        }
      },
      deep: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      let option = ''


      let dateGroup = {}

       this.item.items.forEach((el) => {
        let date = el.statisticsDate
        if (!dateGroup[date]) {
          dateGroup[date] = {
            successfulOrderAmount: 0,
            orderAmount: 0
          }
        }
        dateGroup[date].successfulOrderAmount += el.successfulOrderAmount
        dateGroup[date].orderAmount += el.orderAmount
      })

       let sourceData1 = Object.keys(dateGroup).map((date) => {
        return [date, dateGroup[date].successfulOrderAmount, dateGroup[date].orderAmount]
      })

      let sourceData = sourceData1.sort((a,b)=>new Date(a[0])-new Date(b[0]))
      .map((el) => {
        return [el[0].substring(5), el[1], el[2]]
      })

      // console.log('===============sourceData')
      // console.log(sourceData)

      option = {
        legend: {
          orient: 'horizontal',
          left: 10,
          top: 1
        },
        dataset: {
          source: [['product', '实付金额', '订单金额'], ...sourceData]
        },
        tooltip: { // 鼠标放上去后的弹窗提示
          show: true,
          trigger: 'item',

        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
          {
            type: 'bar',
            itemStyle: {
              borderWidth: 1,
              color: '#5258f4'
            },
            barWidth: '20%',
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            type: 'bar',
            itemStyle: {
              borderWidth: 1,
              color: 'green'
            },
            barWidth: '20%',
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }

      this.chart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #333;
}
</style>
