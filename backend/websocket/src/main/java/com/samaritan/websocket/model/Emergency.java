package com.samaritan.websocket.model;

import java.time.Instant;


public class Emergency {

    private final long id;
    private final long ownerUserId;
    private final Instant requestedAt;
    private Double latitude;
    private Double longitude;
    private Boolean requires911;
    private String emergencyType;
    private String selfEmergency;
    private String description;


    public Emergency(long id, long ownerUserId, double latitude, double longitude){
        this(id, ownerUserId, Instant.now(), latitude, longitude, null, null, null, null);
    }

    public Emergency(long id, long ownerUserId, Instant requestedAt, Double latitude, Double longitude,
                     Boolean requires911, String emergencyType, String selfEmergency, String description){
        this.id = id;
        this.ownerUserId = ownerUserId;
        this.requestedAt = requestedAt;
        this.latitude = latitude;
        this.longitude = longitude;
        this.requires911 = requires911;
        this.emergencyType = emergencyType;
        this.selfEmergency = selfEmergency;
        this.description = description;
    }

    public void applyUpdate(UpdateEmergencyMessage u){
        if (u.latitude() != null) latitude = u.latitude();
        if (u.longitude() != null) longitude = u.longitude();
        if (u.requires911() != null ) requires911 = u.requires911();
        if (u.emergencyType() != null) emergencyType = u.emergencyType();
        if (u.selfEmergency() != null) selfEmergency = u.selfEmergency();
        if (u.description() != null) description = u.description();
    }

    public EmergencyDetails toDetails() {
        return new EmergencyDetails(id, latitude, longitude, requires911, emergencyType,
                selfEmergency, description, requestedAt.toString());
    }

    public long getId() {
        return id;
    }
    public long getOwnerUserId() {
        return ownerUserId;
    }

    public Double getLatitude(){ return latitude;}

    public Double getLongitude() { return longitude;}

    public Boolean getRequires911() { return requires911; }

    public String getEmergencyType() { return emergencyType; }

    public String getSelfEmergency() { return selfEmergency; }

    public String getDescription() { return description; }

    public Instant getRequestedAt() { return requestedAt; }


    public long getUserId() {
        return ownerUserId;
    }
}
