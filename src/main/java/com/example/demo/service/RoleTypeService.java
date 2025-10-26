package com.example.demo.service;

import com.example.demo.entity.RoleType;
import com.example.demo.mapper.RoleTypeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleTypeService {

    private final RoleTypeMapper roleTypeMapper;

    /**
     * 查询所有角色类型
     */
    public List<RoleType> findAll() {
        return roleTypeMapper.findAll();
    }

    /**
     * 根据ID查询
     */
    public RoleType findById(Long id) {
        return roleTypeMapper.findById(id);
    }
}

