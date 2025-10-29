package com.example.demo.util;

import com.example.demo.dto.*;
import com.example.demo.entity.Device;
import com.example.demo.entity.FrequencyMotor;
import com.example.demo.entity.MotorFan;
import com.example.demo.entity.Sensor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO 转换工具类
 */
@Component
public class DtoConverter {
    
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    /**
     * 格式化时间
     */
    private String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATETIME_FORMATTER) : null;
    }
    
    /**
     * Sensor 转 SensorDTO
     */
    public SensorDTO toSensorDTO(Sensor sensor) {
        if (sensor == null) return null;
        SensorDTO dto = new SensorDTO();
        dto.setId(sensor.getId());
        dto.setParentId(sensor.getParentId());
        dto.setDeviceNum(sensor.getDeviceNum());
        dto.setSensorTypeId(sensor.getSensorTypeId());
        dto.setSensorName(sensor.getSensorName());
        dto.setSensorValue(sensor.getSensorValue());
        dto.setUnit(sensor.getUnit());
        dto.setCreatedAt(formatDateTime(sensor.getCreatedAt()));
        dto.setUpdatedAt(formatDateTime(sensor.getUpdatedAt()));
        return dto;
    }
    
    /**
     * Sensor 列表转 SensorDTO 列表
     */
    public List<SensorDTO> toSensorDTOList(List<Sensor> sensors) {
        if (sensors == null) return null;
        return sensors.stream()
                .map(this::toSensorDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * MotorFan 转 MotorFanDTO
     */
    public MotorFanDTO toMotorFanDTO(MotorFan motorFan) {
        if (motorFan == null) return null;
        MotorFanDTO dto = new MotorFanDTO();
        dto.setId(motorFan.getId());
        dto.setFanName(motorFan.getFanName());
        dto.setDeviceId(motorFan.getDeviceId());
        dto.setDeviceNum(motorFan.getDeviceNum());
        dto.setIsRunning(motorFan.getIsRunning());
        dto.setCreatedTime(formatDateTime(motorFan.getCreatedTime()));
        dto.setUpdatedTime(formatDateTime(motorFan.getUpdatedTime()));
        return dto;
    }
    
    /**
     * MotorFan 列表转 MotorFanDTO 列表
     */
    public List<MotorFanDTO> toMotorFanDTOList(List<MotorFan> motorFans) {
        if (motorFans == null) return null;
        return motorFans.stream()
                .map(this::toMotorFanDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * FrequencyMotor 转 FrequencyMotorDTO
     */
    public FrequencyMotorDTO toFrequencyMotorDTO(FrequencyMotor frequencyMotor) {
        if (frequencyMotor == null) return null;
        FrequencyMotorDTO dto = new FrequencyMotorDTO();
        dto.setId(frequencyMotor.getId());
        dto.setDeviceId(frequencyMotor.getDeviceId());
        dto.setDeviceNum(frequencyMotor.getDeviceNum());
        dto.setName(frequencyMotor.getName());
        dto.setProtectSpeed(frequencyMotor.getProtectSpeed());
        dto.setIsAuto(frequencyMotor.getIsAuto());
        dto.setManualSpeed(frequencyMotor.getManualSpeed());
        dto.setValue(frequencyMotor.getValue());
        dto.setRunTime(frequencyMotor.getRunTime());
        dto.setPauseTime(frequencyMotor.getPauseTime());
        dto.setControlType(frequencyMotor.getControlType());
        dto.setTempSensorId(frequencyMotor.getTempSensorId());
        dto.setTempUpper(frequencyMotor.getTempUpper());
        dto.setTempLower(frequencyMotor.getTempLower());
        dto.setHumidityUpper(frequencyMotor.getHumidityUpper());
        dto.setHumidityLower(frequencyMotor.getHumidityLower());
        dto.setGasUpper(frequencyMotor.getGasUpper());
        dto.setGasLower(frequencyMotor.getGasLower());
        dto.setCreatedTime(formatDateTime(frequencyMotor.getCreatedTime()));
        dto.setUpdatedTime(formatDateTime(frequencyMotor.getUpdatedTime()));
        return dto;
    }
    
    /**
     * FrequencyMotor 列表转 FrequencyMotorDTO 列表
     */
    public List<FrequencyMotorDTO> toFrequencyMotorDTOList(List<FrequencyMotor> frequencyMotors) {
        if (frequencyMotors == null) return null;
        return frequencyMotors.stream()
                .map(this::toFrequencyMotorDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Device 转 DeviceListDTO
     */
    public DeviceListDTO toDeviceListDTO(Device device, List<Sensor> sensors) {
        if (device == null) return null;
        DeviceListDTO dto = new DeviceListDTO();
        dto.setId(device.getId());
        dto.setUserId(device.getUserId());
        dto.setDeviceNum(device.getDeviceNum());
        dto.setDeviceName(device.getDeviceName());
        dto.setDeviceType(device.getDeviceType());
        dto.setDeviceLineState(device.getDeviceLineState());
        dto.setSignal(device.getSignal());
        dto.setElectricQuantity(device.getElectricQuantity());
        dto.setWarningStatus(device.getWarningStatus());
        dto.setCreatedTime(formatDateTime(device.getCreatedTime()));
        dto.setUpdatedTime(formatDateTime(device.getUpdatedTime()));
        dto.setLastOfflineTime(formatDateTime(device.getLastOfflineTime()));
        dto.setSensors(toSensorDTOList(sensors));
        return dto;
    }
    
    /**
     * Device 转 DeviceDetailDTO
     */
    public DeviceDetailDTO toDeviceDetailDTO(Device device, List<Sensor> sensors, 
                                            List<MotorFan> motorFans, 
                                            List<FrequencyMotor> frequencyMotors) {
        if (device == null) return null;
        DeviceDetailDTO dto = new DeviceDetailDTO();
        dto.setId(device.getId());
        dto.setUserId(device.getUserId());
        dto.setDeviceNum(device.getDeviceNum());
        dto.setDeviceName(device.getDeviceName());
        dto.setDeviceType(device.getDeviceType());
        dto.setDeviceLineState(device.getDeviceLineState());
        dto.setSignal(device.getSignal());
        dto.setElectricQuantity(device.getElectricQuantity());
        dto.setWarningStatus(device.getWarningStatus());
        dto.setCreatedTime(formatDateTime(device.getCreatedTime()));
        dto.setUpdatedTime(formatDateTime(device.getUpdatedTime()));
        dto.setLastOfflineTime(formatDateTime(device.getLastOfflineTime()));
        dto.setSensors(toSensorDTOList(sensors));
        dto.setMotorFans(toMotorFanDTOList(motorFans));
        dto.setFrequencyMotors(toFrequencyMotorDTOList(frequencyMotors));
        return dto;
    }
}

