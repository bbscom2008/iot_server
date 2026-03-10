import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import orderManage from './modules/order-manage'
import todayReport from './modules/today-report'

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


  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { index: 1 },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'el-icon-s-home', affix: true, index: 1 }
      }
    ]
  },

  {
    path: '/security-center',
    component: Layout,
    redirect: '/security-center/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/security-center/index'),
        name: 'SecurityCenter',
        meta: { title: '安全中心', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/personal-info',
    component: Layout,
    redirect: '/personal-info/index',
    meta: {
      icon: 'user'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/service-manager/personal-info'),
        name: 'PersonalInfo',
        meta: { title: '个人信息' }
      }

    ]
  },

  {
    path: '/service-manager',
    component: Layout,
    redirect: '/service-manager/service-product-mananger',
    name: 'ServiceManager',
    meta: {
      title: '产品管理',
      icon: 'el-icon-s-goods'
    },
    children: [
      {
        path: 'service-product-mananger',
        component: () => import('@/views/service-manager/service-product-mananger'),
        name: 'ServiceProductMananger',
        meta: { title: '产品列表' }
      },
      {
        path: 'service-income-info',
        component: () => import('@/views/service-manager/service-income-info/service-income-info.vue'),
        name: 'ServiceIncomeInfo',
        meta: { title: '收款码' }
      }
    ]
  },

  ...orderManage,
  
  {
    path: '/team-manager',
    component: Layout,
    redirect: '/team-manager/service-list',
    name: 'TeamManager',
    children: [
      {
        path: 'service-list',
        component: () => import('@/views/service-manager/service-list'),
        name: 'ServiceList',
        meta: { title: '团队管理', icon: 'tree' }
      }

    ]
  },
  

  {
    path: '/cash-manage',
    component: Layout,
    redirect: '/cash-manage/service-change-record',
    name: 'CashManage',
    meta: {
      title: '账变中心',
      icon: 'money'
    },
    children: [
      {
        path: 'service-change-record',
        component: () => import('@/views/cash-manage/service-change-record'),
        name: 'serviceChangeRecord',
        meta: { title: '账变记录' }
      },
      {
        path: 'sub-change-record',
        component: () => import('@/views/cash-manage/sub-change-record'),
        name: 'subChangeRecord',
        meta: { title: '下级账变' }
      }
    ]
  },

  ...todayReport,
  {
    path: '/report-center',
    component: Layout,
    redirect: '/report-center/service-daily-report',
    name: 'ReportCenter',
    meta: {
      title: '报表中心',
      icon: 'table'
    },
    children: [
  
      {
        path: 'service-daily-report',
        component: () => import('@/views/report-center/service-daily-report'),
        name: 'ServiceDailyReport',
        meta: { title: '日终报表' }
      },

      {
        path: 'service-team-report',
        component: () => import('@/views/service-manager/service-team-report'),
        name: 'ServiceTeamReport',
        meta: { title: '团队报表' }
      },

      {
        path: 'product-daily-report',
        component: () => import('@/views/report-center/product-daily-report'),
        name: 'ProductDailyReport',
        meta: { title: '产品日报表' }
      },

      {
        path: 'income-info-daily',
        component: () => import('@/views/report-center/income-info-daily'),
        name: 'IncomeInfoDaily',
        meta: { title: '收款信息日报表' }
      }

    ]
  },

  {
    path: '/merchant-cash',
    component: Layout,
    redirect: '/merchant-cash/service-apply-for',
    name: 'MerchantCash',
    meta: {
      icon: 'el-icon-bank-card'
    },
    children: [
      {
        path: 'service-apply-for',
        component: () => import('@/views/merchant-cash/service-apply-for'),
        name: 'serviceApplyFor',
        meta: { title: '提现申请' }
      }
    ]
  },

  // ...tenantManager,
  // ...merchantAgent,
  // ...merchantManage,
  // ...serviceAgentManager,
  // ...serviceManager,

  // ...cashManage,
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: '对接文档', icon: 'link' }
  //     }
  //   ]
  // },
  // ...gCodeTools,

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
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
