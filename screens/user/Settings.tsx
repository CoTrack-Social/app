import React, { useReducer, useRef, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Picker,
} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons as Icon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MainStackNavProps } from '../../navigation/types';
import { savePreferences, getPreferences } from '../../utils/config';
import { syncUserInfoDataWithServer } from '../../utils/syncStorageHelper';
import { Input, Divider, Text, ListItem } from 'react-native-elements';
import { isEqual } from 'lodash';
import CountrySelectorScreen from './CountrySelectorScreen';

import i18n from 'i18n-js';

const optlist = [
  {
    name: 'gps_history',
    key: 'gps',
    subtitle: 'gps_history_subtitle',
  },
  {
    name: 'bt_tracking',
    key: 'bluetooth',
    subtitle: 'bt_tracking_subtitle',
  },
];

const GRAY_COLOR = 'rgba(147, 147, 147, 1)';

function reducer(state, newState) {
  return { ...state, ...newState };
}

function CountryPicker({ value, onValueChange }) {
  return (
    <Picker
      selectedValue={value}
      onValueChange={onValueChange}
      style={{
        marginLeft: 'auto',
      }}
      mode="dropdown"
    >
      <Picker.Item key="ar" label="Argentina" value="ar" />
      <Picker.Item key="it" label="Italia" value="it" />
    </Picker>
  );
}

const Settings = ({ navigation }: MainStackNavProps<'Settings'>) => {
  const [state, setState] = useReducer(reducer, { gps: true, bluetooth: true });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      const preferences = await getPreferences();
      if (preferences.userInfo) {
        state.gps = !(preferences.userInfo.gps === false);
        state.bluetooth = !(preferences.userInfo.bluetooth === false);
        state.country = preferences.userInfo.country;
        state.email = preferences.userInfo.email;
        state.name = preferences.userInfo.name;
        state.surname = preferences.userInfo.surname;
        state.dni = preferences.userInfo.dni;
        state.infoSent = true;
      }
      setState(state);
      setLoaded(true);
    }
    loadData();
  }, []);

  const handleChange = (key) => async (value) => {
    console.log('key value', key, value);
    let infoSent = true;
    if (value != state[key]) {
      setState({ [key]: value });
      infoSent = false;
      setState({ infoSent: infoSent });
    }
    if (key == 'country') {
      i18n.locale = value;
    }

    //    if(!infoSent) {
    const preferences = await getPreferences();
    console.log('preferences before', preferences.userInfo);
    preferences.userInfo[key] = value;
    preferences.userInfo.infoSent = false;
    await savePreferences(preferences);
    console.log('preferences after', preferences.userInfo);
    syncUserInfoDataWithServer();
    //   }
  };

  const handleDeferChange = async (e) => {
    const { name, value } = e.target;
    state.userInfo[name] = value;
    setState(state);
  };

  const handleSaveChanges = (e) => {
    state.userInfo[e.target.name] = e.target.value;

    // Si no hubo cambios en userInfo, nada que hacer.
    if (isEqual(state.preferences.userInfo, state.userInfo)) {
      return;
    } else {
      state.preferences.userInfo = { ...state.userInfo };
      state.preferences.infoSent = false;
      savePreferences(state.preferences).then(syncUserInfoDataWithServer());
    }
  };

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" style={{ width: '100%' }}>
        <View
          style={{
            flex: 1,
            padding: 20,
            alignItems: 'center',
            width: '100%',
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              width: '100%',
            }}
          >
            <View>
              <Text h4>{i18n.t('Config_Tracking')}</Text>
              {optlist.map((l, i) => (
                <ListItem
                  key={i}
                  title={i18n.t(l.name)}
                  subtitle={i18n.t(l.subtitle)}
                  switch={{
                    value: state[l.key],
                    onValueChange: handleChange(l.key),
                  }}
                  bottomDivider
                />
              ))}
            </View>

            <View style={styles.block}>
              <Text h4>
                {'\n'}
                {i18n.t('Config_Personal_data')}
              </Text>
            </View>
            {/*
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {navigation.navigate('CountrySelectorScreen')}}
            >
              <Text style={styles.listItemText}>{i18n.t('Country')}</Text>
              <Input
                name='pais'
                style={styles.Input}
                maxLength={24}
                value={state.userInfo.country}
                disabled
              />
              <Icon style={styles.icon} name="ios-arrow-forward" size={25} />
            </TouchableOpacity>
            */}
            {/* <View style={styles.inputContainer}>
          <Text>{i18n.t('Country')}</Text>
              <CountryPicker onValueChange={handleChange('country')} value={state.country}/>
            </View> */}

            <ScrollView>
              <View style={styles.inputContainer}>
                <Text>E-MAIL</Text>
                <Input
                  name="email"
                  style={styles.Input}
                  maxLength={48}
                  value={state.email}
                  onBlur={handleChange('email')}
                />
              </View>
            </ScrollView>
            <ScrollView>
              <View style={styles.inputContainer}>
                <Text>{i18n.t('ID')}</Text>
                <Input
                  name="dni"
                  style={styles.Input}
                  maxLength={16}
                  value={state.dni}
                  onChangeText={handleChange('dni')}
                />
              </View>
            </ScrollView>
            <ScrollView>
              <View style={styles.inputContainer}>
                <Text>{i18n.t('Name')}</Text>
                <Input
                  name="name"
                  style={styles.Input}
                  maxLength={48}
                  value={state.name}
                  onChangeText={handleChange('name')}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text>{i18n.t('Surname')}</Text>
                <Input
                  name="surname"
                  style={styles.Input}
                  maxLength={48}
                  value={state.surname}
                  onChangeText={handleChange('surname')}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  block: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderBottomColor: '#ccc',
    // borderBottomWidth: 1,
    // borderTopColor: '#ccc',
    // borderTopWidth: 1,
    width: '100%',
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'scroll',
    maxHeight: '100%',
    width: '100%',
  },
  logo: {
    width: 150,
    height: 100,
    marginHorizontal: 'auto',
  },
  text: {
    fontSize: 14,
    fontWeight: '300',
  },
  inputContainer: {
    paddingTop: 10,
  },
  Input: {
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 50,
    fontSize: 25,
    paddingLeft: 20,
    paddingRight: 20,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
  },
  listItemText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#434343',
    width: '90%',
  },
  icon: {
    color: '#CCCCCC',
    paddingLeft: 5,
  },
});

/*
const SettingsNavigator = createStackNavigator({
  Settings: Settings,
  CountrySelector: CountrySelectorScreen,
});
*/

export default Settings;
