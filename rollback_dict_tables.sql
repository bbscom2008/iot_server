-- 字典表拆分回滚脚本
-- 如果需要回滚到原来的dict_data表结构
-- 执行时间：回滚前请先备份新表数据

-- ============================================
-- 回滚操作：重新创建dict_data表并迁移数据
-- ============================================

-- 重新创建dict_data表
CREATE TABLE IF NOT EXISTS dict_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '字典ID',
    dict_type VARCHAR(50) NOT NULL COMMENT '字典类型：breed_type/device_type/role_type',
    dict_label VARCHAR(100) NOT NULL COMMENT '显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    dict_sort INT DEFAULT 0 COMMENT '排序',
    remark VARCHAR(500) COMMENT '备注',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dict_type (dict_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典数据表';

-- 回滚养殖类型数据
INSERT INTO dict_data (dict_type, dict_label, dict_value, dict_sort, remark, created_at)
SELECT 'breed_type', dict_label, dict_value, dict_sort, remark, created_at
FROM breed_type
ON DUPLICATE KEY UPDATE 
    dict_data.dict_label = breed_type.dict_label,
    dict_data.dict_value = breed_type.dict_value;

-- 回滚角色类型数据
INSERT INTO dict_data (dict_type, dict_label, dict_value, dict_sort, remark, created_at)
SELECT 'role_type', dict_label, dict_value, dict_sort, remark, created_at
FROM role_type
ON DUPLICATE KEY UPDATE 
    dict_data.dict_label = role_type.dict_label,
    dict_data.dict_value = role_type.dict_value;

-- 回滚设备类型数据
INSERT INTO dict_data (dict_type, dict_label, dict_value, dict_sort, remark, created_at)
SELECT 'device_type', dict_label, dict_value, dict_sort, remark, created_at
FROM device_type
ON DUPLICATE KEY UPDATE 
    dict_data.dict_label = device_type.dict_label,
    dict_data.dict_value = device_type.dict_value;

-- 回滚传感器类型数据
INSERT INTO dict_data (dict_type, dict_label, dict_value, dict_sort, remark, created_at)
SELECT 'sensor_type', dict_label, dict_value, dict_sort, remark, created_at
FROM sensor_type
ON DUPLICATE KEY UPDATE 
    dict_data.dict_label = sensor_type.dict_label,
    dict_data.dict_value = sensor_type.dict_value;

-- 回滚报警类型数据
INSERT INTO dict_data (dict_type, dict_label, dict_value, dict_sort, remark, created_at)
SELECT 'warning_type', dict_label, dict_value, dict_sort, remark, created_at
FROM warning_type
ON DUPLICATE KEY UPDATE 
    dict_data.dict_label = warning_type.dict_label,
    dict_data.dict_value = warning_type.dict_value;

-- ============================================
-- 删除5个新表（可选，谨慎操作）
-- ============================================
-- 如果确定回滚，可以删除新创建的表：
-- DROP TABLE IF EXISTS breed_type;
-- DROP TABLE IF EXISTS role_type;
-- DROP TABLE IF EXISTS device_type;
-- DROP TABLE IF EXISTS sensor_type;
-- DROP TABLE IF EXISTS warning_type;

-- ============================================
-- 验证回滚结果
-- ============================================
SELECT '=== 验证dict_data表数据 ===' as '';
SELECT * FROM dict_data ORDER BY dict_type, dict_sort;
