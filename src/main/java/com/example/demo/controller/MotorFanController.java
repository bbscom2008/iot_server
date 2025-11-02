package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.entity.MotorFan;
import com.example.demo.service.MotorFanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/motor-fan")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MotorFanController {

    private final MotorFanService motorFanService;

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

    /**
     * 根据ID获取风机详情
     * GET /motor-fan/{id}
     */
    @GetMapping("/{id}")
    public ApiResponse<MotorFan> getMotorFanById(@PathVariable Long id) {
        MotorFan motorFan = motorFanService.findById(id);
        return ApiResponse.success(motorFan);
    }
}
