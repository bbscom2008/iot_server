package com.example.demo.dto;

import com.example.demo.util.DateUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
    
    @JsonFormat(pattern = DateUtils.DATE_TIME_FORMAT, timezone = DateUtils.TIME_ZONE)
    private LocalDateTime createdTime;    // 创建时间
    
    @JsonFormat(pattern = DateUtils.DATE_TIME_FORMAT, timezone = DateUtils.TIME_ZONE)
    private LocalDateTime updatedTime;    // 更新时间
}

