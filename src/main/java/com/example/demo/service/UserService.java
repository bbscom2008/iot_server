package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final VerifyCodeService verifyCodeService;

    /**
     * 用户登录（密码登录）
     */
    public LoginResponse login(LoginRequest request) {
        // 查找用户
        User user = userMapper.findByPhone(request.getPhone());
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 验证密码（注意：生产环境应该使用加密密码）
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        // 生成Token
        String token = jwtUtil.generateToken(user.getId(), user.getPhone());

        // 返回登录响应
        return new LoginResponse(token, LoginResponse.UserInfo.from(user));
    }

    /**
     * 验证码登录
     */
    public LoginResponse loginByCode(String phone, String verifyCode) {
        // 查找用户
        User user = userMapper.findByPhone(phone);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 验证验证码 // 开发时先不校验验证码
//        boolean isCodeValid = verifyCodeService.verifyCode(phone, verifyCode);
//        if (!isCodeValid) {
//            throw new RuntimeException("验证码错误或已过期");
//        }

        // 生成Token
        String token = jwtUtil.generateToken(user.getId(), user.getPhone());

        // 返回登录响应
        return new LoginResponse(token, LoginResponse.UserInfo.from(user));
    }

    /**
     * 获取用户信息
     */
    public User getUserInfo(Long userId) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        // 不返回密码
        user.setPassword(null);
        return user;
    }

    /**
     * 用户注册
     */
    @Transactional
    public void register(RegisterRequest request) {
        log.info("开始注册用户，手机号: {}", request.getPhone());
        
        // 1. 验证手机号是否已注册
        User existUser = userMapper.findByPhone(request.getPhone());
        if (existUser != null) {
            log.warn("注册失败：手机号已注册 - {}", request.getPhone());
            throw new RuntimeException("该手机号已注册");
        }

        // 2. 验证验证码， 开发其间，先不校验验证码
//        boolean isCodeValid = verifyCodeService.verifyCode(request.getPhone(), request.getVerifyCode());
//        if (!isCodeValid) {
//            throw new RuntimeException("验证码错误或已过期");
//        }

        // 3. 创建新用户
        User user = new User();
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword()); // 注意：生产环境应该加密
        user.setNikeName(request.getPhone()); // 默认昵称为手机号
        user.setBreedingType(request.getBreedingType()); // Integer 类型
        user.setRole(request.getRole()); // Integer 类型

        // 4. 保存用户
        int result = userMapper.insert(user);
        log.info("注册成功，手机号: {}, 用户ID: {}, 养殖类型: {}, 角色: {}, 影响行数: {}", 
                request.getPhone(), user.getId(), request.getBreedingType(), request.getRole(), result);
    }

    /**
     * 发送注册验证码（注册时使用）
     */
    public void sendRegisterCode(String phone) {
        // 检查手机号是否已注册
        User existUser = userMapper.findByPhone(phone);
        if (existUser != null) {
            throw new RuntimeException("该手机号已注册");
        }

        // 发送验证码
        verifyCodeService.sendVerifyCode(phone);
    }

    /**
     * 发送登录验证码（登录时使用）
     */
    public void sendLoginCode(String phone) {
        // 检查手机号是否已注册
        User existUser = userMapper.findByPhone(phone);
        if (existUser == null) {
            throw new RuntimeException("该手机号未注册");
        }

        // 发送验证码
        verifyCodeService.sendVerifyCode(phone);
    }

    /**
     * 更新用户信息
     */
    @Transactional
    public void updateUserInfo(Long userId, User updateData) {
        log.info("=== 开始更新用户信息 ===");
        log.info("用户ID: {}", userId);
        log.info("接收到的更新数据: nikeName={}, breedingType={}, role={}, icon={}", 
                updateData.getNikeName(), updateData.getBreedingType(), 
                updateData.getRole(), updateData.getIcon());
        
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        log.info("更新前的用户数据: nikeName={}, breedingType={}, role={}", 
                user.getNikeName(), user.getBreedingType(), user.getRole());

        // 更新字段
        if (updateData.getNikeName() != null) {
            user.setNikeName(updateData.getNikeName());
        }
        if (updateData.getAddress() != null) {
            user.setAddress(updateData.getAddress());
        }
        if (updateData.getIcon() != null) {
            user.setIcon(updateData.getIcon());
        }
        if (updateData.getBreedingType() != null) {
            user.setBreedingType(updateData.getBreedingType());
        }
        if (updateData.getRole() != null) {
            user.setRole(updateData.getRole());
        }
        
        log.info("更新后的用户数据: nikeName={}, breedingType={}, role={}", 
                user.getNikeName(), user.getBreedingType(), user.getRole());

        int result = userMapper.updateUser(user);
        log.info("用户信息更新成功，用户ID: {}, 影响行数: {}", userId, result);
    }

    /**
     * 发送修改手机号验证码
     */
    public void sendChangePhoneCode(String newPhone) {
        // 检查新手机号是否已被注册
        User existUser = userMapper.findByPhone(newPhone);
        if (existUser != null) {
            throw new RuntimeException("该手机号已被其他用户使用");
        }

        // 发送验证码
        verifyCodeService.sendVerifyCode(newPhone);
        log.info("发送修改手机号验证码到: {}", newPhone);
    }

    /**
     * 修改手机号
     */
    @Transactional
    public void changePhone(Long userId, String newPhone, String verifyCode) {
        // 查找用户
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 检查新手机号是否与当前手机号相同
        if (newPhone.equals(user.getPhone())) {
            throw new RuntimeException("新手机号不能与当前手机号相同");
        }

        // 检查新手机号是否已被注册
        User existUser = userMapper.findByPhone(newPhone);
        if (existUser != null) {
            throw new RuntimeException("该手机号已被其他用户使用");
        }

        // 验证验证码 // 开发时先不校验验证码
//        boolean isCodeValid = verifyCodeService.verifyCode(newPhone, verifyCode);
//        if (!isCodeValid) {
//            throw new RuntimeException("验证码错误或已过期");
//        }

        // 更新手机号
        user.setPhone(newPhone);
        userMapper.updateUser(user);
        log.info("手机号修改成功，用户ID: {}, 新手机号: {}", userId, newPhone);
    }
}
