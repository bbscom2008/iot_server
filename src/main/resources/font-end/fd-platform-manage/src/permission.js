import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getBindGoogleCode, isChangePwd } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/blank', '/login', '/auth-redirect', '/bindGoogleCode', '/changePassword', '/template-preview'] // no redirect whitelist

// router.beforeEach(async (to, from, next) => {
//   // start progress bar
//   NProgress.start()
//   const { roles } = await store.dispatch('user/getInfo')
//   const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
//   router.addRoutes(accessRoutes)
//   next()

// })

function isHaveDashBoardAuth() {
  // 不是管理员， 也没有首页的权限，

  if (
    !store.state.user.tokenInfo.isPlatformAdmin &&
    store.state.user.tokenInfo.permissionList.indexOf('dashboard') == -1
  ) {
    return false
  }

  return true
}

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  console.log('-----beforeEach----to.path---' + to.path)
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  const googleCode = getBindGoogleCode()

  if (hasToken && googleCode && isChangePwd()) {
    console.log('---router--1----' + to.path)
    // 是白名单，直接进
    if (whiteList.indexOf(to.path) !== -1) {
      console.log('---router--2----' + to.path)
      next()
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // console.log(store.getters.availableBalance,'store.getters.userAccount.availableBalance')
      // console.log(store.getters.freezeBalance,'store.getters.userAccount.freezeBalance')
      // 获得平台信息
      // if(!store.state.userAccount.availableBalance){
      store.dispatch('userAccount/getUserAccount')
      // }

      // console.log('---router--2----'+to.path);
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        console.log('---router--3----' + to.path)
        next()
      } else {
        console.log('---router--4----' + to.path)
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // 如果没有首页的权限，跳转到 空白页

          if (to.path == '/dashboard' && !isHaveDashBoardAuth()) {
            // 去第一个页面
            if (store.state.permission.addRoutes.length > 1) {
              next(store.state.permission.addRoutes[0].path)
            } else {
              console.log('---去  空白页------')
              next('/blank')
            }
          } else {
            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            // console.log('---router--5----'+to.path);
            next({ ...to, replace: true })
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          // next(`/login?redirect=${to.path}`)
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
