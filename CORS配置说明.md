# CORS 跨域配置说明

## 🎯 什么是 CORS？

CORS（Cross-Origin Resource Sharing，跨域资源共享）是一种机制，允许服务器声明哪些源（域、协议和端口）可以访问其资源。

### 为什么需要 CORS？

浏览器的**同源策略**限制了从一个源加载的文档或脚本如何与来自另一个源的资源进行交互。

**示例：**
- 前端运行在：`http://localhost:8081`（UniApp H5）
- 后端运行在：`http://localhost:8080`（Spring Boot）
- **不同端口** = **跨域**，浏览器会阻止请求

---

## ✅ 本项目的 CORS 配置

### 配置方式

本项目使用了**三层 CORS 配置**，确保跨域请求万无一失：

#### 1️⃣ 全局配置（WebMvcConfigurer）

**文件：** `WebConfig.java`

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOriginPatterns("*")      // 允许所有来源
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
            .allowedHeaders("*")             // 允许所有请求头
            .allowCredentials(true)          // 允许携带认证信息
            .exposedHeaders("Authorization", "Content-Type")
            .maxAge(3600);                   // 预检请求缓存1小时
}
```

#### 2️⃣ CORS 过滤器（CorsFilter Bean）

**文件：** `WebConfig.java`

```java
@Bean
public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.addAllowedOriginPattern("*");
    config.setAllowCredentials(true);
    config.addAllowedHeader("*");
    config.addAllowedMethod("*");
    config.addExposedHeader("Authorization");
    config.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    
    return new CorsFilter(source);
}
```

**优先级：** CorsFilter > WebMvcConfigurer

#### 3️⃣ Controller 级别注解

**所有 Controller 上都添加了：**

```java
@RestController
@CrossOrigin(origins = "*")
public class UserController {
    // ...
}
```

---

## 📋 配置详解

### 配置项说明

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `allowedOriginPatterns` | `"*"` | 允许所有来源（开发环境） |
| `allowedMethods` | `GET, POST, PUT, DELETE, OPTIONS, PATCH` | 允许的 HTTP 方法 |
| `allowedHeaders` | `"*"` | 允许所有请求头 |
| `allowCredentials` | `true` | 允许携带 Cookie、Authorization |
| `exposedHeaders` | `Authorization, Content-Type` | 暴露给前端的响应头 |
| `maxAge` | `3600` | 预检请求缓存时间（秒） |

### 重要概念

#### 1. allowedOrigins vs allowedOriginPatterns

```java
// ❌ 错误：使用 allowedOrigins("*") 时不能 allowCredentials(true)
.allowedOrigins("*")
.allowCredentials(true)

// ✅ 正确：使用 allowedOriginPatterns
.allowedOriginPatterns("*")
.allowCredentials(true)
```

#### 2. 预检请求（Preflight Request）

浏览器在发送某些跨域请求前，会先发送 OPTIONS 请求询问服务器是否允许。

**示例流程：**
```
1. 浏览器发送 OPTIONS 请求（预检）
   OPTIONS http://localhost:8080/user/info
   Origin: http://localhost:8081
   Access-Control-Request-Method: POST
   Access-Control-Request-Headers: Authorization

2. 服务器响应
   Access-Control-Allow-Origin: http://localhost:8081
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   Access-Control-Allow-Headers: Authorization
   Access-Control-Max-Age: 3600

3. 浏览器发送实际请求
   POST http://localhost:8080/user/info
   Authorization: eyJhbGci...
```

---

## 🧪 测试 CORS

### 方法1：浏览器控制台测试

打开浏览器控制台（F12），执行：

```javascript
// 测试跨域请求
fetch('http://localhost:8080/user/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: '13800138000',
    password: '123456'
  })
})
.then(response => response.json())
.then(data => console.log('成功:', data))
.catch(error => console.error('错误:', error));
```

### 方法2：使用 curl 测试预检请求

```bash
# 发送预检请求
curl -X OPTIONS http://localhost:8080/user/info \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v
```

**预期响应头包含：**
```
Access-Control-Allow-Origin: http://localhost:8081
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

### 方法3：前端实际测试

在 UniApp 前端项目中测试：

```javascript
// src/utils/request.js 已经配置好
const BASE_URL = 'http://localhost:8080/'

// 发送请求测试
request.post('user/login', {
  phone: '13800138000',
  password: '123456'
})
.then(res => {
  console.log('登录成功', res)
})
```

---

## 🚨 常见问题

### 问题1：CORS 错误仍然存在

**错误信息：**
```
Access to fetch at 'http://localhost:8080/user/login' from origin 'http://localhost:8081' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**解决方案：**
1. 确保后端已启动
2. 检查 `WebConfig.java` 配置是否生效
3. 清除浏览器缓存
4. 重启后端服务

### 问题2：携带 Authorization 失败

**错误信息：**
```
Request header field Authorization is not allowed by Access-Control-Allow-Headers
```

**解决方案：**
- 确保配置了 `.allowedHeaders("*")`
- 确保配置了 `.exposedHeaders("Authorization")`

### 问题3：携带 Cookies 失败

**错误信息：**
```
The value of the 'Access-Control-Allow-Credentials' header is '' which must be 'true'
```

**解决方案：**
- 确保配置了 `.allowCredentials(true)`
- 确保使用 `allowedOriginPatterns("*")` 而不是 `allowedOrigins("*")`

---

## 🔒 生产环境配置

### 不要在生产环境使用 `*`

**开发环境（当前配置）：**
```java
.allowedOriginPatterns("*")  // 允许所有来源
```

**生产环境（推荐）：**
```java
.allowedOriginPatterns(
    "https://yourdomain.com",           // 生产域名
    "https://www.yourdomain.com",       // www 域名
    "https://app.yourdomain.com"        // 移动端域名
)
```

### 使用配置文件管理

**application.properties：**
```properties
# CORS 配置
cors.allowed-origins=https://yourdomain.com,https://app.yourdomain.com
cors.max-age=3600
```

**WebConfig.java：**
```java
@Value("${cors.allowed-origins}")
private String[] allowedOrigins;

@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOriginPatterns(allowedOrigins)
            // ...
}
```

---

## 📊 配置优先级

```
Controller 级别 @CrossOrigin
    ↓
CorsFilter Bean
    ↓
WebMvcConfigurer.addCorsMappings
    ↓
Spring Security 配置（如果有）
```

**本项目：** 使用了多层配置，确保万无一失

---

## ✅ 验证清单

启动后端后，检查以下内容：

- [x] 浏览器控制台无 CORS 错误
- [x] 前端能正常调用登录接口
- [x] 前端能正常调用带 Authorization 的接口
- [x] OPTIONS 预检请求返回正确的响应头
- [x] 跨域请求能携带 token

---

## 📚 相关文件

- ✅ `WebConfig.java` - CORS 全局配置
- ✅ `UserController.java` - 添加了 @CrossOrigin
- ✅ `DeviceController.java` - 添加了 @CrossOrigin
- ✅ `DeviceWarningController.java` - 添加了 @CrossOrigin
- ✅ `DictDataController.java` - 添加了 @CrossOrigin

---

## 🎉 配置完成

你的项目现在已经完全支持跨域请求：

✅ **全局 CORS 配置** - 所有接口自动支持  
✅ **CorsFilter** - 底层过滤器保障  
✅ **Controller 注解** - 双重保险  
✅ **携带认证信息** - 支持 Authorization 头部  
✅ **预检请求优化** - 缓存1小时  

**前端可以放心调用后端接口了！** 🚀

---

## 🔗 参考资料

- [MDN - CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [Spring CORS 官方文档](https://spring.io/guides/gs/rest-service-cors/)
- [Understanding CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

