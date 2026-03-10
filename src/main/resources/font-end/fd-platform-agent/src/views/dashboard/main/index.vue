<template>
  <div class="containerd">
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
              <div class="card-panel-text">平台可用余额:</div>
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
              <div class="card-panel-text">平台冻结金额:</div>
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
              <div class="card-panel-text">平台数量:</div>
              <div class="card-panel-num">
                <span>
                  {{ topList.tenantCount ? topList.tenantCount : 0 }}
                </span>
                个
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

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
          <el-table-column label="平台名称" align="center" prop="tenantName" />
          <el-table-column label="平台ID" align="center" prop="tenantId" />

          <el-table-column label="订单数量" align="center" prop="orderCount" />
          <el-table-column label="订单金额(元)" align="center" prop="orderAmount" width="120px" />
          <el-table-column label="成功订单数" align="center" prop="successfulOrderCount" />
          <el-table-column
            label="成功订单金额(元)"
            align="center"
            prop="successfulOrderAmount"
            width="160px"
          />

          <el-table-column label="成功率(%)" align="center" prop="successfulRate" />
          <el-table-column label="系统费用(元)" align="center" prop="systemCost" width="130px" />

          <el-table-column
            label="分润比例(%)"
            align="center"
            prop="tenantAgentRate"
            width="130px"
          />
          <el-table-column label="分润(元)" align="center" prop="tenantAgentCost" width="130px" />
        </my-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import {
  tenantAgentAccountSummary,
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
      topList: {
        accountStatus: 0,
        availableBalance: 0,
        freezeBalance: 0,
        tenantCount: 0
      } //顶部数据
    }
  },
  created() {
    this.tenantAgentAccountSummary()
  },
  methods: {
    async flagChange(e) {
      this.flag = e
      this.$refs.tableRef.getTableData(1)
    },
    async tenantAgentAccountSummary() {
      let res = await tenantAgentAccountSummary(this.$store.state.userAccount.userId)

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
  mounted() {}
}
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;

  ::v-deep .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 2px 0 0 2px;
  }
  ::v-deep .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 2px 2px 0;
  }
  ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #42b983;
    border-color: #42b983;
    box-shadow: -1px 0 0 0 #42b983;
  }
  ::v-deep .el-radio-button__inner:hover {
    color: #42b983;
  }
  .btn-change {
    padding: 0 10px;
    margin-top: 20px;
  }
  .h3Color {
    color: #333;
  }

  .panel-group {
    // margin-top: 18px;
    margin-left: 0 !important;
    margin-right: 0 !important;

    &.huizong {
      // margin-left: 100px !important;
      display: flex;
      .card-panel-col {
        margin-bottom: 20px;
        // width: 20%;
        flex: 1;
        min-width: 300px;
        margin: 0 15px;
      }
    }
    .tongji-body {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;

      ::v-deep .el-card__body {
        padding: 0;
      }
    }

    // .card-panel-col {
    //   margin-bottom: 20px;
    //   // width: 20%;
    //   flex: 1;
    //   margin: 0 15px;
    // }

    .card-panel {
      height: 90px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #333;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.1);
      border-color: rgba(0, 0, 0, 0.05);
      // padding: 0 40px 0 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-radius: 3px;

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #63b8ff;
        }
      }
      .card-panel-icon {
        width: 140px;
        // color: #fff  !important;
        background: #63b8ff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .icon-people {
        color: #40c9c6;
      }
      ::v-deep .svg-icon {
        font-size: 56px;
        color: #fff !important;
      }
      .card-panel-icon-wrapper {
        float: left;
        //   margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      // .card-panel-icon {
      //   float: left;
      //   font-size: 48px;
      // }

      .card-panel-description {
        font-weight: bold;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        // margin: 0 30px;
        .card-panel-text {
          line-height: 22px;

          color: #747272;
          font-size: 14px;
        }

        .card-panel-num {
          text-align: center;
          font-size: 20px;
          display: flex;
          // justify-content: right;
          span {
            color: rgb(1, 114, 1);
            margin-right: 10px;
          }
        }
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}

.dark {
  .container .panel-group .card-panel {
    background: #111;
  }
}
</style>
