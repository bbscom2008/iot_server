import Cookies from 'js-cookie'
import store from '@/store'
const TokenKey = 'Super-Admin-Token'
const TokenHeadKey = 'Super-Admin-TokenHead'

const BindGoogleCodeKey = 'Super-Admin-BindGoogleCodeKey'

const IsChangePasswordKey = 'Super-Admin-isChangePassword'

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

  store.state.user.tenantId = ''
  store.state.tenant.currTenantId = ''
  store.state.tenant.selectTenantId = ''
  store.state.user.userId = ''
  store.state.user.tokenInfo = ''


  removeBindGoogleCode()
  return Cookies.remove(TokenKey)
}
export function removetokenHead() {
  return Cookies.remove(TokenHeadKey)
}
