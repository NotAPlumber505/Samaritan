import { signData } from '@/utils/ecdsa';
import { getItem, getSecureItem } from '@/utils/store';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { DeleteEmergency } from '../constants/apiObjects';
import { clearActiveEmergencyId } from '../utils/activeEmergency';
import { deleteEmergency } from '../utils/api';
import CancelButton from './components/CancelButton';

export default function EmergencyStatusScreen() {
  const { emergencyId } = useLocalSearchParams<{ emergencyId: string }>();

  const cancelEmergency = async () => {
    try {
      const storedUserId = await getItem('user_id');
      if (!storedUserId) throw new Error('User information is unavailable.');
      const unsignedPayload = {
        user_id: Number(storedUserId),
        emergency_id: Number(emergencyId),
      };
      const signature = signData(
        getSecureItem('ecdsaPrivateKey') ?? '',
        JSON.stringify(unsignedPayload),
      );
      if (!signature) throw new Error('Could not sign the cancellation request.');
      const payload: DeleteEmergency = { ...unsignedPayload, ecdsa_signature: String(signature) };
      console.log('[cancelEmergency] Calling DELETE /emergency/', emergencyId);
      await deleteEmergency(Number(emergencyId), payload);
      console.log('[cancelEmergency] Emergency deleted successfully');
    } catch (error) {
      console.log('[cancelEmergency] Request failed ->', error);
    } finally {
      await clearActiveEmergencyId();
      router.replace('/');
    }
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
    paddingTop: 70
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