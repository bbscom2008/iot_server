package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;

    /**
     * 用户注册
     */
    @Transactional
    public UserResponse register(RegisterRequest request) {
        // 检查用户名是否已存在
        if (userMapper.countByUsername(request.getUsername()) > 0) {
            throw new RuntimeException("用户名已存在");
        }

        // 创建新用户
        User user = new User();
        user.setUsername(request.getUsername());
        // 注意：在生产环境中应该使用BCrypt等方式加密密码
        user.setPassword(request.getPassword());

        // 保存用户
        userMapper.insert(user);

        // 返回用户信息（user对象已包含自动生成的id）
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getCreatedAt()
        );
    }

    /**
     * 用户登录
     */
    public UserResponse login(LoginRequest request) {
        // 查找用户
        User user = userMapper.findByUsername(request.getUsername());
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }

        // 验证密码
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }

        // 返回用户信息
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getCreatedAt()
        );
    }

    /**
     * 查询所有用户
     */
    public List<UserResponse> getAllUsers() {
        List<User> users = userMapper.findAll();
        return users.stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    /**
     * 根据ID查询用户
     */
    public UserResponse getUserById(Long id) {
        User user = userMapper.findById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getCreatedAt()
        );
    }

    /**
     * 更新用户
     */
    @Transactional
    public UserResponse updateUser(Long id, RegisterRequest request) {
        // 检查用户是否存在
        User existingUser = userMapper.findById(id);
        if (existingUser == null) {
            throw new RuntimeException("用户不存在");
        }

        // 检查用户名是否被其他用户使用
        User userWithSameName = userMapper.findByUsername(request.getUsername());
        if (userWithSameName != null && !userWithSameName.getId().equals(id)) {
            throw new RuntimeException("用户名已被使用");
        }

        // 更新用户信息
        existingUser.setUsername(request.getUsername());
        existingUser.setPassword(request.getPassword());
        
        userMapper.update(existingUser);

        return new UserResponse(
                existingUser.getId(),
                existingUser.getUsername(),
                existingUser.getCreatedAt()
        );
    }

    /**
     * 删除用户
     */
    @Transactional
    public void deleteUser(Long id) {
        User user = userMapper.findById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        userMapper.deleteById(id);
    }
}

