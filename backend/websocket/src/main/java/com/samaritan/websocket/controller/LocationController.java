package com.samaritan.websocket.controller;

import com.samaritan.websocket.model.DistanceToResponderResponse;
import com.samaritan.websocket.model.LocationReport;
import com.samaritan.websocket.model.StoredLocation;
import com.samaritan.websocket.repository.EmergencyRepository;
import com.samaritan.websocket.repository.LocationRepository;
import com.samaritan.websocket.service.DistanceUtil;

@org.springframework.web.bind.annotation.RestController
@org.springframework.web.bind.annotation.RequestMapping("/location")
@org.springframework.web.bind.annotation.CrossOrigin(origins = "*")
public class LocationController {

    private final LocationRepository locationRepository;
    private final EmergencyRepository emergencyRepository;

    public LocationController(LocationRepository locationRepository, EmergencyRepository emergencyRepository) {
        this.locationRepository = locationRepository;
        this.emergencyRepository = emergencyRepository;
    }

    // POST /location/{emergencyId}/{label} -> reports where "requester" or "responder" currently is
        @org.springframework.web.bind.annotation.PostMapping("/{emergencyId}/{label}")
        public org.springframework.http.ResponseEntity<Void> reportLocation(
            @org.springframework.web.bind.annotation.PathVariable long emergencyId,
            @org.springframework.web.bind.annotation.PathVariable String label,
            @org.springframework.web.bind.annotation.RequestBody LocationReport report) {
        if (!(label.equals("requester") || label.equals("responder"))
                || report.getLatitude() == null || report.getLongitude() == null
                || !Double.isFinite(report.getLatitude()) || !Double.isFinite(report.getLongitude())
                || report.getLatitude() < -90 || report.getLatitude() > 90
                || report.getLongitude() < -180 || report.getLongitude() > 180) {
            return org.springframework.http.ResponseEntity.badRequest().build();
        }
        if (emergencyRepository.findById(emergencyId).isEmpty()) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        report.setLabel(label);
        locationRepository.save(new StoredLocation(locationId(emergencyId, label), report));
        return org.springframework.http.ResponseEntity.noContent().build();
    }

    // GET /location/{emergencyId}/distance -> how far the responder currently is from the requester
        @org.springframework.web.bind.annotation.GetMapping("/{emergencyId}/distance")
        public DistanceToResponderResponse distanceToResponder(
            @org.springframework.web.bind.annotation.PathVariable long emergencyId) {
        StoredLocation requester = locationRepository.findById(locationId(emergencyId, "requester"))
            .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "No requester location reported yet"));
        StoredLocation responder = locationRepository.findById(locationId(emergencyId, "responder"))
            .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "No responder location reported yet"));

        double km = DistanceUtil.distanceKm(requester.getLatitude(), requester.getLongitude(),
                responder.getLatitude(), responder.getLongitude());
        double miles = DistanceUtil.distanceMiles(requester.getLatitude(), requester.getLongitude(),
                responder.getLatitude(), responder.getLongitude());

        return new DistanceToResponderResponse(km, miles, responder.getLatitude(), responder.getLongitude());
    }

    private String locationId(long emergencyId, String label) {
        return emergencyId + ":" + label;
    }
}
