import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
};

export default function Button({ label, onPress }: Props) {

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 300,
    height: 300,
    borderRadius: 500,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    backgroundColor: '#FF383C',
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
