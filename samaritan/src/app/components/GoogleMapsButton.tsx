import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

export default function GoogleMapsButton() {
  const openGoogleMaps = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'Please allow location access to use Google Maps.',
      );
      return;
    }

    const location = await Location.getLastKnownPositionAsync({});

    if (!location) {
      Alert.alert(
        'Location unavailable',
        'Unable to find your last known location. Please try again.',
      );
      return;
    }

    const { latitude, longitude } = location.coords;
    const googleMapsUrl =
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    await Linking.openURL(googleMapsUrl);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open Google Maps"
      onPress={openGoogleMaps}
      style={styles.button}
    >
      <Text style={styles.buttonLabel}>Open Google Maps</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 300,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#327EFF',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});