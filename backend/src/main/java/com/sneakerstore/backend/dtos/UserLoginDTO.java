package com.sneakerstore.backend.dtos;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDTO {
    private String phoneNumber;
    private String password;
}