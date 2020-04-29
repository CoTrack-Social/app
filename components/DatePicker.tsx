import React, { useState } from 'react';
import { Text, View, Picker, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import i18n from 'i18n-js';

export default function DatePicker({ label, onChange, value }) {
  // const dobRef = useRef<any | undefined>();

  let defaultValue = { dobDay: 0, dobMonth: 0, dobYear: 0 };

  if (value) {
    const v = value.split('/');
    defaultValue = {
      dobDay: parseInt(v[0]),
      dobMonth: parseInt(v[1]),
      dobYear: parseInt(v[2]),
    };
  }

  // const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalDay, setInternalDay] = useState(defaultValue.dobDay);
  const [internalMonth, setInternalMonth] = useState(defaultValue.dobMonth);
  const [internalYear, setInternalYear] = useState(defaultValue.dobYear);

  const handleChange = (key) => (val) => {
    // internalValue[key] = val;
    // setInternalValue(internalValue);

    switch (key) {
      case 'dobDay':
        setInternalDay(val);
        onChange(`${val}/${internalMonth}/${internalYear}`);
        break;
      case 'dobMonth':
        setInternalMonth(val);
        onChange(`${internalDay}/${val}/${internalYear}`);
        break;
      case 'dobYear':
        setInternalYear(val);
        onChange(`${internalDay}/${internalMonth}/${val}`);
        break;
    }
  };

  const arrDays = Array.from(Array(31).keys()).map((e, i) => (
    <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
  ));

  const arrMonths = [
    i18n.t('January'),
    i18n.t('February'),
    i18n.t('March'),
    i18n.t('April'),
    i18n.t('May'),
    i18n.t('June'),
    i18n.t('July'),
    i18n.t('August'),
    i18n.t('September'),
    i18n.t('October'),
    i18n.t('November'),
    i18n.t('December'),
  ].map((e, i) => <Picker.Item key={i + 1} label={e} value={i + 1} />);

  const arrYears = Array.from(Array(100).keys()).map((i) => (
    <Picker.Item key={i + 1} label={`${2020 - i}`} value={2020 - i} />
  ));

  // console.log('arrDays', arrDays);

  return (
    <>
      <Text
        style={{ textTransform: 'uppercase', paddingEnd: 10, marginTop: 15 }}
      >
        {label}
      </Text>

      <View style={styles.buttonContainer}>
        {/* {Platform.OS === 'web' ? (
            <TextInput
              placeholder="Fecha de Nacimiento (DD/MM/YYYY)"
              value={state.dob}
              onChangeText={handleChange('dob')}
              style={styles.input}
            />
          ) : (
            <TextInputMask
              placeholder="Fecha de Nacimiento (DD/MM/YYYY)"
              type="datetime"
              options={{
                format: 'DD/MM/YYYY',
              }}
              value={state.dob}
              onChangeText={handleChange('dob')}
              style={styles.input}
              ref={dobRef}
            />
          )} */}
        <Picker
          // id="day"
          selectedValue={internalDay}
          onValueChange={handleChange('dobDay')}
          style={{ width: '30%' }}
          mode="dropdown"
        >
          <Picker.Item label={i18n.t('Day')} value="0" />
          {arrDays}
        </Picker>
        <Picker
          // id="month"
          selectedValue={internalMonth}
          onValueChange={handleChange('dobMonth')}
          style={{ width: '30%' }}
          mode="dropdown"
        >
          <Picker.Item label={i18n.t('Month')} value="0" />
          {arrMonths}
        </Picker>
        <Picker
          // id="year"
          selectedValue={internalYear}
          onValueChange={handleChange('dobYear')}
          style={{ width: '30%' }}
          mode="dropdown"
        >
          <Picker.Item label={i18n.t('Year')} value="0" />
          {arrYears}
        </Picker>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },

  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primaryColor,
  },
});
