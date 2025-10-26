-- IoT农牧物联网系统数据库初始化脚本



-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    phone VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    nike_name VARCHAR(50) COMMENT '昵称',
    address VARCHAR(255) COMMENT '地址',
    icon mediumtext COMMENT '头像(Base64编码或URL)',
    breeding_type INT COMMENT '养殖类型：字典中的 breed_type',
    role INT COMMENT '角色：字典中的 role_type',
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
    temperature1 DECIMAL(5,2) COMMENT '温度1',
    temperature2 DECIMAL(5,2) COMMENT '温度2',
    temperature3 DECIMAL(5,2) COMMENT '温度3',
    temperature4 DECIMAL(5,2) COMMENT '温度4',
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

-- 4. 养殖类型表
CREATE TABLE IF NOT EXISTS breed_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    dict_label VARCHAR(100) NOT NULL COMMENT '显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    dict_sort INT DEFAULT 0 COMMENT '排序',
    remark VARCHAR(500) COMMENT '备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dict_value (dict_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='养殖类型表';

-- 5. 角色类型表
CREATE TABLE IF NOT EXISTS role_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    dict_label VARCHAR(100) NOT NULL COMMENT '显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    dict_sort INT DEFAULT 0 COMMENT '排序',
    remark VARCHAR(500) COMMENT '备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dict_value (dict_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色类型表';

-- 6. 设备类型表
CREATE TABLE IF NOT EXISTS device_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    dict_label VARCHAR(100) NOT NULL COMMENT '显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    dict_sort INT DEFAULT 0 COMMENT '排序',
    remark VARCHAR(500) COMMENT '备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dict_value (dict_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设备类型表';

-- 7. 传感器类型表
CREATE TABLE IF NOT EXISTS sensor_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    dict_label VARCHAR(100) NOT NULL COMMENT '显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    dict_sort INT DEFAULT 0 COMMENT '排序',
    remark VARCHAR(500) COMMENT '备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dict_value (dict_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='传感器类型表';

-- 8. 报警类型表
CREATE TABLE IF NOT EXISTS warning_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    dict_label VARCHAR(100) NOT NULL COMMENT '显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    dict_sort INT DEFAULT 0 COMMENT '排序',
    remark VARCHAR(500) COMMENT '备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dict_value (dict_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报警类型表';

-- 插入初始数据

-- 插入测试用户（密码：123456）
INSERT INTO users (phone, password, nike_name, address, breeding_type, role) VALUES
('13800138000', '123456', '测试用户', '北京市朝阳区', 0, 0),
('13900139000', '123456', '张三', '上海市浦东新区', 0, 0);

-- 插入养殖类型数据
INSERT INTO breed_type (dict_label, dict_value, dict_sort) VALUES
('猪', '0', 1),
('羊', '1', 2),
('牛', '2', 3),
('鸡', '3', 4),
('鸭', '4', 5),
('其他', '5', 6);

-- 插入角色类型数据
INSERT INTO role_type (dict_label, dict_value, dict_sort) VALUES
('老板', '0', 1),
('饲养员', '1', 2),
('其他', '2', 3);

-- 插入设备类型数据
INSERT INTO device_type (dict_label, dict_value, dict_sort) VALUES
('报警器', '0', 1),
('环控仪', '1', 2),
('变频器', '2', 3),
('控制器', '3', 4),
('称重系统', '4', 5);

-- 插入传感器类型数据
INSERT INTO sensor_type (dict_label, dict_value, dict_sort, remark) VALUES
('温度', '0', 1, '温度传感器'),
('湿度', '1', 2, '湿度传感器'),
('气体', '2', 3, '气体传感器'),
('气压', '3', 4, '气压传感器');

-- 插入报警类型数据
INSERT INTO warning_type (dict_label, dict_value, dict_sort, remark) VALUES
('温度报警', '0', 1, '温度超出安全范围'),
('湿度报警', '1', 2, '湿度超出安全范围'),
('气体报警', '2', 3, '气体浓度超标'),
('断电报警', '3', 4, '设备断电');


-- 插入测试设备数据
INSERT INTO devices (user_id, device_num, device_name, device_type, breed_type, device_line_state, `signal`, temperature1, temperature2, temperature3, temperature4, humidity, gas_con, electric_quantity, warning_status) VALUES
(1, 'DEV001', '1号猪舍报警器', 1, 0, 1, 3, 25.5, 26.0, 24.8, 25.2, 60.5, 50.0, 85, 0),
(1, 'DEV002', '2号猪舍环控仪', 1, 0, 1, 4, 24.0, 24.5, 23.8, 24.2, 55.0, 45.0, 93, 0),
(1, 'DEV003', '3号猪舍报警器', 1, 0, 0, 1, 28.0, 28.5, 27.8, 28.2, 70.0, 80.0, 15, 1),
(2, 'DEV004', '1号鸡舍报警器', 1, 3, 1, 3, 22.0, 22.5, 21.8, 22.2, 50.0, 40.0, 72, 0);

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

SELECT '=== 养殖类型数据 ===' as '';
SELECT * FROM breed_type;

SELECT '=== 角色类型数据 ===' as '';
SELECT * FROM role_type;

SELECT '=== 设备类型数据 ===' as '';
SELECT * FROM device_type;

SELECT '=== 传感器类型数据 ===' as '';
SELECT * FROM sensor_type;

SELECT '=== 报警类型数据 ===' as '';
SELECT * FROM warning_type;

