# 用户注册登录API使用说明（MyBatis版本）

## 项目技术栈
- Spring Boot 3.5.6
- MyBatis 3.0.3
- MySQL 8.x
- Lombok

## 项目配置

### 1. 创建数据库和表
在MySQL中执行 `database_setup.sql` 脚本：
```bash
mysql -u root -p < database_setup.sql
```

或者手动执行：
```sql
CREATE DATABASE IF NOT EXISTS user_auth_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE user_auth_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. 数据库配置
在 `src/main/resources/application.properties` 中配置你的MySQL数据库信息：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/user_auth_db?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8
spring.datasource.username=root
spring.datasource.password=root  # 请修改为你的MySQL密码
```

### 3. 启动项目
```bash
mvn spring-boot:run
```

或者在IDE中直接运行 `DemoApplication.java`

启动成功后，应用将运行在 `http://localhost:8080`

## API接口

### 1. 测试接口
**请求：**
```
GET http://localhost:8080/api/user/hello
```

**响应：**
```json
{
  "success": true,
  "message": "Hello, User API is working!",
  "data": "欢迎使用用户认证系统"
}
```

### 2. 用户注册
**请求：**
```
POST http://localhost:8080/api/user/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}
```

**成功响应：**
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "createdAt": "2025-10-12T10:30:00"
  }
}
```

**失败响应（用户名已存在）：**
```json
{
  "success": false,
  "message": "用户名已存在",
  "data": null
}
```

**失败响应（参数验证错误）：**
```json
{
  "success": false,
  "message": "用户名长度必须在3-50个字符之间",
  "data": null
}
```

### 3. 用户登录
**请求：**
```
POST http://localhost:8080/api/user/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}
```

**成功响应：**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "createdAt": "2025-10-12T10:30:00"
  }
}
```

**失败响应：**
```json
{
  "success": false,
  "message": "用户名或密码错误",
  "data": null
}
```

## 参数验证规则

### 注册
- `username`: 必填，长度3-50个字符
- `password`: 必填，长度6-100个字符

### 登录
- `username`: 必填
- `password`: 必填

## 测试示例（使用curl）

### 注册用户
```bash
curl -X POST http://localhost:8080/api/user/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"password\":\"123456\"}"
```

### 登录
```bash
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"password\":\"123456\"}"
```

## 项目结构

```
src/main/java/com/example/demo/
├── controller/        # 控制器层
│   └── UserController.java
├── service/          # 服务层
│   └── UserService.java
├── mapper/           # MyBatis Mapper接口
│   └── UserMapper.java
├── entity/           # 实体类
│   └── User.java
├── dto/              # 数据传输对象
│   ├── ApiResponse.java
│   ├── LoginRequest.java
│   ├── RegisterRequest.java
│   └── UserResponse.java
└── DemoApplication.java

src/main/resources/
├── mapper/           # MyBatis XML映射文件
│   └── UserMapper.xml
└── application.properties
```

## 数据库表结构

数据库表 `users` 结构如下：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 主键，自增 |
| username | VARCHAR(50) | 用户名，唯一 |
| password | VARCHAR(255) | 密码 |
| created_at | DATETIME | 创建时间 |

## MyBatis 配置说明

### application.properties 中的 MyBatis 配置：
```properties
# MyBatis映射文件位置
mybatis.mapper-locations=classpath:mapper/*.xml

# 实体类包路径（用于类型别名）
mybatis.type-aliases-package=com.example.demo.entity

# 下划线转驼峰命名
mybatis.configuration.map-underscore-to-camel-case=true

# 打印SQL日志
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

### MyBatis Mapper 接口：
- 使用 `@Mapper` 注解标注
- 方法对应 XML 文件中的 SQL 语句
- 支持自动回填主键（`useGeneratedKeys="true"`）

### MyBatis XML 映射文件：
- 位置：`src/main/resources/mapper/`
- namespace 对应 Mapper 接口的全限定名
- 支持 resultMap 自定义结果映射

## 注意事项

⚠️ **重要提示：** 
1. **数据库表需要手动创建**：与JPA不同，MyBatis不会自动创建表，请先执行 `database_setup.sql`
2. 当前实现为演示版本，密码以明文形式存储在数据库中
3. 生产环境中必须使用BCrypt等加密方式对密码进行加密
4. 建议添加JWT或Session来管理用户登录状态
5. 建议添加更多的异常处理和日志记录
6. MyBatis需要手动管理SQL，但提供了更灵活的数据库操作能力

## 后续改进建议

1. **密码加密**：使用Spring Security的BCryptPasswordEncoder
2. **JWT认证**：添加JWT Token实现无状态认证
3. **全局异常处理**：使用@ControllerAdvice统一处理异常
4. **日志记录**：添加日志记录用户操作
5. **邮箱验证**：添加邮箱字段和验证功能
6. **忘记密码**：添加密码找回功能
7. **用户角色**：添加用户角色和权限管理

