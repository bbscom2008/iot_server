/**
 * 运营管理  <i class="el-icon-setting" />
 */

import Layout from '@/layout'

const systemManager = [
  {
    path: '/agiso',
    component: Layout,
    redirect: '/agiso/agiso-manager',
    name: 'agiso',
    meta: {
      title: '阿奇索',
      icon: 'aqisuo',
      index: 2,
    },
    children: [
      {
        path: 'agiso-manager',
        component: () => import('@/views/agiso/agiso-manager'),
        name: 'AgisoManager',
        meta: { title: '阿奇索管理', index: 1 } 
      },
      {
        path: 'agiso-auth-list',
        component: () => import('@/views/agiso/agiso-auth-list'),
        name: 'AgisoAuthList',
        meta: { title: 'agiso授权列表',index: 2 }
      },
      
    ]
  }
]
export default systemManager
