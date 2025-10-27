package com.example.demo.mapper;

import com.example.demo.entity.FrequencyMotor;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FrequencyMotorMapper {

    /**
     * 根据设备ID查询所有变频电机
     */
    List<FrequencyMotor> findByDeviceId(Long deviceId);

    /**
     * 根据设备编号查询所有变频电机
     */
    List<FrequencyMotor> findByDeviceNum(String deviceNum);

    /**
     * 根据ID查询变频电机
     */
    FrequencyMotor findById(Long id);

    /**
     * 新增变频电机
     */
    int insert(FrequencyMotor frequencyMotor);

    /**
     * 更新变频电机配置
     */
    int update(FrequencyMotor frequencyMotor);

    /**
     * 删除变频电机
     */
    int deleteById(Long id);

    /**
     * 删除设备的所有变频电机
     */
    int deleteByDeviceId(Long deviceId);
}

