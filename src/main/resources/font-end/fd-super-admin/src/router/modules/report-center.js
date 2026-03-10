/**
 *  报表中心  相关路由
 */

import Layout from '@/layout'

const reportCenter = [
  {
    path: '/report-center',
    component: Layout,
    redirect: '/report-center/platform-daily-report',
    meta: {
      title: '报表中心',
      icon: 'table'
    },
    children: [
      {
        path: 'tenant-agent-daily-report',
        component: () => import('@/views/report-center/tenant-agent-daily-report'),
        name: 'TenantAgentDailyReport',
        // meta: { title: '租户代理日报表' }
        meta: { title: '平台代理日报表' }
      },
      {
        path: 'platform-daily-report',
        component: () => import('@/views/report-center/platform-daily-report'),
        name: 'PlatformDailyReport',
        meta: { title: '平台日报表' }
      },
      {
        path: 'merchant-agent-daily-report',
        component: () => import('@/views/report-center/merchant-agent-daily-report'),
        name: 'MerchantAgentDailyReport',
        meta: { title: '商户代理日报表' }
      },
      {
        path: 'merchant-daily-report',
        component: () => import('@/views/report-center/merchant-daily-report'),
        name: 'MerchantDailyReport',
        meta: { title: '商户日报表' }
      },
      // {
      //   path: 'merchant-month-report',
      //   component: () => import('@/views/report-center/merchant-month-report'),
      //   name: 'MerchantMonthlyReport',
      //   meta: { title: '商户月报表' }
      // },
 
      {
        path: 'service-daily-report',
        component: () => import('@/views/report-center/service-daily-report'),
        name: 'ServiceDailyReport',
        meta: { title: '码商日报表' }
      },
      {
        path: 'product-type-daily',
        component: () => import('@/views/report-center/product-type-daily'),
        name: 'ProductTypeDaily',
        meta: { title: '产品类型日报表' }
      },

      
      {
        path: 'channel-daily-report',
        component: () => import('@/views/report-center/channel-daily-report'),
        name: 'ChannelDailyReport',
        meta: { title: '通道日报表' }
      },
      {
        path: 'product-daily-report',
        component: () => import('@/views/report-center/product-daily-report'),
        name: 'ProductDailyReport',
        meta: { title: '产品日报表' }
      },
   
   
      
      
      
      // {
      //   path: 'income-info-daily',
      //   component: () => import('@/views/report-center/income-info-daily'),
      //   name: 'IncomeInfoDaily',
      //   meta: { title: '收款信息日报表' }
      // }
    ]
  }
]
export default reportCenter
