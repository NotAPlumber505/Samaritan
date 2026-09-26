import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import CancelButton from './components/CancelButton';

export default function EmergencyStatusScreen() {
  const { emergencyId } = useLocalSearchParams<{ emergencyId: string }>();

  const cancelEmergency = () => {
    // TODO: call DELETE /emergency/{id} once cancellation is wired to the backend
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help is on the way</Text>
      <Text style={styles.message}>
        Your emergency request (ID: {emergencyId}) has been submitted. A responder will be by shortly.
      </Text>
      <View style={styles.actions}>
        <CancelButton onConfirm={cancelEmergency} />
      </View>
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
  },
  title: {
    color: '#327EFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    color: '#1f2933',
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 'auto' as any,
  },
  actions: {
    alignSelf: 'stretch',
    marginTop: 40,
  },
});