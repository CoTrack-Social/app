import React, { useState } from 'react';
import { View, Picker, StyleSheet } from 'react-native';
import { provinces, regions } from '../utils/data';

export default function ProvincePicker({ label, onChange, value, country }) {
  const [internalValue, setInternalValue] = useState(value ? value.id : 0);

  if(!country) country = 'it';

  const handleChange = val => {
    const prov = regions[country].provinces.find(e => e.id === parseInt(val));
    setInternalValue(val);
    onChange(prov);
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
        {regions[country].provinces.map((e, i) => (
          <Picker.Item key={i + 1} label={e.name} value={e.id} />
        ))}
      </Picker>
    </View>
  );
}

// <SearchableDropdown
// onTextChange={text => console.log(text)}
// //On text change listner on the searchable input
// // onItemSelect={item => alert(JSON.stringify(item))}
// onItemSelect={handleChange('province')}
// //onItemSelect called after the selection from the dropdown
// containerStyle={{ marginTop: 20, padding: 0 }}
// //suggestion container style
// textInputStyle={{
//   //inserted text style
//   padding: 10,
//   borderWidth: 1,
// }}
// itemStyle={{
//   //single dropdown item style
//   padding: 10,
//   marginTop: 2,
//   backgroundColor: '#FAF9F8',
//   borderColor: '#bbb',
//   borderWidth: 1,
// }}
// itemTextStyle={{
//   //single dropdown item's text style
//   color: '#222',
// }}
// itemsContainerStyle={
//   {
//     //items container style you can pass maxHeight
//     //to restrict the items dropdown hieght
//     // maxHeight: '300px',
//   }
// }
// items={provinces}
// //mapping of item array
// defaultIndex={selectedProvince}
// //default selected item index
// placeholder="Provincia"
// //place holder for the search input
// resetValue={false}
// //reset textInput Value with true and false state
// underlineColorAndroid="transparent"
// //To remove the underline from the android input
// />

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
