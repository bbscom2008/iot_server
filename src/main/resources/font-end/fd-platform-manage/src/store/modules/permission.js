import { asyncRoutes, constantRoutes } from '@/router'


import store from '@/store'



function isAdmin() {
  return store.state.user.tokenInfo.isPlatformAdmin
  // return true
}


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {

  if(route.path == "*"){
    return true  //   404 页面
  }

  let permission_code = ''
  if(route.path.startsWith('/')){
      permission_code= route.path.substring(1) 

      // 当前是个文件夹，如果，其中任意一个，有权限 ，那当前文件夹就有，
      if (route.children && route.children.length > 0) {

        for (let index = 0; index < route.children.length; index++) {
          const child = route.children[index];
         let isHave =  store.state.user.tokenInfo.permissionList.indexOf(child.path)
         if(isHave >=0){
            return true
         }
        }


      }

  }else{
    permission_code= route.path
  }


  let index = store.state.user.tokenInfo.permissionList.indexOf(permission_code)
  // if (route.meta && route.meta.roles) {
  //   return roles.some(role => route.meta.roles.includes(role))

  // } else {

  //   return true
  // }

  return index != -1 // 找到了，就是有权限
}

/**
 * 获得所当前的权限，，我们没有用 角色，，直接用 权限点判断 。
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }

    if (hasPermission(roles, tmp)) {

      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }

      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // if (roles.includes('admin')) {
      if (isAdmin()) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      console.log('---accessedRoutes--', JSON.stringify(accessedRoutes));
      
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
