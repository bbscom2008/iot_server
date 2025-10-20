-- 为现有数据库添加注册相关字段
-- 如果数据库已存在，执行此脚本添加新字段

USE iot_system;

-- 检查并添加 breeding_type 字段
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
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(20) COMMENT ''养殖类型：养猪、养鸭、养鸡、养兔、其他'' AFTER icon')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 检查并添加 position 字段
SET @columnname = 'position';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(20) COMMENT ''岗位：老板、饲养员、其他'' AFTER breeding_type')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 为现有用户设置默认值
UPDATE users SET breeding_type = '养猪' WHERE breeding_type IS NULL;
UPDATE users SET position = '老板' WHERE position IS NULL;

-- 查看结果
SELECT id, phone, nike_name, breeding_type, position, created_at FROM users;

SELECT '=== 用户表更新完成 ===' as '';

