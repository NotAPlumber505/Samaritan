import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";
import Button from '../components/EmergencyButton';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Connect people who can help with people who need help.</Text>

      <Button 
        label="Request Emergency Help"
        onPress={() => router.push('/emergency')}
        />

      <Text style={[styles.text, { fontWeight: 'bold' }]}> Nearby Samaritans: 12 </Text>
      <Text style={styles.disclaimerText}> 
        For life-threatening emergencies, call 911 immediately. 
        Samaritan connects you with nearby registered responders and does not replace emergency services. 
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    color: '#327EFF',
    paddingVertical: 40,
    paddingHorizontal: 40,
    fontSize: 20,
    textAlign: 'center',
  },
  disclaimerText: {
    color: '#FF383C',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
});
