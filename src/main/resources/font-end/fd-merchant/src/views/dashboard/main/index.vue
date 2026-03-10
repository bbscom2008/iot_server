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
              <div class="card-panel-text">可用余额:</div>
              <div class="card-panel-num">
                <span> {{ topList.availableBalance ? topList.availableBalance : 0 }} </span>
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
                <span> {{ topList.freezeBalance ? topList.freezeBalance : 0 }} </span>
                元
              </div>
            </div>
          </div>
        </div>
        <div class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon" style="background: #43cd80">
              <svg-icon icon-class="chengjiaodingdanjine" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">平台预付金额:</div>
              <div class="card-panel-num">
                <span> {{ topList.collectDeposit ? topList.collectDeposit : 0 }} </span>
                元
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>




       <!-- <el-card  style="display: none;" > -->
    <el-card v-if="isShowUi" >
      <div class="fast-enter">

        <h3 class="h3Color  ">
          <span style="font-family: 'Microsoft Yahei';">快速入口</span>
        </h3>
        <div class="box">
          <!--  -->
          <el-tabs :stretch="false" v-model="activeName" @tab-click="handleClick" >

            <el-tab-pane v-for="(tab, i) in fastTabs" :key="i" :label="tab.label" :name="`tab${i + 1}`">

              <div class="item-line">
                <div class="item" v-for="(item, index) in tab.children" :key="index"
                  :style="{ backgroundImage: $store.state.app.isDarkTheme ? `url(${require(`@/assets/img/card_bg${item.bgIndex}_dark.png`)})` 
                    : `url(${require(`@/assets/img/card_bg${item.bgIndex}.png`)})` }"
                  @click="$router.push(item.url)"
                  >

                  <div class="icon" :style="{ backgroundImage: `url(${item.icon})` }"></div>

                  <span>{{ item.label }}</span>
                </div>
              </div>

            </el-tab-pane>


          </el-tabs>
        </div>
      </div>
    </el-card>



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
                    </span>
                    个
                  </div>
                </div>
              </div>
            </el-card>
            <el-card class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon" style="background: #99cc99">
                  <svg-icon icon-class="dingdanjine" className="dingdanjine" />
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
                  <!-- <svg-icon icon-class="a-chenggongshuai1x" /> -->
                   <svg-icon icon-class="su_lv" />
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
                <div class="card-panel-icon" style="background: #cccccc">
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
                <div class="card-panel-icon" style="background: #99cccc">
                  <svg-icon icon-class="qiandai" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">费用:</div>
                  <div class="card-panel-num">
                    <span>
                      {{ todayList.merchantCost ? todayList.merchantCost : 0 }}
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
                    </span>
                    个
                  </div>
                </div>
              </div>
            </el-card>
            <el-card class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon" style="background: #99cc99">
                  <svg-icon icon-class="dingdanjine" className="dingdanjine" />
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
                  <!-- <svg-icon icon-class="a-chenggongshuai1x" /> -->
                   <svg-icon icon-class="su_lv" />
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
                <div class="card-panel-icon" style="background: #cccccc">
                  <svg-icon icon-class="hetong-dingdanshuliang" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">成交订单数量:</div>
                  <div class="card-panel-num">
                    <span>
                      {{
                        yestodayList.successfulOrderCount ? yestodayList.successfulOrderCount : 0
                      }}
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
                <div class="card-panel-icon" style="background: #99cccc">
                  <svg-icon icon-class="qiandai" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">费用:</div>
                  <div class="card-panel-num">
                    <span>
                      {{ yestodayList.merchantCost ? yestodayList.merchantCost : 0 }}
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
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import {
  merchantAccountSummary,
  getCollectOrderToday,
  getCollectOrderYesterday,
  getPaymentToday,
  getPaymentYesterdayYesterday
} from '@/api/user'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      flag: '0',
      topList: { accountStatus: 0, availableBalance: 0, freezeBalance: 0, collectDeposit: 0 }, //顶部数据
      todayList: {
        orderCount: 0,
        orderAmount: 0,
        successfulOrderCount: 0,
        successfulOrderAmount: 0,
        merchantCost: 0,
        successfulRate: 0
      },
      yestodayList: {
        orderCount: 0,
        orderAmount: 0,
        successfulOrderCount: 0,
        successfulOrderAmount: 0,
        merchantCost: 0,
        successfulRate: 0
      },
      activeName: 'tab1',
      fastTabs: [
        {
          label: '常用业务',
          children: [
            {
              label: '今日通道报表',
              url: '/today-report/channel-today-report',
              icon:require(`@/assets/img/card_c1.png`),
              bgIndex:1
            },
            {
              label: '通道管理',
              url: '/merchant/income-channel-list',
              icon:require(`@/assets/img/card_c3.png`),
              bgIndex:2
            },
            {
              label: '代收订单',
              url: '/merchant-order/collect-order',
              icon:require(`@/assets/img/card_c3.png`),
              bgIndex:3
            },
             {
              label: '代付订单',
              url: '/merchant-order/agent-pay',
              icon:require(`@/assets/img/card_c3.png`),
              bgIndex:3
            },

            {
              label: '账变列表',
              url: '/cash-manage/merchant-change-record',
              icon:require(`@/assets/img/card_c4.png`),
              bgIndex:4
            },
             {
              label: '异常订单',
              url: '/merchant-order/exception-order',
              icon:require(`@/assets/img/card_c4.png`),
              bgIndex:3
            }
          ]
        },
       
        
        {
          label: '今日报表',
          children: [
         
            {
              label: '商户今日报表',
              url: '/today-report/merchant-today-report',
              icon:require(`@/assets/img/card_c4.png`),
              bgIndex:1
            },
           
            {
              label: '通道今日报表',
              url: '/today-report/channel-today-report',
              icon:require(`@/assets/img/card_c4.png`),
              bgIndex:5
            },
           
          ]
        },
        {
          label: '报表中心',
          children: [
          
            {
              label: '商户日报表',
              url: '/report-center/merchant-daily-report',
              icon:require(`@/assets/img/card_c4.png`),
              bgIndex:3
            },
            
            {
              label: '通道日报表',
              url: '/report-center/channel-daily-report',
              icon:require(`@/assets/img/card_c4.png`),
              bgIndex:6
            },
            
          ]
        },
       
        {
          label: '商户管理',
          children: [
            {
              label: '商户信息',
              url: '/merchant/merchant-info',
              icon:require(`@/assets/img/card_c6.png`),
              bgIndex:5
            },
            {
              label: '通道管理',
              url: '/merchant/income-channel-list',
              icon:require(`@/assets/img/card_c4.png`),
              bgIndex:2
            }
          ]
        },
        
        {
          label: '订单管理',
          children: [
            {
              label: '代收订单',
              url: '/merchant-order/collect-order',
              icon:require(`@/assets/img/card_c4.png`),
              bgIndex:1
            },
            {
              label: '代付订单',
              url: '/merchant-order/agent-pay',
              icon:require(`@/assets/img/card_c4.png`),
              bgIndex:2
            }, 
            {
              label: '异常订单',
              url: '/merchant-order/exception-order',
              icon:require(`@/assets/img/card_c4.png`),
              bgIndex:3
            }
          ]
        },
        // {
        //   label: '账变中心',
        //   children: [
        //     {
        //       label: '平台代理账变记录',
        //       url: '/cash-manage/tenement-agent-record',
        //       icon:require(`@/assets/img/card_c4.png`),
        //       bgIndex:2
        //     },
        //     {
        //       label: '平台账变记录',
        //       url: '/cash-manage/tenement-change-record',
        //       icon:require(`@/assets/img/card_c4.png`),
        //       bgIndex:1
        //     },
        //     {
        //       label: '商户代理账变记录',
        //       url: '/cash-manage/merchant-agent-record',
        //       icon:require(`@/assets/img/card_c4.png`),
        //       bgIndex:3
        //     },
        //     {
        //       label: '商户账变记录',
        //       url: '/cash-manage/merchant-change-record',
        //       icon:require(`@/assets/img/card_c4.png`),
        //       bgIndex:5
        //     },
        //     {
        //       label: '码商账变记录',
        //       url: '/cash-manage/service-change-record',
        //       icon:require(`@/assets/img/card_c4.png`),
        //       bgIndex:4
        //     }
        //   ]
        // },
        // {
        //   label: '提现管理',
        //   children: [
        //     {
        //       label: '平台代理提现审核',
        //       url: '/merchant-cash/tenement-agent-apply-for',
        //       icon:require(`@/assets/img/card_c2.png`),
        //       bgIndex:1
        //     },
        //     {
        //       label: '平台提现审核',
        //       url: '/merchant-cash/tenement-apply-for',
        //       icon:require(`@/assets/img/card_c2.png`),
        //       bgIndex:3
        //     }
        //   ]
        // }
      ]
    }
  },
  created() {
    this.merchantAccountSummary()
    this.getCollectOrderToday()
    this.getCollectOrderYesterday()
  },
  methods: {
    handleClick(){},
    async getCollectOrderToday() {
      let res = await getCollectOrderToday()
      this.todayList = res.data ? res.data : {}
    },
    async getCollectOrderYesterday() {
      let res = await getCollectOrderYesterday()
      this.yestodayList = res.data ? res.data : {}
    },
    async getPaymentToday() {
      let res = await getPaymentToday()
      this.todayList = res.data ? res.data : {}
    },
    async getPaymentYesterdayYesterday() {
      let res = await getPaymentYesterdayYesterday()
      this.yestodayList = res.data ? res.data : {}
    },

    async merchantAccountSummary() {
      let res = await merchantAccountSummary(this.$store.state.userAccount.userId)
      this.topList = res.data ? res.data : {}
    },
    radioChange(e) {
      this.flag = e !== undefined ? e : '1'
      if (e == 0) {
        this.getCollectOrderToday()
        this.getCollectOrderYesterday()
      } else {
        this.getPaymentToday()
        this.getPaymentYesterdayYesterday()
      }
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
