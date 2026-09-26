package com.samaritan.utils.repositories;

import com.samaritan.constants.api.CreateEmergency;

public class EmergencyTable {
    //TODO: Actually connect this to Tiger Data database. For now, it's a mock.
    public static int emergencyId = 0;

    public static int insertEmergency(CreateEmergency emergencyJson) {
        int currentId = emergencyId;
        emergencyId ++;
        return currentId;
    }
}
