/**
 * 商户管理的相关路由
 */

import Layout from '@/layout'

const merchantRouter = [
  {
    path: '/channel-manage',
    component: Layout,
    redirect: '/channel-manage/income-channel-list',
    meta: {
      title: '通道管理',
      icon: 'table'
    },
    children: [

      {
        path: 'income-channel-list',
        component: () => import('@/views/merchant/income-channel-list'),
        name: 'IncomeChannelList',
        meta: { title: '通道列表' }
      },

       {
        path: 'template-manager',
        component: () => import('@/views/service-manager/template-manager'),
        name: 'TemplateManager',
        meta: { title: '收银台模板' }
      },

      {
        path: 'service-product-mananger',
        component: () => import('@/views/service-manager/service-product-mananger'),
        name: 'ServiceProductMananger',
        meta: { title: '产品管理' }
      },

    ]
  }
]
export default merchantRouter
