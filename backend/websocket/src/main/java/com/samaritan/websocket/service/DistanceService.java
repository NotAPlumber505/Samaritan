package com.samaritan.websocket.service;

import com.samaritan.websocket.model.DistanceResult;
import com.samaritan.websocket.model.StoredLocation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DistanceService {

    private static final Logger log = LoggerFactory.getLogger(DistanceService.class);

    public List<DistanceResult> computeAllPairwiseDistances(List<StoredLocation> locations) {


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


        log.info("Computed {} pairwise distances across {} stored locations:", results.size(), locations.size());
        for (DistanceResult r : results) {
            log.info(String.format("  %s (%s)  <->  %s (%s)  =  %.3f km / %.3f mi",
                    r.getFromId(), r.getFromLabel(), r.getToId(), r.getToLabel(),
                    r.getDistanceKm(), r.getDistanceMiles()));
        }


        return results;
    }

    public List<DistanceResult> computeDistancesFrom(StoredLocation origin, List<StoredLocation> others) {
        List<DistanceResult> results = new ArrayList<>();

        for (StoredLocation other : others) {
            if (other.getId().equals(origin.getId())) {
                continue;
            }
            double km = DistanceUtil.distanceKm(origin.getLatitude(), origin.getLongitude(),
                    other.getLatitude(), other.getLongitude());
            double miles = DistanceUtil.distanceMiles(origin.getLatitude(), origin.getLongitude(),
                    other.getLatitude(), other.getLongitude());
            results.add(new DistanceResult(origin.getId(), labelOf(origin), other.getId(), labelOf(other), km, miles));
        }

        results.sort(Comparator.comparingDouble(DistanceResult::getDistanceKm));

        log.info("Distances from {} ({}) to {} other location(s):", origin.getId(), labelOf(origin), results.size());
        for (DistanceResult r : results) {
            log.info(String.format("  -> %s (%s) = %.3f km / %.3f mi", r.getToId(), r.getToLabel(),
                    r.getDistanceKm(), r.getDistanceMiles()));
        }

        return results;
    }

    private String labelOf(StoredLocation location) {
        return location.getLabel() != null && !location.getLabel().isBlank()
                ? location.getLabel()
                : location.getId();
    }

}
