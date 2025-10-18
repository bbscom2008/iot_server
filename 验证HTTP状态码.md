# 验证 HTTP 状态码 - 快速指南

## ✅ 修复完成

**核心改动：**
1. ✅ 全局异常处理器返回 `ResponseEntity`
2. ✅ 设置正确的 HTTP 状态码（401、400、500）
3. ✅ 移除所有 Controller 的 try-catch
4. ✅ 异常向上抛出，由全局处理器统一处理

---

## 🚀 立即验证（3 分钟）

### 第一步：重启后端（必须！）

```bash
# Ctrl+C 停止当前服务
# 重新启动
mvn spring-boot:run
```

### 第二步：测试 Token 过期（HTTP 401）

```bash
# 使用 -i 参数查看 HTTP 状态码
curl -i -X GET http://localhost:8080/user/info \
  -H "Authorization: invalid_token"
```

**检查输出的第一行：**
```
HTTP/1.1 401 Unauthorized          ← 应该是 401，不是 200！
```

### 第三步：测试缺少 Token（HTTP 401）

```bash
curl -i -X GET http://localhost:8080/user/info
```

**检查第一行：**
```
HTTP/1.1 401 Unauthorized          ← 应该是 401
```

### 第四步：测试参数验证错误（HTTP 400）

```bash
curl -i -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"","password":""}'
```

**检查第一行：**
```
HTTP/1.1 400 Bad Request           ← 应该是 400
```

---

## 📊 完整的状态码对照表

| 场景 | HTTP 状态码 | 响应体 code | 说明 |
|------|------------|------------|------|
| 请求成功 | **200 OK** | 200 | 正常 |
| Token 过期 | **401 Unauthorized** | 401 | 需要重新登录 |
| 缺少 Token | **401 Unauthorized** | 401 | 需要登录 |
| Token 无效 | **401 Unauthorized** | 401 | Token 格式错误 |
| 参数验证失败 | **400 Bad Request** | 400 | 客户端错误 |
| 用户不存在 | **500 Internal Server Error** | 500 | 业务错误 |
| 密码错误 | **500 Internal Server Error** | 500 | 业务错误 |
| 系统异常 | **500 Internal Server Error** | 500 | 服务器错误 |

---

## 🧪 使用 Postman 验证

### 1. Token 过期测试

**配置：**
- Method: GET
- URL: `http://localhost:8080/user/info`
- Headers: `Authorization: invalid_token`

**点击 Send**

**查看结果：**
- **Status**: `401 Unauthorized` ✅（在右上角显示）
- **Body**: `{"code": 401, "msg": "Token 已过期，请重新登录"}`

### 2. 缺少 Token 测试

**配置：**
- Method: GET
- URL: `http://localhost:8080/user/info`
- Headers: （不添加 Authorization）

**点击 Send**

**查看结果：**
- **Status**: `401 Unauthorized` ✅
- **Body**: `{"code": 401, "msg": "请先登录"}`

---

## 🌐 使用浏览器验证

### 方法1：打开浏览器控制台（F12）

```javascript
// 测试 Token 过期
fetch('http://localhost:8080/user/info', {
    headers: { 'Authorization': 'invalid_token' }
})
.then(response => {
    console.log('HTTP 状态码:', response.status);      // 应该是 401
    console.log('状态文本:', response.statusText);      // "Unauthorized"
    return response.json();
})
.then(data => {
    console.log('响应体 code:', data.code);            // 也是 401
    console.log('错误信息:', data.msg);
});
```

### 方法2：Network 面板查看

1. 打开浏览器开发者工具（F12）
2. 切换到 Network（网络）标签
3. 执行上面的 fetch 请求
4. 查看请求列表
5. 点击请求，查看 **Status Code** 列

**应该显示：** `401 Unauthorized`（红色）

---

## 📝 验证清单

重启后端后，依次验证：

- [ ] Token 过期 → HTTP 状态码 **401**
- [ ] 缺少 Token → HTTP 状态码 **401**
- [ ] Token 无效 → HTTP 状态码 **401**
- [ ] 参数验证错误 → HTTP 状态码 **400**
- [ ] 用户不存在 → HTTP 状态码 **500**
- [ ] 请求成功 → HTTP 状态码 **200**

**全部通过表示修复成功！** ✅

---

## 💡 关键点

### 为什么要这样做？

**符合 HTTP 规范：**
- HTTP 状态码是标准的错误指示器
- 客户端框架（如 axios）会自动根据状态码处理

**前端更容易处理：**
```javascript
// 使用 axios 时
axios.get('/user/info')
  .then(response => {
    // 200 的响应
  })
  .catch(error => {
    if (error.response.status === 401) {
      // 自动处理 401
      router.push('/login');
    }
  });
```

**统一标准：**
- 所有主流 API 都使用 HTTP 状态码
- RESTful API 最佳实践

---

## 🎯 前端建议

### 统一错误处理

```javascript
// request.js
uni.request({
    url: 'xxx',
    success: (res) => {
        if (res.statusCode === 401) {
            // Token 过期，跳转登录
            uni.reLaunch({ url: '/pages/login/login' });
        } else if (res.statusCode === 200) {
            // 正常处理
            resolve(res.data);
        } else {
            // 其他错误
            uni.showToast({ title: res.data.msg });
        }
    }
});
```

---

## 🎉 完成！

现在系统会返回正确的 HTTP 状态码：

| 状态 | HTTP 状态码 |
|------|------------|
| 成功 | **200** |
| 认证失败 | **401** |
| 参数错误 | **400** |
| 业务/系统错误 | **500** |

**重启后端，使用 `curl -i` 验证！** 🚀

---

## 🔍 快速检查命令

```bash
# 检查 Token 过期是否返回 HTTP 401
curl -i -X GET http://localhost:8080/user/info \
  -H "Authorization: test" \
  | head -1

# 应该输出：HTTP/1.1 401 Unauthorized
```

如果看到 `HTTP/1.1 401 Unauthorized`，说明修复成功！✅

