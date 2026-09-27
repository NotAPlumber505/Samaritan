package com.samaritan.websocket.repository;

import com.samaritan.websocket.model.User;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private final Map<Long, User> usersById = new ConcurrentHashMap<>();
    private final Map<String, Long> idByPublicKey = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong(1);

    public User upsert(String ecdsaPublicKey, boolean isSamaritan, String pushToken) {
        Long existingId = idByPublicKey.get(ecdsaPublicKey);
        if (existingId != null) {
            User existing = usersById.get(existingId);
            existing.setSamaritan(isSamaritan);
            if (pushToken != null) {
                existing.setPushToken(pushToken);
            }
            return existing;
        }

        long id = nextId.getAndIncrement();
        User user = new User(id, ecdsaPublicKey, isSamaritan, pushToken);
        usersById.put(id, user);
        idByPublicKey.put(ecdsaPublicKey, id);
        return user;
    }

    public Optional<User> findById(long id) {
        return Optional.ofNullable(usersById.get(id));
    }

    /**
     * Everyone currently opted in as a Samaritan with a push token registered.
     * TODO: swap for a real query once emergency creation and users are wired to TigerData.
     */
    public List<User> findSamaritansWithPushToken() {
        return usersById.values().stream()
                .filter(User::isSamaritan)
                .filter(u -> u.getPushToken() != null && !u.getPushToken().isBlank())
                .toList();
    }
}