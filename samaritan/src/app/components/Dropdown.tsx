import { Picker } from '@react-native-picker/picker';
import { StyleSheet, View } from 'react-native';

type Props = {
  selectedValue: string;
  onValueChange: (value: string) => void;
};

export default function Dropdown({ selectedValue, onValueChange, }: Props) {

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {selectedValue === "" && (
          <Picker.Item label="Select an emergency type" value="" enabled={false} />
        )}
        <Picker.Item label="Medical" value="medical" />
        <Picker.Item label="Injury" value="injury" />
        <Picker.Item label="Other" value="other" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FF383C",
  },

  picker: {
    height: 100,
    width: 300,
    color: "#FFFFFF",
    fontWeight: 'bold',
  },
});
