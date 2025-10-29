package com.example.demo.dto;

import com.example.demo.util.DateUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 传感器数据传输对象
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorDTO implements Serializable {
    
    private Long id;
    private Long parentId;          // 所属父设备ID
    private String deviceNum;       // 当前设备编号
    private Integer sensorTypeId;   // 传感器类型ID
    private String sensorName;      // 传感器名称
    private BigDecimal sensorValue; // 传感器值
    private String unit;            // 单位

    @JsonFormat(pattern = DateUtils.DATE_TIME_FORMAT, timezone = DateUtils.TIME_ZONE)
    private LocalDateTime createdAt;       // 创建时间（格式化后的字符串）
    @JsonFormat(pattern = DateUtils.DATE_TIME_FORMAT, timezone = DateUtils.TIME_ZONE)
    private LocalDateTime updatedAt;       // 更新时间（格式化后的字符串）
}

