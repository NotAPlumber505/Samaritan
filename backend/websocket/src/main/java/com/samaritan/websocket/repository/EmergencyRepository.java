package com.samaritan.websocket.repository;


import com.samaritan.constants.api.CreateEmergency;
import com.samaritan.websocket.model.Emergency;

import java.util.*;

import com.samaritan.websocket.service.DistanceUtil;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class EmergencyRepository {

    private final Map<Long, Emergency> emergencies = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong(1);

    public Collection<Emergency> findAll() {
        return emergencies.values();
    }





    public Emergency create(long ownerUserId, double latitude, double longitude){
        Emergency emergency = new Emergency(nextId.getAndIncrement(), ownerUserId, latitude, longitude);
        emergencies.put(emergency.getId(), emergency);
        return emergency;
    }

    public Optional<Emergency> findById(long id) {
        return Optional.ofNullable(emergencies.get(id));
    }


    public boolean deleteById(Long id) {
        return id != null && emergencies.remove(id) != null;
    }

    public List<Emergency> findNearby(double originLat, double originLng, double radiusMeters) {
        return emergencies.values().stream()
                .filter(e -> DistanceUtil.distanceKm(
                        originLat, originLng, e.getLatitude(), e.getLongitude()) <= radiusMeters)
                .sorted(Comparator.comparingDouble(e -> DistanceUtil.distanceKm(
                        originLat, originLng, e.getLatitude(), e.getLongitude())))
                .toList();
    }



}
