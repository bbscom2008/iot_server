package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 传感器数据传输对象
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorDTO {
    
    private Long id;
    private Long parentId;          // 所属父设备ID
    private String deviceNum;       // 当前设备编号
    private Integer sensorTypeId;   // 传感器类型ID
    private String sensorName;      // 传感器名称
    private BigDecimal sensorValue; // 传感器值
    private String unit;            // 单位
    private String createdAt;       // 创建时间（格式化后的字符串）
    private String updatedAt;       // 更新时间（格式化后的字符串）
}

