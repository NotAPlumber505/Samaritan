package com.samaritan.websocket.model;

import org.antlr.v4.runtime.misc.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LocationReport {

    @NotNull
    @JsonProperty("Latitude")
    private Double latitude;


    @NotNull
    @JsonProperty("Longitude")
    private Double longitude;




    //Emergency_ID: Number
    //    Latitude?: String
    //    Longitude?: String
    //    Requires_911?: boolean
    //    Emergency_Type?: String
    //    Self_Emergency?: String
    //    Description?: String

    private Boolean requires_911;
    private String emergencyType;
    private String selfEmergency;
    private String description;
    @JsonProperty("Label")
    private String label;

    public LocationReport(){

    }


    public Double getLatitude(){
        return latitude;
    }

    public void setLatitude(Double latitude){
        this.latitude = latitude;
    }

    public Double getLongitude(){
        return longitude;
    }

    public void setLongitude(Double longitude){
        this.longitude = longitude;
    }

    public Boolean getRequires_911(){
        return requires_911;
    }

    public void setRequires_911(Boolean requires_911){
        this.requires_911 = requires_911;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description){
        this.description = description;
    }

    public String getEmergencyType(){
        return emergencyType;
    }

    public void setEmergencyType(String emergencyType){
        this.emergencyType = emergencyType;
    }


    public String getSelfEmergency() {
        return selfEmergency;
    }

    public void setSelfEmergency(String selfEmergency) {
        this.selfEmergency = selfEmergency;
    }


    public String getLabel() {
        return label;
    }

    public void setLabel(String label){
        this.label = label;
    }
}
