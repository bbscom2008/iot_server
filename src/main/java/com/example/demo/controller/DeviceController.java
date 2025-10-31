package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.DeviceDetailDTO;
import com.example.demo.dto.DeviceListDTO;
import com.example.demo.dto.DeviceSettingsRequest;
import com.example.demo.dto.DeviceStatistics;
import com.example.demo.dto.PageResult;
import com.example.demo.entity.Device;
import com.example.demo.service.DeviceService;
import com.example.demo.util.DtoConverter;
import com.example.demo.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/device")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DeviceController {

    private final DeviceService deviceService;
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
        PageResult<DeviceListDTO> result = deviceService.getDeviceListDTO(
                userId, pageNum, pageSize, search, type);
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
        DeviceDetailDTO deviceDetailDTO = deviceService.getDeviceDetailDTO(id);
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

    /**
     * 更新设备设置
     * PUT /device/settings/{id}
     */
    @PutMapping("/settings/{id}")
    public ApiResponse<String> updateDeviceSettings(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @Valid @RequestBody DeviceSettingsRequest request) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        
        // 使用工具类将 DTO 转换为 Entity
        Device device = dtoConverter.toEntity(request, Device.class);
        
        deviceService.updateDeviceSettings(id, userId, device);
        return ApiResponse.success("更新成功");
    }

    /**
     * 删除设备
     * DELETE /device/delete/{id}
     */
    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteDevice(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        deviceService.deleteDevice(id, userId);
        return ApiResponse.success("删除成功");
    }
}

