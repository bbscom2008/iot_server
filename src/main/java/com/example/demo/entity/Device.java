package com.example.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Device {

    private Long id;
    private Long userId;
    private String deviceNum;
    private String deviceName;
    private Integer deviceType;      // 0-报警器 1-环控仪 2-变频器
    private Integer deviceLineState; // 0-离线 1-在线
    private Integer signal;          // 信号强度
    private BigDecimal temperature1;  // 温度1
    private BigDecimal temperature2;  // 温度2
    private BigDecimal temperature3;  // 温度3
    private BigDecimal temperature4;  // 温度4
    private BigDecimal humidity;     // 湿度
    private BigDecimal gasCon;       // 气体浓度
    private Integer electricQuantity; // 电量（0-100）
    private Integer warningStatus;   // 报警状态
    private Integer outageState;     // 断电状态
    private Integer gasConStatus;    // 气体报警状态
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

