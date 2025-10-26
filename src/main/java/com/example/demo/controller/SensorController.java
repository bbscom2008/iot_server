package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.entity.Sensor;
import com.example.demo.service.SensorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sensor")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SensorController {

    private final SensorService sensorService;

    /**
     * 根据设备ID获取传感器列表
     * GET /sensor/device/{deviceId}
     */
    @GetMapping("/device/{deviceId}")
    public ApiResponse<Map<String, Object>> getSensorsByDeviceId(@PathVariable Long deviceId) {
        List<Sensor> list = sensorService.findByDeviceId(deviceId);
        Map<String, Object> result = new HashMap<>();
        result.put("data", list);
        return ApiResponse.success(result);
    }

    /**
     * 根据设备编号获取传感器列表
     * GET /sensor/device-num/{deviceNum}
     */
    @GetMapping("/device-num/{deviceNum}")
    public ApiResponse<Map<String, Object>> getSensorsByDeviceNum(@PathVariable String deviceNum) {
        List<Sensor> list = sensorService.findByDeviceNum(deviceNum);
        Map<String, Object> result = new HashMap<>();
        result.put("data", list);
        return ApiResponse.success(result);
    }

    /**
     * 根据ID获取传感器详情
     * GET /sensor/{id}
     */
    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> getSensorById(@PathVariable Long id) {
        Sensor sensor = sensorService.findById(id);
        Map<String, Object> result = new HashMap<>();
        result.put("data", sensor);
        return ApiResponse.success(result);
    }

    /**
     * 新增传感器
     * POST /sensor
     */
    @PostMapping
    public ApiResponse<String> addSensor(@RequestBody Sensor sensor) {
        sensorService.addSensor(sensor);
        return ApiResponse.success("传感器添加成功");
    }

    /**
     * 更新传感器值
     * PUT /sensor/{id}/value
     */
    @PutMapping("/{id}/value")
    public ApiResponse<String> updateSensorValue(
            @PathVariable Long id,
            @RequestBody Map<String, Double> params) {
        Double sensorValue = params.get("sensorValue");
        sensorService.updateSensorValue(id, sensorValue);
        return ApiResponse.success("传感器值更新成功");
    }

    /**
     * 删除传感器
     * DELETE /sensor/{id}
     */
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteSensor(@PathVariable Long id) {
        sensorService.deleteSensor(id);
        return ApiResponse.success("传感器删除成功");
    }
}

