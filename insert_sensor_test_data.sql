-- 向 sensors 表插入测试数据
-- 假设 devices 表中已有设备数据，设备编号从 DEV001 开始

-- ============================================
-- 清空现有数据（可选）
-- ============================================
-- DELETE FROM sensors;

-- ============================================
-- 为 DEV001 设备插入传感器数据
-- ============================================
INSERT INTO sensors (device_id, device_num, sensor_type_id, sensor_name, sensor_value, unit, created_at, updated_at) VALUES
(1, 'DEV001', 5, '温度1', 25.5, '°C', NOW(), NOW()),
(1, 'DEV001', 5, '温度2', 26.0, '°C', NOW(), NOW()),
(1, 'DEV001', 5, '温度3', 24.8, '°C', NOW(), NOW()),
(1, 'DEV001', 5, '温度4', 25.2, '°C', NOW(), NOW()),
(1, 'DEV001', 6, '湿度', 60.5, '%', NOW(), NOW()),
(1, 'DEV001', 7, '气体浓度', 50.0, 'ppm', NOW(), NOW());

-- ============================================
-- 为 DEV002 设备插入传感器数据
-- ============================================
INSERT INTO sensors (device_id, device_num, sensor_type_id, sensor_name, sensor_value, unit, created_at, updated_at) VALUES
(2, 'DEV002', 5, '温度1', 24.0, '°C', NOW(), NOW()),
(2, 'DEV002', 5, '温度2', 24.5, '°C', NOW(), NOW()),
(2, 'DEV002', 5, '温度3', 23.8, '°C', NOW(), NOW()),
(2, 'DEV002', 6, '湿度', 55.0, '%', NOW(), NOW()),
(2, 'DEV002', 7, '气体浓度', 45.0, 'ppm', NOW(), NOW());

-- ============================================
-- 为 DEV003 设备插入传感器数据
-- ============================================
INSERT INTO sensors (device_id, device_num, sensor_type_id, sensor_name, sensor_value, unit, created_at, updated_at) VALUES
(3, 'DEV003', 5, '温度1', 28.0, '°C', NOW(), NOW()),
(3, 'DEV003', 5, '温度2', 28.5, '°C', NOW(), NOW()),
(3, 'DEV003', 6, '湿度', 70.0, '%', NOW(), NOW()),
(3, 'DEV003', 7, '气体浓度', 80.0, 'ppm', NOW(), NOW());

-- ============================================
-- 为 DEV004 设备插入传感器数据
-- ============================================
INSERT INTO sensors (device_id, device_num, sensor_type_id, sensor_name, sensor_value, unit, created_at, updated_at) VALUES
(4, 'DEV004', 5, '温度1', 22.0, '°C', NOW(), NOW()),
(4, 'DEV004', 5, '温度2', 22.5, '°C', NOW(), NOW()),
(4, 'DEV004', 5, '温度3', 21.8, '°C', NOW(), NOW()),
(4, 'DEV004', 6, '湿度', 50.0, '%', NOW(), NOW()),
(4, 'DEV004', 7, '气体浓度', 40.0, 'ppm', NOW(), NOW());

-- ============================================
-- 验证插入的数据
-- ============================================
SELECT '=== 传感器数据统计 ===' as '';
SELECT 
    s.sensor_type_id,
    CASE s.sensor_type_id
        WHEN 5 THEN '温度'
        WHEN 6 THEN '湿度'
        WHEN 7 THEN '气体'
        ELSE '未知'
    END as sensor_type_name,
    COUNT(*) as count
FROM sensors s
GROUP BY s.sensor_type_id;

SELECT '=== 各设备传感器数据 ===' as '';
SELECT 
    device_num,
    CASE sensor_type_id
        WHEN 5 THEN '温度'
        WHEN 6 THEN '湿度'
        WHEN 7 THEN '气体'
        ELSE '未知'
    END as sensor_type,
    sensor_name,
    sensor_value,
    unit
FROM sensors
ORDER BY device_num, sensor_type_id, sensor_name;

-- ============================================
-- 完成
-- ============================================
SELECT '传感器测试数据插入完成' as '';

