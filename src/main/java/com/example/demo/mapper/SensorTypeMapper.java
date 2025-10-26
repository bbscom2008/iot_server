package com.example.demo.mapper;

import com.example.demo.entity.SensorType;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SensorTypeMapper {

    /**
     * 查询所有传感器类型
     */
    List<SensorType> findAll();

    /**
     * 根据ID查询
     */
    SensorType findById(Long id);
}

