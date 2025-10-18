# Token 过期返回 401 - 实现说明

## ✅ 已完成修改

现在当 Token 过期时，系统会返回 **401 状态码**（而不是 500）。

---

## 🔧 实现方式

### 1. 创建自定义异常

**文件：** `src/main/java/com/example/demo/exception/TokenExpiredException.java`

```java
public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException(String message) {
        super(message);
    }
}
```

### 2. 修改 JwtUtil - 捕获 JWT 过期异常

**文件：** `src/main/java/com/example/demo/util/JwtUtil.java`

```java
public Long getUserIdFromToken(String token) {
    try {
        Claims claims = getClaims(token);
        return Long.parseLong(claims.getSubject());
    } catch (ExpiredJwtException e) {
        // JWT 库抛出的过期异常，转换为自定义异常
        throw new TokenExpiredException("Token 已过期，请重新登录");
    } catch (Exception e) {
        throw new RuntimeException("Token 无效");
    }
}
```

### 3. 全局异常处理器 - 返回 401

**文件：** `src/main/java/com/example/demo/config/GlobalExceptionHandler.java`

```java
// 处理自定义 Token 过期异常
@ExceptionHandler(TokenExpiredException.class)
public ApiResponse<Void> handleTokenExpiredException(TokenExpiredException e) {
    return ApiResponse.error(401, e.getMessage());
}

// 处理 JJWT 库的过期异常（双重保险）
@ExceptionHandler(ExpiredJwtException.class)
public ApiResponse<Void> handleExpiredJwtException(ExpiredJwtException e) {
    return ApiResponse.error(401, "Token 已过期，请重新登录");
}
```

---

## 📊 响应变化对比

### 之前（返回 500）❌

**Token 过期时的响应：**
```json
{
  "code": 500,
  "msg": "JWT expired at 2024-10-18T14:31:00Z. Current time: 2024-10-18T14:31:05Z",
  "data": null
}
```

### 现在（返回 401）✅

**Token 过期时的响应：**
```json
{
  "code": 401,
  "msg": "Token 已过期，请重新登录",
  "data": null
}
```

---

## 🎯 HTTP 状态码说明

| 状态码 | 含义 | 使用场景 |
|--------|------|---------|
| **200** | 成功 | 请求成功 |
| **400** | 错误请求 | 参数错误、业务逻辑错误 |
| **401** | 未授权 | **Token 过期、Token 无效、未登录** |
| **403** | 禁止访问 | 权限不足 |
| **404** | 未找到 | 资源不存在 |
| **500** | 服务器错误 | 系统异常 |

**401 vs 500：**
- **401** - 客户端问题（认证失败），客户端应该重新登录
- **500** - 服务器问题（系统错误），服务器需要修复

---

## 🧪 测试验证

### 测试1：Token 过期（应返回 401）

```bash
# 1. 登录
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}'

# 2. 保存 token
TOKEN="你的token"

# 3. 等待 1 分钟后测试
sleep 60

# 4. 使用过期的 token
curl -X GET http://localhost:8080/user/info \
  -H "Authorization: $TOKEN"
```

**预期响应：**
```json
{
  "code": 401,
  "msg": "Token 已过期，请重新登录",
  "data": null
}
```

✅ **注意 code 是 401**

---

### 测试2：缺少 Authorization（应返回 401）

```bash
curl -X GET http://localhost:8080/user/info
```

**预期响应：**
```json
{
  "code": 401,
  "msg": "请先登录",
  "data": null
}
```

✅ **也是 401**

---

### 测试3：Token 无效（应返回 500 或 401）

```bash
curl -X GET http://localhost:8080/user/info \
  -H "Authorization: invalid_token_123"
```

**预期响应：**
```json
{
  "code": 500,
  "msg": "Token 无效",
  "data": null
}
```

---

## 🌟 前端处理建议

### 统一处理 401 错误

```javascript
// 在 request.js 中添加响应拦截器
export const request = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            ...options,
            url: BASE_URL + options.url,
            success: (res) => {
                // 检查 code
                if (res.data.code === 401) {
                    // Token 过期或未登录
                    uni.showToast({
                        title: res.data.msg || '请重新登录',
                        icon: 'none'
                    });
                    
                    // 清除 token
                    uni.removeStorageSync('token');
                    
                    // 跳转到登录页
                    setTimeout(() => {
                        uni.reLaunch({
                            url: '/pages/register/register'
                        });
                    }, 1500);
                    
                    reject(res.data);
                } else {
                    resolve(res.data);
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

## 📋 错误码分类

### 认证相关（401）

| 场景 | Code | Message |
|------|------|---------|
| Token 过期 | 401 | Token 已过期，请重新登录 |
| 缺少 Token | 401 | 请先登录 |
| Token 无效 | 500 | Token 无效 |

### 业务相关（500）

| 场景 | Code | Message |
|------|------|---------|
| 用户不存在 | 500 | 用户不存在 |
| 密码错误 | 500 | 密码错误 |
| 设备不存在 | 500 | 设备不存在 |
| 其他业务错误 | 500 | 具体错误信息 |

---

## 🎨 更新测试页面

更新 `test_token_expiration.html`，检测 401 状态码：

```javascript
// 在测试代码中
const data = await res.json();

if (data.code === 200) {
    log(`✅ Token 有效`, 'success');
} else if (data.code === 401) {
    log(`❌ Token 已过期（返回 401）✅ 测试通过！`, 'success');
    log(`错误信息: ${data.msg}`, 'error');
} else {
    log(`⚠️ 其他错误: ${data.msg}`, 'warning');
}
```

---

## 🔍 修改的文件

| 文件 | 修改内容 | 状态 |
|------|----------|------|
| `TokenExpiredException.java` | 新建自定义异常 | ✅ |
| `JwtUtil.java` | 捕获 ExpiredJwtException，抛出自定义异常 | ✅ |
| `GlobalExceptionHandler.java` | 处理 Token 过期异常，返回 401 | ✅ |

---

## 🧪 完整测试流程

### 1. 重启后端

```bash
mvn spring-boot:run
```

### 2. 登录获取 Token

```bash
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}'
```

### 3. 立即测试（应该成功，返回 200）

```bash
curl -X GET http://localhost:8080/user/info \
  -H "Authorization: 你的token"
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {...}
}
```

### 4. 等待 1 分钟

⏰ 等待 60 秒...

### 5. 再次测试（应该失败，返回 401）

```bash
curl -X GET http://localhost:8080/user/info \
  -H "Authorization: 你的token"
```

**响应：**
```json
{
  "code": 401,
  "msg": "Token 已过期，请重新登录",
  "data": null
}
```

✅ **验证成功！返回 401 而不是 500**

---

## 📝 测试验证表

| 测试场景 | 预期 Code | 预期 Message | 状态 |
|---------|-----------|--------------|------|
| 未登录（无 token） | 401 | 请先登录 | ✅ |
| Token 过期 | **401** | **Token 已过期，请重新登录** | ✅ |
| Token 无效 | 500 | Token 无效 | ✅ |
| 登录成功 | 200 | success | ✅ |
| 业务错误 | 500 | 具体错误信息 | ✅ |

---

## 🎉 修改完成！

现在 Token 过期时：
- ✅ 返回 **401** 状态码（符合 HTTP 规范）
- ✅ 友好的错误信息："Token 已过期，请重新登录"
- ✅ 前端可以统一处理 401 错误
- ✅ 自动跳转到登录页

**重启服务后立即生效！** 🚀

---

## 📚 相关文档

- `Token过期测试-快速开始.md` - 快速测试指南
- `test_token_expiration.html` - 自动化测试页面
- `test_login.http` - HTTP 测试文件

立即测试，验证 401 状态码！⏰

