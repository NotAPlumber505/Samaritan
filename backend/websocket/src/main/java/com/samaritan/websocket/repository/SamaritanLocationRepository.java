package com.samaritan.websocket.repository;

import com.samaritan.websocket.model.SamaritanPushRecipient;
import com.samaritan.websocket.service.DistanceUtil;

@org.springframework.stereotype.Repository
public class SamaritanLocationRepository {

    private final org.springframework.jdbc.core.simple.JdbcClient jdbc;

    private static final org.springframework.jdbc.core.RowMapper<SamaritanPushRecipient> ROW_MAPPER =
            (rs, rowNum) -> new SamaritanPushRecipient(
                    rs.getLong("user_id"),
                    rs.getString("push_token"),
                    rs.getDouble("latitude"),
                    rs.getDouble("longitude"));

    public SamaritanLocationRepository(org.springframework.jdbc.core.simple.JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public void upsert(long userId, double latitude, double longitude) {
        jdbc.sql("""
                INSERT INTO samaritan_locations (user_id, latitude, longitude)
                VALUES (?, ?, ?)
                ON CONFLICT (user_id) DO UPDATE
                SET latitude = EXCLUDED.latitude,
                    longitude = EXCLUDED.longitude,
                    updated_at = CURRENT_TIMESTAMP
                """)
                .params(userId, latitude, longitude)
                .update();
    }

    public java.util.List<SamaritanPushRecipient> findNearbyRecipients(
            long excludedUserId, double latitude, double longitude, double radiusMeters) {
        double latitudeDelta = radiusMeters / 111_320.0;
        double longitudeDelta = radiusMeters
                / (111_320.0 * Math.max(Math.cos(Math.toRadians(latitude)), 0.01));

        return jdbc.sql("""
                SELECT u.id AS user_id, u.push_token, l.latitude, l.longitude
                FROM users u
                JOIN samaritan_locations l ON l.user_id = u.id
                WHERE u.is_samaritan = TRUE
                  AND u.push_token IS NOT NULL
                  AND u.push_token <> ''
                  AND u.id <> ?
                  AND l.updated_at >= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
                  AND l.latitude BETWEEN ? AND ?
                  AND l.longitude BETWEEN ? AND ?
                """)
                .params(excludedUserId,
                        latitude - latitudeDelta, latitude + latitudeDelta,
                        longitude - longitudeDelta, longitude + longitudeDelta)
                .query(ROW_MAPPER)
                .list()
                .stream()
                .filter(recipient -> DistanceUtil.distanceInMeters(
                        latitude, longitude, recipient.latitude(), recipient.longitude()) <= radiusMeters)
                .toList();
    }
}