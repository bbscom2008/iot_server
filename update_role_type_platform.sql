-- 更新角色类型表，支持区分手机端和PC端用户

-- 1. 重命名 role_type 为 user_role（更贴切的命名）
RENAME TABLE `role_type` TO `user_role`;

-- 2. 添加 platform 字段，用于区分平台
ALTER TABLE `user_role` 
ADD COLUMN `platform` VARCHAR(20) NOT NULL DEFAULT 'mobile' COMMENT '平台类型：mobile-手机端，web-PC端' AFTER `dict_value`;

-- 3. 更新现有数据，将当前的角色标记为手机端
UPDATE `user_role` SET `platform` = 'mobile';

-- 4. 插入PC端的角色类型
INSERT INTO `user_role` (`dict_label`, `dict_value`, `platform`, `dict_sort`, `remark`, `created_at`) VALUES
('管理员', '10', 'web', 1, 'PC端管理员', NOW()),
('员工', '11', 'web', 2, 'PC端员工', NOW());

-- 5. 添加复合唯一索引，确保同一平台下dict_value唯一
ALTER TABLE `user_role` 
ADD UNIQUE INDEX `uk_dict_value_platform` (`dict_value`, `platform`);

-- 6. 更新注释
ALTER TABLE `user_role` COMMENT = '用户角色表（区分手机端和PC端）';

