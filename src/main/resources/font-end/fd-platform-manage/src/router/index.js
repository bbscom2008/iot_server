import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
import merchantManage from './modules/merchant'
import cashManage from './modules/cash-manage'
import orderManage from './modules/order-manage'
import channelManage from './modules/channel-manage'

import systemManager from './modules/system-manager'
import reportCenter from './modules/report-center'
import todayReport from './modules/today-report'
import serviceManager from './modules/service-manager'
// import serviceAgentManager from './modules/service-agent-manager'
// import gCodeTools from './modules/gcode-tools'
import tenantManager from './modules/tenant-manager'
import aliPay from './modules/ali-pay'
// import agiso from './modules/agiso'
import botManager from '@/router/modules/bot-manager'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/changePassword',
    component: () => import('@/views/login/changePassword'),
    hidden: true
  },
  {
    path: '/bindGoogleCode',
    component: () => import('@/views/login/bindGoogleCode'),
    hidden: true
  },
  // {
  //   path: '/auth-redirect',
  //   component: () => import('@/views/login/auth-redirect'),
  //   hidden: true
  // },
  {
    path: '/template-preview',
    component: () => import('@/views/service-manager/template-preview'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  // {
  //   path: '/401',
  //   component: () => import('@/views/error-page/401'),
  //   hidden: true
  // },
  {
    path: '/',
    hidden: true,
    redirect: '/dashboard',
  },

  //  {
  //   path: '/blank',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('@/views/blank/blank'),
  //       name: 'Blank',
  //       meta: { title: 'Blank', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

{
    path: '/dashboard',
    redirect: '/dashboard/dashboard',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'el-icon-s-home', affix: true, index:1 }
      }
    ]
  },



  ...merchantManage,
  ...tenantManager,
  ...orderManage,
  
  ...channelManage,

  ...serviceManager,
  ...aliPay,
  ...todayReport,
  ...reportCenter,
  ...cashManage,

  ...systemManager,
  // ...agiso,
  // ...merchantAgent,
  // ...serviceAgentManager,

  ...botManager,
  

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/dashboard', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
