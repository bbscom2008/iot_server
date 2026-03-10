import Cookies from 'js-cookie'

import store from '@/store'

const TokenKey = 'Platform-Manage-Token'
const TokenHeadKey = 'Platform-Manage-TokenHead'

const BindGoogleCodeKey = 'Platform-Manage-BindGoogleCodeKey-fsdffssrwerw'

const IsChangePasswordKey = 'Platform-Manage-isChangePassword-fsdffssrwerw'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getBindGoogleCode() {
  return Cookies.get(BindGoogleCodeKey)
}
export function bindGoogleCode(value) {
  return Cookies.set(BindGoogleCodeKey, value)
}

export function removeBindGoogleCode() {
  return Cookies.remove(BindGoogleCodeKey)
}



export function isChangePwd() {
  return Cookies.get(IsChangePasswordKey)
}
export function setChangePwd() {
  return Cookies.set(IsChangePasswordKey, true)
}
export function removeChangePwd() {
  return Cookies.remove(IsChangePasswordKey)
}






export function getTokenHead() {
  return Cookies.get(TokenHeadKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setTokenHead(tokenHead) {
  return Cookies.set(TokenHeadKey, tokenHead)
}

export function removeToken() {
  removeChangePwd()
  removeBindGoogleCode()


  // 删除 仓库中的数据
  store.state.user.userName=''
  store.state.user.tenantId=''
  store.state.user.tokenInfo=''
  store.state.userAccount.userId=''
  store.state.tenant.currTenantId=''
  store.state.tenant.selectTenantId=''
  store.state.tenant.selectTenantId=''
  store.state.userAccount.availableBalance=''
  store.state.userAccount.freezeBalance=''



  return Cookies.remove(TokenKey)
}
export function removetokenHead() {
  return Cookies.remove(TokenHeadKey)
}
