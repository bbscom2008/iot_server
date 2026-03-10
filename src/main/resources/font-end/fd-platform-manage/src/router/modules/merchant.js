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
        meta: { title: '商户管理' }
      },
      {
        path: 'merchant-settle-record',
        component: () => import('@/views/merchant/merchant-settle-record'),
        name: 'MerchantSettleRecord',
        meta: { title: '结算记录' }
      }
   
    ]
  }
]
export default merchantRouter
