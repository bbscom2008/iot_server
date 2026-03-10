/**
 * 运营管理  <i class="el-icon-setting" />
 */

import Layout from '@/layout'

const systemManager = [
  {
    path: '/ali-pay',
    component: Layout,
    redirect: '/ali-pay/ali-pay-manager',
    name: 'AliPay',
    meta: {
      title: '支付宝',
      icon: 'zhi',
      index: 2,
    },
    children: [
      {
        path: 'ali-pay-manager',
        component: () => import('@/views/ali-pay/ali-pay-manager'),
        name: 'AliPayManager',
        meta: { title: '支付宝管理', index: 1 } 
      },
      // {
      //   path: 'ali-auth-list',
      //   component: () => import('@/views/ali-pay/auth-list'),
      //   name: 'AliAuthList',
      //   meta: { title: '授权列表',index: 2 }
      // },
      // {
      //   path: 'bill-list',
      //   component: () => import('@/views/ali-pay/bill-list'),
      //   name: 'AliBillList',
      //   meta: { title: '支付宝账单',index: 3 }
      // },
      
    ]
  }
]
export default systemManager
