/**
 * 商户管理的相关路由
 */

import Layout from '@/layout'

const cashManage = [
  {
    path: '/cash-manage',
    component: Layout,
    redirect: '/cash-manage/tenement-change-record',
    name: 'CashManage',
    meta: {
      title: '账变中心',
      icon: 'money'
    },
    children: [
      {
        path: 'tenement-change-record',
        component: () => import('@/views/cash-manage/tenement-change-record'),
        name: 'tenementChangeRecord',
        meta: { title: '平台账变记录' }
      },
      // {
      //   path: 'tenement-agent-record',
      //   component: () => import('@/views/cash-manage/tenement-agent-record'),
      //   name: 'tenementAgentRecord',
      //   meta: { title: '商户代理账变记录' }
      // },
     
      {
        path: 'merchant-agent-record',
        component: () => import('@/views/cash-manage/merchant-agent-record'),
        name: 'merchantAgenteRecord',
        meta: { title: '商户代理账变记录' }
      },
      {
        path: 'merchant-change-record',
        component: () => import('@/views/cash-manage/merchant-change-record'),
        name: 'merchantChangeRecord',
        meta: { title: '商户账变记录' }
      },
     
      {
        path: 'service-change-record',
        component: () => import('@/views/cash-manage/service-change-record'),
        name: 'serviceChangeRecord',
        meta: { title: '码商账变记录' }
      }
    ]
  },
  {
    path: '/merchant-cash',
    component: Layout,
    redirect: '/merchant-cash/tenement-apply-for',
    name: 'MerchantCash',
    meta: {
      title: '提现管理',
      icon: 'el-icon-bank-card'
    },
    children: [
      // {
      //   path: 'apply-for',
      //   component: () => import('@/views/merchant-cash/apply-for'),
      //   name: 'CashApplyFor',
      //   meta: { title: '提现申请' }
      // },
      {
        path: 'tenement-apply-for',
        component: () => import('@/views/merchant-cash/tenement-apply-for'),
        name: 'tenementApply',
        meta: { title: '平台提现申请' }
      },
      
      {
        path: 'tenement-agent-apply-for',
        component: () => import('@/views/merchant-cash/tenement-agent-apply-for'),
        name: 'tenementAgentApply',
        meta: { title: '商户代理提现审核' }
      },
     
      // {
      //   path: 'merchant-agent-apply-for',
      //   component: () => import('@/views/merchant-cash/merchant-agent-apply-for'),
      //   name: 'merchantAgentApply',
      //   meta: { title: '商户代理提现申请' }
      // },
      {
        path: 'merchant-apply-for',
        component: () => import('@/views/merchant-cash/merchant-apply-for'),
        name: 'merchantApply',
        meta: { title: '商户提现审核' }
      },
      {
        path: 'service-apply-for',
        component: () => import('@/views/merchant-cash/service-apply-for'),
        name: 'serviceApplyFor',
        meta: { title: '码商提现审核' }
      },
      // {
      //   path: 'recharge-list',
      //   component: () => import('@/views/merchant-cash/recharge-list'),
      //   name: 'RechargeList',
      //   meta: { title: '提现审核' }
      // }
    ]
  }
]
export default cashManage
