package com.samaritan.websocket.repository;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import com.samaritan.constants.api.CreateEmergency;
import com.samaritan.websocket.model.Emergency;
import com.samaritan.websocket.service.DistanceUtil;

@org.springframework.stereotype.Repository
public class EmergencyRepository {

    private final org.springframework.jdbc.core.simple.JdbcClient jdbc;

    private static final org.springframework.jdbc.core.RowMapper<Emergency> ROW_MAPPER = (rs, i) -> new Emergency(
            rs.getLong("id"),
            rs.getLong("owner_user_id"),
            rs.getObject("requested_at", OffsetDateTime.class).toInstant(),
            rs.getObject("latitude", Double.class),     // getObject keeps NULL as null, not 0.0
            rs.getObject("longitude", Double.class),
            rs.getObject("requires_911", Boolean.class),
            rs.getString("emergency_type"),
            rs.getString("self_emergency"),
            rs.getString("description"));

    public EmergencyRepository(org.springframework.jdbc.core.simple.JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public Emergency create(CreateEmergency req) {
        return jdbc.sql("""
                INSERT INTO emergencies
                    (owner_user_id, latitude, longitude)
                VALUES (?, ?, ?)
                RETURNING *
                """)
                .params(req.user_id(), req.latitude(), req.longitude())
                .query(ROW_MAPPER)
                .single();
    }

    // Location-only create, used by EmergencyService and TestPublishController
    public Emergency create(long ownerUserId, double latitude, double longitude) {
        return create(new CreateEmergency(ownerUserId, latitude, longitude, null));
    }

    // Saves the fields that can change after creation
    public boolean update(Emergency e) {
        return jdbc.sql("""
                UPDATE emergencies
                SET latitude = ?, longitude = ?, requires_911 = ?,
                    emergency_type = ?, self_emergency = ?, description = ?
                WHERE id = ?
                """)
                .params(e.getLatitude(), e.getLongitude(), e.getRequires911(),
                        e.getEmergencyType(), e.getSelfEmergency(), e.getDescription(), e.getId())
                .update() > 0;
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

    public boolean deleteByIdAndOwner(long id, long ownerUserId) {
        return jdbc.sql("DELETE FROM emergencies WHERE id = ? AND owner_user_id = ?")
                .params(id, ownerUserId)
                .update() > 0;
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
                .sorted(Comparator.comparingDouble((Emergency e) -> DistanceUtil.distanceInMeters(
                        originLat, originLng, e.getLatitude(), e.getLongitude())))
                .toList();
    }
}