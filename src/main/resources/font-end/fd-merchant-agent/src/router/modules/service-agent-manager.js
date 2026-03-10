/**
 *  码商代理管理  相关路由
 */

import Layout from '@/layout'

const serviceAgentManager = [
  {
    path: '/service-agent-manager',
    component: Layout,
    redirect: '/service-agent-manager/service-agent-team',
    name: 'ServiceAgentManager',
    meta: {
      title: '码商代理管理',
      icon: 'table'
    },
    children: [
      {
        path: 'service-agent-team',
        component: () => import('@/views/service-agent-manager/service-agent-team'),
        name: 'ServiceAgentTeam',
        meta: { title: '码商代理列表' }
      },
      {
        path: 'service-agent-distribute-profit-setting',
        component: () => import('@/views/service-agent-manager/service-agent-distribute-profit-setting'),
        name: 'ServiceAgentDistributeProfitSetting',
        meta: { title: '分润配置' }
      },
      {
        path: 'service-agent-distribute-profit-list',
        component: () => import('@/views/service-agent-manager/service-agent-distribute-profit-list'),
        name: 'ServiceAgentDistributeProfitList',
        meta: { title: '分润列表' }
      }
    ]
  }
]
export default serviceAgentManager
