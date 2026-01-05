package com.sneakerstore.backend.services;

import com.sneakerstore.backend.components.JwtTokenUtil;
import com.sneakerstore.backend.models.User;
import com.sneakerstore.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public String login(String phoneNumber, String password) throws Exception {

        User existingUser = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new Exception("Sai số điện thoại hoặc mật khẩu"));

        if (!existingUser.getPassword().equals(password)) {
            throw new Exception("Sai số điện thoại hoặc mật khẩu");
        }

        return jwtTokenUtil.generateToken(existingUser);
    }
}