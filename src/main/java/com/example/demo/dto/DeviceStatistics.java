package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceStatistics {

    private Long allDevice;      // 总设备数
    private Long lineDevice;     // 在线设备数
    private Long warningDevice;  // 报警设备数
}

