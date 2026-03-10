/**
 * 运营管理  <i class="el-icon-setting" />
 */

import Layout from '@/layout'

const systemManager = [
  {
    path: '/system-manager',
    component: Layout,
    redirect: '/system-manager/system-setting',
    name: 'systemManager',
    meta: {
      title: '系统管理',
      icon: 'el-icon-setting',
      index: 2,
    },
    children: [
      // {
      //   path: 'online-user',
      //   component: () => import('@/views/system-manager/online-user'),
      //   name: 'OnlineUser',
      //   meta: { title: '在线用户', index: 1 } 
      // },
      {
        path: 'system-setting',
        component: () => import('@/views/system-manager/system-setting'),
        name: 'SystemSetting',
        meta: { title: '系统配置' }
      },
      {
        path: 'platform-setting',
        component: () => import('@/views/system-manager/platform-setting'),
        name: 'PlatformSetting',
        meta: { title: '平台配置' }
      },
      // {
      //   path: 'dictionary-manage',
      //   component: () => import('@/views/system-manager/dictionary-manage'),
      //   name: 'dictionaryManage',
      //   meta: { title: '字典管理' }
      // },
      // {
      //   path: 'menu-manage',
      //   component: () => import('@/views/system-manager/menu-manage'),
      //   name: 'MenuManage',
      //   meta: { title: '菜单管理',index: 3 } 
      // },


        // {
        //   path: 'user-role',
        //   component: () => import('@/views/system-manager/user-role/index.vue'),
        //   redirect: '/system-manager/user-role/user-manage',
        //   name: 'UserRole',
        //   meta: { title: '用户权限管理', affix: true },
        //   children: [
          {
            path: 'role-manage',
            component: () => import('@/views/system-manager/user-role/role-manage'),
            name: 'RoleManage',
            meta: { title: '角色管理',index: 4 } // icon: 'peoples',
          },
          {
              path: 'user-manage',
              component: () => import('@/views/system-manager/user-role/user-manage'),
              name: 'UserManage',
              meta: { title: '用户管理', index: 5 }  // icon: 'user',
            },
            // {
            //   path: 'product-manage',
            //   component: () => import('@/views/system-manager/product-manage'),
            //   name: 'ProductManage',
            //   meta: { title: '支付宝管理',  affix: true,index: 5 }  // icon: 'user',
            // },
            
            // {
            //   path: 'same-frame',
            //   component: () => import('@/views/same-frame'),
            //   name: 'sameFrame',
            //   meta: { title: '统一模板', icon: 'user', affix: true }
            // },
        //   ]
        // },
        {
          path: 'operate-log',
          component: () => import('@/views/system-manager/log-manager/operate-log'),
          name: 'OperateLog',
          meta: { title: '系统日志',index: 6 }
        },
        {
          path: 'obj-save',
          component: () => import('@/views/system-manager/obj-save'),
          name: 'ObjSave',
          meta: { title: '对象存储' }
        },
        {
          path: 'risk-control_center',
          component: () => import('@/views/system-manager/risk-control_center'),
          name: 'RiskControlCenter',
          meta: { title: '风控中心' }
        },
        

      // {
        // path: 'log-manager',
        // component: () => import('@/views/system-manager/log-manager/index.vue'),
        // redirect: '/system-manager/log-manager/operate-log',
        // name: 'LogManager',
        // meta: { title: '日志管理' },
        // children: [
          // {
          //   path: 'operate-log',
          //   component: () => import('@/views/system-manager/log-manager/operate-log'),
          //   name: 'OperateLog',
          //   meta: { title: '系统日志' }
          // }, 
          {
            path: 'login-log',
            component: () => import('@/views/system-manager/log-manager/login-log'),
            name: 'LoginLog',
            meta: { title: '登录日志' }
          }, 
        // ]
      // }
      
    ]
  }
]
export default systemManager
