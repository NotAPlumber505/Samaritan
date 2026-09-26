package com.samaritan.websocket.model;


// how far location B is from location A
public class DistanceResult {

    private final String fromId;
    private final String fromLabel;
    private final String toId;
    private final String toLabel;
    private final double distanceKm;
    private final double distanceMiles;


    public DistanceResult(String fromId, String fromLabel, String toId,
                          String toLabel, double distanceKm, double distanceMiles){
        this.fromId = fromId;
        this.fromLabel = fromLabel;
        this.toId = toId;
        this.toLabel = toLabel;
        this.distanceKm = distanceKm;
        this.distanceMiles = distanceMiles;

    }

    public String getFromId() {
        return fromId;
    }

    public String getFromLabel() {
        return fromLabel;
    }

    public String getToId() {
        return toId;
    }

    public String getToLabel() {
        return toLabel;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public double getDistanceMiles() {
        return distanceMiles;
    }



}
