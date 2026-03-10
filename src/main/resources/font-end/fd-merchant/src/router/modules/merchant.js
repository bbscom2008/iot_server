/**
 * 商户管理的相关路由
 */

import Layout from '@/layout'

const merchantRouter = [
  {
    path: '/merchant',
    component: Layout,
    redirect: '/merchant/merchant-info',
    name: 'merchant',
    meta: {
      title: '商户管理',
      icon: 'tree'
    },
    children: [
      {
        path: 'merchant-info',
        component: () => import('@/views/merchant/merchant-info'),
        name: 'MerchantInfo',
        meta: { title: '商户信息' }
      },
      {
        path: 'income-channel-list',
        component: () => import('@/views/merchant/income-channel-list'),
        name: 'IncomeChannelList',
        meta: { title: '通道管理' }
      },
      // {
      //   path: 'pay-channel-list',
      //   component: () => import('@/views/merchant/pay-channel-list'),
      //   name: 'PayChannelList',
      //   meta: { title: '代付通道列表' }
      // }
    ]
  }
]
export default merchantRouter
