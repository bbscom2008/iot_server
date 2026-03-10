import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

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
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: '首页',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: '首页', icon: 'dashboard' }
  //   }]
  // },

  {
    path: "/",
    component: Layout,
    redirect: "/api-rule",
    children: [
      {
        path: "api-rule",
        name: "ApiRule",
        component: () => import("@/views/doc/md-view"),
        meta: { title: "接口规则", icon: "el-icon-notebook-2" },
      },
    ],
  },
  {
    path: "/payment-api",
    component: Layout,
    children: [
      {
        path: '',
        name: 'payment-api',
        component: () => import('@/views/doc/md-view'),
        meta: { title: '代收支付接口', icon: 'el-icon-notebook-2' }
      },

    ],
  },
  {
    path: "/transfer-api",
    component: Layout,
    children: [
      {
        path: '',
        name: 'transfer-api',
        component: () => import('@/views/doc/md-view'),
        meta: { title: '代付支付接口', icon: 'el-icon-notebook-2' }
      },
    ],
  },
   {
    path: "/merchant-api",
    component: Layout,
    children: [
      {
        path: '',
        name: 'merchant-api',
        component: () => import('@/views/doc/md-view'),
        meta: { title: '商户查询接口', icon: 'el-icon-notebook-2' }
      },
    ],
  },

   {
    path: "/all-api",
    component: Layout,
    children: [
      {
        path: '',
        name: 'all-api',
        component: () => import('@/views/doc/md-view'),
        meta: { title: '完整接口', icon: 'el-icon-notebook-2' }
      }
    ],
  },



  // {
  //   path: '/doc',
  //   component: Layout,
  //   redirect: '/doc/api-rule',
  //   name: 'Example',
  //   meta: { title: '接口文档', icon: 'el-icon-reading' },
  //   children: [
  //     {
  //       path: 'api-rule',
  //       name: 'ApiRule',
  //       component: () => import('@/views/doc/md-view'),
  //       meta: { title: '接口规则', icon: 'el-icon-notebook-2' }
  //     },
  //     {
  //       path: 'payment-api',
  //       name: 'Tree',
  //       component: () => import('@/views/doc/md-view'),
  //       meta: { title: '代收支付接口', icon: 'el-icon-notebook-2' }
  //     },
  //     {
  //       path: 'transfer-api',
  //       name: 'Tree',
  //       component: () => import('@/views/doc/md-view'),
  //       meta: { title: '代付支付接口', icon: 'el-icon-notebook-2' }
  //     },
  //     {
  //       path: 'all-api',
  //       name: 'Tree',
  //       component: () => import('@/views/doc/md-view'),
  //       meta: { title: '完整接口', icon: 'el-icon-notebook-2' }
  //     }

  //   ]
  // },

  // {
  //   path: '/demo',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Demo',
  //       component: () => import('@/views/demo/index'),
  //       meta: { title: 'demo下载', icon: 'el-icon-download' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/all-api", hidden: true },
];

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
