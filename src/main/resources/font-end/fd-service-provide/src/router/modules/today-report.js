/**
 *  报表中心  相关路由
 */

import Layout from '@/layout'

const reportCenter = [
  {
    path: '/today-report',
    component: Layout,
    redirect: '/today-report/service-today-report',
    name: 'TodayReportCenter',
    meta: {
      title: '今日报表',
      icon: 'table'
    },
    children: [
      
      {
        path: 'service-today-report',
        component: () => import('@/views/today-report/service-daily-report'),
        name: 'ServiceTodayReport',
        meta: { title: '今日个人报表' }
      },

      {
        path: 'service-team-today-report',
        component: () => import('@/views/today-report/service-team-report'),
        name: 'ServiceTodayTeamReport',
        meta: { title: '今日团队报表' }
      },

      {
        path: 'product-today-report',
        component: () => import('@/views/today-report/product-daily-report'),
        name: 'ProductTodayReport',
        meta: { title: '今日产品报表' }
      },

      {
        path: 'income-today-report',
        component: () => import('@/views/today-report/income-info-daily'),
        name: 'IncomeInfoTodayReport',
        meta: { title: '今日收款信息报表' }
      }
    ]
  }
]
export default reportCenter
