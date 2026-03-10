/**
 *  码商管理  相关路由
 */

import Layout from '@/layout'

const serviceManager = [
  {
    path: '/service-manager',
    component: Layout,
    redirect: '/service-manager/service-list',
    name: 'ServiceManager',
    meta: {
      title: '码商管理',
      icon: 'tree-table'
    },
    children: [
      {
        path: 'service-list',
        component: () => import('@/views/service-manager/service-list'),
        name: 'ServiceList',
        meta: { title: '码商' }
      },
      // {
      //   path: 'service-team-report',
      //   component: () => import('@/views/service-manager/service-team-report'),
      //   name: 'ServiceTeamReport',
      //   meta: { title: '团队报表' }
      // },
      {
        path: 'service-auth',
        component: () => import('@/views/service-manager/service-auth'),
        name: 'ServiceAuth',
        meta: { title: '码商权限' }
      },
      {
        path: 'service-team-manage',
        component: () => import('@/views/service-manager/service-team-manage'),
        name: 'ServiceTeamManage',
        meta: { title: '团队管理' }
      },

      // {
      //   path: 'service-team-report',
      //   component: () => import('@/views/service-manager/service-team-report'),
      //   name: 'ServiceTeamReport',
      //   meta: { title: '团队报表' }
      // },
      {
        path: 'template-create',
        component: () => import('@/views/service-manager/template-create'),
        name: 'TemplateCreate',
        hidden: true,
        meta: { title: '创建收银台模板' }
      },

      // {
      //   path: 'collect-info-template',
      //   component: () => import('@/views/service-manager/collect-info-template'),
      //   name: 'CollectInfoTemplate',
      //   meta: { title: '创建收款信息模板' }
      // },
      // {
      //   path: 'service-product-mananger',
      //   component: () => import('@/views/service-manager/service-product-mananger'),
      //   name: 'ServiceProductMananger',
      //   meta: { title: '产品管理' }
      // },
      {
        path: 'service-income-info',
        component: () => import('@/views/service-manager/service-income-info/service-income-info.vue'),
        name: 'ServiceIncomeInfo',
        meta: { title: '收款码' }
      },
      
    ]
  }
]
export default serviceManager
