import { Alert, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  onConfirm: () => void;
};

export default function CancelButton({ onConfirm }: Props) {
  const confirmCancellation = () => {
    Alert.alert(
      'Cancel emergency?',
      'Are you sure you want to cancel this emergency request?',
      [
        { text: 'Keep emergency', style: 'cancel' },
        { text: 'Cancel emergency', style: 'destructive', onPress: onConfirm },
      ],
    );
  };

  return (
    <Pressable
      accessibilityLabel="Cancel emergency"
      accessibilityRole="button"
      onPress={confirmCancellation}
      style={styles.button}
    >
      <Text style={styles.buttonLabel}>Cancel emergency</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#FF383C',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 24,
    marginBottom: 60,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
