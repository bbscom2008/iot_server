/**
 *  机器人用户管理  相关路由
 */

import Layout from '@/layout'

const botManager = [
  {
    path: '/bot-manager',
    component: Layout,
    redirect: '/bot-manager/bot-user-list',
    name: 'BotManager',
    meta: {
      title: '机器人管理',
      icon: 'table',
      index: 3
    },
    children: [
      {
        path: 'bot-user-list',
        component: () => import('@/views/bot-manager/bot-user-list.vue'),
        name: 'BotUserList',
        meta: { title: '机器人用户列表', index: 1 }
      },
      {
        path: 'bot-dispatch-user-list',
        component: () => import('@/views/bot-manager/bot-dispatch-user-list.vue'),
        name: 'BotDispatchUserList',
        meta: { title: '转发用户列表', index: 2 }
      },
      {
        path: 'bot-group-list',
        component: () => import('@/views/bot-manager/bot-group-list.vue'),
        name: 'BotGroupList',
        meta: { title: '机器人群组列表', index: 3 }
      },
      {
        path: 'bot-sys-config-list',
        component: () => import('@/views/bot-manager/bot-sys-config-list.vue'),
        name: 'BotSysConfigList',
        meta: { title: '机器人系统配置', index: 4 }
      }
    ]
  }
]
export default botManager
