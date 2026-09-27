package com.samaritan.websocket.service;

import com.samaritan.websocket.entity.UserEntity;
import com.samaritan.websocket.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserEntity saveUser(UserEntity userEntity) {
        UserEntity entityToSave = new UserEntity(
                userEntity.getEcdsaPublicKey(),
                userEntity.getIsSamaritan(),
                userEntity.getPushToken()
        );

        return userRepository.save(entityToSave);
    }

    @Transactional(readOnly = true)
    public Optional<UserEntity> findUserById(long userId) {
        return userRepository.findById(userId);
    }
}