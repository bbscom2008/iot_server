# CORS 快速参考

## ✅ 已配置内容

### 1. 全局 CORS 配置

**文件：** `src/main/java/com/example/demo/config/WebConfig.java`

✅ **WebMvcConfigurer 配置**
✅ **CorsFilter Bean 配置**
✅ **允许所有来源** (`allowedOriginPatterns("*")`)
✅ **允许携带认证信息** (`allowCredentials(true)`)
✅ **允许所有请求头和方法**
✅ **暴露 Authorization 头部**

### 2. Controller 级别配置

✅ `UserController` - 添加了 `@CrossOrigin(origins = "*")`
✅ `DeviceController` - 添加了 `@CrossOrigin(origins = "*")`
✅ `DeviceWarningController` - 添加了 `@CrossOrigin(origins = "*")`
✅ `DictDataController` - 添加了 `@CrossOrigin(origins = "*")`

---

## 🧪 快速测试

### 方法1：使用测试页面

```bash
# 直接在浏览器打开
test_cors.html
```

### 方法2：浏览器控制台

```javascript
// 测试登录
fetch('http://localhost:8080/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '13800138000',
    password: '123456'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### 方法3：前端项目

修改前端 `request.js`：
```javascript
const BASE_URL = 'http://localhost:8080/'
```

---

## 🎯 支持的配置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| 允许来源 | `*` | 所有域名 |
| 允许方法 | `GET, POST, PUT, DELETE, OPTIONS, PATCH` | 所有常用方法 |
| 允许头部 | `*` | 所有请求头 |
| 携带凭证 | `true` | 支持 Cookie、Authorization |
| 暴露头部 | `Authorization, Content-Type` | 前端可访问 |
| 缓存时间 | `3600秒` | 1小时 |

---

## 🚨 常见问题速查

### ❌ CORS 错误："No 'Access-Control-Allow-Origin' header"

**解决：**
1. 确保后端已启动
2. 重启后端服务
3. 清除浏览器缓存

### ❌ Authorization 头部被阻止

**解决：**
- 配置已包含 `exposedHeaders("Authorization")`
- 确保使用 `allowCredentials(true)`

### ❌ 预检请求失败

**解决：**
- 配置已包含 `allowedMethods("OPTIONS")`
- CorsFilter 会自动处理

---

## 📋 检查清单

启动后端，检查以下内容：

- [ ] 前端能调用登录接口
- [ ] 前端能调用带 token 的接口
- [ ] 浏览器控制台无 CORS 错误
- [ ] 打开 `test_cors.html` 所有测试通过

---

## 🔧 生产环境

**当前配置：** 开发环境（允许所有来源）

**生产环境改为：**
```java
.allowedOriginPatterns(
    "https://yourdomain.com",
    "https://app.yourdomain.com"
)
```

---

## 📚 相关文件

- ✅ `WebConfig.java` - CORS 配置
- ✅ `CORS配置说明.md` - 详细文档
- ✅ `test_cors.html` - 测试页面

---

## 🎉 配置完成

你的项目已经完全支持 CORS 跨域请求！

**三层保障：**
1. ✅ WebMvcConfigurer 全局配置
2. ✅ CorsFilter 过滤器
3. ✅ Controller 注解

**前端可以放心调用了！** 🚀

