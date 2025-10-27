package com.example.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FrequencyMotor {

    private Long id;
    private Long deviceId;          // 设备ID
    private String deviceNum;       // 设备编号
    private String name;            // 变频电机名称：变频1、变频2
    private BigDecimal protectSpeed;  // 保护转速
    private Integer isAuto;         // 运行模式：0-手动 1-自动
    private BigDecimal manualSpeed;  // 手动转速
    private Integer value;           // 当前值（整数，范围0-256）
    private Integer runTime;        // 运行时间（秒）
    private Integer pauseTime;      // 暂停时间（秒）
    private Integer controlType;    // 控制类型：1-温控 2-湿控 3-气体
    private BigDecimal tempUpper;    // 温度上限
    private BigDecimal tempLower;    // 温度下限
    private BigDecimal humidityUpper; // 湿度上限
    private BigDecimal humidityLower; // 湿度下限
    private BigDecimal gasUpper;     // 气体上限
    private BigDecimal gasLower;     // 气体下限
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}

