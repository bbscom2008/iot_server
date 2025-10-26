-- 删除 device_type 表中的 dict_sort 列的迁移脚本
-- 执行时间：迁移前请先备份数据库

-- ============================================
-- 第一步：删除 dict_sort 列
-- ============================================

ALTER TABLE device_type DROP COLUMN IF EXISTS dict_sort;

-- ============================================
-- 第二步：验证删除结果
-- ============================================

DESC device_type;

SELECT 'device_type 表中的 dict_sort 列已成功删除' as '';

