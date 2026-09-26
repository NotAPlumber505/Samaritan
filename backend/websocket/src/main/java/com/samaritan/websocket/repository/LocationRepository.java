package com.samaritan.websocket.repository;


import com.samaritan.websocket.model.StoredLocation;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

@Repository
public class LocationRepository {

    private final List<StoredLocation> locations = new CopyOnWriteArrayList<>();

    public StoredLocation save(StoredLocation location){
        locations.add(location);
        return location;
    }

    public List<StoredLocation> findAll() {
        return Collections.unmodifiableList(locations);

    }

    public Optional<StoredLocation> findById(String id){
        return locations.stream().filter(l -> l.getId().equals(id)).findFirst();

    }

    public void clear() {
        locations.clear();
    }

    public int count() {
        return locations.size();
    }


}
