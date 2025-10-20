package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "手机号不能为空")
    private String phone;

    @NotBlank(message = "密码不能为空")
    private String password;

    @NotBlank(message = "验证码不能为空")
    private String verifyCode;

    @NotNull(message = "养殖类型不能为空")
    private Integer breedingType;  // 0-猪 1-羊 2-牛 3-鸡 4-鸭 5-其他

    @NotNull(message = "角色不能为空")
    private Integer role;  // 0-老板 1-饲养员 2-其他
}
