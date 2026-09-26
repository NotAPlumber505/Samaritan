package com.samaritan.websocket.model;

public class StoredLocation {
    private final String id;
    private final Double latitude;
    private final Double longitude;
    private final Boolean requires_911;
    private final String emergencyType;
    private final String self_Emergency;
    private final String description;
    private final String label;

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
        this.requires_911 = report.getRequires_911();
        this.description = report.getDescription();
        this.emergencyType = report.getEmergencyType();
        this.self_Emergency = report.getSelfEmergency();
        this.label = report.getLabel();

    }


    public String getId() { return id; }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude(){
        return longitude;
    }

    public Boolean getRequires_911(){
        return requires_911;
    }


    public String getEmergencyType(){
        return emergencyType;
    }

    public String getSelfEmergency(){
        return self_Emergency;
    }

    public String getDescription(){
        return description;
    }

    public String getLabel(){
        return label;
    }


}
