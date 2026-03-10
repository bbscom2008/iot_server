

/**
 * 永久存储的内容
 */

const TokenKey = 'Admin-Token'
const TokenHeadKey = 'Admin-TokenHead'

const BindGoogleCodeKey = 'weuhweurysdf-BindGoogleCodeKey-fsdffssrwerw'

const IsChangePasswordKey = 'weuhweurysdf-isChangePassword-fsdffssrwerw'

export function getToken() {
  const token = uni.getStorageSync(TokenKey)
  return token
}

export function getBindGoogleCode() {
	
  return uni.getStorageSync(BindGoogleCodeKey)
}
export function bindGoogleCode(value) {
  return uni.setStorageSync(BindGoogleCodeKey, value)
}

export function removeBindGoogleCode() {
  return uni.removeStorageSync(BindGoogleCodeKey)
}



export function isChangePwd() {
  return uni.getStorageSync(IsChangePasswordKey)
}
export function setChangePwd() {
  return uni.setStorageSync(IsChangePasswordKey, true)
}
export function removeChangePwd() {
  return uni.removeStorageSync(IsChangePasswordKey)
}



export function getTokenHead() {
  return uni.getStorageSync(TokenHeadKey)
}

export function setToken(token) {
  return uni.setStorageSync(TokenKey, token)
}
export function setTokenHead(tokenHead) {
  return uni.setStorageSync(TokenHeadKey, tokenHead)
}

export function removeToken() {
  removeChangePwd()
  removeBindGoogleCode()
  return uni.removeStorageSync(TokenKey)
}
export function removetokenHead() {
  return uni.removeStorageSync(TokenHeadKey)
}
