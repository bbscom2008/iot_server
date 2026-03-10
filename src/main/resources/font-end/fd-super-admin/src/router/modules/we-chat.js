/**
 * 运营管理  <i class="el-icon-setting" />
 */

import Layout from '@/layout'

const systemManager = [
  {
    path: '/we-chat',
    component: Layout,
    name: 'weChat',
    meta: {
      title: '微信',
      icon: 'wechat',
      index: 3,
    },
    children: [
      {
        path: 'we-chat-manager',
        component: () => import('@/views/we-chat/we-chat-manager'),
        name: 'weChatManager',
        meta: { title: '微信管理', index: 1 } 
      }
      
    ]
  }
]
export default systemManager
