# 商户余额查询

通过该接口查询商户余额

> 接口说明

请求URL：https://xxxxxx/order/api/v1/merchant

请求方式：`POST`

请求类型：`application/json`

> 请求参数

| 字段名     | 变量名     | 必填 | 类型        | 示例值                           | 描述       |
| ---------- | ---------- | ---- | ----------- | -------------------------------- | ---------- |
| 商户号     | merchantNo | 是   | String(128) | QlJPKSymSC2O                     | 商户号     |
| 请求时间戳 | timestamp  | 是   | long(13)    | 1749710334000                    | 请求时间戳 |
| 签名       | sign       | 是   | String      | 6C914BB42578C6C8059BC17B1CEE48DC | 签名值     |

```
请求示例数据
{
  "sign": "46940C58B2F3AE426B77A297ABF4D31E",
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

| 字段名       | 变量名           | 必填 | 类型        | 示例值                           | 描述                                    |
| ------------ | ---------------- | ---- | ----------- | -------------------------------- | --------------------------------------- |
| 商户号       | merchantNo       | 是   | String(128) | QlJPKSymSC2O                     | 商户号                                  |
| 请求时间戳   | timestamp        | 是   | long(13)    | 1749710334000                    | 请求时间戳                              |
| 签名         | sign             | 是   | String      | 6C914BB42578C6C8059BC17B1CEE48DC | 签名值                                  |
| 商户用户名   | merchantUserName | 是   | string      | merchantTest01                   | 商户用户名                              |
| 商户是否可用 | status           | 是   | integer     | 1 可用   0  不可用               | 商户是否可用                            |
| 可用余额     | availableBalance | 是   | BigDecimal  | 100                           | 可用余额，单位为元，最多精确到小数点后2位   |
| 冻结金额     | freezeBalance    | 是   | BigDecimal  | 100                           | 冻结金额，单位为元，最多精确到小数点后2位   |
| 预付款金额   | collectDeposit   | 是   | BigDecimal  | 100                           | 预付款金额，单位为元，最多精确到小数点后2位 |

```
返回示例数据
{
  "code": "00000",
  "data": {
    "merchantNo": "QlJPKSymSC2O",
    "timestamp": 1749710334000,
    "sign": "6C914BB42578C6C8059BC17B1CEE48DC",
    "merchantUserName": "merchantTest01",
    "status": 0,
    "availableBalance": 100,
    "freezeBalance": 100,
    "collectDeposit": 100
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

