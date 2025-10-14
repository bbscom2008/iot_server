package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.PageResult;
import com.example.demo.entity.DeviceWarning;
import com.example.demo.service.DeviceWarningService;
import com.example.demo.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/device")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DeviceWarningController {

    private final DeviceWarningService deviceWarningService;
    private final JwtUtil jwtUtil;

    /**
     * 获取报警列表
     * GET /device/warning/list
     */
    @GetMapping("/warning/list")
    public ApiResponse<PageResult<DeviceWarning>> getWarningList(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            PageResult<DeviceWarning> result = deviceWarningService.getWarningList(userId, pageNum, pageSize);
            return ApiResponse.success(result);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    /**
     * 消除报警（标记已读）
     * POST /device/warning/read
     */
    @PostMapping("/warning/read")
    public ApiResponse<String> markWarningRead(
            @RequestHeader("Authorization") String token,
            @RequestParam String deviceNum) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            deviceWarningService.markWarningRead(deviceNum, userId);
            return ApiResponse.success("操作成功");
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    /**
     * 消除环控仪报警
     * POST /device/hkyWarningRead/read
     */
    @PostMapping("/hkyWarningRead/read")
    public ApiResponse<String> markHkyWarningRead(
            @RequestHeader("Authorization") String token,
            @RequestParam String deviceNum) {
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            deviceWarningService.markWarningRead(deviceNum, userId);
            return ApiResponse.success("操作成功");
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}

