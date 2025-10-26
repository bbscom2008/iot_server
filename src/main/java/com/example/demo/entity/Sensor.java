package com.example.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sensor {

    private Long id;
    private Long deviceId;          // 设备ID
    private String deviceNum;       // 设备编号
    private Integer sensorTypeId;   // 传感器类型ID：5-温度 6-湿度 7-气体
    private String sensorName;      // 传感器名称：温度1、温度2等
    private BigDecimal sensorValue; // 传感器值
    private String unit;            // 单位：°C, %, ppm等
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

