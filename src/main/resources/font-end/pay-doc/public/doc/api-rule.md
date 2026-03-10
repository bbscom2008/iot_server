# 接口规则

## 协议规则

传输方式：`HTTPS`
提交方式：`POST`
内容类型：`application/json`
字符编码：`UTF-8`
签名算法：`MD5`
超时时间：`60秒`



## 参数规范

交易金额：默认为人民币交易，单位为元，最多保留到小数点后2位。

## 签名算法

```
签名生成的通用步骤如下
```

***第一步：*** 设所有发送或者接收到的数据为集合M，将集合M内`非空`参数值的参数按照参数名ASCII码从小到大排序（字典序），使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串stringA。
特别注意以下重要规则：

- 参数名ASCII码从小到大排序（字典序）；
- 如果参数的值为空不参与签名；
- 参数名区分大小写；
- 验证调用返回或支付中心主动通知签名时，传送的sign参数不参与签名，将生成的签名与该sign值作校验。


***第二步：*** 在stringA最后拼接上key `[即 StringA +"&key=" + 私钥 ]` 得到stringSignTemp字符串，并对stringSignTemp进行MD5运算，再将得到的字符串所有字符转换为大写，得到sign值signValue。

如请求支付系统参数如下：

```
Map signMap = new HashMap<>();
signMap.put("channelCode", "1001");
signMap.put("merchantOrderNo", "QlJPKSymSC2O");
signMap.put("orderAmount", 100);
signMap.put("merchantNo", "abcd");
signMap.put("notifyUrl", "https://www.baidu.com");
signMap.put("extParam", "拓展参数(可空)");
signMap.put("timeStamp", 1234567891011(13位));
```

`待签名值`：
channelCode=1001&merchantOrderNo=QlJPKSymSC2O&orderAmount=100&merchantNo=abcd&notifyUrl=[https://www.baidu.com](https://www.baidu.com/)&extParam=''&timeStamp=1234567891011&key=sxedcrfvtgbujm

`签名结果`：1689B66D95B7CBB92A77A337BE59AAB1

`最终请求支付系统参数`：
channelCode=1001&merchantOrderNo=QlJPKSymSC2O&orderAmount=100&merchantNo=abcd&notifyUrl=[https://www.baidu.com](https://www.baidu.com/)&extParam=''&timeStamp=1234567891011&sign=1689B66D95B7CBB92A77A337BE59AAB1

## 全局异常

- U0001：用户请求失败
- B0001：业务处理失败

文档更新时间: 2025-06-10 18:00
