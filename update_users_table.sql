-- 为现有数据库添加注册相关字段
-- 如果数据库已存在，执行此脚本添加新字段

USE iot_system;

-- 检查并添加 breeding_type 字段（INT 类型）
SET @dbname = 'iot_system';
SET @tablename = 'users';
SET @columnname = 'breeding_type';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT COMMENT ''养殖类型：字典中的 breed_type'' AFTER icon')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 检查并添加 role 字段（INT 类型）
SET @columnname = 'role';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT COMMENT ''角色：字典中的 role_type'' AFTER breeding_type')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 为现有用户设置默认值（0-猪，0-老板）
UPDATE users SET breeding_type = 0 WHERE breeding_type IS NULL;
UPDATE users SET role = 0 WHERE role IS NULL;

-- 查看结果
SELECT id, phone, nike_name, breeding_type, role, created_at FROM users;

SELECT '=== 用户表更新完成 ===' as '';

