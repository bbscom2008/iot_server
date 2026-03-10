import Cookies from 'js-cookie'

const TokenKey = 'Merchant-Token'
const TokenHeadKey = 'Merchant-TokenHead'

const BindGoogleCodeKey = 'Merchant-BindGoogleCodeKey-fsdffssrwerw'

const IsChangePasswordKey = 'Merchant-isChangePassword-fsdffssrwerw'

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
  return Cookies.remove(TokenKey)
}
export function removetokenHead() {
  return Cookies.remove(TokenHeadKey)
}
