-- 创建电机风扇表
-- 每个设备有 10 个或 16 个电机风扇

CREATE TABLE IF NOT EXISTS motor_fan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '风扇ID',
    fan_name VARCHAR(50) NOT NULL COMMENT '风扇名称：如 风机1号、风机2号 等',
    device_id BIGINT NOT NULL COMMENT '设备ID',
    device_num VARCHAR(50) NOT NULL COMMENT '设备编号',
    is_running TINYINT NOT NULL DEFAULT 0 COMMENT '运行状态：0-停止 1-运行',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_device_id (device_id),
    INDEX idx_device_num (device_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='电机风扇表';

-- 为现有设备插入默认风扇数据（每个设备16个风扇）
INSERT INTO motor_fan (fan_name, device_id, device_num, is_running, created_time, updated_time)
SELECT 
    CONCAT('风机', n.fan_num) as fan_name,
    d.id as device_id,
    d.device_num,
    0 as is_running,
    NOW() as created_time,
    NOW() as updated_time
FROM devices d
CROSS JOIN (
    SELECT 1 as fan_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION
    SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16
) n
WHERE NOT EXISTS (
    SELECT 1 FROM motor_fan mf 
    WHERE mf.device_id = d.id AND mf.fan_name = CONCAT('风机', n.fan_num)
);

-- 验证数据
SELECT '风扇表创建完成' as message;
SELECT COUNT(*) as total_fans FROM motor_fan;
SELECT device_num, COUNT(*) as fan_count FROM motor_fan GROUP BY device_num;

