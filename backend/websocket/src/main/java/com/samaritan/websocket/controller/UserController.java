package com.samaritan.websocket.controller;

import com.samaritan.constants.api.CreateUser;
import com.samaritan.constants.api.CreateUserResponse;
import com.samaritan.websocket.entity.UserEntity;
import org.springframework.web.bind.annotation.*;
import com.samaritan.websocket.service.UserService;



@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public CreateUserResponse createUser(@RequestBody CreateUser json) {
        UserEntity userEntity = new UserEntity(json.ecdsa_public_key(), json.is_samaritan(), json.push_key());
        UserEntity savedUser = userService.saveUser(userEntity);
        return new CreateUserResponse(savedUser.getUserId());
    }
}