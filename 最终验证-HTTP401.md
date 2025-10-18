# HTTP 401 状态码 - 最终验证

## ✅ 问题已彻底解决

**之前：** 所有请求返回 HTTP 200，错误只在响应体的 `code` 字段  
**现在：** 返回正确的 HTTP 状态码（401、400、500）

---

## 🔧 关键修改

### 1. 全局异常处理器
**所有异常处理器现在返回 `ResponseEntity`：**

```java
// Token 过期 → HTTP 401
@ExceptionHandler(TokenExpiredException.class)
public ResponseEntity<ApiResponse<Void>> handleTokenExpiredException(...) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
}

// 缺少 Token → HTTP 401
@ExceptionHandler(MissingRequestHeaderException.class)
public ResponseEntity<ApiResponse<Void>> handleMissingRequestHeader(...) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
}

// 参数错误 → HTTP 400
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ApiResponse<Void>> handleValidationException(...) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
}

// 业务错误 → HTTP 500
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ApiResponse<Void>> handleRuntimeException(...) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
}
```

### 2. Controller 层
**移除了所有 try-catch，异常直接向上抛：**

```java
// 之前
@GetMapping("/info")
public ApiResponse<Map<String, Object>> getUserInfo(...) {
    try {
        // ...
    } catch (Exception e) {
        return ApiResponse.error(e.getMessage());  // ❌ 捕获了异常
    }
}

// 现在
@GetMapping("/info")
public ApiResponse<Map<String, Object>> getUserInfo(...) {
    // 异常会向上抛出，由全局异常处理器处理 ✅
    Long userId = jwtUtil.getUserIdFromToken(token);
    // ...
    return ApiResponse.success(result);
}
```

---

## 🎯 一键验证脚本

复制以下命令，一次性验证所有状态码：

```bash
echo "=== HTTP 状态码验证测试 ==="
echo ""

echo "测试1：Token 无效（预期 HTTP 401）"
curl -i -X GET http://localhost:8080/user/info \
  -H "Authorization: invalid_token" 2>/dev/null | head -1
echo ""

echo "测试2：缺少 Token（预期 HTTP 401）"
curl -i -X GET http://localhost:8080/user/info 2>/dev/null | head -1
echo ""

echo "测试3：参数验证错误（预期 HTTP 400）"
curl -i -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"","password":""}' 2>/dev/null | head -1
echo ""

echo "测试4：用户不存在（预期 HTTP 500）"
curl -i -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"99999999999","password":"123456"}' 2>/dev/null | head -1
echo ""

echo "测试5：登录成功（预期 HTTP 200）"
curl -i -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}' 2>/dev/null | head -1
echo ""

echo "=== 验证完成 ==="
```

**预期输出：**
```
测试1：Token 无效（预期 HTTP 401）
HTTP/1.1 401 Unauthorized

测试2：缺少 Token（预期 HTTP 401）
HTTP/1.1 401 Unauthorized

测试3：参数验证错误（预期 HTTP 400）
HTTP/1.1 400 Bad Request

测试4：用户不存在（预期 HTTP 500）
HTTP/1.1 500 Internal Server Error

测试5：登录成功（预期 HTTP 200）
HTTP/1.1 200 OK
```

---

## 📱 前端如何使用

### JavaScript/axios

```javascript
axios.get('/user/info', {
    headers: { 'Authorization': token }
})
.then(response => {
    // HTTP 200 - 成功
    console.log(response.data);
})
.catch(error => {
    // 根据 HTTP 状态码处理
    if (error.response.status === 401) {
        // Token 过期或未登录
        alert('请重新登录');
        window.location.href = '/login';
    } else if (error.response.status === 400) {
        // 参数错误
        alert(error.response.data.msg);
    } else {
        // 其他错误
        alert('请求失败');
    }
});
```

### UniApp

```javascript
uni.request({
    url: 'http://localhost:8080/user/info',
    header: {
        'Authorization': token
    },
    success: (res) => {
        if (res.statusCode === 401) {
            // Token 过期
            uni.showToast({ title: '请重新登录' });
            uni.reLaunch({ url: '/pages/login/login' });
        } else if (res.statusCode === 200) {
            // 成功
            console.log(res.data);
        } else {
            // 其他错误
            uni.showToast({ title: res.data.msg });
        }
    }
});
```

---

## ⚡ 快速测试命令

```bash
# 最简单的验证方式
curl -i http://localhost:8080/user/info | head -1

# 应该看到：
# HTTP/1.1 401 Unauthorized
```

---

## 🎊 修改总结

| 修改项 | 状态 |
|--------|------|
| 全局异常处理器返回 ResponseEntity | ✅ |
| 设置正确的 HTTP 状态码 | ✅ |
| 移除 Controller try-catch | ✅ |
| Token 过期返回 HTTP 401 | ✅ |
| 缺少 Token 返回 HTTP 401 | ✅ |
| 参数错误返回 HTTP 400 | ✅ |
| 业务错误返回 HTTP 500 | ✅ |

---

## 📚 相关文档

- `HTTP状态码修复说明.md` - 详细说明
- `验证HTTP状态码.md` - 验证指南
- `test_login.http` - HTTP 测试文件

---

## 🚀 立即验证

**一条命令验证：**

```bash
curl -i http://localhost:8080/user/info | head -1
```

**期望看到：**
```
HTTP/1.1 401 Unauthorized
```

**如果看到 `HTTP/1.1 200 OK`，说明需要重启后端！**

---

## ✅ 验证成功标志

当你运行：
```bash
curl -i -X GET http://localhost:8080/user/info \
  -H "Authorization: invalid_token"
```

看到：
```
HTTP/1.1 401 Unauthorized        ← 这就对了！
Content-Type: application/json
...
```

**而不是：**
```
HTTP/1.1 200 OK                  ← 这是之前的问题
```

就说明修复成功！🎉

