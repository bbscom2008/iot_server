# 用户管理系统使用指南

## 🎯 功能概述

这是一个完整的用户CRUD管理系统，包含：
- ✅ 查看所有用户（Read）
- ✅ 添加新用户（Create）
- ✅ 编辑用户信息（Update）
- ✅ 删除用户（Delete）
- ✅ 漂亮的Web界面
- ✅ RESTful API接口

## 🚀 快速开始

### 1. 确保数据库已创建
```bash
mysql -u root -p < database_setup.sql
```

### 2. 启动Spring Boot应用
```bash
mvn spring-boot:run
```

或在IDE中直接运行 `DemoApplication.java`

### 3. 访问Web界面
打开浏览器访问：
```
http://localhost:8080/index.html
```

## 📱 Web界面功能

### 添加用户
1. 在"添加新用户"表单中输入用户名和密码
2. 用户名：3-50个字符
3. 密码：至少6个字符
4. 点击"添加用户"按钮

### 查看用户列表
- 页面自动加载所有用户
- 显示用户ID、用户名、创建时间
- 点击"刷新列表"可手动刷新

### 编辑用户
1. 在用户列表中找到要编辑的用户
2. 点击"编辑"按钮
3. 修改用户名或密码
4. 点击"保存修改"

### 删除用户
1. 在用户列表中找到要删除的用户
2. 点击"删除"按钮
3. 确认删除操作

## 🔌 API接口说明

### 1. 获取所有用户
```http
GET http://localhost:8080/api/user/all
```

**响应示例：**
```json
{
  "success": true,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "username": "zhangsan",
      "createdAt": "2025-10-12T10:30:00"
    }
  ]
}
```

### 2. 根据ID查询用户
```http
GET http://localhost:8080/api/user/{id}
```

**响应示例：**
```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "id": 1,
    "username": "zhangsan",
    "createdAt": "2025-10-12T10:30:00"
  }
}
```

### 3. 添加用户
```http
POST http://localhost:8080/api/user/register
Content-Type: application/json

{
  "username": "zhangsan",
  "password": "123456"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "id": 1,
    "username": "zhangsan",
    "createdAt": "2025-10-12T10:30:00"
  }
}
```

### 4. 更新用户
```http
PUT http://localhost:8080/api/user/{id}
Content-Type: application/json

{
  "username": "zhangsan_new",
  "password": "newpassword"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "更新成功",
  "data": {
    "id": 1,
    "username": "zhangsan_new",
    "createdAt": "2025-10-12T10:30:00"
  }
}
```

### 5. 删除用户
```http
DELETE http://localhost:8080/api/user/{id}
```

**响应示例：**
```json
{
  "success": true,
  "message": "删除成功",
  "data": null
}
```

## 📝 测试API

你可以使用提供的 HTTP 测试文件来测试API：

### 创建测试文件 `test_crud_api.http`

```http
### 获取所有用户
GET http://localhost:8080/api/user/all

###

### 根据ID查询用户
GET http://localhost:8080/api/user/1

###

### 添加用户
POST http://localhost:8080/api/user/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}

###

### 更新用户
PUT http://localhost:8080/api/user/1
Content-Type: application/json

{
  "username": "testuser_updated",
  "password": "newpassword"
}

###

### 删除用户
DELETE http://localhost:8080/api/user/1
```

## 🎨 界面特点

- **现代化设计**：渐变色背景，圆角卡片
- **响应式布局**：自适应不同屏幕尺寸
- **交互友好**：按钮悬停效果，表单验证
- **实时反馈**：操作成功/失败消息提示
- **流畅动画**：平滑滚动，过渡效果

## 📦 技术栈

### 后端
- Spring Boot 3.5.6
- MyBatis 3.0.3
- MySQL 8.x
- Lombok

### 前端
- 原生 HTML5
- CSS3（Flexbox, Grid, 渐变）
- JavaScript ES6+（Fetch API, Async/Await）

## 🔒 安全提示

⚠️ **当前版本为演示版本，包含以下限制：**

1. **密码未加密**：生产环境需要使用BCrypt加密
2. **无身份认证**：建议添加JWT或Session认证
3. **跨域开放**：`@CrossOrigin(origins = "*")` 应限制具体域名
4. **无权限控制**：所有用户都可以执行所有操作

### 生产环境改进建议
1. 添加用户认证和授权
2. 实现密码加密（BCrypt）
3. 添加操作日志
4. 实现数据验证和过滤
5. 添加请求限流
6. 使用HTTPS

## 📁 项目结构

```
src/main/
├── java/com/example/demo/
│   ├── controller/
│   │   └── UserController.java      # REST API控制器（含CRUD接口）
│   ├── service/
│   │   └── UserService.java         # 业务逻辑层（含CRUD方法）
│   ├── mapper/
│   │   └── UserMapper.java          # MyBatis Mapper接口
│   ├── entity/
│   │   └── User.java                # 用户实体类
│   └── dto/
│       ├── ApiResponse.java         # 统一响应格式
│       ├── RegisterRequest.java     # 注册/更新请求DTO
│       ├── LoginRequest.java        # 登录请求DTO
│       └── UserResponse.java        # 用户响应DTO
└── resources/
    ├── mapper/
    │   └── UserMapper.xml           # MyBatis SQL映射文件
    ├── static/
    │   └── index.html               # Web管理界面
    └── application.properties       # 应用配置
```

## 🐛 常见问题

### 1. 无法访问Web页面
- 确保应用已启动
- 检查端口8080是否被占用
- 访问 `http://localhost:8080/index.html`

### 2. API返回CORS错误
- Controller已添加 `@CrossOrigin` 注解
- 检查浏览器控制台错误信息

### 3. 数据库连接失败
- 确认MySQL服务已启动
- 检查 `application.properties` 中的数据库配置
- 确认数据库 `user_db` 已创建

### 4. 用户列表为空
- 先添加一些测试用户
- 检查浏览器控制台是否有错误
- 确认API `/api/user/all` 可以正常访问

## 🎉 完成！

现在你可以通过漂亮的Web界面来管理用户了！

访问地址：**http://localhost:8080/index.html**

