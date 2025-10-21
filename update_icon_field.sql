-- ============================================
-- 修改用户表icon字段以支持Base64图片存储
-- ============================================

USE iot_system;

-- 查看当前icon字段的定义
DESCRIBE users;

-- 修改icon字段为MEDIUMTEXT类型
-- MEDIUMTEXT 最大存储 16MB，足够存储Base64编码的图片
ALTER TABLE users 
MODIFY COLUMN icon MEDIUMTEXT COMMENT '头像(Base64编码或URL)';

-- 验证修改结果
DESCRIBE users;

-- 查看icon字段的详细信息
SHOW FULL COLUMNS FROM users WHERE Field = 'icon';

/*
说明：
1. VARCHAR(500) 只能存储500个字符，对于Base64图片远远不够
2. MEDIUMTEXT 可以存储最大 16MB 的文本
3. 一个100KB的图片，Base64编码后约140KB，完全够用
4. 如果担心占用空间，可以使用 TEXT(65KB) 或 LONGTEXT(4GB)

字段类型对比：
- VARCHAR(500)：最大500字符
- TEXT：最大65KB
- MEDIUMTEXT：最大16MB（推荐）
- LONGTEXT：最大4GB
*/

