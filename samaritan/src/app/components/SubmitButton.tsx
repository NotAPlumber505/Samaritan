import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  onPress: () => void;
};

export default function SubmitButton({ onPress }: Props) {
  return (
    <Pressable
      accessibilityLabel="Submit emergency"
      accessibilityRole="button"
      onPress={onPress}
      style={styles.button}
    >
      <Text style={styles.buttonLabel}>Submit emergency</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#327EFF',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 24,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});