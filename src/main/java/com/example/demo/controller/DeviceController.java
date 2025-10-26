package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.DeviceStatistics;
import com.example.demo.dto.PageResult;
import com.example.demo.entity.Device;
import com.example.demo.entity.Sensor;
import com.example.demo.service.DeviceService;
import com.example.demo.service.SensorService;
import com.example.demo.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/device")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DeviceController {

    private final DeviceService deviceService;
    private final SensorService sensorService;
    private final JwtUtil jwtUtil;
    
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    /**
     * 格式化时间，去掉 T
     */
    private String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATETIME_FORMATTER) : null;
    }
    
    /**
     * 将 Sensor 对象转换为 Map，并格式化时间字段
     */
    private Map<String, Object> sensorToMap(Sensor sensor) {
        if (sensor == null) return null;
        Map<String, Object> sensorMap = new HashMap<>();
        sensorMap.put("id", sensor.getId());
        sensorMap.put("deviceId", sensor.getDeviceId());
        sensorMap.put("deviceNum", sensor.getDeviceNum());
        sensorMap.put("sensorTypeId", sensor.getSensorTypeId());
        sensorMap.put("sensorName", sensor.getSensorName());
        sensorMap.put("sensorValue", sensor.getSensorValue());
        sensorMap.put("unit", sensor.getUnit());
        sensorMap.put("createdAt", formatDateTime(sensor.getCreatedAt()));
        sensorMap.put("updatedAt", formatDateTime(sensor.getUpdatedAt()));
        return sensorMap;
    }

    /**
     * 获取设备列表
     * GET /device/list
     */
    @GetMapping("/list")
    public ApiResponse<PageResult<Map<String, Object>>> getDeviceList(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer type) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        PageResult<Device> deviceResult = deviceService.getDeviceList(
                userId, pageNum, pageSize, search, type);
        
        // 为每个设备添加传感器数据
        List<Map<String, Object>> deviceListWithSensors = deviceResult.getList().stream().map(device -> {
            Map<String, Object> deviceMap = new HashMap<>();
            deviceMap.put("id", device.getId());
            deviceMap.put("userId", device.getUserId());
            deviceMap.put("deviceNum", device.getDeviceNum());
            deviceMap.put("deviceName", device.getDeviceName());
            deviceMap.put("deviceType", device.getDeviceType());
            deviceMap.put("deviceLineState", device.getDeviceLineState());
            deviceMap.put("signal", device.getSignal());
            deviceMap.put("electricQuantity", device.getElectricQuantity());
            deviceMap.put("warningStatus", device.getWarningStatus());
            deviceMap.put("createdTime", formatDateTime(device.getCreatedTime()));
            deviceMap.put("updatedTime", formatDateTime(device.getUpdatedTime()));
            deviceMap.put("lastOfflineTime", formatDateTime(device.getLastOfflineTime()));
            
            // 获取设备的传感器数据并格式化
            List<Sensor> sensors = sensorService.findByDeviceId(device.getId());
            List<Map<String, Object>> sensorList = sensors != null ? 
                sensors.stream().map(this::sensorToMap).collect(Collectors.toList()) : new java.util.ArrayList<>();
            deviceMap.put("sensors", sensorList);
            
            return deviceMap;
        }).collect(Collectors.toList());
        
        PageResult<Map<String, Object>> result = PageResult.of(deviceListWithSensors, deviceResult.getTotal());
        
        return ApiResponse.success(result);
    }

    /**
     * 获取设备统计
     * GET /device/statistics
     */
    @GetMapping("/statistics")
    public ApiResponse<DeviceStatistics> getStatistics(
            @RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        DeviceStatistics statistics = deviceService.getStatistics(userId);
        return ApiResponse.success(statistics);
    }

    /**
     * 获取设备详情
     * GET /device/detail/{id}
     */
    @GetMapping("/detail/{id}")
    public ApiResponse<Map<String, Object>> getDeviceDetail(@PathVariable Long id) {
        Device device = deviceService.getDeviceDetail(id);
        
        // 获取设备的传感器数据并格式化
        List<Sensor> sensors = sensorService.findByDeviceId(id);
        List<Map<String, Object>> sensorList = sensors != null ? 
            sensors.stream().map(this::sensorToMap).collect(Collectors.toList()) : new java.util.ArrayList<>();
        
        // 构建返回数据
        Map<String, Object> result = new HashMap<>();
        result.put("id", device.getId());
        result.put("userId", device.getUserId());
        result.put("deviceNum", device.getDeviceNum());
        result.put("deviceName", device.getDeviceName());
        result.put("deviceType", device.getDeviceType());
        result.put("deviceLineState", device.getDeviceLineState());
        result.put("signal", device.getSignal());
        result.put("electricQuantity", device.getElectricQuantity());
        result.put("warningStatus", device.getWarningStatus());
        result.put("createdTime", formatDateTime(device.getCreatedTime()));
        result.put("updatedTime", formatDateTime(device.getUpdatedTime()));
        result.put("lastOfflineTime", formatDateTime(device.getLastOfflineTime()));
        
        // 添加传感器数组（已格式化）
        result.put("sensors", sensorList);
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", result);
        return ApiResponse.success(response);
    }

    /**
     * 绑定设备
     * POST /device/bind
     */
    @PostMapping("/bind")
    public ApiResponse<String> bindDevice(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> params) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        String deviceNum = params.get("deviceNum");
        String deviceName = params.get("deviceName");
        
        deviceService.bindDevice(userId, deviceNum, deviceName);
        return ApiResponse.success("绑定成功");
    }

    /**
     * 解绑设备
     * PUT /device/un/bind
     */
    @PutMapping("/un/bind")
    public ApiResponse<String> unbindDevice(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Long> params) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        Long deviceId = params.get("deviceId");
        
        deviceService.unbindDevice(deviceId, userId);
        return ApiResponse.success("解绑成功");
    }
}

