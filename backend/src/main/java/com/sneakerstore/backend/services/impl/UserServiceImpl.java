package com.sneakerstore.backend.services.impl;

import com.sneakerstore.backend.components.JwtTokenUtil;
import com.sneakerstore.backend.models.User;
import com.sneakerstore.backend.repositories.UserRepository;
import com.sneakerstore.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    @Override
    public User createUser(User user) {
        if (userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new RuntimeException("Số điện thoại đã tồn tại, vui lòng dùng số khác!");
        }
        return userRepository.save(user);
    }

    @Override
    public String login(String phoneNumber, String password) throws Exception {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new Exception("Sai số điện thoại hoặc mật khẩu"));
        if (!user.getPassword().equals(password)) {
            throw new Exception("Sai số điện thoại hoặc mật khẩu");
        }
        
        return jwtTokenUtil.generateToken(user);
    }

    @Override
    public User getUserById(long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User với ID: " + id));
    }
}