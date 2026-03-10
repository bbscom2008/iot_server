<template>
  <!-- <el-card  style="display: none;" > -->
  <el-card>
    <div class="fast-enter">
      <h3 class="h3Color">
        <span style="font-family: 'Microsoft Yahei'">快速入口</span>
      </h3>
      <div class="box">
        <!--  -->
        <el-tabs :stretch="false" v-model="activeName">
          <el-tab-pane
            v-for="(tab, i) in fastTabs"
            :key="i"
            :label="tab.label"
            :name="`tab${i + 1}`"
          >
            <div class="item-line">
              <div
                class="item"
                v-for="(item, index) in tab.children"
                :key="index"
                :style="{
                  backgroundImage: $store.state.app.isDarkTheme
                    ? `url(${require(`@/assets/img/card_bg${item.bgIndex}_dark.png`)})`
                    : `url(${require(`@/assets/img/card_bg${item.bgIndex}.png`)})`
                }"
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
</template>

<script>
export default {
  name: 'QuickEnter',
  data() {
    return {
      activeName: 'tab1',
      fastTabs: [
        {
          label: '常用业务',
          children: [
            {
              label: '用户管理',
              url: '/system-manager/user-manage',
              icon: require(`@/assets/img/card_c1.png`),
              bgIndex: 1
            },
            {
              label: '代付订单',
              url: '/merchant-order/agent-pay',
              icon: require(`@/assets/img/card_c3.png`),
              bgIndex: 2
            },
            {
              label: '代收订单',
              url: '/merchant-order/collect-order',
              icon: require(`@/assets/img/card_c3.png`),
              bgIndex: 3
            },
            {
              label: '平台日报表',
              url: '/report-center/platform-daily-report',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 4
            },
            {
              label: '码商管理',
              url: '/service-manager/service-list',
              icon: require(`@/assets/img/card_c5.png`),
              bgIndex: 5
            },
            {
              label: '平台报表',
              url: '/report-center/platform-daily-report',
              icon: require(`@/assets/img/card_c6.png`),
              bgIndex: 6
            }
          ]
        },
        {
          label: '系统管理',
          children: [
            {
              label: '平台配置',
              url: '/system-manager/system-setting',
              icon: require(`@/assets/img/card_c2.png`),
              bgIndex: 2
            },
            // {
            //   label: '平台配置',
            //   url: '/system-manager/platform-setting',
            //   icon:require(`@/assets/img/card_c2.png`),
            //   bgIndex:4
            // },
            {
              label: '用户管理',
              url: '/system-manager/user-manage',
              icon: require(`@/assets/img/card_c1.png`),
              bgIndex: 1
            },
            {
              label: '系统日志',
              url: '/system-manager/operate-log',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 3
            },
            {
              label: '登录日志',
              url: '/system-manager/operate-log',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 5
            }
          ]
        },
        // {
        //   label: '支付宝',
        //   children: [
        //     {
        //       label: '在线用户',
        //       url: '',
        //       icon:require(`@/assets/img/card_c1.png`)
        //     },
        //     {
        //       label: '系统配置',
        //       url: '',
        //       icon:require(`@/assets/img/card_c1.png`)
        //     }
        //   ]
        // },
        // {
        //   label: '微信管理',
        //   children: [
        //     {
        //       label: '在线用户',
        //       url: '',
        //       icon:require(`@/assets/img/card_c1.png`)
        //     },
        //     {
        //       label: '系统配置',
        //       url: '',
        //       icon:require(`@/assets/img/card_c1.png`)
        //     }
        //   ]
        // },
        // {
        //   label: '阿奇索',
        //   children: [
        //     {
        //       label: '在线用户',
        //       url: '',
        //       icon:require(`@/assets/img/card_c1.png`)
        //     },
        //     {
        //       label: '系统配置',
        //       url: '',
        //       icon:require(`@/assets/img/card_c1.png`)
        //     }
        //   ]
        // },
        {
          label: '报表中心',
          children: [
            {
              label: '平台日报表',
              url: '/report-center/platform-daily-report',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 1
            },
            {
              label: '商户日报表',
              url: '/report-center/merchant-daily-report',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 3
            },
            {
              label: '码商日报表',
              url: '/report-center/service-daily-report',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 2
            },
            // {
            //   label: '产品类型日报表',
            //   url: '/report-center/product-type-daily',
            //   icon:require(`@/assets/img/card_c4.png`),
            //   bgIndex:4
            // },
            {
              label: '通道日报表',
              url: '/report-center/channel-daily-report',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 6
            },
            {
              label: '产品日报表',
              url: '/report-center/product-daily-report',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 5
            }
          ]
        },
        {
          label: '今日报表',
          children: [
            {
              label: '平台今日报表',
              url: '/today-report/platform-today-report',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 3
            },
            {
              label: '商户今日报表',
              url: '/today-report/merchant-today-report',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 1
            },
            {
              label: '码商今日报表',
              url: '/today-report/service-today-report',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 2
            },
            // {
            //   label: '产品类型今日报表',
            //   url: '/today-report/product-type-today-report',
            //   icon:require(`@/assets/img/card_c4.png`),
            //   bgIndex:6
            // },
            {
              label: '通道今日报表',
              url: '/today-report/channel-today-report',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 5
            },
            {
              label: '产品今日报表',
              url: '/today-report/product-today-report',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 4
            }
          ]
        },

        {
          label: '商户管理',
          children: [
            {
              label: '商户列表',
              url: '/merchant/merchant-info',
              icon: require(`@/assets/img/card_c6.png`),
              bgIndex: 5
            },
            {
              label: '通道管理',
              url: '/merchant/income-channel-list',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 2
            }
          ]
        },
        {
          label: '码商管理',
          children: [
            {
              label: '码商列表',
              url: '/service-manager/service-list',
              icon: require(`@/assets/img/card_c5.png`),
              bgIndex: 5
            },
            {
              label: '码商权限',
              url: '/service-manager/service-auth',
              icon: require(`@/assets/img/card_c2.png`),
              bgIndex: 2
            },
            {
              label: '收银台列表',
              url: '/service-manager/template-manager',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 1
            },
            {
              label: '产品管理',
              url: '/service-manager/service-product-mananger',
              icon: require(`@/assets/img/card_c2.png`),
              bgIndex: 4
            },
            {
              label: '收款码列表',
              url: '/service-manager/service-income-info',
              icon: require(`@/assets/img/card_c5.png`),
              bgIndex: 3
            }
          ]
        },
        {
          label: '订单管理',
          children: [
            {
              label: '代收订单',
              url: '/merchant-order/collect-order',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 1
            },
            {
              label: '代付订单',
              url: '/merchant-order/agent-pay',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 2
            },
            {
              label: '异常订单',
              url: '/merchant-order/exception-order',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 3
            }
          ]
        },
        {
          label: '账变中心',
          children: [
            // {
            //   label: '平台代理账变记录',
            //   url: '/cash-manage/tenement-agent-record',
            //   icon:require(`@/assets/img/card_c4.png`),
            //   bgIndex:2
            // },
            {
              label: '平台账变记录',
              url: '/cash-manage/tenement-change-record',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 1
            },
            {
              label: '商户代理账变记录',
              url: '/cash-manage/merchant-agent-record',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 3
            },
            {
              label: '商户账变记录',
              url: '/cash-manage/merchant-change-record',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 5
            },
            {
              label: '码商账变记录',
              url: '/cash-manage/service-change-record',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 4
            }
          ]
        },
        {
          label: '提现管理',
          children: [
            {
              label: '平台提现申请',
              url: '/merchant-cash/tenement-apply-for',
              icon: require(`@/assets/img/card_c2.png`),
              bgIndex: 1
            },
            {
              label: '商户代理提现审核',
              url: '/merchant-cash/tenement-agent-apply-for',
              icon: require(`@/assets/img/card_c2.png`),
              bgIndex: 3
            },
            {
              label: '商户提现审核',
              url: '/merchant-cash/merchant-apply-for',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 5
            },
            {
              label: '码商提现审核',
              url: '/merchant-cash/service-apply-for',
              icon: require(`@/assets/img/card_c4.png`),
              bgIndex: 4
            }
          ]
        }
      ]
    }
  }
}
</script>

<style></style>
