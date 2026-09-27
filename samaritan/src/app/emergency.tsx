import { signData } from '@/utils/ecdsa';
import { getItem, getSecureItem } from '@/utils/store';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Dropdown from "../app/components/Dropdown";
import { CreateEmergency } from '../constants/apiObjects';
import { setActiveEmergencyId } from '../utils/activeEmergency';
import { createEmergency, reportLocation } from '../utils/api';
import CancelButton from './components/CancelButton';
import SubmitButton from './components/SubmitButton';

export default function EmergencyScreen() {
  const [emergencyType, setEmergencyType] = useState("");
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const cancelEmergency = () => {
    router.replace('/');
  };

  const submitEmergency = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      console.log('[submitEmergency] Step 1: Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted.current) return;
      if (status !== 'granted') {
        Alert.alert('Location Permission Required', 'Please allow location access to submit an emergency.');
        setIsSubmitting(false);
        return;
      }

      const location = await Location.getLastKnownPositionAsync({});
      if (!isMounted.current) return;
      if (!location) {
        Alert.alert('Location unavailable', 'Unable to find your last known location. Please try again.');
        setIsSubmitting(false);
        return;
      }
      console.log('[submitEmergency] Step 2: Location found ->', location.coords);

      const storedUserId = await getItem('user_id');
      if (!isMounted.current) return;
      if (!storedUserId) {
        Alert.alert('User information unavailable', 'Complete app setup before submitting an emergency.');
        setIsSubmitting(false);
        return;
      }
      const unsignedPayload = {
        user_id: Number(storedUserId),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      const signature = signData(
        getSecureItem('ecdsaPrivateKey') ?? '',
        JSON.stringify(unsignedPayload),
      );
      if (!signature) {
        Alert.alert('Signing failed', 'Could not verify your emergency request. Please try again.');
        setIsSubmitting(false);
        return;
      }
      const payload: CreateEmergency = { ...unsignedPayload, ecdsa_signature: String(signature) };

      console.log('[submitEmergency] Step 3: Calling POST /emergency...');
      const response = await createEmergency(payload);
      if (!isMounted.current) return;
      console.log('[submitEmergency] Step 4: Emergency created with ID ->', response.emergency_id);

      await setActiveEmergencyId(Number(response.emergency_id));

      try {
        console.log('[submitEmergency] Step 5: Reporting requester location...');
        await reportLocation(Number(response.emergency_id), 'requester', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (reportError) {
        // Non-fatal: the emergency was already created, so proceed even if the location report fails
        console.log('[submitEmergency] Location report failed ->', reportError);
      }

      if (!isMounted.current) return;
      setIsSubmitting(false);
      router.push({
        pathname: '/new-alert-details',
        params: {
          emergencyId: String(response.emergency_id),
          emergencyType,
          description: text,
          latitude: String(location.coords.latitude),
          longitude: String(location.coords.longitude),
        },
      });
    } catch (error) {
      if (!isMounted.current) return;
      console.log('[submitEmergency] Request failed ->', error);
      Alert.alert('Submission failed', 'Could not submit your emergency. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Back to home"
        accessibilityRole="button"
        hitSlop={12}
        onPress={() => router.replace('/')}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={28} color="#327EFF" />
        <Text style={styles.backButtonText}>Home</Text>
      </Pressable>
      <Text style={styles.title}>What is your medical emergency?</Text>

      <Dropdown 
        selectedValue={emergencyType}
        onValueChange={setEmergencyType}
      />

      <Text style={styles.prompt}>{'\n'}Please describe your medical emergency (optional): {'\n'}</Text>

      <TextInput style={styles.inputBox} 
        placeholder="Type something here..."
        value={text}
        onChangeText={(newValue) => setText(newValue)}
        multiline
        numberOfLines={6}
      />

      <View style={styles.actions}>
        {emergencyType !== '' && <SubmitButton onPress={submitEmergency} disabled={isSubmitting} />}
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
    justifyContent: 'flex-start',
    paddingTop: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginLeft: 20,
    marginBottom: 24,
    minHeight: 52,
  },
  backButtonText: {
    color: '#327EFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    color: '#327EFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 24,
  },
  prompt: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5,
  },
  inputBox: {
    marginTop: 20,
    height: 50,
    width: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  actions: {
    alignSelf: 'stretch',
    gap: 12,
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
});