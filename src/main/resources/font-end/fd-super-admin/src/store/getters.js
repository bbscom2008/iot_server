const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  
  roles: state => state.user.roles,

  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  user:state=>state.user.userId,
  userId:state => state.user.userInfo.userId,
  tenantList: state => state.tenant.tenantList,
  tenantId: state => state.tenant.currTenantId,
  selectTenantId: state => state.tenant.selectTenantId, // 下拉框中的 平台 ID
  
}
export default getters
