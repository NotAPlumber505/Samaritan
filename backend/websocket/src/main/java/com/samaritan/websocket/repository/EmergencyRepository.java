package com.samaritan.websocket.repository;

import com.samaritan.websocket.entity.EmergencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmergencyRepository extends JpaRepository<EmergencyEntity, Long> {

    Optional<EmergencyEntity> findByEmergencyId(long userId);
}
