package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.entity.FrequencyMotor;
import com.example.demo.service.FrequencyMotorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/frequencyMotor")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FrequencyMotorController {

    private final FrequencyMotorService frequencyMotorService;

    /**
     * 更新变频电机配置
     * PUT /frequencyMotor
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
        
        frequencyMotorService.update(frequencyMotor);
        return ApiResponse.success("更新成功");
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
}

