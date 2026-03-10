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
      icon: 'table'
    },
    children: [
      {
        path: 'merchant-info',
        component: () => import('@/views/merchant/merchant-info'),
        name: 'MerchantInfo',
        meta: { title: '商户管理' }
      },
    ]
  }
]
export default merchantRouter
