/**
 * 运营管理  <i class="el-icon-setting" />
 */

import Layout from '@/layout'

// {
//     path: '/',
//     component: Layout,
//     redirect: '/dashboard',
//     meta: {  index:1 },
//     children: [
//       {
//         path: 'dashboard',
//         component: () => import('@/views/dashboard/index'),
//         name: 'Dashboard',
//         meta: { title: '首页', icon: 'dashboard', affix: true, index:1 }
//       }
//     ]
//   },
const tenantManager = [
  {
    path: '/tenantReport',
    component: Layout,
    name: 'TenantReport',
    children: [
      // {
      //   path: 'tenant-agent',
      //   component: () => import('@/views/tenant/tenant-agent'),
      //   name: 'TenantAgent',
      //   meta: { title: '租户代理' }
      // },
      {
        path: 'tenant-team-report',
        component: () => import('@/views/tenant/tenant-team-report'),
        name: 'TenantTeamReport',
        meta: { title: '平台日报表',icon: 'table' }
      },
      
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
     
      
    ]
  },
  {
    path: '/tenant',
    component: Layout,
    name: 'Tenant',
    children: [
      {
        path: 'tenant-manager',
        component: () => import('@/views/tenant/tenant-manager'),
        name: 'TenantManager',
        meta: { title: '平台列表' ,icon: 'table'}
      },
     
      
    ]
  },
]
export default tenantManager
