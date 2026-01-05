package com.sneakerstore.backend.services;

import com.sneakerstore.backend.models.User;

public interface UserService {
    User createUser(User user);
    String login(String phoneNumber, String password) throws Exception;
    User getUserById(long id);
}