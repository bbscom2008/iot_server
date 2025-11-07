package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.MotorFanListDTO;
import com.example.demo.entity.MotorFan;
import com.example.demo.service.MotorFanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/motor-fan")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MotorFanController {

    private final MotorFanService motorFanService;

    /**
     * 获取所有风机列表（关联设备和用户信息）
     * GET /motor-fan/list
     */
    @GetMapping("/list")
    public ApiResponse<List<MotorFanListDTO>> getAllMotorFans(
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) String userPhone,
            @RequestParam(required = false) String deviceName,
            @RequestParam(required = false) String deviceNum,
            @RequestParam(required = false) String fanName) {
        
        // 构造查询参数
        Map<String, Object> params = new HashMap<>();
        params.put("userName", userName);
        params.put("userPhone", userPhone);
        params.put("deviceName", deviceName);
        params.put("deviceNum", deviceNum);
        params.put("fanName", fanName);
        
        List<MotorFanListDTO> motorFans = motorFanService.findAll(params);
        return ApiResponse.success(motorFans);
    }

    /**
     * 获取设备下的所有风机
     * GET /motor-fan/list/{deviceId}
     */
    @GetMapping("/list/{deviceId}")
    public ApiResponse<List<MotorFan>> getMotorFanList(@PathVariable Long deviceId) {
        List<MotorFan> motorFans = motorFanService.findByDeviceId(deviceId);
        return ApiResponse.success(motorFans);
    }

    /**
     * 根据ID获取风机详情
     * GET /motor-fan/{id}
     */
    @GetMapping("/{id}")
    public ApiResponse<MotorFan> getMotorFanById(@PathVariable Long id) {
        MotorFan motorFan = motorFanService.findById(id);
        return ApiResponse.success(motorFan);
    }

    /**
     * 更新风机配置
     * PUT /motor-fan/update
     */
    @PutMapping("/update")
    public ApiResponse<String> updateMotorFan(@RequestBody MotorFan motorFan) {
        // 检查ID是否存在
        if (motorFan.getId() == null) {
            throw new RuntimeException("风机ID不能为空");
        }
        
        MotorFan existFan = motorFanService.findById(motorFan.getId());
        if (existFan == null) {
            throw new RuntimeException("风机不存在");
        }
        
        motorFanService.update(motorFan);
        return ApiResponse.success("更新成功");
    }
}