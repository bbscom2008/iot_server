// ^(?=.*[a-zA-Z])[a-zA-Z\d]{6,20}$

// ^(?=.*[a-zA-Z])[a-zA-Z\d]{6,20}$

/**
 * 密码的规则
 */
export const passwordPattern = {
  pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
  message: '密码必须包含至少一个字母、一个数字，长度在8到20个字符之间',
  trigger: 'blur'
}

/**
 * 用户名的规则
 */
export const userNameValidate = [
  { required: false, message: '请输入账号', trigger: 'blur' }
  // { pattern: /^[a-zA-Z][a-zA-Z0-9]{5,19}$/, message: '以字母开头,数字、字母6到20 位', trigger: 'blur' },
]

/**
 * 伲称 的规则
 */
export const userNickNameRules = [
  // { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,32}$/, message: '最长32个字符，不能有特殊符号', trigger: 'blur' }
]

/**
 * 所有名称的规则
 */
export const accountRules = [
  // {
  //   pattern: /^[a-zA-Z][a-zA-Z0-9]{0,31}$/,
  //   message: '以字母开头，数字、字母1到32 位',
  //   trigger: 'blur'
  // }
]

/**
 *  网址校验
 */
export const urlRules = [
  // {
  //   pattern:
  //     /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/,
  //   message: 'url不符合规则 ',
  //   trigger: 'blur'
  // }
]

/**
 *  网址校验
 */
export const countRules = [{ pattern: /^[1-9]\d*$/, message: '大于0的正整数', trigger: 'blur' }]

// 正整数
export const weightCheck = (rule, value, callback) => {
  if (String(value).includes('.')) {
    return callback(new Error('不能有小数点'))
  }

  if (value <= 0 || value > 10) {
    return callback(new Error('必须是 1- 10 之前的数字'))
  }
  callback()
}

/**
 * 对百分比的校验
 * @returns
 */
export const rateCheck = (rule, value, callback) => {
  if (String(value).trim() == '') {
    return callback(new Error('请输入比例'))
  }

  if (value <= -100 || value >= 100) {
    return callback(new Error('比例范围为-100到100'))
  }

  if (String(value).includes('.') && String(value).split('.')[1].length > 2) {
    return callback(new Error('小数点后只能保留两位'))
  }

  callback()
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 角色编码验证规则
 */
export const rulesCode = [
  {
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{2,32}$/,
    message: '至少一个字母、一个数字，长度2 到 32个字符',
    trigger: 'blur'
  }
]
/**
 * 角色名称验证规则---名称
 */
export const rulesName = [
  { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,32}$/, message: '长度在 1 到 32 个字符', trigger: 'blur' }
]
/**
 * 账号验证规则---账号
 */
export const userName = [
  {
    pattern: /^(?=.*[a-zA-Z])[a-zA-Z\d]{6,20}$/,
    message: '至少包含一个字母、允许有数字、允许纯字母、长度在6 到 20个字符之间',
    trigger: 'blur'
  }
]
/**
 * 交易密码
 */
export const tradePassword = [
  {
    pattern: /^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d]{8,20}$/,
    message: '至少包含一个字母、允许有数字、允许纯字母、长度在6 到 20个字符之间',
    trigger: 'blur'
  }
]
/**
 * 交易密码
 */
export const tradePwd = [
  {
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
    message: '至少包含一个字母、允许有数字、允许纯字母、长度在8 到 20个字符之间',
    trigger: 'blur'
  }
]
/**
 * 谷歌验证码
 */
export const googleCode = [
  { pattern: /^[0-9]{6}$/, message: '谷歌验证码必须是6位数字', trigger: 'blur' }
]

const javaLongCheck = (rule, value, callback) => {
  if (!value || String(value).trim().length == 0) {
    return callback()
  }

  // 检查输入是否为纯数字字符串
  if (/^[1-9]\d*$/.test(value)) {
    const inputBigInt = BigInt(value)
    const javaLongMax = 9223372036854775807n

    if (inputBigInt < javaLongMax) {
      return callback()
    } else {
      return callback(new Error('输入不正确, 超出限制'))
    }
  } else {
    return callback(new Error('必须是数字'))
  }
}

// 正整数类型 最大是 java 中的 long 类型的最大值
export const integerRules = { validator: javaLongCheck, trigger: 'blur' }
/**
 * 金额校验
 */
export const amountCheck = (rule, value, callback) => {
  if (!value || String(value).trim() == '') {
    return callback()
  }

  // if (!/^[1-9]\d*$/.test(value)) {
  //   return callback(new Error('必须是数字'))
  // }

  // if (value <= 0) {
  //   return callback(new Error('必须大于0'))
  // } else
  if (String(value).includes('.') && String(value).split('.')[1].length > 2) {
    return callback(new Error('小数点后只能保留两位'))
  }
  //  else if (value > 10000000 || value < -10000000) {
  //   return callback(new Error('超出限制，最大1000万，最小 -1000万'))
  // }
  else {
    callback()
  }
}

export const amountCheckRule = { validator: amountCheck, trigger: 'blur' }

/**
 * 提现金额校验，变动金额校验
 */
export const changeAmount = (rule, value, callback) => {
  if (!value || String(value).trim() == '') {
    return callback()
  }
  const reg = /^\d+(\.\d+)?$/

  // if (!reg.test(value)) {
  //   return callback(new Error('必须是正数，保留两位小数'))
  // }

  // if (value <= 0) {
  //   return callback(new Error('必须大于0'))
  // }
  //  else
  if (String(value).includes('.') && String(value).split('.')[1].length > 2) {
    return callback(new Error('小数点后只能保留两位'))
  }
  //  else if (value > 1000000 || value < -1000000) {
  //   return callback(new Error('金额超出限制'))
  // }
  else {
    callback()
  }
}

