package com.samaritan.websocket.model;

public class StoredLocation {
    private final String id;
    private final Double latitude;
    private final Double longitude;
    private final Boolean requires_911;
    private final String emergencyType;
    private final String self_Emergency;
    private final String description;


    //Emergency_ID: Number
    //    Latitude?: String
    //    Longitude?: String
    //    Requires_911?: boolean
    //    Emergency_Type?: String
    //    Self_Emergency?: String
    //    Description?: String


    public StoredLocation(String id, LocationReport report){
        this.id = id;

        this.latitude = report.getLatitude();
        this.longitude = report.getLongitude();
        this.requires_911 = report.get911();
        this.description = report.getDescription();
        this.emergencyType = report.getEmergencyType();
        this.self_Emergency = report.getSelfEmergency();





    }



}
