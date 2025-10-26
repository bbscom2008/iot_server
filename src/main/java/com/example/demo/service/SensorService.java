package com.example.demo.service;

import com.example.demo.entity.Sensor;
import com.example.demo.mapper.SensorMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SensorService {

    private final SensorMapper sensorMapper;

    /**
     * 根据设备ID查询所有传感器
     */
    public List<Sensor> findByDeviceId(Long deviceId) {
        return sensorMapper.findByDeviceId(deviceId);
    }

    /**
     * 根据设备编号查询所有传感器
     */
    public List<Sensor> findByDeviceNum(String deviceNum) {
        return sensorMapper.findByDeviceNum(deviceNum);
    }

    /**
     * 根据ID查询传感器
     */
    public Sensor findById(Long id) {
        return sensorMapper.findById(id);
    }

    /**
     * 新增传感器
     */
    public void addSensor(Sensor sensor) {
        sensorMapper.insert(sensor);
    }

    /**
     * 更新传感器值
     */
    public void updateSensorValue(Long sensorId, Double sensorValue) {
        sensorMapper.updateValue(sensorId, java.math.BigDecimal.valueOf(sensorValue));
    }

    /**
     * 删除传感器
     */
    public void deleteSensor(Long sensorId) {
        sensorMapper.deleteById(sensorId);
    }

    /**
     * 删除设备的所有传感器
     */
    public void deleteByDeviceId(Long deviceId) {
        sensorMapper.deleteByDeviceId(deviceId);
    }
}

