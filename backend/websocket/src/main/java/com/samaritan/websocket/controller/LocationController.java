package com.samaritan.websocket.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.samaritan.websocket.model.DistanceToResponderResponse;
import com.samaritan.websocket.model.LocationReport;
import com.samaritan.websocket.model.StoredLocation;
import com.samaritan.websocket.repository.LocationRepository;
import com.samaritan.websocket.service.DistanceUtil;

@RestController
@RequestMapping("/location")
public class LocationController {

    private final LocationRepository locationRepository;

    public LocationController(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    // POST /location/{emergencyId}/{label} -> reports where "requester" or "responder" currently is
    @PostMapping("/{emergencyId}/{label}")
    public ResponseEntity<Void> reportLocation(@PathVariable long emergencyId,
                                                @PathVariable String label,
                                                @RequestBody LocationReport report) {
        report.setLabel(label);
        locationRepository.save(new StoredLocation(locationId(emergencyId, label), report));
        return ResponseEntity.noContent().build();
    }

    // GET /location/{emergencyId}/distance -> how far the responder currently is from the requester
    @GetMapping("/{emergencyId}/distance")
    public DistanceToResponderResponse distanceToResponder(@PathVariable long emergencyId) {
        StoredLocation requester = locationRepository.findById(locationId(emergencyId, "requester"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No requester location reported yet"));
        StoredLocation responder = locationRepository.findById(locationId(emergencyId, "responder"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No responder location reported yet"));

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
