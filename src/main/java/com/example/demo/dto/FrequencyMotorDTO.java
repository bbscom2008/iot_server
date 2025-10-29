package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 变频电机数据传输对象
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FrequencyMotorDTO {
    
    private Long id;
    private Long deviceId;          // 设备ID
    private String deviceNum;       // 设备编号
    private String name;            // 变频电机名称
    private BigDecimal protectSpeed;  // 保护转速
    private Integer isAuto;         // 运行模式：0-手动 1-自动
    private BigDecimal manualSpeed;  // 手动转速
    private Integer value;           // 当前值
    private Integer runTime;        // 运行时间（秒）
    private Integer pauseTime;      // 暂停时间（秒）
    private Integer controlType;    // 控制类型：1-温控 2-湿控 3-气体
    private Long tempSensorId;      // 变频器选择的温度传感器ID
    private BigDecimal tempUpper;    // 温度上限
    private BigDecimal tempLower;    // 温度下限
    private BigDecimal humidityUpper; // 湿度上限
    private BigDecimal humidityLower; // 湿度下限
    private BigDecimal gasUpper;     // 气体上限
    private BigDecimal gasLower;     // 气体下限
    private String createdTime;     // 创建时间（格式化后的字符串）
    private String updatedTime;     // 更新时间（格式化后的字符串）
}

