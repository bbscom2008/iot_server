/**
 * 运营管理  <i class="el-icon-setting" />
 */

import Layout from '@/layout'

const operateManager = [
  {
    path: '/opm',
    component: Layout,
    name: 'operateManager',
    meta: {
      title: '运营管理',
      icon: 'el-icon-setting'
    },
    children: [
      
     
      {
        path: 'product-list',
        component: () => import('@/views/opm/product-manage'),
        name: 'ProductList',
        meta: { title: '产品管理' }
      },
      {
        path: 'channel-list',
        component: () => import('@/views/merchant/pay-channel-list'),
        name: 'ChannelList',
        meta: { title: '通道管理' }
      },
      {
        path: 'channel-info-list',
        component: () => import('@/views/opm/channel-info-list'),
        name: 'ChannelInfoList',
        meta: { title: '收款信息列表' }
      }
    ]
  }
]
export default operateManager
