import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Dropdown from "../app/components/Dropdown";
import CancelButton from './components/CancelButton';
import SubmitButton from './components/SubmitButton';

export default function EmergencyScreen() {
  const [emergencyType, setEmergencyType] = useState("");
  const [text, setText] = useState('');

  const cancelEmergency = () => {
    router.replace('/');
  };

  const submitEmergency = () => {
    Alert.alert('Emergency submitted', 'Your emergency request has been submitted.');
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
        {emergencyType !== '' && <SubmitButton onPress={submitEmergency} />}
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