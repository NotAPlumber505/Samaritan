package com.samaritan.websocket.controller;

import com.samaritan.constants.api.CreateUser;
import com.samaritan.constants.api.CreateUserResponse;
import com.samaritan.websocket.model.User;
import com.samaritan.websocket.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<CreateUserResponse> postUser(@RequestBody CreateUser request) {
        User user = userRepository.upsert(request.ecdsa_public_key(), request.is_samaritan(), request.push_token());
        return ResponseEntity.status(HttpStatus.CREATED).body(new CreateUserResponse(user.getId()));
    }
}