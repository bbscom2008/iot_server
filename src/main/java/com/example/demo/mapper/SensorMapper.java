package com.example.demo.mapper;

import com.example.demo.entity.Sensor;
import org.apache.ibatis.annotations.Mapper;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface SensorMapper {

    /**
     * 根据设备ID查询所有传感器
     */
    List<Sensor> findByDeviceId(Long deviceId);

    /**
     * 根据设备编号查询所有传感器
     */
    List<Sensor> findByDeviceNum(String deviceNum);

    /**
     * 根据ID查询传感器
     */
    Sensor findById(Long id);

    /**
     * 新增传感器
     */
    int insert(Sensor sensor);

    /**
     * 更新传感器值
     */
    int updateValue(Long id, BigDecimal sensorValue);

    /**
     * 删除传感器
     */
    int deleteById(Long id);

    /**
     * 删除设备的所有传感器
     */
    int deleteByDeviceId(Long deviceId);
}

