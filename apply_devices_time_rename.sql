-- 应用 devices 表时间字段重命名
-- 执行此脚本前请确保已执行 rename_devices_time_columns.sql

-- 如果直接执行数据库更改，执行以下命令：
-- ALTER TABLE devices 
-- CHANGE COLUMN created_at created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
-- CHANGE COLUMN updated_at updated_time DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
-- ADD COLUMN last_offline_time DATETIME COMMENT '最后离线时间' AFTER updated_time;

SELECT '请在数据库中执行 rename_devices_time_columns.sql 脚本' as message;

