package com.sneakerstore.backend.dtos;

import lombok.*;

@Data // Tự tạo Getter/Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDTO {
    private String phoneNumber;
    private String password;
}