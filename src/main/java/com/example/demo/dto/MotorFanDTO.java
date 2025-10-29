package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 风机数据传输对象
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MotorFanDTO {
    
    private Long id;
    private String fanName;        // 风扇名称
    private Long deviceId;         // 设备ID
    private String deviceNum;      // 设备编号
    private Integer isRunning;     // 运行状态：0-停止 1-运行
    private String createdTime;    // 创建时间（格式化后的字符串）
    private String updatedTime;    // 更新时间（格式化后的字符串）
}

