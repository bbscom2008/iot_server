# Authorization 认证机制说明

## ✅ 最终方案（已实现）

### 设计原则

1. **登录接口** - 不需要 Authorization（未登录用户可访问）
2. **其他接口** - **必须**有 Authorization（强制要求）
3. **友好错误** - 缺少 Authorization 时返回友好的错误提示

---

## 🔧 实现方式

### 1. 全局异常处理器

在 `GlobalExceptionHandler.java` 中添加了专门处理缺少请求头的异常：

```java
@ExceptionHandler(MissingRequestHeaderException.class)
public ApiResponse<Void> handleMissingRequestHeader(MissingRequestHeaderException e) {
    if ("Authorization".equals(e.getHeaderName())) {
        return ApiResponse.error(401, "请先登录");
    }
    return ApiResponse.error(400, "缺少必需的请求头: " + e.getHeaderName());
}
```

**工作原理：**
- 当接口标记了 `@RequestHeader("Authorization")` 为必填
- 如果客户端没有传这个头部，Spring 会自动抛出 `MissingRequestHeaderException`
- 全局异常处理器捕获这个异常，返回友好的错误消息

### 2. Controller 层配置

**登录接口（不需要 Authorization）：**
```java
@PostMapping("/login")
public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    // 不需要 @RequestHeader("Authorization")
    // 未登录用户可以访问
}
```

**其他接口（必须有 Authorization）：**
```java
@GetMapping("/info")
public ApiResponse<Map<String, Object>> getUserInfo(
        @RequestHeader("Authorization") String token) {
    // Authorization 是必填的
    // 如果客户端不传，会被全局异常处理器拦截
}
```

---

## 📋 接口分类

### 无需认证的接口（公开接口）

| 接口 | 路径 | 说明 |
|------|------|------|
| 用户登录 | POST `/user/login` | 获取 token |

### 需要认证的接口（受保护接口）

| 模块 | 接口 | 路径 |
|------|------|------|
| 用户 | 获取用户信息 | GET `/user/info` |
| 用户 | 更新用户信息 | POST `/user/updateInfo` |
| 设备 | 获取设备列表 | GET `/device/list` |
| 设备 | 获取设备统计 | GET `/device/statistics` |
| 设备 | 获取设备详情 | GET `/device/{id}` |
| 设备 | 绑定设备 | POST `/device/bind` |
| 设备 | 解绑设备 | PUT `/device/un/bind` |
| 报警 | 获取报警列表 | GET `/device/warning/list` |
| 报警 | 消除报警 | POST `/device/warning/read` |
| 报警 | 消除环控仪报警 | POST `/device/hkyWarningRead/read` |
| 字典 | 获取字典数据 | GET `/user/dict/data/list` |

---

## 🎯 测试场景

### 场景1：登录（不需要 Authorization）✅

**请求：**
```bash
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}'
```

**响应（成功）：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "token": "eyJhbGci...",
    "user": {...}
  }
}
```

---

### 场景2：访问受保护接口 - 带有 Authorization ✅

**请求：**
```bash
curl -X GET http://localhost:8080/user/info \
  -H "Authorization: eyJhbGci..."
```

**响应（成功）：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "data": {
      "id": 1,
      "phone": "13800138000",
      "nikeName": "测试用户"
    }
  }
}
```

---

### 场景3：访问受保护接口 - 不带 Authorization ❌

**请求：**
```bash
curl -X GET http://localhost:8080/user/info
```

**响应（友好错误）：**
```json
{
  "code": 401,
  "msg": "请先登录",
  "data": null
}
```

**说明：** 全局异常处理器自动捕获并返回友好消息

---

### 场景4：Token 无效或过期 ❌

**请求：**
```bash
curl -X GET http://localhost:8080/user/info \
  -H "Authorization: invalid_token"
```

**响应（JWT 解析错误）：**
```json
{
  "code": 500,
  "msg": "JWT解析失败或token无效",
  "data": null
}
```

---

## 🔑 客户端使用指南

### 步骤1：登录获取 Token

```javascript
// 前端代码示例
const loginResponse = await fetch('http://localhost:8080/user/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: '13800138000',
    password: '123456'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

// 保存 token（本地存储、sessionStorage等）
localStorage.setItem('token', token);
```

### 步骤2：使用 Token 访问其他接口

```javascript
// 前端代码示例
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:8080/user/info', {
  method: 'GET',
  headers: {
    'Authorization': token  // 在请求头中传递 token
  }
});

const userData = await response.json();
```

### 步骤3：处理认证错误

```javascript
// 前端代码示例
const response = await fetch('http://localhost:8080/user/info', {
  headers: {
    'Authorization': localStorage.getItem('token')
  }
});

const data = await response.json();

if (data.code === 401) {
  // 未登录或 token 过期
  alert('请先登录');
  // 跳转到登录页
  window.location.href = '/login';
}
```

---

## 🌟 优势

### 1. **符合 RESTful 规范**
- 必填参数就应该标记为必填
- 不应该在业务逻辑中判断参数是否存在

### 2. **代码简洁**
- Controller 层代码更简洁，不需要手动判断 token 是否为空
- 统一的异常处理，所有接口都能受益

### 3. **友好的错误提示**
- 缺少 Authorization：`{"code": 401, "msg": "请先登录"}`
- 明确告诉客户端问题所在

### 4. **前端易于适配**
- 前端 `request.js` 自动在需要的路径添加 Authorization 头部
- 已在前端项目中配置：包含 `/my/` 的路径自动添加 token

---

## 📁 相关文件

修改的文件：
- ✅ `GlobalExceptionHandler.java` - 添加 `MissingRequestHeaderException` 处理
- ✅ `UserController.java` - 登录接口无需 token，其他接口必须有
- ✅ `DeviceController.java` - 所有接口必须有 Authorization
- ✅ `DeviceWarningController.java` - 所有接口必须有 Authorization
- ✅ `DictDataController.java` - 字典接口（可根据需求决定是否需要认证）

---

## 🔐 安全建议

### 生产环境改进

1. **Token 过期时间**
   - 当前：7天
   - 建议：1小时（短期 access token）+ 刷新机制（refresh token）

2. **密码加密**
   - 当前：明文存储
   - 必须：使用 BCrypt 加密

3. **HTTPS**
   - 生产环境必须使用 HTTPS
   - 防止 token 被中间人截获

4. **Token 刷新机制**
   - 实现 refresh token
   - access token 过期后使用 refresh token 获取新的 access token

---

## 🎉 总结

现在的实现方式：

✅ **登录接口** - 不需要 Authorization（正确）  
✅ **其他接口** - **必须**有 Authorization（强制要求）  
✅ **缺少 token** - 自动返回 `401 请先登录`（友好错误）  
✅ **代码简洁** - 无需手动判断 token 是否为空  
✅ **符合规范** - RESTful API 最佳实践  

**客户端只需确保在请求头中传递 Authorization 即可！**

