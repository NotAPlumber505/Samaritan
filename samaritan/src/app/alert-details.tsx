import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { emergencies } from '../app/data/emergencies';

export default function AlertDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const emergency = emergencies.find((item) => item.id === id);

  const showResponse = (response: 'accepted' | 'declined') => {
    Alert.alert(
      `Emergency ${response}`,
      `This emergency has been ${response} for testing purposes.`,
    );
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
        <Detail label="Emergency type" value={emergency.type} />
        <Detail label="Location" value={emergency.location} />
        <Detail label="Time requested" value={emergency.requestedAt} />
        <Detail label="Description" value={emergency.description} />
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => showResponse('accepted')} style={styles.acceptButton}>
          <Text style={styles.buttonText}>Accept</Text>
        </Pressable>
        <Pressable onPress={() => showResponse('declined')} style={styles.declineButton}>
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