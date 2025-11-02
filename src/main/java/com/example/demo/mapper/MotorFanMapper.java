package com.example.demo.mapper;

import com.example.demo.entity.MotorFan;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MotorFanMapper {

    /**
     * 根据设备ID查询所有风扇
     */
    List<MotorFan> findByDeviceId(Long deviceId);

    /**
     * 根据设备编号查询所有风扇
     */
    List<MotorFan> findByDeviceNum(String deviceNum);

    /**
     * 根据ID查询风扇
     */
    MotorFan findById(Long id);

    /**
     * 新增风扇
     */
    int insert(MotorFan motorFan);

    /**
     * 更新风扇运行状态
     */
    int updateRunningStatus(Long id, Integer isRunning);

    /**
     * 更新风机配置
     */
    int update(MotorFan motorFan);

    /**
     * 删除风扇
     */
    int deleteById(Long id);

    /**
     * 删除设备的所有风扇
     */
    int deleteByDeviceId(Long deviceId);
}

