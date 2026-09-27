package com.samaritan.websocket.repository;

import com.samaritan.websocket.service.DistanceUtil;

import com.samaritan.websocket.model.Emergency;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Repository
public class EmergencyRepository {

    private final JdbcClient jdbc;

    private static final RowMapper<Emergency> ROW_MAPPER = (rs, i) -> new Emergency(
            rs.getLong("id"),
            rs.getLong("owner_user_id"),
            rs.getDouble("latitude"),
            rs.getDouble("longitude"));

    public EmergencyRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public Emergency create(long ownerUserId, double latitude, double longitude) {
        long id = jdbc.sql("""
                INSERT INTO emergencies (owner_user_id, latitude, longitude)
                VALUES (?, ?, ?) RETURNING id
                """)
                .params(ownerUserId, latitude, longitude)
                .query(Long.class)
                .single();
        return new Emergency(id, ownerUserId, latitude, longitude);
    }

    public Optional<Emergency> findById(long id) {
        return jdbc.sql("SELECT * FROM emergencies WHERE id = ?")
                .param(id)
                .query(ROW_MAPPER)
                .optional();
    }

    public List<Emergency> findAll() {
        return jdbc.sql("SELECT * FROM emergencies").query(ROW_MAPPER).list();
    }

    public boolean deleteById(long id) {
        return jdbc.sql("DELETE FROM emergencies WHERE id = ?").param(id).update() > 0;
    }

    public List<Emergency> findNearby(double originLat, double originLng, double radiusMeters) {
        // Cheap bounding-box filter in SQL, then an exact distance check in Java
        double latDelta = radiusMeters / 111_320.0;
        double lngDelta = radiusMeters / (111_320.0 * Math.max(Math.cos(Math.toRadians(originLat)), 0.01));

        return jdbc.sql("""
                SELECT * FROM emergencies
                WHERE latitude  BETWEEN ? AND ?
                  AND longitude BETWEEN ? AND ?
                """)
                .params(originLat - latDelta, originLat + latDelta,
                        originLng - lngDelta, originLng + lngDelta)
                .query(ROW_MAPPER)
                .list()
                .stream()
                .filter(e -> DistanceUtil.distanceInMeters(
                        originLat, originLng, e.getLatitude(), e.getLongitude()) <= radiusMeters)
                .sorted(Comparator.comparingDouble(e -> DistanceUtil.distanceInMeters(
                        originLat, originLng, e.getLatitude(), e.getLongitude())))
                .toList();
    }
}