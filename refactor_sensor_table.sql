-- 重构传感器数据的迁移脚本
-- 从 devices 表中删除传感器字段，创建独立的 sensors 表
-- 执行时间：迁移前请先备份数据库

-- ============================================
-- 第一步：创建 sensors 表
-- ============================================

CREATE TABLE IF NOT EXISTS sensors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '传感器ID',
    device_id BIGINT NOT NULL COMMENT '设备ID',
    device_num VARCHAR(50) NOT NULL COMMENT '设备编号',
    sensor_type_id INT NOT NULL COMMENT '传感器类型ID：5-温度 6-湿度 7-气体',
    sensor_name VARCHAR(100) COMMENT '传感器名称：温度1、温度2等',
    sensor_value DECIMAL(10,2) COMMENT '传感器值',
    unit VARCHAR(20) COMMENT '单位：°C, %, ppm等',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_device_id (device_id),
    INDEX idx_device_num (device_num),
    INDEX idx_sensor_type_id (sensor_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='传感器表';

-- ============================================
-- 第二步：迁移数据（可选，如果有现有数据）
-- ============================================
-- 将 devices 表中的传感器数据迁移到 sensors 表

INSERT INTO sensors (device_id, device_num, sensor_type_id, sensor_name, sensor_value, unit, created_at, updated_at)
SELECT 
    id as device_id,
    device_num,
    5 as sensor_type_id,
    '温度1' as sensor_name,
    temperature1 as sensor_value,
    '°C' as unit,
    created_at,
    updated_at
FROM devices
WHERE temperature1 IS NOT NULL
ON DUPLICATE KEY UPDATE sensor_value = sensor_value;

INSERT INTO sensors (device_id, device_num, sensor_type_id, sensor_name, sensor_value, unit, created_at, updated_at)
SELECT 
    id as device_id,
    device_num,
    5 as sensor_type_id,
    '温度2' as sensor_name,
    temperature2 as sensor_value,
    '°C' as unit,
    created_at,
    updated_at
FROM devices
WHERE temperature2 IS NOT NULL
ON DUPLICATE KEY UPDATE sensor_value = sensor_value;

INSERT INTO sensors (device_id, device_num, sensor_type_id, sensor_name, sensor_value, unit, created_at, updated_at)
SELECT 
    id as device_id,
    device_num,
    5 as sensor_type_id,
    '温度3' as sensor_name,
    temperature3 as sensor_value,
    '°C' as unit,
    created_at,
    updated_at
FROM devices
WHERE temperature3 IS NOT NULL
ON DUPLICATE KEY UPDATE sensor_value = sensor_value;

INSERT INTO sensors (device_id, device_num, sensor_type_id, sensor_name, sensor_value, unit, created_at, updated_at)
SELECT 
    id as device_id,
    device_num,
    5 as sensor_type_id,
    '温度4' as sensor_name,
    temperature4 as sensor_value,
    '°C' as unit,
    created_at,
    updated_at
FROM devices
WHERE temperature4 IS NOT NULL
ON DUPLICATE KEY UPDATE sensor_value = sensor_value;

INSERT INTO sensors (device_id, device_num, sensor_type_id, sensor_name, sensor_value, unit, created_at, updated_at)
SELECT 
    id as device_id,
    device_num,
    6 as sensor_type_id,
    '湿度' as sensor_name,
    humidity as sensor_value,
    '%' as unit,
    created_at,
    updated_at
FROM devices
WHERE humidity IS NOT NULL
ON DUPLICATE KEY UPDATE sensor_value = sensor_value;

INSERT INTO sensors (device_id, device_num, sensor_type_id, sensor_name, sensor_value, unit, created_at, updated_at)
SELECT 
    id as device_id,
    device_num,
    7 as sensor_type_id,
    '气体浓度' as sensor_name,
    gas_con as sensor_value,
    'ppm' as unit,
    created_at,
    updated_at
FROM devices
WHERE gas_con IS NOT NULL
ON DUPLICATE KEY UPDATE sensor_value = sensor_value;

-- ============================================
-- 第三步：删除 devices 表中的传感器列
-- ============================================

ALTER TABLE devices DROP COLUMN IF EXISTS temperature1;
ALTER TABLE devices DROP COLUMN IF EXISTS temperature2;
ALTER TABLE devices DROP COLUMN IF EXISTS temperature3;
ALTER TABLE devices DROP COLUMN IF EXISTS temperature4;
ALTER TABLE devices DROP COLUMN IF EXISTS humidity;
ALTER TABLE devices DROP COLUMN IF EXISTS gas_con;
ALTER TABLE devices DROP COLUMN IF EXISTS outage_state;
ALTER TABLE devices DROP COLUMN IF EXISTS gas_con_status;

-- ============================================
-- 第四步：验证结果
-- ============================================

DESC devices;
DESC sensors;

SELECT '传感器数据已成功重构到 sensors 表' as '';
SELECT 'devices 表中的传感器字段已删除' as '';

