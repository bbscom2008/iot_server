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
      icon: 'table'
    },
    children: [
      {
        path: 'service-list',
        component: () => import('@/views/service-manager/service-list'),
        name: 'ServiceList',
        meta: { title: '码商列表' }
      },
      {
        path: 'service-team-report',
        component: () => import('@/views/service-manager/service-team-report'),
        name: 'ServiceTeamReport',
        meta: { title: '团队报表' }
      },
      {
        path: 'template-create',
        component: () => import('@/views/service-manager/template-create'),
        name: 'TemplateCreate',
        hidden: true,
        meta: { title: '创建收银台模板' }
      },
      // {
      //   path: 'template-create2',
      //   component: () => import('@/views/opm/template-create_2'),
      //   name: 'TemplateCreate2',
      //   // hidden: true,
      //   meta: { title: '创建收银台模板2' }
      // },

      {
        path: 'template-manager',
        component: () => import('@/views/opm/template-manager'),
        name: 'TemplateManager',
        meta: { title: '收银台模板列表' }
      },
      // {
      //   path: 'collect-info-template',
      //   component: () => import('@/views/service-manager/collect-info-template'),
      //   name: 'CollectInfoTemplate',
      //   meta: { title: '创建收款信息模板' }
      // },
      {
        path: 'service-product-mananger',
        component: () => import('@/views/service-manager/service-product-mananger'),
        name: 'ServiceProductMananger',
        meta: { title: '产品管理' }
      },
      {
        path: 'service-income-info',
        component: () => import('@/views/service-manager/service-income-info'),
        name: 'ServiceIncomeInfo',
        meta: { title: '收款信息管理' }
      },
      
    ]
  }
]
export default serviceManager
