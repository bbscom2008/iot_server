# 代收支付接口

## 统一下单

商户业务系统通过统一下单接口发起支付收款订单，支付网关会根据商户配置的支付通道路由支付通道完成支付下单。支付网关根据不同的支付方式返回对应的支付参数，业务系统使用支付参数发起收款。

> 接口说明

请求URL：https://xxxxxx/order/api/v1/collectOrder/create

请求方式：`POST`

请求类型：`application/json`

> 请求参数

| 字段名       | 变量名          | 必填 | 类型        | 示例值                           | 描述                                                     |
| ------------ | --------------- | ---- | ----------- | -------------------------------- | -------------------------------------------------------- |
| 商户号       | merchantNo      | 是   | String(128) | QlJPKSymSC2O                     | 商户号                                                   |
| 请求时间戳   | timestamp       | 是   | long(13)    | 1749710334000                    | 请求时间戳                                               |
| 签名         | sign            | 是   | String(128) | C380BEC2BFD727A4B6845133519F3AD6 | 签名值                                                   |
| 通道编码     | channelCode     | 是   | String(128) | tdasdfasdf                       | 通道编码                                                 |
| 商户订单号   | merchantOrderNo | 是   | String(128) | 20160427210604000490             | 商户订单号                                               |
| 订单金额     | orderAmount     | 是   | BigDecimal  | 100                           | 单位为元，精确最多到小数点后2位                              |
| 异步通知地址 | notifyUrl       | 是   | String      | https://www.baidu.com/notify.htm | 支付结果异步回调URL,只有传了该值才会发起回调             |
| 跳转通知地址 | returnUrl       | 否   | String      | https://www.baidu.com/return.htm | 支付结果同步跳转通知URL                                  |
| 付款人姓名   | payerName       | 否   | String      | 张三                             | 付款人的名称                                             |
| 付款人IP     | payerIp         | 否   | String      | 127.0.0.1                        | 付款人的IP                                               |
| 扩展参数     | extParam        | 否   | String(512) | 134586944573118714               | 商户扩展参数，字符串或者JSON格式字符串，回调时会原样返回 |

```
请求示例数据
{
  "merchantNo": "nMBYzKWDMz5N",
  "timestamp": 1748600910000,
  "sign": "1111",
  "channelCode": "tdasdfasdf",
  "merchantOrderNo": "mab15cenumbe",
  "orderAmount": 100,
  "notifyUrl": "https://www.baidu.com",
  "returnUrl": "https://www.baidu.com/return.htm",
  "payerName": "张三",
  "payerIp": "127.0.0.1",
  "extParam": "134586944573118714"
}
```

> 返回参数

| 字段名          | 变量名  | 必填 | 类型        | 示例值                                     | 描述                                   |
| --------------- | ------- | ---- | ----------- | ------------------------------------------ | -------------------------------------- |
| 响应状态码      | code    | 否   | string      | 00000                                      | 00000为成功，其他-处理有误，详见错误码 |
| 响应信息        | message | 否   | String(128) | 处理成功!                                  | 响应的结果信息                         |
| 返回数据        | data    | 否   | object      | {}                                         | 返回响应数据                           |
| traceId日志排查 | traceId | 否   | string      | 2025-06-12 14:51:36KdCrbTDYh6tFtQb8 server | traceId日志排查                        |

```
data数据格式
```

| 字段名                   | 变量名          | 必传 | 类型        | 示例值                                                       | 描述                                                     |
| ------------------------ | --------------- | ---- | ----------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| 商户号                   | merchantNo      | 是   | String(128) | QlJPKSymSC2O                                                 | 商户号                                                   |
| 请求时间戳               | timestamp       | 是   | long(13)    | 1749710334000                                                | 请求时间戳                                               |
| 签名                     | sign            | 是   | String      | 6C914BB42578C6C8059BC17B1CEE48DC                             | 签名值                                                   |
| 通道编码                 | channelCode     | 否   | string      | td                                                           | 通道编码                                                 |
| 系统订单号               | systemOrderNo   | 否   | long        | 4580221161868350593                                          | 返回订单的系统订单号                                     |
| 商户订单号               | merchantOrderNo | 否   | String(128) | 20160427210604000490                                         | 返回订单的商户订单号                                     |
| 订单金额                 | orderAmount     | 是   | BigDecimal  | 100                                                       | 单位为元，最多精确到小数点后2位                              |
| 订单状态                 | orderStatus     | 是   | integer     | 订单状态  0-已生成、1-待接单、2-已接单、3-已成功、4-已取消、5-已超时、6-高危订单、7-渠道订单失败、8-匹配失败 | 订单创建成功后的订单状态                                 |
| 订单状态说明             | orderStatusDesc | 否   | String      | 已生成                                                       | 订单状态说明                                             |
| 收款信息                 | payData         | 否   | string      | 银行卡卡号 :12313121312312323 ，姓名：张三                   | 订单创建后，匹配成功后获取收款信息                       |
| 收银台地址<br />收款信息 | cashPageUrl     | 否   | string      | www.shouyintai.com/E7YZdSX1oVGs9h4rptxUZPFSpHmBXfBo4fPFoGdUjTI | 收银台地址<br/>收款信息                                  |
| 支付成功跳转地址URL      | returnUrl       | 否   | string      | https://www.baidu.com/return.htm                             | 支付成功跳转地址URL                                      |
| 扩展参数                 | extParam        | 否   | String(512) | 134586944573118714                                           | 商户扩展参数，字符串或者JSON格式字符串，回调时会原样返回 |


```
返回示例数据
{
    "code": "00000",
    "message": "success",
    "data": {
        "merchantNo": "QlJPKSymSC2O",
        "timestamp": 1749710334000,
        "sign": "6C914BB42578C6C8059BC17B1CEE48DC",
        "channelCode": "td",
        "systemOrderNo": 4580221161868350593,
        "merchantOrderNo": "20160427210604000490",
        "orderAmount": 100,
        "orderStatus": 0,
        "orderStatusDesc": "已生成",
        "payData": "银行卡卡号:12313121312312323，姓名：张三",
        "cashPageUrl": "www.shouyintai.com/E7YZdSX1oVGs9h4rptxUZPFSpHmBXfBo4fPFoGdUjTI",
        "returnUrl": "https://www.baidu.com/return.htm",
        "extParam": "134586944573118714",
        
    },
    "traceId": "2025-06-12 14:51:36KdCrbTDYh6tFtQb8 server"
}
```

## 代收订单通知

1、回调接口由对接方自定义配置，下单时传入（下单未携带回调地址则不会触发回调通知）
2、对接方接收回调后需返回字符串”success“，如未返回或返回其他信息，回触发补偿机制，自动重试三次通知

> 接口说明

请求URL：该链接是通过统一下单接口提交的参数notifyUrl设置，如果无法访问链接，商户系统将无法接收到支付中心的通知。

请求方式：`POST`

请求类型：`application/json`

> 通知参数

| 字段名     | 变量名          | 必传 | 类型        | 示例值                                                       | 描述                                                     |
| ---------- | --------------- | ---- | ----------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| 系统订单号 | systemOrderNo   | 是   | Long        | 12021022311124442600                                         | 返回支付系统订单号                                       |
| 商户号     | merchantNo      | 是   | String(128) | QlJPKSymSC2O                                                 | 商户号                                                   |
| 商户订单号 | merchantOrderNo | 是   | String(128) | 20160427210604000490                                         | 返回商户传入的订单号                                     |
| 订单金额   | orderAmount     | 是   | BigDecimal  | 100                                                       | 单位为元，最多精确到小数点后2位                              |
| 实付金额   | paidAmount      | 是   | BigDecimal  | 99.99                                                        | 单位为元，最多精确到小数点后2位                              |
| 订单状态   | orderStatus     | 是   | int         | 订单状态  0-已生成、1-待接单、2-已接单、3-已成功、4-已取消、5-已超时、6-高危订单、7-渠道订单失败、8-匹配失败 | 订单状态                                                 |
| 时间戳     | timestamp       | 是   | long(13)    | 1749710334000                                                | 时间戳                                                   |
| 拓展参数   | extParam        | 否   | String(512) | 134586944573118714                                           | 商户扩展参数，字符串或者JSON格式字符串，回调时会原样返回 |
| 签名       | sign            | 是   | String(32)  | C380BEC2BFD727A4B6845133519F3AD6                             | 签名值，详见签名算法                                     |


> 返回结果

业务系统处理后同步返回给支付中心，返回字符串`success`则表示成功，返回非success则表示处理失败，支付中心会再次通知业务系统。（通知频率为0/30/60/300/600/1800/3600,单位：秒）

```
注意：返回的字符串必须是小写，且前后不能有空格和换行符。
通知示例数据
{
    "orderAmount": 100,
    "merchantNo": "QlJPKSymSC2O",
    "paidAmount": 99.99,
    "systemOrderNo": "12021022311124442600",
    "merchantOrderNo": "20160427210604000490",
    "orderStatus": 1,
    "timestamp": 1749440692831,
    "extParam": "134586944573118714",
    "sign": "C380BEC2BFD727A4B6845133519F3AD6"
}
```

## 查询代收订单

商户通过该接口查询订单，支付网关会返回订单最新的数据

> 接口说明

请求URL：https://xxxxxx/order/api/v1/collectOrder/queryCollectOrder

请求方式：`POST`

请求类型：`application/json`

> 请求参数

| 字段名     | 变量名          | 必填 | 类型        | 示例值                           | 描述               |
| ---------- | --------------- | ---- | ----------- | -------------------------------- | ------------------ |
| 商户号     | merchantNo      | 是   | String(128) | QlJPKSymSC2O                     | 商户号             |
| 请求时间戳 | timestamp       | 是   | long(13)    | 1749710334000                    | 请求时间戳         |
| 签名       | sign            | 是   | String      | 6C914BB42578C6C8059BC17B1CEE48DC | 签名值             |
| 商户订单号 | merchantOrderNo | 是   | String(30)  | 20160427210604000490             | 创建订单时的商户号 |


```
请求示例数据
{
  "sign": "46940C58B2F3AE426B77A297ABF4D31E",
  "merchantOrderNo": "mho1621934803068",
  "merchantNo": "QlJPKSymSC2O",
  "timestamp": "1749710334000"
}
```

| 字段名          | 变量名  | 必填 | 类型        | 示例值                                     | 描述                                   |
| --------------- | ------- | ---- | ----------- | ------------------------------------------ | -------------------------------------- |
| 响应状态码      | code    | 否   | string      | 00000                                      | 00000为成功，其他-处理有误，详见错误码 |
| 响应信息        | message | 否   | String(128) | 处理成功!                                  | 响应的结果信息                         |
| 返回数据        | data    | 否   | object      | {}                                         | 返回响应数据                           |
| traceId日志排查 | traceId | 否   | string      | 2025-06-12 14:51:36KdCrbTDYh6tFtQb8 server | traceId日志排查                        |

```
data数据格式
```

| 字段名     | 变量名           | 必传 | 类型        | 示例值                                                       | 描述                        |
| ---------- | ---------------- | ---- | ----------- | ------------------------------------------------------------ | --------------------------- |
| 商户号     | merchantNo       | 是   | String(128) | QlJPKSymSC2O                                                 | 商户号                      |
| 请求时间戳 | timestamp        | 否   | long(13)    | 1749710334000                                                | 请求时间戳                  |
| 签名       | sign             | 是   | String      | 6C914BB42578C6C8059BC17B1CEE48DC                             | 签名值                      |
| 通道编码   | channelCode      | 否   | String(32)  | 10001                                                        | 通道编码                    |
| 系统订单号 | systemOrderNo    | 否   | long        | 4580221161868350593                                          | 返回订单的系统订单号        |
| 商户订单号 | merchantOrderNo  | 否   | String(128) | 20160427210604000490                                         | 返回订单的商户订单号        |
| 订单金额   | orderAmount      | 否   | BigDecimal  | 100                                                       | 单位为元，最多精确到小数点后2位 |
| 实付金额   | payAmount        | 是   | BigDecimal  | 99.99                                                        | 单位为元，最多精确到小数点后2位 |
| 订单状态   | orderStatus      | 是   | integer     | 订单状态  0-已生成、1-待接单、2-已接单、3-已成功、4-已取消、5-已超时、6-高危订单、7-渠道订单失败、8-匹配失败 | 订单创建成功后的订单状态    |
| 状态说明   | orderStatusDesc  | 否   | string      | 已生成                                                       | 订单状态说明                |
| 通知状态   | notifyStatus     | 否   | integer     | 1                                                            | 订单通知状态                |
| 状态说明   | notifyStatusDesc | 否   | string      | 通知成功                                                     | 订单通知状态说明            |
| 收款信息   | payData          | 否   | string      | "{\"姓名\":\"李国庆\",\"银行\":\"中国银行\",\"卡号\":\"88888888888888888888\"}" | 收款信息                    |
| 过期时间   | expiredTime      | 否   | string      | 2024-10-10 12:30:00                                          | 订单过期时间                |

```
返回示例数据
{
  "code": "00000",
  "data": {
    "merchantNo": "QlJPKSymSC2O",
    "timestamp": "1749710334000",
    "sign": "46940C58B2F3AE426B77A297ABF4D31E",
    "channelCode": "20001",
    "systemOrderNo": "4580221161868350593",
    "merchantOrderNo": "20160427210604000490",
    "orderAmount": 100,
    "orderStatus": 0,
    "orderStatusDesc": "已生成",
    "payAmount": 99.99,
    "notifyStatus": 1,
    "notifyStatusDesc": "通知成功",
    "payData": ""{"姓名":"李国庆","银行":"中国银行","卡号":"88888888888888888888"}"",
    "expiredTime": "2024-10-10 12:30:00"
  },
  "message": "success",
  "traceId": "2025-06-12 14:51:36KdCrbTDYh6tFtQb8 server"
}
```

## 返回码

| code  | 描述                          |
| ----- | ----------------------------- |
| 00000 | 成功                          |
| S0001 | 异常，具体错误详见message字段 |

------

文档更新时间: 2025-06-10 18:00

# 