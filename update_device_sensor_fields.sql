-- 更新设备表传感器字段结构
-- 将ta、tb字段改为temperature1-4字段

USE iot_system;

-- 添加新的温度字段
ALTER TABLE devices 
ADD COLUMN temperature1 DECIMAL(5,2) COMMENT '温度1' AFTER `signal`,
ADD COLUMN temperature2 DECIMAL(5,2) COMMENT '温度2' AFTER temperature1,
ADD COLUMN temperature3 DECIMAL(5,2) COMMENT '温度3' AFTER temperature2,
ADD COLUMN temperature4 DECIMAL(5,2) COMMENT '温度4' AFTER temperature3;

-- 将现有ta、tb数据迁移到temperature1、temperature2
UPDATE devices SET 
    temperature1 = ta,
    temperature2 = tb
WHERE ta IS NOT NULL OR tb IS NOT NULL;

-- 删除旧的ta、tb字段
ALTER TABLE devices DROP COLUMN ta;
ALTER TABLE devices DROP COLUMN tb;

-- 验证更新结果
SELECT '=== 更新后的设备表结构 ===' as '';
DESCRIBE devices;

SELECT '=== 更新后的设备数据 ===' as '';
SELECT id, device_num, device_name, temperature1, temperature2, temperature3, temperature4, humidity, gas_con 
FROM devices;
