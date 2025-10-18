package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.DeviceStatistics;
import com.example.demo.dto.PageResult;
import com.example.demo.entity.Device;
import com.example.demo.service.DeviceService;
import com.example.demo.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/device")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DeviceController {

    private final DeviceService deviceService;
    private final JwtUtil jwtUtil;

    /**
     * 获取设备列表
     * GET /device/list
     */
    @GetMapping("/list")
    public ApiResponse<PageResult<Device>> getDeviceList(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer breedType) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        PageResult<Device> result = deviceService.getDeviceList(
                userId, pageNum, pageSize, search, type, breedType);
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
     * GET /device/{id}
     */
    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> getDeviceDetail(@PathVariable Long id) {
        Device device = deviceService.getDeviceDetail(id);
        Map<String, Object> result = new HashMap<>();
        result.put("data", device);
        return ApiResponse.success(result);
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

