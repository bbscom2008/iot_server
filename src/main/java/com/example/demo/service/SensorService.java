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
     * 自动生成 device_num 格式：sen-{sensor_type_id}-{从1001开始递增}
     */
    public void addSensor(Sensor sensor) {
        // 如果 device_num 为空或不符合格式，自动生成
        if (sensor.getDeviceNum() == null || sensor.getDeviceNum().isEmpty() || 
            !sensor.getDeviceNum().matches("^sen-\\d+-\\d+$")) {
            String deviceNum = generateDeviceNum(sensor.getSensorTypeId());
            sensor.setDeviceNum(deviceNum);
        }
        sensorMapper.insert(sensor);
    }

    /**
     * 生成传感器设备编号
     * 格式：sen-{sensor_type_id}-{从1001开始递增}
     * 每个 sensor_type_id 独立计数，都从 1001 开始
     */
    private String generateDeviceNum(Integer sensorTypeId) {
        // 查询当前 sensor_type_id 的最大编号
        String maxDeviceNum = sensorMapper.findMaxDeviceNumByType(sensorTypeId);
        
        int nextNumber = 1001; // 默认从 1001 开始
        
        if (maxDeviceNum != null && maxDeviceNum.matches("^sen-\\d+-(\\d+)$")) {
            // 提取当前最大编号
            try {
                String[] parts = maxDeviceNum.split("-");
                if (parts.length == 3) {
                    int maxNumber = Integer.parseInt(parts[2]);
                    nextNumber = maxNumber + 1;
                }
            } catch (NumberFormatException e) {
                // 如果解析失败，使用默认值 1001
                nextNumber = 1001;
            }
        }
        
        return String.format("sen-%d-%d", sensorTypeId, nextNumber);
    }

    /**
     * 更新传感器值
     */
    public void updateSensorValue(Long sensorId, Double sensorValue) {
        sensorMapper.updateValue(sensorId, sensorValue);
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

