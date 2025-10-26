-- 重命名 device_type 表中的列名
-- dict_label → name
-- dict_value → type_id
-- 执行时间：迁移前请先备份数据库

-- ============================================
-- 第一步：重命名列
-- ============================================

ALTER TABLE device_type 
CHANGE COLUMN dict_label name VARCHAR(100) NOT NULL COMMENT '显示名称',
CHANGE COLUMN dict_value type_id VARCHAR(100) NOT NULL COMMENT '类型ID';

-- ============================================
-- 第二步：验证修改结果
-- ============================================

DESC device_type;

SELECT 'device_type 表列名已成功重命名' as '';
SELECT '* dict_label → name' as '';
SELECT '* dict_value → type_id' as '';

