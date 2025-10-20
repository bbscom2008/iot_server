#!/bin/bash

# 注册功能一键测试脚本

echo "======================================"
echo "   注册功能测试"
echo "======================================"
echo ""

# 随机生成手机号（确保是全新的）
RANDOM_PHONE="139$(date +%s | tail -c 9)"

echo "使用随机手机号: $RANDOM_PHONE"
echo ""

echo "执行注册请求..."
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8080/user/register \
  -H "Content-Type: application/json" \
  -d "{
    \"phone\": \"$RANDOM_PHONE\",
    \"password\": \"123456\",
    \"verifyCode\": \"123456\",
    \"breedingType\": \"养猪\",
    \"position\": \"老板\"
  }")

# 提取 HTTP 状态码
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo "======================================"
echo "测试结果："
echo "======================================"
echo "HTTP 状态码: $HTTP_CODE"
echo "响应内容: $BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 测试通过！注册成功"
    echo ""
    echo "验证：尝试登录..."
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/user/login \
      -H "Content-Type: application/json" \
      -d "{
        \"phone\": \"$RANDOM_PHONE\",
        \"password\": \"123456\"
      }")
    echo "登录响应: $LOGIN_RESPONSE"
else
    echo "❌ 测试失败！HTTP 状态码应该是 200，实际是 $HTTP_CODE"
    echo "响应内容: $BODY"
fi

echo ""
echo "======================================"
echo "请查看后端控制台日志，应该看到："
echo "  - 收到注册请求，手机号: $RANDOM_PHONE"
echo "  - 开始注册用户，手机号: $RANDOM_PHONE"
echo "  - 注册成功，手机号: $RANDOM_PHONE, 用户ID: X, 影响行数: 1"
echo "  - 注册成功，准备返回响应"
echo "  - 返回响应: ApiResponse(code=200, msg=注册成功, data=null)"
echo "======================================"

