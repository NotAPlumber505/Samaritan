import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
        Latitude: location.coords.latitude,
        Longitude: location.coords.longitude,
      });
      console.log('[alerts] Step 4: Received emergencies ->', response.Emergencies);
      setEmergencies(response.Emergencies);
    } catch (error) {
      console.log('[alerts] Request failed ->', error);
      setErrorMessage('Could not load nearby emergencies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmergencies();
  }, [loadEmergencies]);

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
            key={String(emergency.Emergency_ID)}
            accessibilityLabel={`View ${emergency.Emergency_Type ?? 'emergency'}`}
            accessibilityRole="button"
            onPress={() => openDetails(emergency)}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            <Text style={styles.type}>{emergency.Emergency_Type ?? 'Emergency'}</Text>
            <Text style={styles.location}>
              {emergency.Latitude?.toFixed(4)}, {emergency.Longitude?.toFixed(4)}
            </Text>
            {emergency.Requested_At ? (
              <Text style={styles.time}>Requested {new Date(String(emergency.Requested_At)).toLocaleString()}</Text>
            ) : null}
            {emergency.Description ? <Text style={styles.time}>{emergency.Description}</Text> : null}
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