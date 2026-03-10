/**
 *  报表中心  相关路由
 */

import Layout from '@/layout'

const reportCenter = [
  {
    path: '/today-report',
    component: Layout,
    redirect: '/today-report/platform-today-report',
    name: 'ReportCenter',
    meta: {
      title: '今日报表',
      icon: 'table'
    },
    children: [
      {
        path: 'platform-today-report',
        component: () => import('@/views/today-report/platform-today-report'),
        name: 'PlatformTodayReport',
        meta: { title: '平台今日报表' }
      },

      {
        path: 'merchant-agent-today-report',
        component: () => import('@/views/today-report/merchant-agent-today-report'),
        name: 'MerchantAgentTodayReport',
        meta: { title: '商户代理今日报表' }
      },

      {
        path: 'merchant-today-report',
        component: () => import('@/views/today-report/merchant-today-report'),
        name: 'MerchantTodayReport',
        meta: { title: '商户今日报表' }
      },
      {
        path: 'service-today-report',
        component: () => import('@/views/today-report/service-today-report'),
        name: 'ServiceTodayReport',
        meta: { title: '码商今日报表' }
      },
      {
        path: 'channel-today-report',
        component: () => import('@/views/today-report/channel-today-report'),
        name: 'ChannelTodayReport',
        meta: { title: '通道今日报表' }
      },
      {
        path: 'product-today-report',
        component: () => import('@/views/today-report/product-today-report'),
        name: 'ProductTodayReport',
        meta: { title: '产品今日报表' }
      },
     
    ]
  }
]
export default reportCenter
