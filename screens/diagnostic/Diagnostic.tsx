import React, { useReducer, useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Platform,
  ScrollView,
  StatusBar,
  Picker,
  Alert,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import * as Location from 'expo-location';

import { QuestResults } from './types';
import Colors from '../../constants/Colors';
import { formatAge } from '../../utils/forms';
import Touchable from '../../components/Touchable';
import { getPreferences } from '../../utils/config';
import { saveDiagnosticLocally } from '../../utils/localStorageHelper';
import { syncRecordsDataWithServer } from '../../utils/syncStorageHelper';
import i18n from 'i18n-js';
import { Text, Button, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons'
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';

const initialState = {
  age: '',
  height: '',
  weight: '',
  symptoms: {},
  questions: {},
  medicalHistory: {},
};

function reducer(state, newState) {
  return { ...state, ...newState };
}

function BMIDisplay({height, weight}) {
  const h = parseFloat(height)/100; // altura en metros
  const w = parseFloat(weight);

  const bmi = Math.floor(w/(h*h));  // peso sobre altura al cuadrado
  
  const [iconcolor, text, iconname] = (function(bmi)  {
    if(isNaN(bmi)) return ['white',i18n.t('BMI_1'),'info'];
    if(bmi < 16) return ['#F2453E',i18n.t('BMI_2'), 'warning'];
    if(bmi < 17) return ['#FF9700',i18n.t('BMI_3'), 'done'];
    if(bmi < 18.5) return ['#FEE94E',i18n.t('BMI_4'), 'done'];
    if(bmi < 25) return ['#00C16E',i18n.t('BMI_5'), 'done'];
    if(bmi < 30) return ['#FEE94E',i18n.t('BMI_6'), 'report'];
    if(bmi < 35) return ['#FF9700',i18n.t('BMI_7'), 'report'];
    if(bmi < 40) return ['#F2453E',i18n.t('BMI_8'), 'report'];
    return ['#BF3930',i18n.t('BMI_9'), 'report'];
  })(bmi);

  
  return (
    <Button
    icon={{
      name: iconname,
      size: 30,
      color: iconcolor,
    }}
      title={text}
      size={20}
      type="outline"
      disabled
    />
  );
}

function QuestButton({ id, text, onPress, selected }) {
  const isSelected = selected[id] === 'yes';

  const handlePress = () => {
    onPress(id);
  };

  return (
    <Touchable
      style={[styles.button, isSelected && styles.activeButton]}
      onPress={handlePress}
    >
      <Text style={[styles.buttonText, isSelected && styles.activeButtonText]}>
        {text}
      </Text>
    </Touchable>
  );
}

function YesNoButtons({ id, onPress, state }) {
  const isYes = state[id] === 'yes';
  const isNo = state[id] === 'no';

  const handleYesPress = () => {
    onSelect('yes');
  };
  const handleNoPress = () => {
    onSelect('no');
  };

  const onSelect = (value) => {
    const newState = { ...state, [id]: value };
    onPress(newState);
  };

  return (
    <>
      <Touchable
        style={[styles.button, isYes && styles.activeButton]}
        onPress={handleYesPress}
      >
        <Text style={[styles.buttonText, isYes && styles.activeButtonText]}>
          Si
        </Text>
      </Touchable>
      <Touchable
        style={[styles.button, isNo && styles.activeButton]}
        onPress={handleNoPress}
      >
        <Text style={[styles.buttonText, isNo && styles.activeButtonText]}>
          No
        </Text>
      </Touchable>
    </>
  );
}

class TPicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange=(value, index)=>{
    this.setState({temperature: value}, () => Alert.alert(this.state.temperature))
  }
  state = {temperature: '37.5'};
  render() {

    const arrItems = Array.from(Array(100).keys()).map((e, i) => (
      <Picker.Item key={(i + 340)/10} label={`${(i + 340)/10}`} value={(i + 340)/10} />
    ));

    return (
      <Picker
      selectedValue={this.state.temperature}
      onValueChange={this.handleChange}
      style={{
        width: '25%',
        marginLeft: 'auto',
      }}
      mode="dropdown"
    >
      {arrItems}
    </Picker>
    )
  }
}


function TempPicker({onChange, value }) {
  let defaultValue = { temp1: 37, temp2: 5 };
  
  if (value) {
    try {
      const v = value.split('.');
      defaultValue.temp1 = parseInt(v[0]);
      defaultValue.temp2 = parseInt(v[1]);
    } catch (e) {}
  }
  const [internalValue, setInternalValue] = useState(defaultValue);

  const handleChange = (key) => (val) => {
    internalValue[key] = val;
    setInternalValue(internalValue);
    onChange(`${internalValue.temp1}.${internalValue.temp2}`);

  };

  const arrTemp1 = Array.from(Array(10).keys()).map((e, i) => (
    <Picker.Item key={i + 34} label={`${i + 34}`} value={i + 34} />
  ));
  const arrTemp2 = Array.from(Array(10).keys()).map((e, i) => (
    <Picker.Item key={i + 1} label={`${i}`} value={i} />
  ));
  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 15,
      marginTop: 15,
    },
  });
  return (
    <View style={styles.buttonContainer}>
      <Picker
        selectedValue={internalValue.temp1}
        onValueChange={handleChange('temp1')}
        style={{
          width: '25%',
          marginLeft: 'auto',
        }}
        mode="dropdown"
      >
        {arrTemp1}
      </Picker>
      <Text>.</Text>
      <Picker
        selectedValue={internalValue.temp2}
        onValueChange={handleChange('temp2')}
        style={{ width: '20%' }}
        mode="dropdown"
      >
        {arrTemp2}
      </Picker>
    </View>
  );
}

interface QuestionaryProps {
  onShowResults: (value: QuestResults) => void;
}

function Questionary({ onShowResults }: QuestionaryProps) {
  const [state, setState] = useReducer(reducer, initialState);
  const [disabled, setDisabled] = useState(true);
  const [positiveTravelContact, setPositiveTravelContact] = useState(false);
  const [positiveExtraConditions, setpositiveExtraConditions] = useState(false);

  const onSelectSymptoms = useCallback(
    (id) => {
      const newSelected = {
        ...state.symptoms,
        [id]: state.symptoms[id] === 'yes' ? 'no' : 'yes',
      };
      setState({ symptoms: newSelected });
    },
    [state.symptoms],
  );

  const onSelectMedicalHistory = useCallback(
    (id) => {
      const newSelected = {
        ...state.medicalHistory,
        [id]: state.medicalHistory[id] === 'yes' ? 'no' : 'yes',
      };
      setState({ medicalHistory: newSelected });
    },
    [state.medicalHistory],
  );

  const handleChangeAge = (age) => {
    setState({ age: formatAge(age) });
  };
  const handleChangeWeight = (val) => {
    val.replace(/\D/g, '');
    if(val < 0) val = 0;
    if(val > 250 ) val = 250;
    setState({ weight: val });
  };
  const handleChangeHeight = (val) => {
    val.replace(/\D/g, '');
    if(val < 0) val = 0;
    if(val > 250 ) return;
    setState({ height: val });
  };

  useEffect(() => {
    const hasAnswers = Object.keys(state.questions);
    const hasPositiveAnswers =
      hasAnswers.filter((k) => state.questions[k] === 'yes').length >= 1;
    const hasPositiveConditions =
      Object.keys(state.medicalHistory).filter(
        (k) => state.medicalHistory[k] === 'yes',
      ).length >= 1;

    setDisabled(!(hasAnswers.length >= 3));
    setPositiveTravelContact(!!hasPositiveAnswers);
    setpositiveExtraConditions(!!hasPositiveConditions);

  }, [state]);

  const handleShowResults = (result) => {
    onShowResults(result);
    // scrollRef.current.scrollTo({ x: 0, animated: false });
  };

  const handlePress = async () => {
    let result: QuestResults;

    // Fiebre 37.5+ Y
    // Uno de (tos,odinofagia: dolor al tragar,dificultad respitatoria,anosmia/disguesia: falta de olfato/sabor)
    // y en ultimos 14 días historial de viaje/contacto o residencia en zona de transmision local
    result = 'positive';
    if(state.symptoms['fever'] === 'yes')
    {
      // Triage Italia
      /*
      if(state.temperature === undefined || state.temperature > 37.5) {
        if( positiveTravelContact ) {
          result = 'negative';
        }
      }
      */

      // state.temperature === undefined = 37.5, bug en TempPicker
      if(state.temperature === undefined || state.temperature > 37.5) {
        if( (state.symptoms['throat'] === 'yes' || 
            state.symptoms['breath'] === 'yes' ||
            state.symptoms['anosmya'] === 'yes' ||
            state.symptoms['cough'] === 'yes')
            &&
            (
              positiveTravelContact
            ) 
          ) {
          result = 'negative';
        }
      }
    }

    let location;
    try {
      location = await Location.getLastKnownPositionAsync();
    } catch (e) {
      console.log('Could not get last known location', e);
      location = '';
    }

    saveDiagnosticLocally(state, result, location, () => {
      handleShowResults(result);
      syncRecordsDataWithServer();
    });
  };

  const handleYesNoPress = (values) => {
    setState({ questions: values });
  };

  const scrollRef = React.useRef<ScrollView | null>(null);

  useScrollToTop(scrollRef);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.questContainer}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        <Text style={styles.title}>
        {i18n.t('AutoTest_Intro')}
        </Text>
        <Text>{' '}</Text>
        <Divider/>
        <View>
        <TextInput
          placeholder={i18n.t('AskAge')}
          value={state.age}
          onChangeText={handleChangeAge}
          keyboardType="phone-pad"
          style={styles.input}
          blurOnSubmit
        />
        <View style={[(i18n.locale == 'ar') ? styles.hidden : '']}>
        <Divider/>
        <Text style={styles.section}>{i18n.t('BMI_title')}</Text>
        <TextInput
          placeholder={i18n.t('Height') + ' (CM)'}
          value={state.height}
          onChangeText={handleChangeHeight}
          keyboardType="phone-pad"
          style={styles.input}
          blurOnSubmit
        />
        <TextInput
          placeholder={i18n.t('Weight') + ' (KG)'}
          value={state.weight}
          onChangeText={handleChangeWeight}
          keyboardType="numbers-and-punctuation"
          style={styles.input}
          blurOnSubmit
        />
        <BMIDisplay height={state.height} weight={state.weight}/>
        </View>
        </View>
        <Text style={styles.section}>{i18n.t('symptoms_title')}</Text>
        <Divider/>
        <View style={styles.questButtons}>
        <QuestButton
            id="anosmya"
            text={i18n.t('anosmya')}
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="fever"
            text={i18n.t('fever')}
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="cough"
            text={i18n.t('cough')}
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="throat"
            text={i18n.t('throat')}
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="breath"
            text={i18n.t('breath')}
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="headache"
            text={i18n.t('headache')}
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="diarrhea"
            text={i18n.t('diarrhea')}
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="tiredness"
            text={i18n.t('tiredness')}
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
        </View>
        {state.symptoms && state.symptoms.fever === 'yes' && (
          <>
            <Text style={styles.section}>{i18n.t('temperature')}</Text>
            <TempPicker
              value={state.temperature}
              onChange={(val) => setState({ temperature: val })}
            />
            {/*<TPicker onChange={(val) => setState({ temperature: val })}/>*/}
          </>
        )}
        <Text style={styles.section}>{i18n.t('Contact_section')}</Text>
        <Divider/>
        <Text style={styles.subtitle}>
        {i18n.t('confirmedContact_subtitle')}  
        </Text>
        <View style={styles.questButtons}>
          <YesNoButtons
            id="confirmedContact"
            onPress={handleYesNoPress}
            state={state.questions}
          />
        </View>
        <Text style={styles.subtitle}>
        {i18n.t('suspectedOutside_subtitle')}  
        </Text>
        <View style={styles.questButtons}>
          <YesNoButtons
            id="suspectedOutside"
            onPress={handleYesNoPress}
            state={state.questions}
          />
        </View>
        <Text style={styles.subtitle}>
        {i18n.t('suspectedInside_subtitle')}
        </Text>
        <View style={styles.questButtons}>
          <YesNoButtons
            id="suspectedInside"
            onPress={handleYesNoPress}
            state={state.questions}
          />
        </View>
        <Text style={styles.section}>{i18n.t('medicalHistory')}</Text>
        <Divider/>
        <View style={styles.questButtons}>
          <QuestButton
            id="immunosuppression"
            text={i18n.t('immunosuppression')}
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="diabetes"
            text={i18n.t('diabetes')}
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="cancer"
            text={i18n.t('cancer')}
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="hepatic"
            text={i18n.t('hepatic')}
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="pregnant"
            text={i18n.t('pregnant')}
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="newborn"
            text={i18n.t('newborn')}
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="respiratoryDisease"
            text={i18n.t('respiratoryDisease')}
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="kidneyDisease"
            text={i18n.t('kidneyDisease')}
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
          <QuestButton
            id="cardiologicalDisease"
            text={i18n.t('cardiologicalDisease')}
            onPress={onSelectMedicalHistory}
            selected={state.medicalHistory}
          />
        </View>
      </ScrollView>
      <Touchable
        enabled={!disabled}
        style={[
          styles.button,
          styles.activeButton,
          { width: undefined, margin: 10 },
          disabled && { backgroundColor: '#ccc' },
        ]}
        onPress={handlePress}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
        {i18n.t('MakeTest')}
        </Text>
      </Touchable>
    </>
  );
}

export default function Diagnostic({ navigation }) {
  const onShowResults = (value: QuestResults) => {
    navigation.navigate('DiagnosticResults', {
      results: value,
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Questionary onShowResults={onShowResults} />
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: {
    height: 0, width: 0, opacity: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  questContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  questButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  title: { paddingTop: 20, fontSize: 16, fontWeight: '300' },
  section: {
    paddingTop: 30,
    paddingBottom: 10,
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: { paddingTop: 20, paddingBottom: 10 },
  input: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 15,
    borderColor: 'white',
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
