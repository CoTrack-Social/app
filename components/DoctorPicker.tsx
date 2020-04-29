import React, { useState } from 'react';
import { View, Picker, StyleSheet } from 'react-native';
import { doctors, regions } from '../utils/data';

export default function DoctorPicker({ label, onChange, value, province }) {
  const [internalValue, setInternalValue] = useState(value ? value.id : 0);

  if(!province || !province.doctors) {
    return null;
  }

  const handleChange = val => {
    const dr = province.doctors.find(e => e.id === parseInt(val));
    setInternalValue(val);
    onChange(dr);
  };

  return (
    <View style={styles.buttonContainer}>
      <Picker
        selectedValue={internalValue}
        onValueChange={handleChange}
        style={styles.picker}
        mode="dialog"
      >
        <Picker.Item label={label} value="" />
        {province.doctors.map((e, i) => (
          <Picker.Item key={i + 1} label={e.name + ' | ' + e.type} value={e.id} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },
  picker: {
    width: '100%',
    height: 42,
    color: 'black',
    // backgroundColor: 'white',
    borderColor: 'black',
    // borderStyle: 'solid',
    borderWidth: 1,
  },
});
