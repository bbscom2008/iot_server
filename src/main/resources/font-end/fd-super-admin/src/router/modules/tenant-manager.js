/**
 * 运营管理  <i class="el-icon-setting" />
 */

import Layout from '@/layout'

const tenantManager = [

  {
    path: '/platform',
    component: Layout,
    meta: {
      icon: 'peoples'
    },
    children: [
      {
        path: 'tenant-agent',
        component: () => import('@/views/tenant/tenant-agent'),
        name: 'TenantAgent',
        meta: { title: '平台代理' }
      },
    ]
  },


  {
    path: '/tenant',
    component: Layout,
    name: 'Tenant',
    redirect: '/tenant/tenant-manager',
    meta: {
      title: '平台管理',
      icon: 'tree'
    },
    children: [
      // {
      //   path: 'tenant-agent',
      //   component: () => import('@/views/tenant/tenant-agent'),
      //   name: 'TenantAgent',
      //   meta: { title: '平台代理' }
      // },
      {
        path: 'tenant-manager',
        component: () => import('@/views/tenant/tenant-manager'),
        name: 'TenantManager',
        meta: { title: '平台列表' }
      },
      // {
      //   path: 'tenant-setting',
      //   component: () => import('@/views/tenant/tenant-setting'),
      //   name: 'TenantSetting',
      //   meta: { title: '租户配置管理' }
      // },
      
      {
        path: 'tenant-product-type',
        component: () => import('@/views/tenant/tenant-product-type'),
        name: 'TenantProductType',
        meta: { title: '产品类型列表' }
      },
      // {
      //   path: 'tenant-product-neturl',
      //   component: () => import('@/views/tenant/tenant-product-neturl'),
      //   name: 'ProductNeturl',
      //   meta: { title: '链接管理' }
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
