import React, { useReducer, useRef, useEffect, useState } from 'react';
import {
  Linking,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  CheckBox,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import moment from 'moment';
import { MainStackNavProps } from '../../navigation/types';
import Touchable from '../../components/Touchable';
import Colors from '../../constants/Colors';
import { savePreferences, getPreferences } from '../../utils/config';
import RadioButtons from '../../components/RadioButtons';
import DatePicker from '../../components/DatePicker';
import DoctorPicker from '../../components/DoctorPicker';
import ProvincePicker from '../../components/ProvincePicker';
import { syncUserInfoDataWithServer } from '../../utils/syncStorageHelper';

import { mapStyles } from '../map/mapStyles';
import i18n from 'i18n-js';

function reducer(state, newState) {
  return { ...state, ...newState };
}

const UserInfo = ({ navigation }: MainStackNavProps<'UserInfo'>) => {
  const [state, setState] = useReducer(reducer, {});
  const [canSave, setCanSave] = useState(false);
  const [isVisibleModalDni, setIsVisibleModalDni] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState(0);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      const preferences = await getPreferences();
      if (preferences.userInfo) {
        preferences.userInfo.terms = false;
        preferences.userInfo.province &&
          setSelectedProvince(preferences.userInfo.province.id);
      }
      setState(preferences.userInfo);
      setLoaded(true);
    }
    loadData();
  }, []);

  const handleChange = (key) => (value) => {
    setState({ [key]: value });
  };

  const handleChangeID = (key) => (value) => {
    value = value.replace(/[\W_]+/g, '');
    setState({ [key]: value });
  };

  const handleOpenLink = (url) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  useEffect(() => {
    if (
      (state.phoneNumber || '') !== '' &&
      (state.email || '') !== '' &&
      (state.gender || '') !== '' &&
      (state.province || '') !== '' &&
      (state.dni || '') !== '' &&
      (state.terms || '') !== '' &&
      isValidDate()
    ) {
      setCanSave(true);
    } else {
      setCanSave(false);
    }
  }, [state]);

  function isValidDate() {
    if ((state.dob || '') === '') {
      return false;
    }
    return moment(state.dob, 'D/M/YYYY', true).isValid();
  }
  async function handleContinue() {
    state.acceptedTerms = Constants.manifest.extra.termsVersion;
    await savePreferences({ userInfo: state });
    syncUserInfoDataWithServer();
    navigation.navigate('Main');
  }

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View
          style={{
            marginTop: 22,
            position: 'absolute',
            top: '20%',
            zIndex: 99999,
            display:
              Platform.OS === 'web' && !isVisibleModalDni ? 'none' : null,
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            presentationStyle="overFullScreen"
            visible={isVisibleModalDni}
            style={Platform.OS === 'web' ? { borderWidth: 0 } : undefined}
          >
            <View
              style={{ marginTop: 15, width: '90%', marginHorizontal: '5%' }}
            >
              <Text style={mapStyles.modalTitle}>{i18n.t('WhyWeAsk')}</Text>
              <View style={[mapStyles.modalBody]}>
                <Text style={{ textAlign: 'left' }}>
                  La información que generamos entre todos sobre nuestros
                  síntomas es utilizada por las autoridades nacionales y
                  provinciales para predecir y monitorear brotes de COVID-19.
                  {'\n\n'}
                  En caso de ser necesario por tus síntomas o a criterio de
                  gobierno, deben poder contactarte para coordinar que te
                  realices un test. {'\n\n'}
                  Tu información GPS se almacena en tu telefono y solamente se
                  comparte si vos lo decidís.{'\n\n'}
                  <Text style={{ marginTop: 15 }}>
                    Te pedimos leas los{' '}
                    <Text
                      onPress={() =>
                        handleOpenLink('https://cotrack.social/tyc.html')
                      }
                      style={{
                        color: Colors.primaryColor,
                        textDecorationLine: 'underline',
                        marginTop: 15,
                      }}
                    >
                      {i18n.t('Terms')}
                    </Text>{' '}
                    y las{' '}
                    <Text
                      onPress={() =>
                        handleOpenLink('https://cotrack.social/faq.html')
                      }
                      style={{
                        color: Colors.primaryColor,
                        textDecorationLine: 'underline',
                        marginTop: 15,
                      }}
                    >
                      {i18n.t('Faq')}
                    </Text>{' '}
                    disponibles en{' '}
                    <Text
                      onPress={() => handleOpenLink('https://cotrack.social/')}
                      style={{
                        color: Colors.primaryColor,
                        textDecorationLine: 'underline',
                        marginTop: 15,
                      }}
                    >
                      https://cotrack.social/
                    </Text>{' '}
                    para más detalle
                  </Text>
                </Text>
              </View>
              <View style={mapStyles.modalButtonContainer}>
                <TouchableOpacity onPress={() => setIsVisibleModalDni(false)}>
                  <View style={mapStyles.modalButton}>
                    <Text style={{ color: 'white' }}>Aceptar</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        <View
          style={{
            flex: 1,
            padding: 20,
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{
              flex: 1,
              justifyContent: 'flex-start',
            }}
          >
            <Text style={styles.text}>{i18n.t('title_signup')}</Text>

            <ProvincePicker
              label={i18n.t('Province')}
              onChange={handleChange('province')}
              value={state.province}
              country={state.country}
            />

            {state.province && state.province.image ? (
              <View
                style={{
                  alignItems: 'center',
                }}
              >
                <Image
                  source={state.province.image}
                  style={{
                    height: 100,
                    width: 100,
                    marginTop: 10,
                  }}
                  resizeMode="contain"
                />
                <Text style={{ textAlign: 'center', marginTop: 5 }}>
                  {i18n.t('OfficialApp')}
                </Text>
              </View>
            ) : null}

            <DoctorPicker
              label={i18n.t('Doctor')}
              onChange={handleChange('doctor')}
              value={state.doctor}
              province={state.province}
              country={state.country}
            />
            <TextInput
              placeholder={i18n.t('ID')}
              value={state.dni}
              onChangeText={handleChangeID('dni')}
              style={styles.input}
              maxLength={16}
              blurOnSubmit
            />
            <View style={[styles.input, { borderWidth: 0 }]}>
              <RadioButtons
                label={i18n.t('Gender')}
                options={[
                  {
                    key: 'M',
                    text: i18n.t('Male'),
                  },
                  {
                    key: 'F',
                    text: i18n.t('Female'),
                  },
                ]}
                value={state.gender}
                onChange={handleChange('gender')}
              />
            </View>

            <DatePicker
              label={i18n.t('BirthDate')}
              onChange={handleChange('dob')}
              value={state.dob}
            />

            <TextInput
              placeholder="Email"
              value={state.email}
              onChangeText={handleChange('email')}
              keyboardType="email-address"
              autoCompleteType="email"
              style={styles.input}
              blurOnSubmit
            />

            <TextInput
              placeholder={i18n.t('Cellphone')}
              value={state.phoneNumber}
              onChangeText={handleChange('phoneNumber')}
              keyboardType="phone-pad"
              style={styles.input}
              blurOnSubmit
            />

            <Text
              onPress={() => setIsVisibleModalDni(true)}
              style={{
                color: Colors.primaryColor,
                textDecorationLine: 'underline',
                marginTop: 15,
              }}
            >
              {i18n.t('WhyWeAsk')}
            </Text>

            <View
              style={{ flexDirection: 'row', marginTop: 20, marginBottom: 20 }}
            >
              <CheckBox
                value={state.terms}
                onValueChange={handleChange('terms')}
              />
              <Text style={{ marginTop: Platform.OS === 'web' ? 0 : 5 }}>
                {' '}
                {i18n.t('ReadAndAccepted')}{' '}
                <Text
                  onPress={() =>
                    handleOpenLink('https://cotrack.social/tyc.html')
                  }
                  style={{
                    color: Colors.primaryColor,
                    textDecorationLine: 'underline',
                    marginTop: 15,
                  }}
                >
                  {i18n.t('Terms')}
                </Text>
              </Text>
            </View>
            <Touchable
              enabled={canSave}
              style={[
                styles.button,
                styles.activeButton,
                { width: undefined, margin: 10 },
                !canSave && { backgroundColor: '#ccc' },
              ]}
              onPress={handleContinue}
            >
              <Text style={[styles.buttonText, styles.activeButtonText]}>
                {i18n.t('Continue')}
              </Text>
            </Touchable>
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
              <Text style={styles.footerText}>{i18n.t('ForOfficialUse')}</Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'scroll',
    maxHeight: '100%',
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
  footerText: {
    fontSize: 12,
    fontWeight: '200',
    textAlign: 'center',
  },
  input: {
    marginTop: 20,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  button: {
    flexDirection: 'row',
    minHeight: 50,
    width: '49%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
    }),
  },
  buttonText: {
    padding: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  activeButton: {
    backgroundColor: Colors.primaryColor,
  },
  activeButtonText: { color: '#fff' },
});

export default UserInfo;
