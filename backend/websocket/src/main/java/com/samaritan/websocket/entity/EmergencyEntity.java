package com.samaritan.websocket.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "emergencies")
public class EmergencyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emergency_id")
    private long emergencyId;

    @Column(name = "user_id", nullable = false, columnDefinition = "BIGINT")
    private long user_id;

    @Column(name = "latitude", nullable = false, columnDefinition = "DOUBLE PRECISION")
    private double latitude;

    @Column(name = "longitude", nullable = false, columnDefinition = "DOUBLE PRECISION")
    private double longitude;

    @Column(name = "requires_911")
    private Boolean requires911;

    @Column(name = "emergency_nature")
    private String emergency_nature;

    @Column(name = "self_emergency")
    private String self_emergency;

    @Column(name = "description")
    private String description;



    public EmergencyEntity() {}

    public EmergencyEntity(long userId, double latitude, double longitude, Boolean requires911, String emergency_nature, String self_emergency, String description) {
        this.user_id=userId;
        this.latitude=latitude;
        this.longitude=longitude;
        this.requires911=requires911;
        this.emergency_nature=emergency_nature;
        this.self_emergency=self_emergency;
        this.description=description;
    }

    public long getEmergencyId() {
        return emergencyId;
    }

    public void setEmergencyId(long emergencyId) {
        this.emergencyId = emergencyId;
    }

    public long getUser_id() {
        return user_id;
    }

    public void setUser_id(long user_id) {
        this.user_id = user_id;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public Boolean getRequires911() {
        return requires911;
    }

    public void setRequires911(Boolean requires911) {
        this.requires911 = requires911;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmergency_nature() {
        return emergency_nature;
    }

    public void setEmergency_nature(String emergency_nature) {
        this.emergency_nature = emergency_nature;
    }

    public String getSelf_emergency() {
        return self_emergency;
    }

    public void setSelf_emergency(String self_emergency) {
        this.self_emergency = self_emergency;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}

