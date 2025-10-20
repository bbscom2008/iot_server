package com.example.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private Long id;
    private String phone;
    private String password;
    private String nikeName;
    private String address;
    private String icon;
    private String breedingType;    // 养殖类型：养猪、养鸭、养鸡、养兔、其他
    private String position;        // 岗位：老板、饲养员、其他
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
