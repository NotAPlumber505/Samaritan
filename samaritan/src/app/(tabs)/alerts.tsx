import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmergencyDetails } from '../../constants/apiObjects';
import { getEmergencies } from '../../utils/api';

export default function AlertScreen() {
  const [emergencies, setEmergencies] = useState<EmergencyDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadEmergencies = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    console.log('[alerts] Step 1: Requesting location permission...');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMessage('Location access is required to show nearby emergencies.');
      setIsLoading(false);
      return;
    }

    const location = await Location.getLastKnownPositionAsync({});
    if (!location) {
      setErrorMessage('Unable to find your last known location.');
      setIsLoading(false);
      return;
    }
    console.log('[alerts] Step 2: Location found ->', location.coords);

    try {
      console.log('[alerts] Step 3: Calling GET /emergency...');
      const response = await getEmergencies({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log('[alerts] Step 4: Received emergencies ->', response.emergencies);
      setEmergencies(response.emergencies);
    } catch (error) {
      console.log('[alerts] Request failed ->', error);
      setErrorMessage('Could not load nearby emergencies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    void loadEmergencies();
  }, [loadEmergencies]));

  const openDetails = (emergency: EmergencyDetails) => {
    router.push({ pathname: '../alert-details', params: { emergency: JSON.stringify(emergency) } });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadEmergencies} />}
      >
        {errorMessage ? <Text style={styles.message}>{errorMessage}</Text> : null}
        {!errorMessage && !isLoading && emergencies.length === 0 ? (
          <Text style={styles.message}>No nearby emergencies right now.</Text>
        ) : null}
        {emergencies.map((emergency) => (
          <Pressable
            key={String(emergency.emergency_id)}
            accessibilityLabel={`View ${emergency.emergency_type ?? 'emergency'}`}
            accessibilityRole="button"
            onPress={() => openDetails(emergency)}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            <Text style={styles.type}>{emergency.emergency_type ?? 'Emergency'}</Text>
            <Text style={styles.location}>
              {emergency.latitude?.toFixed(4)}, {emergency.longitude?.toFixed(4)}
            </Text>
            {emergency.requested_at ? (
              <Text style={styles.time}>Requested {new Date(String(emergency.requested_at)).toLocaleString()}</Text>
            ) : null}
            {emergency.description ? <Text style={styles.time}>{emergency.description}</Text> : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  list: {
    gap: 12,
    padding: 20,
  },
  message: {
    color: '#667085',
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 40,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderColor: '#d9d9d9',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  cardPressed: {
    backgroundColor: '#eef4ff',
  },
  type: {
    color: '#327EFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  location: {
    color: '#1f2933',
    fontSize: 16,
    lineHeight: 22,
  },
  time: {
    color: '#667085',
    fontSize: 14,
    marginTop: 8,
  },
});