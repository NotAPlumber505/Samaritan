package com.samaritan.websocket.repository;


import java.util.List;
import java.util.Optional;

import com.samaritan.websocket.model.StoredLocation;

@org.springframework.stereotype.Repository
public class LocationRepository {

    private final org.springframework.jdbc.core.simple.JdbcClient jdbc;

    private static final org.springframework.jdbc.core.RowMapper<StoredLocation> ROW_MAPPER = (rs, rowNum) -> {
        String id = rs.getLong("emergency_id") + ":" + rs.getString("label");
        com.samaritan.websocket.model.LocationReport report = new com.samaritan.websocket.model.LocationReport();
        report.setLatitude(rs.getDouble("latitude"));
        report.setLongitude(rs.getDouble("longitude"));
        report.setLabel(rs.getString("label"));
        return new StoredLocation(id, report);
    };

    public LocationRepository(org.springframework.jdbc.core.simple.JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public StoredLocation save(StoredLocation location){
        String[] idParts = location.getId().split(":", 2);
        if (idParts.length != 2) {
            throw new IllegalArgumentException("Location ID must be '<emergencyId>:<label>'");
        }
        long emergencyId = Long.parseLong(idParts[0]);
        String label = idParts[1];
        jdbc.sql("""
                INSERT INTO emergency_locations (emergency_id, label, latitude, longitude)
                VALUES (?, ?, ?, ?)
                ON CONFLICT (emergency_id, label) DO UPDATE
                SET latitude = EXCLUDED.latitude,
                    longitude = EXCLUDED.longitude,
                    updated_at = CURRENT_TIMESTAMP
                """)
                .params(emergencyId, label, location.getLatitude(), location.getLongitude())
                .update();
        return location;
    }

    public List<StoredLocation> findAll() {
        return jdbc.sql("SELECT emergency_id, label, latitude, longitude FROM emergency_locations")
                .query(ROW_MAPPER)
                .list();

    }

    public Optional<StoredLocation> findById(String id){
        String[] idParts = id.split(":", 2);
        if (idParts.length != 2) return Optional.empty();
        try {
            long emergencyId = Long.parseLong(idParts[0]);
            return jdbc.sql("""
                    SELECT emergency_id, label, latitude, longitude
                    FROM emergency_locations
                    WHERE emergency_id = ? AND label = ?
                    """)
                    .params(emergencyId, idParts[1])
                    .query(ROW_MAPPER)
                    .optional();
        } catch (NumberFormatException exception) {
            return Optional.empty();
        }

    }

    public void clear() {
        jdbc.sql("DELETE FROM emergency_locations").update();
    }

    public int count() {
        return jdbc.sql("SELECT COUNT(*) FROM emergency_locations")
                .query(Integer.class)
                .single();
    }


}
