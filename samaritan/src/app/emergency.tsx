import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Dropdown from "../app/components/Dropdown";
import { CreateEmergency, UpdateEmergency } from '../constants/apiObjects';
import { setActiveEmergencyId } from '../utils/activeEmergency';
import { createEmergency, reportLocation, updateEmergency } from '../utils/api';
import CancelButton from './components/CancelButton';
import SubmitButton from './components/SubmitButton';

export default function EmergencyScreen() {
  const [emergencyType, setEmergencyType] = useState("");
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancelEmergency = () => {
    router.replace('/');
  };

  const submitEmergency = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    console.log('[submitEmergency] Step 1: Requesting location permission...');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location Permission Required', 'Please allow location access to submit an emergency.');
      return;
    }

    const location = await Location.getLastKnownPositionAsync({});
    if (!location) {
      Alert.alert('Location unavailable', 'Unable to find your last known location. Please try again.');
      return;
    }
    console.log('[submitEmergency] Step 2: Location found ->', location.coords);

    // TODO: replace User_ID/ECDSA_r/ECDSA_s with the real signed-in user's ID and signature once auth exists
    const payload: CreateEmergency = {
      user_id: 1,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      ecdsa_signature: ""
    };

    try {
      console.log('[submitEmergency] Step 3: Calling POST /emergency...');
      const response = await createEmergency(payload);
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

      if (emergencyType !== '' || text !== '') {
        const updatePayload: UpdateEmergency = {
          user_id: '1', // TODO: replace with the real signed-in user's ID once auth exists
          emergency_id: response.emergency_id,
          emergency_nature: emergencyType || undefined,
          description: text || undefined,
          ecdsa_signature: ""
        };
        try {
          console.log('[submitEmergency] Step 6: Calling POST /emergency/update...');
          await updateEmergency(updatePayload);
          console.log('[submitEmergency] Step 7: Emergency details updated successfully');
        } catch (updateError) {
          // Non-fatal: the emergency was already created, so proceed even if the details update fails
          console.log('[submitEmergency] Update failed ->', updateError);
        }
      }

      router.replace({ pathname: '/emergency-status', params: { emergencyId: String(response.Emergency_ID) } });
    } catch (error) {
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