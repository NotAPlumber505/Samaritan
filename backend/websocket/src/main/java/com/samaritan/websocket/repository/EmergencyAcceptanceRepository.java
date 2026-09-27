package com.samaritan.websocket.repository;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class EmergencyAcceptanceRepository {

    private final JdbcClient jdbc;

    public EmergencyAcceptanceRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public boolean accept(long emergencyId, long userId) {
        return jdbc.sql("""
                INSERT INTO emergency_acceptances (emergency_id, user_id)
                VALUES (?, ?)
                ON CONFLICT (emergency_id, user_id) DO NOTHING
                """)
                .params(emergencyId, userId)
                .update() > 0;
    }
}