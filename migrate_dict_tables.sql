-- 字典表拆分迁移脚本（去掉Dict后缀，删除dict_data表）
-- 将原来的dict_data表拆分成5个独立的表
-- 执行时间：迁移前请先备份数据库

-- ============================================
-- 第一步：创建5个新的字典表
-- ============================================

-- 1. 养殖类型表
CREATE TABLE IF NOT EXISTS breed_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    dict_label VARCHAR(100) NOT NULL COMMENT '显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    dict_sort INT DEFAULT 0 COMMENT '排序',
    remark VARCHAR(500) COMMENT '备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dict_value (dict_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='养殖类型表';

-- 2. 角色类型表
CREATE TABLE IF NOT EXISTS role_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    dict_label VARCHAR(100) NOT NULL COMMENT '显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    dict_sort INT DEFAULT 0 COMMENT '排序',
    remark VARCHAR(500) COMMENT '备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dict_value (dict_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色类型表';

-- 3. 设备类型表
CREATE TABLE IF NOT EXISTS device_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    dict_label VARCHAR(100) NOT NULL COMMENT '显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    dict_sort INT DEFAULT 0 COMMENT '排序',
    remark VARCHAR(500) COMMENT '备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dict_value (dict_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设备类型表';

-- 4. 传感器类型表
CREATE TABLE IF NOT EXISTS sensor_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    dict_label VARCHAR(100) NOT NULL COMMENT '显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    dict_sort INT DEFAULT 0 COMMENT '排序',
    remark VARCHAR(500) COMMENT '备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dict_value (dict_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='传感器类型表';

-- 5. 报警类型表
CREATE TABLE IF NOT EXISTS warning_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    dict_label VARCHAR(100) NOT NULL COMMENT '显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    dict_sort INT DEFAULT 0 COMMENT '排序',
    remark VARCHAR(500) COMMENT '备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dict_value (dict_value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报警类型表';

-- ============================================
-- 第二步：迁移数据（如果dict_data表存在数据）
-- ============================================

-- 迁移养殖类型数据
INSERT INTO breed_type (dict_label, dict_value, dict_sort, remark, created_at)
SELECT dict_label, dict_value, dict_sort, remark, created_at
FROM dict_data
WHERE dict_type = 'breed_type'
ON DUPLICATE KEY UPDATE breed_type.dict_label = breed_type.dict_label;

-- 迁移角色类型数据
INSERT INTO role_type (dict_label, dict_value, dict_sort, remark, created_at)
SELECT dict_label, dict_value, dict_sort, remark, created_at
FROM dict_data
WHERE dict_type = 'role_type'
ON DUPLICATE KEY UPDATE role_type.dict_label = role_type.dict_label;

-- 迁移设备类型数据
INSERT INTO device_type (dict_label, dict_value, dict_sort, remark, created_at)
SELECT dict_label, dict_value, dict_sort, remark, created_at
FROM dict_data
WHERE dict_type = 'device_type'
ON DUPLICATE KEY UPDATE device_type.dict_label = device_type.dict_label;

-- 迁移传感器类型数据
INSERT INTO sensor_type (dict_label, dict_value, dict_sort, remark, created_at)
SELECT dict_label, dict_value, dict_sort, remark, created_at
FROM dict_data
WHERE dict_type = 'sensor_type'
ON DUPLICATE KEY UPDATE sensor_type.dict_label = sensor_type.dict_label;

-- ============================================
-- 第三步：插入初始字典数据
-- ============================================

-- 插入养殖类型数据
INSERT IGNORE INTO breed_type (dict_label, dict_value, dict_sort) VALUES
('猪', '0', 1),
('羊', '1', 2),
('牛', '2', 3),
('鸡', '3', 4),
('鸭', '4', 5),
('其他', '5', 6);

-- 插入角色类型数据
INSERT IGNORE INTO role_type (dict_label, dict_value, dict_sort) VALUES
('老板', '0', 1),
('饲养员', '1', 2),
('其他', '2', 3);

-- 插入设备类型数据
INSERT IGNORE INTO device_type (dict_label, dict_value, dict_sort) VALUES
('报警器', '0', 1),
('环控仪', '1', 2),
('变频器', '2', 3),
('控制器', '3', 4),
('称重系统', '4', 5);

-- 插入传感器类型数据
INSERT IGNORE INTO sensor_type (dict_label, dict_value, dict_sort, remark) VALUES
('温度', '0', 1, '温度传感器'),
('湿度', '1', 2, '湿度传感器'),
('气体', '2', 3, '气体传感器'),
('气压', '3', 4, '气压传感器');

-- 插入报警类型数据
INSERT IGNORE INTO warning_type (dict_label, dict_value, dict_sort, remark) VALUES
('温度报警', '0', 1, '温度超出安全范围'),
('湿度报警', '1', 2, '湿度超出安全范围'),
('气体报警', '2', 3, '气体浓度超标'),
('断电报警', '3', 4, '设备断电');

-- ============================================
-- 第四步：删除原dict_data表
-- ============================================

DROP TABLE IF EXISTS dict_data;

-- ============================================
-- 第五步：验证数据
-- ============================================

SELECT '=== 养殖类型数据 ===' as '';
SELECT * FROM breed_type ORDER BY dict_sort;

SELECT '=== 角色类型数据 ===' as '';
SELECT * FROM role_type ORDER BY dict_sort;

SELECT '=== 设备类型数据 ===' as '';
SELECT * FROM device_type ORDER BY dict_sort;

SELECT '=== 传感器类型数据 ===' as '';
SELECT * FROM sensor_type ORDER BY dict_sort;

SELECT '=== 报警类型数据 ===' as '';
SELECT * FROM warning_type ORDER BY dict_sort;

-- ============================================
-- 完成
-- ============================================
