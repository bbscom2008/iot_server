/**
 * 用户名的规则
 */
export const userNameRule = {
  validateFunction: (rule, value, data, callback) => {
    
    // if (!/^[a-zA-Z][a-zA-Z0-9]{5,19}$/.test(value)) {
    //   return callback('用户名必须以字母开头，6-20位字母和数字')
    // }
    return callback()// 等价于 callback()
  }
}

/**
 * 用户名的规则
 */
export const userNickNameRule = {
  validateFunction: (rule, value, data, callback) => {
    // if (!/^[\u4e00-\u9fa5a-zA-Z0-9]{1,32}$/.test(value)) {
    //   callback('最长 32 个字符，不能有特殊符号')
    // }
    return true // 等价于 callback()
  }
}

/**
 * 大于等于 0 的正整数校验
 */
export const countRules2 = {
  validateFunction: (rule, value, data, callback) => {
    console.log('--value---', value);
    if (String(value).includes('.')) {
     return callback('不能有小数点')
    }
    if (Number(value) > 100000) {
     return callback('最大 100000')
    }
    if (Number(value) < 0) {
     return callback('不能小于0')
    }
    return callback()
  }
}


/**
 * 费率校验   -100   100
 */
export const rateRule = {
  validateFunction: (rule, value, data, callback) => {
    console.log('----rateRule-----', value)


    if (!/^[-]?\d*\.?\d+$/.test(value)) {
      callback('格式不正确，必须是数字')
    }

    if (String(value).includes('.') && String(value).split('.')[1].length > 2) {
      callback('小数点后只能保留两位')
    } else if (value >= 100 || value <= -100) {
      callback('必须在-100至100之间')
    }
    return true
  }
}

/**
 *   群组ID   中间   逗号
 */
export const groupIdListRule = {
  validateFunction: (rule, value, data, callback) => {
    console.log('----groupIdListRuleRule-----', value)
    if (String(value).trim() == '') {
      return callback()
    }
    if (String(value).includes(' ')) {
      return callback('不能有空格')
    }
    if (String(value).includes('，')) {
      return callback('不能有中文逗号')
    }
    const amounts = String(value).split(',')

    if (new Set(amounts).size !== amounts.length) {
      return callback('不能有重复的ID')
    }
    for (let i = 0; i < amounts.length; i++) {
      const amount = amounts[i]

      // 判断是否是数据
      if (!/^-([0-9]+)$/.test(amount)) {
        return callback('ID必须为带负号数字')
      }
    }
    return callback()
  }
}

/**
 *   群组ID   中间   逗号
 */
export const authIdListRule = {
  validateFunction: (rule, value, data, callback) => {
    console.log('----authIdListRule-----', value)
    if (String(value).trim() == '') {
      return callback()
    }
    if (String(value).includes(' ')) {
      return callback('不能有空格')
    }
    if (String(value).includes('，')) {
      return callback('不能有中文逗号')
    }
    const amounts = String(value).split(',')

    if (new Set(amounts).size !== amounts.length) {
      return callback('不能有重复的ID')
    }
    for (let i = 0; i < amounts.length; i++) {
      const amount = amounts[i]

      // 判断是否是数据
      if (!/^([0-9]+)$/.test(amount)) {
        return callback('ID必须为数字')
      }
    }
    return callback()
  }
}


/**
 * 固定金额校验,  如果有多个金额,中间写 逗号
 */
export const fixedAmountCheckRule = {
  validateFunction: (rule, value, data, callback) => {
    console.log('----fixedAmountCheckRule-----', value)

    if (String(value).trim() == '') {
      return callback()
    }
    if (String(value).includes(' ')) {
      return callback('不能有空格')
    }

    if (String(value).includes('，')) {
      return callback('不能有中文逗号')
    }

    const amounts = String(value).split(',')

    if (new Set(amounts).size !== amounts.length) {
      return callback('不能有重复的金额')
    }

    for (let i = 0; i < amounts.length; i++) {
      const amount = amounts[i]

      if (String(amount).startsWith('0')) {
        return callback('输入错误，不能以0开头')
      }

      // 判断是否是数据
      if (!/^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(amount)) {
        return callback('必须是数字和逗号')
      }

      if (String(amount).includes('.')) {
        return callback('固定金额不能有小数点')
      }

      if (Number(amount) > 1000000 || Number(amount) <= 0) {
        return callback('必须在 1 到 100万 之间')
      }
    }
    return callback()
  }
}

/**
 * 当日最大订单数
 */
export const dailyMaxCountRule = {
  validateFunction: (rule, value, data, callback) => {
    console.log('----amountCheck-----', value)

    if (!/^[-]?\d*\.?\d+$/.test(value)) {
      callback('格式不正确，必须是数字')
    }

    if (value <= 0) {
      return callback(new Error('必须大于0'))
    } else if (String(value).includes('.')) {
      callback('不能有小数点')
    } else if (value > 10000) {
      callback('最大1万')
    }
    return true
  }
}

/**
 * 金额校验
 */
export const amountCheck = {
  validateFunction: (rule, value, data, callback) => {
    console.log('----amountCheck-----', value)

    // if (!value || String(value).trim() == "") {
    //   return true;
    // }

    if (!/^[-]?\d*\.?\d+$/.test(value)) {
      callback('格式不正确，必须是数字')
    }

    // if (value <= 0) {
    //   return callback(new Error('必须大于0'))
    // } else
    if (String(value).includes('.') && String(value).split('.')[1].length > 2) {
      callback('小数点后只能保留两位')
    } else if (value > 1000000 || value < -1000000) {
      callback('金额最大100万，最小-100万')
    }
    return true
  }
}

export const passwordRule = {
  validateFunction: (rule, value, data, callback) => {
    if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/.test(value)) {
      callback('密码必须包含字母和数字，8-20位')
    }
    return true
  }
}

export const googleCodeRule = {
  validateFunction: (rule, value, data, callback) => {
    console.log('--googleCodeRule---', value)

    if (String(value).trim() == '') {
      return true
    }

    if (!/^[0-9]{6}$/.test(value)) {
      callback('谷歌密钥必须是6位数字')
    }
    return true
  }
}

/**
 * 正整数，最大值为  java 中的 long 类型
 */
export const integerRule = {
  validateFunction: (rule, value, data, callback) => {
    console.log('----integerRule-----', value)

    // if (!value || String(value).trim().length == 0) {
    // 	return true
    // }

    // // 检查输入是否为纯数字字符串
    if (/^[1-9]\d*$/.test(value)) {
      const inputBigInt = BigInt(value)
      const javaLongMax = 9223372036854775807n

      if (inputBigInt < javaLongMax) {
        return true
      } else {
        callback('输入不正确, 超出限制')
      }
    } else {
      callback('必须是数字')
    }

    return true
  }
}