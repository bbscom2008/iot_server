/**
 * 订单管理
 */

import Layout from '@/layout'

const orderManage = [
  
  {
    path: '/merchant-order',
    component: Layout,
    redirect: '/merchant-order/collect-order',
    name: 'MerchantOrder',
    meta: {
      title: '订单管理',
      icon: 'list'
    },
    children: [ 
      {
        path: 'collect-order',
        component: () => import('@/views/merchant-order/collect-order'),
        name: 'CollectOrder',
        meta: { title: '代收订单' }
      },
      // {
      //   path: 'collect-order2',
      //   component: () => import('@/views/merchant-order/collect-order2'),
      //   name: 'AgentIncome',
      //   meta: { title: '代收订单2' }
      // },
      {
        path: 'agent-pay',
        component: () => import('@/views/merchant-order/agent-pay'),
        name: 'AgentPay',
        meta: { title: '代付订单' }
      },
       {
        path: 'acceptence-order',
        component: () => import('@/views/merchant-order/acceptence-order'),
        name: 'AcceptenceOrder',
        meta: { title: '兑付订单' }
      },
      
      {
        path: 'exception-order',
        component: () => import('@/views/merchant-order/exception-order'),
        name: 'ExceptionOrder',
        meta: { title: '异常订单' }
      },
      // {
      //   path: 'payment-accept-order',
      //   component: () => import('@/views/merchant-order/payment-accept-order'),
      //   name: 'PaymentAcceptOrder',
      //   meta: { title: '代付抢单' }
      // },
      // {
      //   path: 'subordinate-collect-order',
      //   component: () => import('@/views/merchant-order/subordinate-collect-order'),
      //   name: 'SubordinateOrder',
      //   meta: { title: '下级代收订单' }
      // },
      // {
      //   path: 'subordinate-agent-pay-order',
      //   component: () => import('@/views/merchant-order/subordinate-agent-pay-order'),
      //   name: 'SubordinateAgentPayOrder',
      //   meta: { title: '下级代付订单' }
      // }
    ]
  }
]
export default orderManage
