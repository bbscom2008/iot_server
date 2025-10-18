-- IoT农牧物联网系统数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS iot_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE iot_system;

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    phone VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    nike_name VARCHAR(50) COMMENT '昵称',
    address VARCHAR(255) COMMENT '地址',
    icon VARCHAR(500) COMMENT '头像URL',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 设备表
CREATE TABLE IF NOT EXISTS devices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '设备ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    device_num VARCHAR(50) NOT NULL UNIQUE COMMENT '设备编号',
    device_name VARCHAR(100) COMMENT '设备名称',
    device_type INT COMMENT '设备类型：0-报警器 1-环控仪 2-变频器',
    breed_type INT COMMENT '养殖类型：0-猪 1-羊 2-牛 3-鸡 4-鸭',
    device_line_state INT DEFAULT 0 COMMENT '在线状态：0-离线 1-在线',
    `signal` INT DEFAULT 0 COMMENT '信号强度',
    ta DECIMAL(5,2) COMMENT '温度A',
    tb DECIMAL(5,2) COMMENT '温度B',
    humidity DECIMAL(5,2) COMMENT '湿度',
    gas_con DECIMAL(10,2) COMMENT '气体浓度',
    electric_quantity INT DEFAULT 100 COMMENT '电量（0-100）',
    warning_status INT DEFAULT 0 COMMENT '报警状态：0-正常 1-报警',
    outage_state INT DEFAULT 0 COMMENT '断电状态：0-正常 1-断电',
    gas_con_status INT DEFAULT 0 COMMENT '气体报警状态：0-正常 1-报警',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_device_num (device_num),
    INDEX idx_device_type (device_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设备表';

-- 3. 设备报警表
CREATE TABLE IF NOT EXISTS device_warnings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '报警ID',
    device_id BIGINT NOT NULL COMMENT '设备ID',
    device_num VARCHAR(50) NOT NULL COMMENT '设备编号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    warning_type VARCHAR(50) COMMENT '报警类型：温度报警/湿度报警/气体报警/断电报警',
    warning_msg TEXT COMMENT '报警信息',
    is_read INT DEFAULT 0 COMMENT '是否已读：0-未读 1-已读',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_device_id (device_id),
    INDEX idx_device_num (device_num),
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设备报警表';

-- 4. 字典数据表
CREATE TABLE IF NOT EXISTS dict_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '字典ID',
    dict_type VARCHAR(50) NOT NULL COMMENT '字典类型：breed_type/device_type',
    dict_label VARCHAR(100) NOT NULL COMMENT '显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    dict_sort INT DEFAULT 0 COMMENT '排序',
    remark VARCHAR(500) COMMENT '备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dict_type (dict_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典数据表';

-- 插入初始数据

-- 插入测试用户（密码：123456）
INSERT INTO users (phone, password, nike_name, address) VALUES
('13800138000', '123456', '测试用户', '北京市朝阳区'),
('13900139000', '123456', '张三', '上海市浦东新区');

-- 插入养殖类型字典
INSERT INTO dict_data (dict_type, dict_label, dict_value, dict_sort) VALUES
('breed_type', '猪', '0', 1),
('breed_type', '羊', '1', 2),
('breed_type', '牛', '2', 3),
('breed_type', '鸡', '3', 4),
('breed_type', '鸭', '4', 5);

-- 插入设备类型字典
INSERT INTO dict_data (dict_type, dict_label, dict_value, dict_sort) VALUES
('device_type', '报警器', '0', 1),
('device_type', '环控仪', '1', 2),
('device_type', '变频器', '2', 3),
('device_type', '控制器', '3', 4),
('device_type', '称重系统', '4', 5);

-- 插入测试设备数据
INSERT INTO devices (user_id, device_num, device_name, device_type, breed_type, device_line_state, `signal`, ta, tb, humidity, gas_con, electric_quantity, warning_status) VALUES
(1, 'DEV001', '1号猪舍报警器', 0, 0, 1, 3, 25.5, 26.0, 60.5, 50.0, 85, 0),
(1, 'DEV002', '2号猪舍环控仪', 1, 0, 1, 4, 24.0, 24.5, 55.0, 45.0, 93, 0),
(1, 'DEV003', '3号猪舍报警器', 0, 0, 0, 1, 28.0, 28.5, 70.0, 80.0, 15, 1),
(2, 'DEV004', '1号鸡舍报警器', 0, 3, 1, 3, 22.0, 22.5, 50.0, 40.0, 72, 0);

-- 插入测试报警数据
INSERT INTO device_warnings (device_id, device_num, user_id, warning_type, warning_msg, is_read) VALUES
(3, 'DEV003', 1, '气体报警', '气体浓度超标：80.0 ppm，超过安全阈值', 0),
(3, 'DEV003', 1, '温度报警', '温度过高：28.5℃，超过安全范围', 0);

-- 查询验证
SELECT '=== 用户数据 ===' as '';
SELECT * FROM users;

SELECT '=== 设备数据 ===' as '';
SELECT * FROM devices;

SELECT '=== 报警数据 ===' as '';
SELECT * FROM device_warnings;

SELECT '=== 字典数据 ===' as '';
SELECT * FROM dict_data;

