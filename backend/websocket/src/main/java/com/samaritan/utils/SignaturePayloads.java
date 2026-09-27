package com.samaritan.utils;

import java.math.BigDecimal;
import java.util.Locale;

public final class SignaturePayloads {

    private SignaturePayloads() {
    }

    public static String createEmergency(long userId, double latitude, double longitude) {
        return "{\"user_id\":" + userId
                + ",\"latitude\":" + jsonNumber(latitude)
                + ",\"longitude\":" + jsonNumber(longitude) + "}";
    }

    public static String emergencyAction(long userId, long emergencyId) {
        return "{\"user_id\":" + userId + ",\"emergency_id\":" + emergencyId + "}";
    }

    public static String userPushToken(long userId, String pushToken) {
        return "{\"user_id\":" + userId + ",\"push_token\":" + jsonString(pushToken) + "}";
    }

    public static String updateEmergency(long userId, long emergencyId,
                                         Double latitude, Double longitude, Boolean requires911,
                                         String emergencyNature, String selfEmergency, String description) {
        StringBuilder payload = new StringBuilder()
                .append("{\"user_id\":").append(userId)
                .append(",\"emergency_id\":").append(emergencyId);
        appendOptionalNumber(payload, "latitude", latitude);
        appendOptionalNumber(payload, "longitude", longitude);
        appendOptionalBoolean(payload, "requires_911", requires911);
        appendOptionalString(payload, "emergency_nature", emergencyNature);
        appendOptionalString(payload, "self_emergency", selfEmergency);
        appendOptionalString(payload, "description", description);
        return payload.append('}').toString();
    }

    private static void appendOptionalNumber(StringBuilder payload, String name, Double value) {
        if (value != null) payload.append(',').append(jsonString(name)).append(':').append(jsonNumber(value));
    }

    private static void appendOptionalBoolean(StringBuilder payload, String name, Boolean value) {
        if (value != null) payload.append(',').append(jsonString(name)).append(':').append(value);
    }

    private static void appendOptionalString(StringBuilder payload, String name, String value) {
        if (value != null) payload.append(',').append(jsonString(name)).append(':').append(jsonString(value));
    }

    public static String websocketUpdate(long userId, Double latitude, Double longitude,
                         Boolean requires911, String emergencyNature,
                                         String selfEmergency, String description) {
        return "{\"user_id\":" + userId
                + ",\"latitude\":" + jsonNumber(latitude)
                + ",\"longitude\":" + jsonNumber(longitude)
            + ",\"requires_911\":" + requires911
                + ",\"emergency_nature\":" + jsonString(emergencyNature)
                + ",\"self_emergency\":" + jsonString(selfEmergency)
                + ",\"description\":" + jsonString(description) + "}";
    }

    private static String jsonNumber(double value) {
        if (!Double.isFinite(value)) {
            throw new IllegalArgumentException("Signed JSON numbers must be finite");
        }
        if (value == 0) return "0";

        BigDecimal number = BigDecimal.valueOf(value).stripTrailingZeros();
        BigDecimal magnitude = number.abs();
        if (magnitude.compareTo(BigDecimal.valueOf(0.000001)) >= 0
                && magnitude.compareTo(BigDecimal.ONE.scaleByPowerOfTen(21)) < 0) {
            return number.toPlainString();
        }
        return number.toString().replace('E', 'e').toLowerCase(Locale.ROOT);
    }

    private static String jsonNumber(Double value) {
        return value == null ? "null" : jsonNumber(value.doubleValue());
    }

    private static String jsonString(String value) {
        if (value == null) return "null";
        StringBuilder escaped = new StringBuilder(value.length() + 2).append('"');
        for (int index = 0; index < value.length(); index++) {
            char character = value.charAt(index);
            switch (character) {
                case '"' -> escaped.append("\\\"");
                case '\\' -> escaped.append("\\\\");
                case '\b' -> escaped.append("\\b");
                case '\f' -> escaped.append("\\f");
                case '\n' -> escaped.append("\\n");
                case '\r' -> escaped.append("\\r");
                case '\t' -> escaped.append("\\t");
                default -> {
                    if (character < 0x20) {
                        escaped.append(String.format(Locale.ROOT, "\\u%04x", (int) character));
                    } else {
                        escaped.append(character);
                    }
                }
            }
        }
        return escaped.append('"').toString();
    }
}