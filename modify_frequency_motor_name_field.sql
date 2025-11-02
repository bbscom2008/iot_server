-- 修改frequency_motor表的name字段为device_name
ALTER TABLE `frequency_motor` CHANGE `name` `device_name` varchar(50) NOT NULL COMMENT '变频电机名称：变频1、变频2';

-- 更新frequency_motor表的注释
ALTER TABLE `frequency_motor` COMMENT = '变频电机表';