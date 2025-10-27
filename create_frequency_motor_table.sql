-- 创建变频电机表
-- 每个设备有2个变频电机（变频1、变频2）

CREATE TABLE IF NOT EXISTS frequency_motor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '变频电机ID',
    device_id BIGINT NOT NULL COMMENT '设备ID',
    device_num VARCHAR(50) NOT NULL COMMENT '设备编号',
    name VARCHAR(50) NOT NULL COMMENT '变频电机名称：变频1、变频2',
    protect_speed DECIMAL(10,2) COMMENT '保护转速',
    is_auto TINYINT NOT NULL DEFAULT 0 COMMENT '运行模式：0-手动 1-自动，默认手动',
    manual_speed DECIMAL(10,2) DEFAULT 10 COMMENT '手动转速，默认10',
    value INT DEFAULT 10 COMMENT '当前值，默认10',
    run_time INT DEFAULT 60 COMMENT '运行时间（秒），默认60秒',
    pause_time INT DEFAULT 30 COMMENT '暂停时间（秒），默认30秒',
    control_type TINYINT DEFAULT 1 COMMENT '控制类型：1-温控 2-湿控 3-气体，默认1',
    temp_upper DECIMAL(10,2) COMMENT '温度上限',
    temp_lower DECIMAL(10,2) COMMENT '温度下限',
    humidity_upper DECIMAL(10,2) COMMENT '湿度上限',
    humidity_lower DECIMAL(10,2) COMMENT '湿度下限',
    gas_upper DECIMAL(10,2) COMMENT '气体上限',
    gas_lower DECIMAL(10,2) COMMENT '气体下限',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_device_id (device_id),
    INDEX idx_device_num (device_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='变频电机表';

-- 为现有设备插入默认变频电机数据（每个设备2个）
INSERT INTO frequency_motor (device_id, device_num, name, protect_speed, is_auto, manual_speed, value, run_time, pause_time, control_type, temp_upper, temp_lower, humidity_upper, humidity_lower, gas_upper, gas_lower, created_time, updated_time)
SELECT 
    d.id as device_id,
    d.device_num,
    '变频1' as name,
    50 as protect_speed,
    0 as is_auto,
    10 as manual_speed,
    10 as value,
    60 as run_time,
    30 as pause_time,
    1 as control_type,
    35 as temp_upper,
    20 as temp_lower,
    70 as humidity_upper,
    40 as humidity_lower,
    100 as gas_upper,
    0 as gas_lower,
    NOW() as created_time,
    NOW() as updated_time
FROM devices d
WHERE NOT EXISTS (
    SELECT 1 FROM frequency_motor fm 
    WHERE fm.device_id = d.id AND fm.name = '变频1'
)

UNION ALL

SELECT 
    d.id as device_id,
    d.device_num,
    '变频2' as name,
    50 as protect_speed,
    0 as is_auto,
    10 as manual_speed,
    10 as value,
    60 as run_time,
    30 as pause_time,
    1 as control_type,
    35 as temp_upper,
    20 as temp_lower,
    70 as humidity_upper,
    40 as humidity_lower,
    100 as gas_upper,
    0 as gas_lower,
    NOW() as created_time,
    NOW() as updated_time
FROM devices d
WHERE NOT EXISTS (
    SELECT 1 FROM frequency_motor fm 
    WHERE fm.device_id = d.id AND fm.name = '变频2'
);

-- 验证数据
SELECT '变频电机表创建完成' as message;
SELECT COUNT(*) as total_motors FROM frequency_motor;
SELECT device_num, COUNT(*) as motor_count FROM frequency_motor GROUP BY device_num;

