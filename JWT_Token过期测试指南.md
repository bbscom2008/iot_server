# JWT Token 过期测试指南

## ⏰ Token 配置

**当前配置：** Token 有效期 = **1 分钟**（60000 毫秒）

**配置文件：** `src/main/resources/application.properties`
```properties
jwt.expiration=60000  # 60000 毫秒 = 1 分钟
```

**时间对照表：**
| 时长 | 毫秒值 |
|------|--------|
| 10 秒 | 10000 |
| 30 秒 | 30000 |
| **1 分钟** | **60000** |
| 5 分钟 | 300000 |
| 30 分钟 | 1800000 |
| 1 小时 | 3600000 |
| 1 天 | 86400000 |
| 7 天 | 604800000 |

---

## 🧪 测试步骤

### 步骤1：重启后端服务（必须！）

```bash
# 停止当前服务（Ctrl+C）
# 重新启动
mvn spring-boot:run
```

**⚠️ 重要：** 修改配置文件后必须重启服务才能生效！

---

### 步骤2：登录获取 Token

**使用 curl：**
```bash
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}'
```

**响应示例：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicGhvbmUiOiIxMzgwMDEzODAwMCIsImlhdCI6MTcwOTU0ODAwMCwiZXhwIjoxNzA5NTQ4MDYwfQ.xxxx",
    "user": {...}
  }
}
```

**记下登录时间：** 例如 14:30:00

---

### 步骤3：立即使用 Token（应该成功）

```bash
# 替换为实际的 token
TOKEN="eyJhbGciOiJIUzI1NiJ9..."

curl -X GET http://localhost:8080/user/info \
  -H "Authorization: $TOKEN"
```

**预期结果：** ✅ 返回用户信息（成功）

---

### 步骤4：等待 1 分钟后再次使用（应该失败）

**等待 1 分钟...**

```bash
# 1 分钟后，再次使用相同的 token
curl -X GET http://localhost:8080/user/info \
  -H "Authorization: $TOKEN"
```

**预期结果：** ❌ Token 已过期（失败）

**预期响应：**
```json
{
  "code": 500,
  "msg": "JWT expired at 2024-10-18T14:31:00...",
  "data": null
}
```

---

### 步骤5：重新登录获取新 Token

```bash
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}'
```

获取新的 token 后，应该又可以正常访问了。

---

## 🎯 自动化测试脚本

创建 `test_token_expiration.sh`（Linux/Mac）或 `test_token_expiration.bat`（Windows）：

### Linux/Mac 脚本

```bash
#!/bin/bash

echo "=== JWT Token 过期测试 ==="
echo ""

# 1. 登录获取 token
echo "步骤1：登录获取 token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}')

echo "$LOGIN_RESPONSE"
echo ""

# 提取 token（需要 jq 工具）
# TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
# echo "Token: $TOKEN"

echo "步骤2：请手动复制上面的 token，然后执行："
echo "TOKEN=\"你的token\""
echo ""
echo "步骤3：立即测试 token（应该成功）："
echo "curl -X GET http://localhost:8080/user/info -H \"Authorization: \$TOKEN\""
echo ""
echo "步骤4：等待 1 分钟后再次执行上面的命令（应该失败）"
echo ""
echo "步骤5：观察错误消息，应该包含 'JWT expired at'"
```

### Windows PowerShell 脚本

```powershell
# test_token_expiration.ps1

Write-Host "=== JWT Token 过期测试 ===" -ForegroundColor Cyan
Write-Host ""

# 1. 登录获取 token
Write-Host "步骤1：登录获取 token..." -ForegroundColor Green
$loginBody = @{
    phone = "13800138000"
    password = "123456"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/user/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

Write-Host "登录响应："
$response | ConvertTo-Json -Depth 10

$token = $response.data.token
Write-Host ""
Write-Host "Token: $token" -ForegroundColor Yellow
Write-Host ""

# 2. 立即使用 token
Write-Host "步骤2：立即使用 token（应该成功）..." -ForegroundColor Green
try {
    $userInfo = Invoke-RestMethod -Uri "http://localhost:8080/user/info" `
        -Method Get `
        -Headers @{ "Authorization" = $token }
    Write-Host "✅ 成功！用户信息：" -ForegroundColor Green
    $userInfo | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ 失败：$_" -ForegroundColor Red
}

Write-Host ""
Write-Host "步骤3：等待 1 分钟..." -ForegroundColor Yellow
Start-Sleep -Seconds 65  # 等待 65 秒确保过期

Write-Host ""
Write-Host "步骤4：1 分钟后再次使用 token（应该失败）..." -ForegroundColor Green
try {
    $userInfo = Invoke-RestMethod -Uri "http://localhost:8080/user/info" `
        -Method Get `
        -Headers @{ "Authorization" = $token }
    Write-Host "⚠️ 意外：Token 仍然有效" -ForegroundColor Yellow
    $userInfo | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✅ 预期结果：Token 已过期" -ForegroundColor Green
    Write-Host "错误信息：$_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 测试完成 ===" -ForegroundColor Cyan
```

---

## 📋 手动测试步骤（推荐）

### 1. 重启后端服务

```bash
mvn spring-boot:run
```

### 2. 登录获取 Token

```bash
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}'
```

**复制返回的 token**

### 3. 立即测试（应该成功）✅

```bash
# 替换为你的 token
curl -X GET http://localhost:8080/user/info \
  -H "Authorization: eyJhbGciOiJIUzI1NiJ9..."
```

**预期：** 返回用户信息

### 4. 记下当前时间

例如：14:30:00

### 5. 等待 1 分钟

⏰ 等待 60 秒...

### 6. 再次测试（应该失败）❌

```bash
# 使用相同的 token
curl -X GET http://localhost:8080/user/info \
  -H "Authorization: eyJhbGciOiJIUzI1NiJ9..."
```

**预期响应：**
```json
{
  "code": 500,
  "msg": "JWT expired at 2024-10-18T14:31:00Z. Current time: 2024-10-18T14:31:05Z",
  "data": null
}
```

### 7. 重新登录获取新 Token

```bash
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}'
```

**预期：** 获取新的 token，又可以使用了

---

## 🎯 使用 test_login.http 测试

### 步骤1：执行登录

```http
### 测试用户登录
POST http://localhost:8080/user/login
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "123456"
}
```

点击执行，复制返回的 token

### 步骤2：立即测试（替换 YOUR_TOKEN）

```http
### 获取用户信息（立即执行，应该成功）
GET http://localhost:8080/user/info
Authorization: eyJhbGciOiJIUzI1NiJ9.你的token
```

### 步骤3：等待 1 分钟

⏰ 等待...

### 步骤4：再次执行相同请求

```http
### 获取用户信息（1分钟后，应该失败）
GET http://localhost:8080/user/info
Authorization: eyJhbGciOiJIUzI1NiJ9.你的token
```

**预期：** 返回 token 过期错误

---

## 📊 观察 Token 内容

### 解码 JWT Token（在线工具）

访问：https://jwt.io/

粘贴你的 token，可以看到：

```json
{
  "sub": "1",              // 用户ID
  "phone": "13800138000",  // 手机号
  "iat": 1709548000,       // 签发时间（时间戳）
  "exp": 1709548060        // 过期时间（时间戳，比 iat 多 60 秒）
}
```

**计算：** `exp - iat = 60 秒 = 1 分钟`

---

## 🔍 验证过期逻辑

查看 `JwtUtil.java` 中的验证逻辑：

```java
private boolean isTokenExpired(String token) {
    Date expiration = getClaims(token).getExpiration();
    return expiration.before(new Date());  // 当前时间超过过期时间则返回 true
}
```

---

## 💡 测试技巧

### 技巧1：使用定时器自动测试

**JavaScript 版本（浏览器控制台）：**

```javascript
// 登录并保存 token
async function testTokenExpiration() {
    // 1. 登录
    const loginRes = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '13800138000', password: '123456' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    
    console.log('✅ 登录成功，Token:', token.substring(0, 50) + '...');
    
    // 2. 立即测试（应该成功）
    console.log('\n⏱️ 立即测试（应该成功）...');
    let res = await fetch('http://localhost:8080/user/info', {
        headers: { 'Authorization': token }
    });
    let data = await res.json();
    console.log('结果:', data.code === 200 ? '✅ 成功' : '❌ 失败', data);
    
    // 3. 等待 65 秒后再测试（应该失败）
    console.log('\n⏱️ 等待 65 秒后测试...');
    setTimeout(async () => {
        console.log('\n⏱️ 65 秒后测试（应该失败）...');
        let res2 = await fetch('http://localhost:8080/user/info', {
            headers: { 'Authorization': token }
        });
        let data2 = await res2.json();
        console.log('结果:', data2.code === 200 ? '❌ 未过期（异常）' : '✅ 已过期（正常）', data2);
    }, 65000);
}

// 执行测试
testTokenExpiration();
```

### 技巧2：多次测试观察

```bash
# 循环测试，每 10 秒测试一次
for i in {1..8}; do
  echo "=== 第 ${i} 次测试（$(expr $i \* 10) 秒） ==="
  curl -X GET http://localhost:8080/user/info \
    -H "Authorization: $TOKEN"
  echo ""
  sleep 10
done
```

---

## 📈 测试预期结果

### 时间线

```
00:00 - 登录获取 token
00:05 - 使用 token ✅ 成功
00:15 - 使用 token ✅ 成功
00:30 - 使用 token ✅ 成功
00:45 - 使用 token ✅ 成功
00:59 - 使用 token ✅ 成功（最后几秒）
01:00 - 使用 token ❌ 失败（过期）
01:05 - 使用 token ❌ 失败（过期）
```

### 过期后的错误信息

**错误响应示例：**
```json
{
  "code": 500,
  "msg": "JWT expired at 2024-10-18T14:31:00Z. Current time: 2024-10-18T14:31:05Z, a difference of 5000 milliseconds.",
  "data": null
}
```

**错误信息解析：**
- `expired at` - Token 过期时间
- `Current time` - 当前时间
- `difference of 5000 milliseconds` - 已过期 5 秒

---

## 🔄 恢复正常配置

测试完成后，如果要恢复正常的有效期：

### 1 小时有效期（推荐生产环境）
```properties
jwt.expiration=3600000
```

### 1 天有效期
```properties
jwt.expiration=86400000
```

### 7 天有效期（之前的配置）
```properties
jwt.expiration=604800000
```

**修改后记得重启服务！**

---

## 🎨 创建可视化测试页面

我为你创建了一个测试页面，自动化测试 token 过期：

**文件：** `test_token_expiration.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Token 过期测试</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px 0;
        }
        .log {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
            max-height: 400px;
            overflow-y: auto;
        }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
    </style>
</head>
<body>
    <div class="container">
        <h1>⏰ JWT Token 过期测试</h1>
        <p>Token 有效期：<strong>1 分钟</strong></p>
        
        <button onclick="startTest()">开始自动测试</button>
        <button onclick="clearLog()">清除日志</button>
        
        <div id="log" class="log"></div>
    </div>

    <script>
        let token = '';
        let testInterval = null;

        function log(message, type = 'info') {
            const logDiv = document.getElementById('log');
            const time = new Date().toLocaleTimeString();
            const className = type;
            logDiv.innerHTML += `<div class="${className}">[${time}] ${message}</div>`;
            logDiv.scrollTop = logDiv.scrollHeight;
        }

        function clearLog() {
            document.getElementById('log').innerHTML = '';
        }

        async function startTest() {
            clearLog();
            log('🚀 开始测试...', 'info');
            
            // 1. 登录
            log('步骤1：登录获取 token...', 'info');
            try {
                const loginRes = await fetch('http://localhost:8080/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: '13800138000',
                        password: '123456'
                    })
                });
                const loginData = await loginRes.json();
                
                if (loginData.code === 200) {
                    token = loginData.data.token;
                    log(`✅ 登录成功！Token: ${token.substring(0, 30)}...`, 'success');
                } else {
                    log(`❌ 登录失败: ${loginData.msg}`, 'error');
                    return;
                }
            } catch (error) {
                log(`❌ 登录请求失败: ${error.message}`, 'error');
                return;
            }

            // 2. 每 10 秒测试一次，持续 80 秒
            log('步骤2：开始定时测试（每10秒一次）...', 'info');
            log('预计 60 秒后 token 将过期', 'info');
            
            let count = 0;
            testInterval = setInterval(async () => {
                count++;
                const elapsed = count * 10;
                
                log(`\n--- 第 ${count} 次测试（已过 ${elapsed} 秒）---`, 'info');
                
                try {
                    const res = await fetch('http://localhost:8080/user/info', {
                        headers: { 'Authorization': token }
                    });
                    const data = await res.json();
                    
                    if (data.code === 200) {
                        log(`✅ Token 仍然有效（已过 ${elapsed} 秒）`, 'success');
                    } else {
                        log(`❌ Token 已过期！错误: ${data.msg}`, 'error');
                        log(`🎉 测试成功！Token 在 ${elapsed} 秒时过期`, 'success');
                        clearInterval(testInterval);
                    }
                } catch (error) {
                    log(`❌ 请求失败: ${error.message}`, 'error');
                }
                
                // 停止条件
                if (count >= 8) {
                    clearInterval(testInterval);
                    log('\n✅ 测试完成', 'success');
                }
            }, 10000);  // 每 10 秒执行一次
        }
    </script>
</body>
</html>
```

---

## 🎯 测试验证点

### ✅ 应该通过的测试

1. **立即使用 token** - 返回 200，获取到数据
2. **30 秒内使用** - 返回 200，获取到数据
3. **50 秒内使用** - 返回 200，获取到数据

### ❌ 应该失败的测试

1. **60 秒后使用** - 返回 500，错误信息包含 "JWT expired"
2. **65 秒后使用** - 返回 500，错误信息包含 "JWT expired"
3. **任意时间后使用** - 返回 500，token 已过期

---

## 📝 常见问题

### Q1: Token 没有过期？

**检查：**
1. 是否重启了后端服务？
2. `application.properties` 中的配置是否正确？
3. 是否真的等待了 1 分钟？

### Q2: 如何查看 token 的过期时间？

**方法1：** 使用 https://jwt.io/ 解码 token

**方法2：** 查看错误信息中的 `expired at` 时间

### Q3: 不同接口过期时间能不同吗？

当前所有接口使用相同的过期时间。如需不同过期时间：
- 可以在生成 token 时传入不同的有效期
- 或实现多种类型的 token（access token + refresh token）

---

## 🎉 测试完成后

测试完成后，建议恢复为更长的有效期：

```properties
# 推荐：1 小时
jwt.expiration=3600000

# 或者：1 天
jwt.expiration=86400000
```

**别忘了重启服务！**

---

## 📚 相关文件

- ✅ `application.properties` - JWT 配置（已改为1分钟）
- ✅ `JwtUtil.java` - Token 生成和验证逻辑
- ✅ `test_login.http` - HTTP 测试文件
- ✅ `test_token_expiration.html` - 自动化测试页面

---

## 🚀 立即开始测试

1. **重启后端服务**
2. **执行登录获取 token**
3. **等待 1 分钟**
4. **观察 token 过期效果**

祝测试顺利！⏰

