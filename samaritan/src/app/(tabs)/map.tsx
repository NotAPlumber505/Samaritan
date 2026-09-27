import * as Linking from 'expo-linking';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { getActiveEmergencyId } from '../../utils/activeEmergency';
import { getDistanceToResponder } from '../../utils/api';
import GoogleMapsButton from '../components/GoogleMapsButton';

export default function MapScreen() {
  const [activeEmergencyId, setActiveEmergencyId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  const [responderCoords, setResponderCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadTrackingInfo = useCallback(async () => {
    setIsLoading(true);
    setStatusMessage(null);

    console.log('[map] Step 1: Checking for an active emergency...');
    const emergencyId = await getActiveEmergencyId();
    setActiveEmergencyId(emergencyId);

    if (!emergencyId) {
      console.log('[map] No active emergency, showing default map.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('[map] Step 2: Calling GET /location/{id}/distance...');
      const response = await getDistanceToResponder(emergencyId);
      console.log('[map] Step 3: Distance to responder ->', response);
      setDistanceMiles(Number(response.distance_miles));
      setResponderCoords({
        latitude: Number(response.responder_latitude),
        longitude: Number(response.responder_longitude),
      });
    } catch (error) {
      console.log('[map] Request failed ->', error);
      setStatusMessage('Waiting for a responder to accept and report their location...');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTrackingInfo();
    }, [loadTrackingInfo]),
  );

  const openDirectionsToResponder = () => {
    if (!responderCoords) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${responderCoords.latitude},${responderCoords.longitude}`;
    Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#327EFF" />
      </View>
    );
  }

  if (!activeEmergencyId) {
    return (
      <View style={styles.container}>
        <GoogleMapsButton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tracking your responder</Text>
      {statusMessage ? (
        <Text style={styles.message}>{statusMessage}</Text>
      ) : (
        <Text style={styles.message}>
          Your responder is about {distanceMiles?.toFixed(1)} miles away.
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Refresh responder distance"
        onPress={loadTrackingInfo}
        style={styles.refreshButton}
      >
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </Pressable>
      {responderCoords ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open directions to responder"
          onPress={openDirectionsToResponder}
          style={styles.directionsButton}
        >
          <Text style={styles.directionsButtonText}>Open directions to responder</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    color: '#327EFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    color: '#1f2933',
    fontSize: 16,
    textAlign: 'center',
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: '#667085',
    borderRadius: 20,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 20,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  directionsButton: {
    width: 300,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#327EFF',
  },
  directionsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});