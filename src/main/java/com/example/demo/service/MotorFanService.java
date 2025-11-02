package com.example.demo.service;

import com.example.demo.entity.MotorFan;
import com.example.demo.mapper.MotorFanMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MotorFanService {

    private final MotorFanMapper motorFanMapper;

    /**
     * 根据设备ID查询所有风扇
     */
    public List<MotorFan> findByDeviceId(Long deviceId) {
        return motorFanMapper.findByDeviceId(deviceId);
    }

    /**
     * 根据设备编号查询所有风扇
     */
    public List<MotorFan> findByDeviceNum(String deviceNum) {
        return motorFanMapper.findByDeviceNum(deviceNum);
    }

    /**
     * 根据ID查询风扇
     */
    public MotorFan findById(Long id) {
        return motorFanMapper.findById(id);
    }

    /**
     * 新增风扇
     */
    public void insert(MotorFan motorFan) {
        motorFanMapper.insert(motorFan);
    }

    /**
     * 更新风扇运行状态
     */
    public void updateRunningStatus(Long id, Integer isRunning) {
        motorFanMapper.updateRunningStatus(id, isRunning);
    }

    /**
     * 更新风机配置
     */
    public void update(MotorFan motorFan) {
        motorFanMapper.update(motorFan);
    }

    /**
     * 删除风扇
     */
    public void deleteById(Long id) {
        motorFanMapper.deleteById(id);
    }

    /**
     * 删除设备的所有风扇
     */
    public void deleteByDeviceId(Long deviceId) {
        motorFanMapper.deleteByDeviceId(deviceId);
    }
}

