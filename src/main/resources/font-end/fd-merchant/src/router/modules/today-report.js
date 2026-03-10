/**
 *  报表中心  相关路由
 */

import Layout from '@/layout'

const reportCenter = [
  {
    path: '/today-report',
    component: Layout,
    redirect: '/today-report/merchant-today-report',
    name: 'ReportCenter',
    meta: {
      title: '今日报表',
      icon: 'table'
    },
    children: [
      {
        path: 'merchant-today-report',
        component: () => import('@/views/today-report/merchant-daily-report'),
        name: 'MerchantTodayReport',
        meta: { title: '今日商户报表' }
      },
      {
        path: 'channel-today-report',
        component: () => import('@/views/today-report/channel-daily-report'),
        name: 'ChannelTodayReport',
        meta: { title: '今日通道报表' }
      },
    ]
  }
]
export default reportCenter
