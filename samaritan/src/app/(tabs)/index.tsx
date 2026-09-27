import { useRouter } from 'expo-router';
import Storage from 'expo-sqlite/kv-store';
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/EmergencyButton';
import FirstBootModal from '../components/FirstBootModal';

export default function Index() {
  const router = useRouter();
  const [firstBoot, setFirstBoot] = useState(false)


  useEffect(() => {
    (async () => {
      const isFirstBoot = await Storage.getItem("firstBootComplete")
      if(!isFirstBoot) {
        setFirstBoot(true)
      }
    })()
  },[])


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Connect people who can help with people who need help.</Text>
      <View>
        {firstBoot && (
        <FirstBootModal/>
      )} 
        <Button 
        label="Request Emergency Help"
        onPress={() => router.push('/emergency')}
        />
      </View>
      <Text style={[styles.text, { fontWeight: 'bold' }]}> Nearby Samaritans: 12 </Text>
      <Text style={styles.hintText}>
        Want to help others nearby? You can opt in to be a Samaritan from the Profile tab.
      </Text>
      <Text style={styles.disclaimerText}> For life-threatening emergencies, call 911 immediately. Samaritan connects you with nearby registered responders and does not replace emergency services. </Text>
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
  hintText: {
    color: '#000000',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 40,
    fontWeight: 'bold',
  },
  disclaimerText: {
    color: '#FF383C',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
});

