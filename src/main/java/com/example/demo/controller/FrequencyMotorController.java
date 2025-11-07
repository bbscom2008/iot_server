package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.entity.FrequencyMotor;
import com.example.demo.service.FrequencyMotorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/frequencyMotor")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FrequencyMotorController {

    private final FrequencyMotorService frequencyMotorService;

    /**
     * 获取所有变频电机列表（关联设备和用户信息）
     * GET /frequencyMotor/list
     */
    @GetMapping("/list")
    public ApiResponse<List<FrequencyMotor>> getAllFrequencyMotors(
            @RequestParam(required = false) String deviceName,
            @RequestParam(required = false) String deviceNum) {
        
        // 构造查询参数
        Map<String, Object> params = Map.of(
            "deviceName", deviceName,
            "deviceNum", deviceNum
        );
        
        List<FrequencyMotor> frequencyMotors = frequencyMotorService.findAll(params);
        return ApiResponse.success(frequencyMotors);
    }

    /**
     * 获取设备下的所有变频电机
     * GET /frequencyMotor/list/{deviceId}
     */
    @GetMapping("/list/{deviceId}")
    public ApiResponse<List<FrequencyMotor>> getFrequencyMotorList(@PathVariable Long deviceId) {
        List<FrequencyMotor> frequencyMotors = frequencyMotorService.findByDeviceId(deviceId);
        return ApiResponse.success(frequencyMotors);
    }

    /**
     * 根据ID获取变频电机详情
     * GET /frequencyMotor/{id}
     */
    @GetMapping("/{id}")
    public ApiResponse<FrequencyMotor> getFrequencyMotorById(@PathVariable Long id) {
        FrequencyMotor frequencyMotor = frequencyMotorService.findById(id);
        return ApiResponse.success(frequencyMotor);
    }

    /**
     * 更新变频电机配置
     * PUT /frequencyMotor/update
     */
    @PutMapping("/update")
    public ApiResponse<String> updateFrequencyMotor(@RequestBody FrequencyMotor frequencyMotor) {
        // 检查ID是否存在
        if (frequencyMotor.getId() == null) {
            throw new RuntimeException("变频电机ID不能为空");
        }
        
        FrequencyMotor existMotor = frequencyMotorService.findById(frequencyMotor.getId());
        if (existMotor == null) {
            throw new RuntimeException("变频电机不存在");
        }

        int affected = frequencyMotorService.update(frequencyMotor);
        if (affected <= 0) {
            throw new RuntimeException("更新失败，未影响任何行");
        }
        return ApiResponse.success("更新成功");
    }
}