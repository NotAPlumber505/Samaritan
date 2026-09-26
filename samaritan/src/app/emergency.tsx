import { StyleSheet, Text, View } from "react-native";

export default function EmergencyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Emergency screen.</Text>

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
});
