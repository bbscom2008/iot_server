package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.SendVerifyCodeRequest;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import com.example.demo.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    /**
     * 用户注册
     * POST /user/register
     */
    @PostMapping("/register")
    public ApiResponse<String> register(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return ApiResponse.success("注册成功");
    }

    /**
     * 发送验证码
     * POST /user/sendVerifyCode
     */
    @PostMapping("/sendVerifyCode")
    public ApiResponse<String> sendVerifyCode(@Valid @RequestBody SendVerifyCodeRequest request) {
        userService.sendVerifyCode(request.getPhone());
        return ApiResponse.success("验证码已发送");
    }

    /**
     * 用户登录
     * POST /user/login
     */
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ApiResponse.success(response);
    }

    /**
     * 获取用户信息
     * GET /user/info
     */
    @GetMapping("/info")
    public ApiResponse<Map<String, Object>> getUserInfo(
            @RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        User user = userService.getUserInfo(userId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("data", user);
        return ApiResponse.success(result);
    }

    /**
     * 更新用户信息
     * POST /user/updateInfo
     */
    @PostMapping("/updateInfo")
    public ApiResponse<String> updateUserInfo(
            @RequestHeader("Authorization") String token,
            @RequestBody User updateData) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        userService.updateUserInfo(userId, updateData);
        return ApiResponse.success("更新成功");
    }
}
