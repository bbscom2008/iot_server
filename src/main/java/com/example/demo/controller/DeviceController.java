package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.Device;
import com.example.demo.entity.FrequencyMotor;
import com.example.demo.entity.MotorFan;
import com.example.demo.entity.Sensor;
import com.example.demo.service.DeviceService;
import com.example.demo.service.FrequencyMotorService;
import com.example.demo.service.MotorFanService;
import com.example.demo.service.SensorService;
import com.example.demo.util.DtoConverter;
import com.example.demo.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
    private final MotorFanService motorFanService;
    private final FrequencyMotorService frequencyMotorService;
    private final JwtUtil jwtUtil;
    private final DtoConverter dtoConverter;

    /**
     * 获取设备列表
     * GET /device/list
     */
    @GetMapping("/list")
    public ApiResponse<PageResult<DeviceListDTO>> getDeviceList(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer type) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        PageResult<Device> deviceResult = deviceService.getDeviceList(
                userId, pageNum, pageSize, search, type);
        
        // 转换为 DTO
        List<DeviceListDTO> deviceListDTO = deviceResult.getList().stream()
                .map(device -> {
                    List<com.example.demo.entity.Sensor> sensors = sensorService.findByDeviceId(device.getId());
                    return dtoConverter.toDeviceListDTO(device, sensors);
                })
                .collect(Collectors.toList());

        PageResult<DeviceListDTO> result = PageResult.of(deviceListDTO, deviceResult.getTotal());
        
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
    public ApiResponse<DeviceDetailDTO> getDeviceDetail(@PathVariable Long id) {
        Device device = deviceService.getDeviceDetail(id);
        
        // 获取设备的传感器、风机、变频电机数据
        List<Sensor> sensors = sensorService.findByDeviceId(id);
        List<MotorFan> motorFans = motorFanService.findByDeviceId(id);
        List<FrequencyMotor> frequencyMotors = frequencyMotorService.findByDeviceId(id);
        
        // 转换为 DTO
        DeviceDetailDTO deviceDetailDTO = dtoConverter.toDeviceDetailDTO(device, sensors, motorFans, frequencyMotors);
        
        return ApiResponse.success(deviceDetailDTO);
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

