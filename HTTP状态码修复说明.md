# HTTP 状态码修复说明

## 🎯 问题说明

### 之前的问题 ❌

**现象：**
- 所有请求的 HTTP 状态码都是 **200 OK**
- 错误信息只在响应体的 `code` 字段中

**示例：**
```bash
curl -i -X GET http://localhost:8080/user/info \
  -H "Authorization: 过期的token"
```

**响应：**
```
HTTP/1.1 200 OK                           ← HTTP 状态码是 200
Content-Type: application/json

{
  "code": 401,                            ← 只有这里是 401
  "msg": "Token 已过期，请重新登录",
  "data": null
}
```

**问题：** 客户端无法通过 HTTP 状态码判断请求是否成功

---

## ✅ 修复方案

### 核心改动

#### 1. 全局异常处理器返回 `ResponseEntity`

**之前：**
```java
@ExceptionHandler(TokenExpiredException.class)
public ApiResponse<Void> handleTokenExpiredException(TokenExpiredException e) {
    return ApiResponse.error(401, e.getMessage());
}
```

**现在：**
```java
@ExceptionHandler(TokenExpiredException.class)
public ResponseEntity<ApiResponse<Void>> handleTokenExpiredException(TokenExpiredException e) {
    ApiResponse<Void> response = ApiResponse.error(401, e.getMessage());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
}
```

#### 2. 移除 Controller 中的 try-catch

**之前：**
```java
@GetMapping("/info")
public ApiResponse<Map<String, Object>> getUserInfo(...) {
    try {
        // 业务逻辑
        return ApiResponse.success(result);
    } catch (Exception e) {
        return ApiResponse.error(e.getMessage());  // 捕获了异常
    }
}
```

**现在：**
```java
@GetMapping("/info")
public ApiResponse<Map<String, Object>> getUserInfo(...) {
    // 业务逻辑
    return ApiResponse.success(result);  // 异常向上抛出
}
```

---

## 📊 修复效果

### Token 过期

**请求：**
```bash
curl -i -X GET http://localhost:8080/user/info \
  -H "Authorization: 过期的token"
```

**响应：**
```
HTTP/1.1 401 Unauthorized                 ← HTTP 状态码是 401 ✅
Content-Type: application/json

{
  "code": 401,
  "msg": "Token 已过期，请重新登录",
  "data": null
}
```

### 缺少 Token

**请求：**
```bash
curl -i -X GET http://localhost:8080/user/info
```

**响应：**
```
HTTP/1.1 401 Unauthorized                 ← HTTP 状态码是 401 ✅
Content-Type: application/json

{
  "code": 401,
  "msg": "请先登录",
  "data": null
}
```

### 参数验证错误

**请求：**
```bash
curl -i -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"","password":""}'
```

**响应：**
```
HTTP/1.1 400 Bad Request                  ← HTTP 状态码是 400 ✅
Content-Type: application/json

{
  "code": 400,
  "msg": "手机号不能为空, 密码不能为空",
  "data": null
}
```

### 业务逻辑错误

**请求：**
```bash
curl -i -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"99999999999","password":"123456"}'
```

**响应：**
```
HTTP/1.1 500 Internal Server Error        ← HTTP 状态码是 500 ✅
Content-Type: application/json

{
  "code": 500,
  "msg": "用户不存在",
  "data": null
}
```

---

## 📋 HTTP 状态码映射

| 异常类型 | HTTP 状态码 | code | 说明 |
|---------|------------|------|------|
| TokenExpiredException | **401** | 401 | Token 过期 |
| ExpiredJwtException | **401** | 401 | JWT 过期 |
| MissingRequestHeaderException | **401** | 401 | 缺少 Authorization |
| MethodArgumentNotValidException | **400** | 400 | 参数验证失败 |
| BindException | **400** | 400 | 参数绑定失败 |
| RuntimeException | **500** | 500 | 业务逻辑错误 |
| Exception | **500** | 500 | 系统错误 |

---

## 🔧 修改的文件

| 文件 | 修改内容 | 状态 |
|------|----------|------|
| `GlobalExceptionHandler.java` | 返回 ResponseEntity 设置 HTTP 状态码 | ✅ |
| `UserController.java` | 移除 try-catch，让异常向上抛 | ✅ |
| `DeviceController.java` | 移除 try-catch | ✅ |
| `DeviceWarningController.java` | 移除 try-catch | ✅ |
| `DictDataController.java` | 移除 try-catch | ✅ |

---

## 🧪 测试验证

### 测试1：Token 过期（HTTP 401）

```bash
# 查看完整响应（包括 HTTP 状态码）
curl -i -X GET http://localhost:8080/user/info \
  -H "Authorization: invalid_or_expired_token"
```

**检查点：**
- ✅ HTTP 状态行包含 `401 Unauthorized`
- ✅ 响应体 `code` 也是 401

### 测试2：缺少 Token（HTTP 401）

```bash
curl -i -X GET http://localhost:8080/user/info
```

**检查点：**
- ✅ HTTP 状态行包含 `401 Unauthorized`

### 测试3：参数验证错误（HTTP 400）

```bash
curl -i -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"","password":""}'
```

**检查点：**
- ✅ HTTP 状态行包含 `400 Bad Request`

### 测试4：业务错误（HTTP 500）

```bash
curl -i -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"99999999999","password":"123456"}'
```

**检查点：**
- ✅ HTTP 状态行包含 `500 Internal Server Error`

---

## 🌟 优势

### 1. 符合 RESTful 规范 ✅
- HTTP 状态码反映请求真实状态
- 客户端可以通过状态码快速判断

### 2. 前端处理更简单 ✅

**JavaScript 示例：**
```javascript
fetch('http://localhost:8080/user/info', {
    headers: { 'Authorization': token }
})
.then(response => {
    // 可以直接检查 HTTP 状态码
    if (response.status === 401) {
        console.log('未授权，跳转登录');
        // 跳转到登录页
        return;
    }
    return response.json();
})
.then(data => {
    // 处理数据
});
```

### 3. 标准化 ✅
- 401 - 认证问题
- 400 - 客户端问题
- 500 - 服务器问题

---

## 📱 前端适配

### UniApp request.js 建议修改

```javascript
export const request = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            ...options,
            url: BASE_URL + options.url,
            success: (res) => {
                // 检查 HTTP 状态码
                if (res.statusCode === 401) {
                    // Token 过期或未登录
                    uni.showToast({
                        title: res.data.msg || '请重新登录',
                        icon: 'none'
                    });
                    
                    // 清除 token
                    uni.removeStorageSync('token');
                    
                    // 跳转登录页
                    setTimeout(() => {
                        uni.reLaunch({
                            url: '/pages/register/register'
                        });
                    }, 1500);
                    
                    reject(res.data);
                } else if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    // 其他错误
                    reject(res.data);
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};
```

---

## ✅ 完成清单

- [x] 全局异常处理器返回正确的 HTTP 状态码
- [x] 移除所有 Controller 的 try-catch
- [x] Token 过期返回 HTTP 401
- [x] 缺少 Token 返回 HTTP 401
- [x] 参数错误返回 HTTP 400
- [x] 业务错误返回 HTTP 500
- [x] 代码无 linter 错误

---

## 🎉 修复完成！

现在的行为：
- ✅ **HTTP 状态码**：401、400、500（根据错误类型）
- ✅ **响应体 code**：与 HTTP 状态码一致
- ✅ **符合 RESTful 规范**

**重启后端立即生效！** 🚀

---

## 🔍 如何验证

### 使用 curl 查看 HTTP 状态码

```bash
# -i 参数会显示响应头（包括 HTTP 状态码）
curl -i -X GET http://localhost:8080/user/info \
  -H "Authorization: invalid_token"
```

**输出示例：**
```
HTTP/1.1 401 Unauthorized        ← 这就是 HTTP 状态码！
Content-Type: application/json
...

{"code":401,"msg":"Token 已过期，请重新登录","data":null}
```

### 使用浏览器控制台查看

```javascript
fetch('http://localhost:8080/user/info', {
    headers: { 'Authorization': 'invalid_token' }
})
.then(response => {
    console.log('HTTP 状态码:', response.status);  // 应该是 401
    return response.json();
})
.then(data => {
    console.log('响应体 code:', data.code);  // 也是 401
});
```

---

## 🎊 立即验证

**重启后端：**
```bash
mvn spring-boot:run
```

**测试：**
```bash
# 使用 -i 查看 HTTP 状态码
curl -i -X GET http://localhost:8080/user/info
```

**应该看到：**
```
HTTP/1.1 401 Unauthorized
```

**而不是：**
```
HTTP/1.1 200 OK
```

完成！🚀

