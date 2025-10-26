package com.example.demo.service;

import com.example.demo.entity.SensorType;
import com.example.demo.mapper.SensorTypeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SensorTypeService {

    private final SensorTypeMapper sensorTypeMapper;

    /**
     * 查询所有传感器类型
     */
    public List<SensorType> findAll() {
        return sensorTypeMapper.findAll();
    }

    /**
     * 根据ID查询
     */
    public SensorType findById(Long id) {
        return sensorTypeMapper.findById(id);
    }
}

