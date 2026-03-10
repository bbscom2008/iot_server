<template>
  <div class="containerd">
    <div class="huizong">
      <el-card>
        <h3 class="h3Color">
          <span>账户汇总: </span>
        </h3>
        <div style="margin-bottom: 15px"></div>
        <div class="panel-group huizong">
          <div class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #cccccc">
                <svg-icon icon-class="dingdan" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">账户状态:</div>
                <div class="card-panel-num">
                  <span>{{ topList.accountStatus == '0' ? '关闭' : '启用' }} </span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #ff8247">
                <svg-icon icon-class="dingdanjine" className="dingdanjine" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">可用余额:</div>
                <div class="card-panel-num">
                  <span>
                    {{ topList.availableBalance ? topList.availableBalance : 0 }}
                  </span>
                  元
                </div>
              </div>
            </div>
          </div>
          <div class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #548b54">
                <svg-icon icon-class="shangfei" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">冻结金额:</div>
                <div class="card-panel-num">
                  <span>
                    {{ topList.freezeBalance ? topList.freezeBalance : 0 }}
                  </span>
                  元
                </div>
              </div>
            </div>
          </div>
          <div class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon" style="background: #43cd80">
                <svg-icon icon-class="a-shourulirunzhuanqiantourubaochougongzi" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">商户数量:</div>
                <div class="card-panel-num">
                  <span>
                    {{ topList.merchantCount ? topList.merchantCount : 0 }}
                  </span>
                  个
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="tongji-box">
      <el-card>
        <div class="btn-change">
          <el-radio-group v-model="flag" @input="flagChange">
            <el-radio-button label="1">今日</el-radio-button>
            <el-radio-button label="2">昨日</el-radio-button>
          </el-radio-group>
        </div>

        <my-table
          class="mt-10"
          ref="tableRef"
          :loadData="getOrderList"
          :tableData="tableData"
          style="width: 100%"
          border
        >
          <el-table-column label="序号" align="center" type="index" width="60" />
          <el-table-column label="商户名称" align="center" prop="merchantName" />

          <el-table-column label="订单数量" align="center" prop="orderCount" />
          <el-table-column label="订单金额(元)" align="center" prop="orderAmount" width="130px" />
          <el-table-column label="成功订单数" align="center" prop="successfulOrderCount" />
          <el-table-column
            label="成功订单金额(元)"
            align="center"
            prop="successfulOrderAmount"
            width="160px"
          />

          <el-table-column label="成功率(%)" align="center" prop="successfulRate" />
        <el-table-column label="系统费用(元)" align="center" >
          <template slot-scope="{ row }">
            {{ row.systemCost}}
          </template>
        </el-table-column>

          <!-- <el-table-column
            label="分润比例(%)"
            align="center"
            prop="merchantAgentRate"
            width="130px"
          />
          <el-table-column label="分润(元)" align="center" prop="merchantAgentCost" width="130px" /> -->
        </my-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import {
  merchantAgentAccountSummary,
  getOrderTodayAnalytics,
  getCollectAndPaymentOrderYesterday
} from '@/api/user'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      flag: '1',
      tableData: [],
      topList: { accountStatus: 0, availableBalance: 0, freezeBalance: 0, merchantCount: 0 } //顶部数据
    }
  },
  created() {
    this.merchantAgentAccountSummary()
  },
  methods: {
    async flagChange(e) {
      this.flag = e
      this.$refs.tableRef.getTableData(1)
    },
    async merchantAgentAccountSummary() {
      let res = await merchantAgentAccountSummary(this.$store.state.userAccount.userId)
        this.topList = res.data ? res.data : {}
    },
    async getOrderList(page) {
      if (this.flag == '1') {
        let res = await getOrderTodayAnalytics(page)
        this.tableData = res.data.list ? res.data.list : []
        return res
      } else {
        let res = await getCollectAndPaymentOrderYesterday(page)
        this.tableData = res.data.list ? res.data.list : []
        return res
      }
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped></style>
