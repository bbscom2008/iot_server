/**
 * 商户管理的相关路由
 */

import Layout from '@/layout'

const merchantAgentRouter = [
  {
    path: '/merchant-agent',
    component: Layout,
    redirect: '/merchant-agent/merchant-agent-list',
    name: 'MerchantAgent',
    meta: {
      title: '商户代理管理',
      icon: 'table'
    },
    children: [
      {
        path: 'merchant-agent-list',
        component: () => import('@/views/merchant-agent/merchant-agent-list'),
        name: 'MerchantAgentList',
        meta: { title: '商户代理列表' }
      },
      // {
      //   path: 'distribute-profit-setting',
      //   component: () => import('@/views/merchant-agent/distribute-profit-setting'),
      //   name: 'DistributeProfitSetting',
      //   meta: { title: '分润配置' }
      // },
      {
        path: 'merchant-team-report',
        component: () => import('@/views/merchant-agent/merchant-team-report'),
        name: 'MerchantTeamReport',
        meta: { title: '团队报表' }
      }     
    ]
  }
]
export default merchantAgentRouter
