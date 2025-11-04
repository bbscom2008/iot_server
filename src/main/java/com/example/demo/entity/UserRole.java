package com.example.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRole {

    private Long id;
    private String dictLabel;
    private String dictValue;
    private String platform;  // 平台类型：mobile-手机端，web-PC端
    private Integer dictSort;
    private String remark;
    private LocalDateTime createdAt;
}

