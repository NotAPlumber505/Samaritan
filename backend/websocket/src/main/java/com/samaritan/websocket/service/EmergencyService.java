package com.samaritan.websocket.service;

import com.samaritan.websocket.entity.EmergencyEntity;
import com.samaritan.websocket.repository.EmergencyRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;

    public EmergencyService(EmergencyRepository emergencyRepository) {
        this.emergencyRepository = emergencyRepository;
    }

    @Transactional
    public EmergencyEntity saveEmergency(EmergencyEntity emergencyEntity) {
        EmergencyEntity entityToSave = new EmergencyEntity(
                emergencyEntity.getUser_id(),
                emergencyEntity.getLatitude(),
                emergencyEntity.getLongitude(),
                emergencyEntity.getRequires911(),
                emergencyEntity.getEmergency_nature(),
                emergencyEntity.getSelf_emergency(),
                emergencyEntity.getDescription()
        );

        return emergencyRepository.save(entityToSave);
    }

    @Transactional(readOnly = true)
    public Optional<EmergencyEntity> findEmergencyById(long emergencyId) {
        return emergencyRepository.findById(emergencyId);
    }
    public List<EmergencyEntity> getAllEmergencies() {
        return emergencyRepository.findAll();
    }
    public boolean deleteById(Long emergencyId) {
        emergencyRepository.deleteById(emergencyId);
        return true;
    }
    @Transactional
    public EmergencyEntity updateEmergency(Long id, EmergencyEntity updatedData) {
        return emergencyRepository.findById(id)
                .map(existingEmergency -> {
                    existingEmergency.setLatitude(updatedData.getLatitude());
                    existingEmergency.setLongitude(updatedData.getLongitude());
                    existingEmergency.setRequires911(updatedData.getRequires911());
                    existingEmergency.setSelf_emergency(updatedData.getSelf_emergency());
                    existingEmergency.setEmergency_nature(updatedData.getEmergency_nature());
                    existingEmergency.setDescription(updatedData.getDescription());
                    // Add any other fields that are allowed to change here...

                    return emergencyRepository.save(existingEmergency);
                })
                .orElseThrow(() -> new EntityNotFoundException("Emergency not found with id: " + id));
    }

}