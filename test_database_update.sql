-- ============================================
-- 数据库更新测试脚本
-- ============================================

-- 步骤1: 查看当前所有用户
SELECT id, phone, nike_name, breeding_type, role, created_at, updated_at 
FROM users 
ORDER BY id;

-- 步骤2: 查看具体用户（替换为你的手机号）
SELECT id, phone, nike_name, breeding_type, role, created_at, updated_at 
FROM users 
WHERE phone = '13800138000';

-- 步骤3: 测试手动更新（替换为你的用户ID）
-- 注意：执行前请记录原始数据
UPDATE users 
SET breeding_type = 1, 
    role = 1,
    nike_name = '测试更新',
    updated_at = NOW() 
WHERE id = 1;

-- 步骤4: 验证更新结果
SELECT id, phone, nike_name, breeding_type, role, updated_at 
FROM users 
WHERE id = 1;

-- 步骤5: 如果手动更新成功，说明SQL没问题
-- 问题在后端代码或事务管理

-- 步骤6: 查看表结构，确认字段名称
DESCRIBE users;

-- 或者
SHOW COLUMNS FROM users;

-- 步骤7: 检查是否有触发器或约束阻止更新
SHOW TRIGGERS LIKE 'users';

-- 步骤8: 回滚测试数据（如果需要）
UPDATE users 
SET breeding_type = NULL, 
    role = NULL,
    nike_name = '原始昵称' 
WHERE id = 1;

