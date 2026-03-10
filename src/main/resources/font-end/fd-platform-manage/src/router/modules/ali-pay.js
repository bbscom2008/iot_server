
/**
 * 运营管理  <i class="el-icon-setting" />
 */

import Layout from '@/layout'

const systemManager = [
  {
    path: '/monitor',
    component: Layout,
    redirect: '/monitor/monitor-manager',
    name: 'Monitor',
    meta: {
      title: '监控中心',
      icon: 'list',
    },
    children: [
      
      // {
      //   path: 'ali-auth-list',
      //   component: () => import('@/views/ali-pay/auth-list'),
      //   name: 'AliAuthList',
      //   meta: { title: '授权列表',index: 2 }
      // },
      
      {
        path: 'monitor-manager',
        component: () => import('@/views/monitor/monitor-manager'),
        name: 'MonitorManager',
        meta: { title: '队列监控', index: 1 } 
      },
      {
        path: 'ali-pay-manager',
        component: () => import('@/views/ali-pay/ali-pay-manager'),
        name: 'AliPayManager',
        meta: { title: '支付宝管理', index: 1 } 
      },
      {
        path: 'bill-list',
        component: () => import('@/views/ali-pay/bill-list'),
        name: 'AliBillList',
        meta: { title: '支付宝账单',index: 3 }
      },
      
    ]
  }
]
export default systemManager
