package com.example.demo.mapper;

import com.example.demo.entity.RoleType;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RoleTypeMapper {

    /**
     * 查询所有角色类型
     */
    List<RoleType> findAll();

    /**
     * 根据ID查询
     */
    RoleType findById(Long id);
}

