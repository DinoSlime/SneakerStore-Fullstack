package com.sneakerstore.backend.services.impl;

import com.sneakerstore.backend.components.JwtTokenUtil;
import com.sneakerstore.backend.models.Role;
import com.sneakerstore.backend.models.User;
import com.sneakerstore.backend.repositories.RoleRepository;
import com.sneakerstore.backend.repositories.UserRepository;
import com.sneakerstore.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
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
        // Kiểm tra trùng username
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new DataIntegrityViolationException("Tên đăng nhập đã tồn tại, vui lòng chọn tên khác!");
        }

        // Kiểm tra trùng số điện thoại
        if (userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new DataIntegrityViolationException("Số điện thoại đã được đăng ký!");
        }

        Role role = roleRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền USER (Role ID = 1)"));
        user.setRole(role);

        if (user.getPassword() != null) {
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
        }

        return userRepository.save(user);
    }

    @Override
    public String login(String username, String password) throws Exception {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("Sai tài khoản hoặc mật khẩu"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Sai tài khoản hoặc mật khẩu");
        }
        
        return jwtTokenUtil.generateToken(user);
    }

    @Override
    public User getUserById(long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User với ID: " + id));
    }
    @Override
    public User getUserDetails(String username) throws Exception {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new Exception("User not found"));
    }
}