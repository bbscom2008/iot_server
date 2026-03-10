<template>
  <div class="tongji-box">
    <div class="btn-change">
      <el-radio-group v-model="flag" @input="radioChange">
        <el-radio-button label="0">代收</el-radio-button>
        <el-radio-button label="1">代付</el-radio-button>
      </el-radio-group>
    </div>

    <div class="tongji-box2">
      <div class="panel-group">
        <h3 class="h3Color">今日统计:</h3>
        <div class="tongji-body">
          <el-card class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #cccccc">
                <svg-icon icon-class="dingdan" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">订单数量:</div>
                <div class="card-panel-num">
                  <span>
                    {{ todayList.orderCount ? todayList.orderCount : 0 }}
                    <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
                  </span>
                  个
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #99cccc">
                <svg-icon icon-class="dingdanjine" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">订单金额:</div>
                <div class="card-panel-num">
                  <span>
                    {{ todayList.orderAmount ? todayList.orderAmount : 0 }}
                  </span>
                  元
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #99cccc">
                <svg-icon icon-class="a-chenggongshuai1x" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">成功率:</div>
                <div class="card-panel-num">
                  <span>
                    {{ todayList.successfulRate ? todayList.successfulRate : 0 }}
                  </span>
                  %
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #99cc99">
                <svg-icon icon-class="hetong-dingdanshuliang" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">成交订单数量:</div>
                <div class="card-panel-num">
                  <span>
                    {{ todayList.successfulOrderCount ? todayList.successfulOrderCount : 0 }}
                  </span>
                  个
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #99cc99">
                <svg-icon icon-class="chengjiaodingdanjine" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">成交订单金额:</div>
                <div class="card-panel-num">
                  <span>
                    {{ todayList.successfulOrderAmount ? todayList.successfulOrderAmount : 0 }}
                  </span>
                  元
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #cccccc">
                <svg-icon icon-class="a-shourulirunzhuanqiantourubaochougongzi" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">利润:</div>
                <div class="card-panel-num">
                  <span>
                    {{ todayList.platformProfit ? todayList.platformProfit : 0 }}
                  </span>
                  元
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div class="panel-group">
        <h3 class="h3Color">昨日统计:</h3>
        <div class="tongji-body">
          <el-card class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #cccccc">
                <svg-icon icon-class="dingdan" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">订单数量:</div>
                <div class="card-panel-num">
                  <span>
                    {{ yestodayList.orderCount ? yestodayList.orderCount : 0 }}
                    <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
                  </span>
                  个
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #99cccc">
                <svg-icon icon-class="dingdanjine" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">订单金额:</div>
                <div class="card-panel-num">
                  <span>
                    {{ yestodayList.orderAmount ? yestodayList.orderAmount : 0 }}
                  </span>
                  元
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #99cccc">
                <svg-icon icon-class="a-chenggongshuai1x" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">成功率:</div>
                <div class="card-panel-num">
                  <span>
                    {{ yestodayList.successfulRate ? yestodayList.successfulRate : 0 }}
                  </span>
                  %
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #99cc99">
                <svg-icon icon-class="hetong-dingdanshuliang" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">成交订单数量:</div>
                <div class="card-panel-num">
                  <span>
                    {{ yestodayList.successfulOrderCount ? yestodayList.successfulOrderCount : 0 }}
                  </span>
                  个
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #99cc99">
                <svg-icon icon-class="chengjiaodingdanjine" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">成交订单金额:</div>
                <div class="card-panel-num">
                  <span>
                    {{
                      yestodayList.successfulOrderAmount ? yestodayList.successfulOrderAmount : 0
                    }}
                  </span>
                  元
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #cccccc">
                <svg-icon icon-class="a-shourulirunzhuanqiantourubaochougongzi" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">利润:</div>
                <div class="card-panel-num">
                  <span>
                    {{ yestodayList.platformProfit ? yestodayList.platformProfit : 0 }}
                  </span>
                  元
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  tenantAccountSummary,
  getCollectOrderToday,
  getCollectOrderYesterday,
  getPaymentToday,
  getPaymentYesterdayYesterday
} from '@/api/user'

export default {
  name: 'TongJiBox1',
  data() {
    return {
      flag: '0',
      todayList: {
        orderCount: 0,
        orderAmount: 0,
        successfulRate: 0,
        successfulOrderCount: 0,
        successfulOrderAmount: 0,
        platformProfit: 0
      }, //代收数据/代付数据
      yestodayList: {
        orderCount: 0,
        orderAmount: 0,
        successfulRate: 0,
        successfulOrderCount: 0,
        successfulOrderAmount: 0,
        platformProfit: 0
      } //代收数据/代付数据
    }
  },
  created() {
    this.getCollectOrderToday()
    this.getCollectOrderYesterday()
  },
  methods: {
    radioChange(e) {
      this.flag = e !== undefined ? e : '1'
      if (e == 0) {
        this.getCollectOrderToday()
        this.getCollectOrderYesterday()
      } else {
        this.getPaymentToday()
        this.getPaymentYesterdayYesterday()
      }
    },
    async getCollectOrderToday() {
      let res = await getCollectOrderToday({
        tenantId: this.tenantId
      })
      this.todayList = res.data ? res.data : {}
    },
    async getCollectOrderYesterday() {
      let res = await getCollectOrderYesterday({
        tenantId: this.tenantId
      })
      this.yestodayList = res.data ? res.data : {}
    },
    async getPaymentToday() {
      let res = await getPaymentToday({
        tenantId: this.tenantId
      })
      this.todayList = res.data ? res.data : {}
    },
    async getPaymentYesterdayYesterday() {
      let res = await getPaymentYesterdayYesterday({
        tenantId: this.tenantId
      })
      this.yestodayList = res.data ? res.data : {}
    }
  }
}
</script>

<style></style>
