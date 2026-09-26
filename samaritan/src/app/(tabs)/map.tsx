import { StyleSheet, View } from 'react-native';
import GoogleMapsButton from '../components/GoogleMapsButton';

export default function MapScreen() {

  return (
    <View style={styles.container}>
      <GoogleMapsButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#327EFF',
    marginBottom: 20,
  },
});