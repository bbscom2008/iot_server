/**
 * 运营管理  <i class="el-icon-setting" />
 */

import Layout from '@/layout'
import ShopsView from '@/views/shops/shops.vue'
const systemManager = [
  {
    path: '/shops',
    component: Layout,
    redirect: '/shops/dongwo',
    name: 'Shops',
    meta: {
      title: '店铺管理',
      icon: 'zhi',
      index: 2
    },
    children: [
      {
        path: 'dongwo',
        redirect: '/shops/dongwo/goods',
        name: 'ShopManager',
        component: ShopsView,
        meta: { title: '洞窝', index: 1 },
        children: [
          {
            path: 'goods',
            component: () => import('@/views/shops/dongwo/goods'),
            name: 'Goods',
            meta: { title: '商品管理', index: 1 }
          },
          {
            path: 'delivery-credentials',
            component: () => import('@/views/shops/dongwo/delivery-credentials'),
            name: 'DeliveryCredentials',
            meta: { title: '发货凭证', index: 1 }
          }
        ]
      }
    ]
  }
]

// const systemManager = [
  
//       {
//         path: '/dongwo',
//         component: Layout,
//         redirect: '/dongwo/goods',
//         name: 'ShopDongwo',
//         meta: { title: '洞窝店铺', icon: 'zhi',index: 1 },
//         children: [
//           {
//             path: 'dongwo-goods',
//             component: () => import('@/views/shops/DongwoGoods'),
//             name: 'DongwoGoods',
//             meta: { title: '商品管理', index: 1 }
//           },
//           {
//             path: 'delivery-credentials',
//             component: () => import('@/views/shops/delivery-credentials'),
//             name: 'DeliveryCredentials',
//             meta: { title: '发货凭证', index: 1 }
//           }
//         ]
//       }

// ]

export default systemManager
