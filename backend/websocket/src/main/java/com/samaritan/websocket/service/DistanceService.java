package com.samaritan.websocket.service;

import com.samaritan.websocket.model.DistanceResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DistanceService {

    private static final Logger log = LoggerFactory.getLogger(DistanceService.class);

    List<DistanceResult> results = new ArrayList<>();

    for (int i = 0; i < locations.size(); i++) {
        for (int j = i + 1; j < locations.size(); j++) {
            StoredLocation a = locations.get(i);
            StoredLocation b = locations.get(j);

            double km = DistanceUtil.distanceKm(a.getLatitude(), a.getLongitude(),
                    b.getLatitude(), b.getLongitude());
            double miles = DistanceUtil.distanceMiles(a.getLatitude(), a.getLongitude(),
                    b.getLatitude(), b.getLongitude());

            results.add(new DistanceResult(a.getId(), labelOf(a), b.getId(), labelOf(b), km, miles));
        }
    }


}
