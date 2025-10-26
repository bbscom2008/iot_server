-- 重命名 devices 表的时间字段
-- createdAt -> created_time
-- updatedAt -> updated_time
-- 增加 last_offline_time 字段
-- 执行时间：迁移前请先备份数据库

-- ============================================
-- 第一步：重命名现有字段并添加新字段
-- ============================================

ALTER TABLE devices 
CHANGE COLUMN created_at created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
CHANGE COLUMN updated_at updated_time DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
ADD COLUMN last_offline_time DATETIME COMMENT '最后离线时间' AFTER updated_time;

-- ============================================
-- 第二步：验证修改结果
-- ============================================

DESC devices;

SELECT 'devices 表时间字段已成功修改' as '';
SELECT '* created_at -> created_time' as '';
SELECT '* updated_at -> updated_time' as '';
SELECT '* 新增 last_offline_time' as '';

