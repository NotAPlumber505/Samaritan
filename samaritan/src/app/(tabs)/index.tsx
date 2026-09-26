import { generateECDSAKeyPair, signData } from '@/utils/ecdsa';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";
import Button from '../components/EmergencyButton';


export default function Index() {
  const router = useRouter();
  const backendIp = "127.0.0.1"
  const fetchPostRest = async (publicKey:string ,dataSigned:string, data: string ) => {
    console.log("Sending fetch POST")
    const response = await fetch(`http://${backendIp}/verify`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              'Content-Type': "application/json",
            },
            body: JSON.stringify({
              publicKey: publicKey,
              signedData: dataSigned,
              rawData: data
            })
          })
    console.log("Response has arrived! : " + response)
  }


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Connect people who can help with people who need help.</Text>

      <Button 
        label="Request Emergency Help"
        onPress={() => {
          const keys = generateECDSAKeyPair()
          if(keys == undefined) {
            console.log("Error generating key!")
            return
          }
          if(!(keys[0] && keys[1])){ 
            console.log("One of the keys are undefined!")
            return
          }
          else {
            console.log("Public key: " + keys[1])
          }
          console.log("Signing data: DOG")
          const data = "DOG"
          const dataSigned = signData(keys[0].toString(),data)

          if(!dataSigned) {
            console.log("failed to sign data")
            return
          }
          fetchPostRest(keys[1].toString(), dataSigned.toString(), data)

        }}
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
