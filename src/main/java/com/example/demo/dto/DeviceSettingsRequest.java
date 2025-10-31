package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

/**
 * 设备设置更新请求DTO
 */
@Data
@NoArgsConstructor
public class DeviceSettingsRequest {
    
    @NotBlank(message = "设备名称不能为空")
    private String deviceName;           // 设备名称
    
    private Integer levelTime;           // 阶梯时间（秒）
    
    private Double gasUpperLimit;        // 气体上限（ppm）
    private Double gasLowerLimit;        // 气体下限（ppm）
    private Double tempUpperLimit;       // 温度上限（°C）
    private Double tempLowerLimit;       // 温度下限（°C）
    private Double humidityUpperLimit;   // 湿度上限（%）
    private Double humidityLowerLimit;   // 湿度下限（%）
    
    private Integer masterSwitch;        // 总开关：0-关闭 1-开启
    private Integer powerOffSwitch;      // 断电开关：0-关闭 1-开启
    private Integer tempSwitch;          // 温度开关：0-关闭 1-开启
    private Integer humiditySwitch;      // 湿度开关：0-关闭 1-开启
    private Integer gasSwitch;           // 气体开关：0-关闭 1-开启
    
    private Integer dialingMethod;       // 拨打方式：1-同时拨打 2-依次拨打
    private Integer alarmMethod;         // 报警方式：1-打电话 2-发短信 3-打电话和发短信
    private String alarmPhones;          // 报警电话 JSON字符串，最多10个电话
}

