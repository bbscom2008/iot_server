package com.example.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MotorFan {

    private Long id;
    private String fanName;        // 风扇名称
    private Long deviceId;         // 设备ID
    private String deviceNum;      // 设备编号
    private Integer isRunning;     // 运行状态：0-停止 1-运行
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}

