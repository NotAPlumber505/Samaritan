import { signData } from '@/utils/ecdsa';
import { getItem, getSecureItem } from '@/utils/store';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { EmergencyDetails } from '../constants/apiObjects';
import { setActiveEmergencyId } from '../utils/activeEmergency';
import { acceptEmergency, reportLocation } from '../utils/api';

export default function AlertDetailsScreen() {
  const { emergency: emergencyParam } = useLocalSearchParams<{ emergency: string }>();
  const emergency: EmergencyDetails | null = emergencyParam ? JSON.parse(emergencyParam) : null;

  const acceptThisEmergency = async () => {
    if (!emergency) return;
    const emergencyId = Number(emergency.emergency_id);

    try {
      const storedUserId = await getItem('user_id');
      if (!storedUserId) throw new Error('User information is unavailable.');
      const unsignedPayload = {
        user_id: Number(storedUserId),
        emergency_id: emergencyId,
      };
      const signature = signData(
        getSecureItem('ecdsaPrivateKey') ?? '',
        JSON.stringify(unsignedPayload),
      );
      if (!signature) throw new Error('Could not sign the acceptance request.');
      console.log('[acceptThisEmergency] Step 1: Calling POST /emergency/{id}/accept...');
      await acceptEmergency({
        ...unsignedPayload,
        ecdsa_signature: String(signature),
      });
      console.log('[acceptThisEmergency] Step 2: Emergency accepted');

      await setActiveEmergencyId(emergencyId);

      console.log('[acceptThisEmergency] Step 3: Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getLastKnownPositionAsync({});
        if (location) {
          try {
            console.log('[acceptThisEmergency] Step 4: Reporting responder location...');
            await reportLocation(emergencyId, 'responder', {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          } catch (reportError) {
            // Non-fatal: the emergency was already accepted, so proceed even if the location report fails
            console.log('[acceptThisEmergency] Location report failed ->', reportError);
          }
        }
      }

      Alert.alert('Emergency accepted', 'You have accepted this emergency for testing purposes.');
      router.back();
    } catch (error) {
      console.log('[acceptThisEmergency] Request failed ->', error);
      Alert.alert('Could not accept', 'Please check your connection and try again.');
    }
  };

  const declineEmergency = () => {
    router.back();
  };

  if (!emergency) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Emergency not found.</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to alerts</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Details</Text>

      <View style={styles.details}>
        <Detail label="Emergency type" value={String(emergency.emergency_type ?? 'Unknown')} />
        <Detail label="Location" value={`${emergency.latitude ?? '?'}, ${emergency.longitude ?? '?'}`} />
        <Detail label="Requires 911" value={emergency.requires_911 ? 'Yes' : 'No'} />
        <Detail
          label="Time requested"
          value={emergency.requested_at ? new Date(String(emergency.requested_at)).toLocaleString() : 'Unknown'}
        />
        <Detail label="Description" value={String(emergency.description ?? 'No description provided')} />
      </View>

      <View style={styles.actions}>
        <Pressable onPress={acceptThisEmergency} style={styles.acceptButton}>
          <Text style={styles.buttonText}>Accept</Text>
        </Pressable>
        <Pressable onPress={declineEmergency} style={styles.declineButton}>
          <Text style={styles.buttonText}>Decline</Text>
        </Pressable>
      </View>
    </View>
  );
}

type DetailProps = {
  label: string;
  value: string;
};

function Detail({ label, value }: DetailProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    color: '#FF383C',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  details: {
    gap: 20,
  },
  detailRow: {
    gap: 6,
  },
  detailLabel: {
    color: '#667085',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailValue: {
    color: '#1f2933',
    fontSize: 18,
    lineHeight: 26,
  },
  actions: {
    gap: 12,
    marginTop: 'auto',
    paddingBottom: 20,
  },
  acceptButton: {
    alignItems: 'center',
    backgroundColor: '#327EFF',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
    marginBottom: 20,
  },
  declineButton: {
    alignItems: 'center',
    backgroundColor: '#FF383C',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
    marginBottom: 100,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notFound: {
    color: '#1f2933',
    fontSize: 18,
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#327EFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});