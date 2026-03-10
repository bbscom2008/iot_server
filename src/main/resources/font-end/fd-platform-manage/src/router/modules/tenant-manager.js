/**
 * 运营管理  <i class="el-icon-setting" />
 */

import Layout from '@/layout'

const tenantManager = [
  {
    path: '/merchant-agent',
    component: Layout,
    meta: {
      title: '商户代理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'merchant-agent-list',
        component: () => import('@/views/merchant-agent/merchant-agent-list.vue'),
        name: 'MerchantAgentList',
        meta: { title: '商户代理' }
      },
      // {
      //   path: 'tenant-manager',
      //   component: () => import('@/views/tenant/tenant-manager'),
      //   name: 'TenantManager',
      //   meta: { title: '租户列表' }
      // },
      // {
      //   path: 'tenant-setting',
      //   component: () => import('@/views/tenant/tenant-setting'),
      //   name: 'TenantSetting',
      //   meta: { title: '租户配置管理' }
      // },
      // {
      //   path: 'tenant-product-type',
      //   component: () => import('@/views/tenant/tenant-product-type'),
      //   name: 'ProductType',
      //   meta: { title: '产品类型列表' }
      // },
     
      // {
      //   path: 'tenant-team-report',
      //   component: () => import('@/views/tenant/tenant-team-report'),
      //   name: 'TenantTeamReport',
      //   meta: { title: '团队报表' }
      // },
    ]
  }
]
export default tenantManager
