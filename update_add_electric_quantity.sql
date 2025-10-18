-- 添加电量字段到设备表
-- 如果你已经创建了数据库，执行此脚本添加缺失的字段

USE iot_system;

-- 检查字段是否存在，如果不存在则添加
SET @dbname = 'iot_system';
SET @tablename = 'devices';
SET @columnname = 'electric_quantity';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT DEFAULT 100 COMMENT ''电量（0-100）'' AFTER gas_con')
));

PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 为已存在的设备设置默认电量值
UPDATE devices SET electric_quantity = 85 WHERE electric_quantity IS NULL OR electric_quantity = 0;

-- 查看结果
SELECT id, device_num, device_name, electric_quantity FROM devices;

SELECT '=== 电量字段添加完成 ===' as '';

