package com.samaritan.websocket.service;

import com.samaritan.constants.api.UpdateEmergency;
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
    public EmergencyEntity updateEmergency(Long id, UpdateEmergency updatedData) {
        return emergencyRepository.findById(id)
                .map(existingEmergency -> {
                    if (updatedData.latitude() != null)
                        existingEmergency.setLatitude(updatedData.latitude());

                    if (updatedData.longitude() != null)
                        existingEmergency.setLongitude(updatedData.longitude());

                    if (updatedData.requires_911() != null)
                        existingEmergency.setRequires911(updatedData.requires_911());

                    if (updatedData.self_emergency() != null)
                        existingEmergency.setSelf_emergency(updatedData.self_emergency());

                    if (updatedData.emergency_nature() != null)
                        existingEmergency.setEmergency_nature(updatedData.emergency_nature());

                    if (updatedData.description() != null)
                        existingEmergency.setDescription(updatedData.description());

                    return emergencyRepository.save(existingEmergency);
                })
                .orElseThrow(() -> new EntityNotFoundException("Emergency not found with id: " + id));
    }

}