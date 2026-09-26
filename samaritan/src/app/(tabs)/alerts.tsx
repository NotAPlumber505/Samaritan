import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { emergencies } from '../data/emergencies';

export default function AlertScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list}>
        {emergencies.map((emergency) => (
          <Pressable
            key={emergency.id}
            accessibilityLabel={`View ${emergency.type} emergency at ${emergency.location}`}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '../alert-details', params: { id: emergency.id } })}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            <Text style={styles.type}>{emergency.type} emergency</Text>
            <Text style={styles.location}>{emergency.location}</Text>
            <Text style={styles.time}>Requested {emergency.requestedAt}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  list: {
    gap: 12,
    padding: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderColor: '#d9d9d9',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  cardPressed: {
    backgroundColor: '#eef4ff',
  },
  type: {
    color: '#327EFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  location: {
    color: '#1f2933',
    fontSize: 16,
    lineHeight: 22,
  },
  time: {
    color: '#667085',
    fontSize: 14,
    marginTop: 8,
  },
});