package com.samaritan.websocket.repository;


import com.samaritan.websocket.model.Emergency;
import java.util.Optional;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class EmergencyRepository {

    private final Map<Long, Emergency> emergencies = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong(1);

    public Emergency create(long ownerUserId, double latitude, double longitude){
        Emergency emergency = new Emergency(nextId.getAndIncrement(), ownerUserId, latitude, longitude);
        emergencies.put(emergency.getId(), emergency);
        return emergency;
    }

    public Optional<Emergency> findById(long id) {
        return Optional.ofNullable(emergencies.get(id));
    }


}
