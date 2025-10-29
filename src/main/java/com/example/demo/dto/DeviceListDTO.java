package com.example.demo.dto;

import com.example.demo.entity.Device;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 设备列表项数据传输对象
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceListDTO {
    
    private Long id;
    private Long userId;
    private String deviceNum;
    private String deviceName;
    private Integer deviceType;      // 设备类型ID
    private Integer deviceLineState; // 0-离线 1-在线
    private Integer signal;          // 信号强度
    private Integer electricQuantity; // 电量（0-100）
    private Integer warningStatus;   // 报警状态：0-正常 1-报警
    private String createdTime;      // 创建时间（格式化后的字符串）
    private String updatedTime;      // 更新时间（格式化后的字符串）
    private String lastOfflineTime;  // 最后离线时间（格式化后的字符串）
    private List<SensorDTO> sensors; // 传感器列表
}

