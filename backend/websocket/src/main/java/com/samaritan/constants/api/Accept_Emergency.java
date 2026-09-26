package com.samaritan.constants.api;

public record Accept_Emergency(
      int user_id, //The samaritan who is responding to the emergency
      int emergency_id,
      String ecdsa_signature
) {
}
