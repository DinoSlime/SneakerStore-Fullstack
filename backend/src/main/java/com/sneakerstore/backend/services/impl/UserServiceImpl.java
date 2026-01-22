package com.sneakerstore.backend.services.impl;

import com.sneakerstore.backend.components.JwtTokenUtil;
import com.sneakerstore.backend.models.Role;
import com.sneakerstore.backend.models.User;
import com.sneakerstore.backend.repositories.RoleRepository;
import com.sneakerstore.backend.repositories.UserRepository;
import com.sneakerstore.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    @Override
    public User createUser(User user) {
        if (userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new RuntimeException("Số điện thoại đã tồn tại, vui lòng dùng số khác!");
        }
        Role role = roleRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền USER (Role ID = 1) trong Database"));
        user.setRole(role);

        if (user.getPassword() != null) {
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
        }

        return userRepository.save(user);
    }

    @Override
    public String login(String phoneNumber, String password) throws Exception {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new Exception("Sai số điện thoại hoặc mật khẩu"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
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