import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import {
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Layout from '../../constants/Layout';
import { PreventionItem, PreventionStackNavProps } from './types';
import { SharedElement } from 'react-navigation-shared-element';
import i18n from 'i18n-js';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { translations } from '../../assets/translations';

i18n.translations = translations;
i18n.locale = Localization.locale.startsWith('it') ? 'it' : 'ar';
i18n.fallbacks = true;

const data: PreventionItem[] = [
  {
    id: '1',
    title: i18n.t('Prevention_Item_1_Title'),
    shortText:
      i18n.t('Prevention_Item_1_shortText'),
    longText:
      i18n.t('Prevention_Item_1_longText'),
    image: require('../../assets/images/prevention/coronavirus.png'),
  },
  {
    id: '2',    
    title: i18n.t('Prevention_Item_2_Title'),
    shortText:
      i18n.t('Prevention_Item_2_shortText'),
    longText:
      i18n.t('Prevention_Item_2_longText'),
    image: require('../../assets/images/prevention/fever.png'),
  },
  {
    id: '3',
    title: i18n.t('Prevention_Item_3_Title'),
    shortText:
    i18n.t('Prevention_Item_3_shortText'),
    longText:
    i18n.t('Prevention_Item_3_longText'),
    image: require('../../assets/images/prevention/spread.png'),
  },
  {
    id: '4',
    title: i18n.t('Prevention_Item_4_Title'),
    shortText:
    i18n.t('Prevention_Item_4_shortText'),
    longText:
    i18n.t('Prevention_Item_4_longText'),
    image: require('../../assets/images/prevention/transmission.png'),
  },
  {
    id: '5',
    title: i18n.t('Prevention_Item_5_Title'),
    shortText:
    i18n.t('Prevention_Item_5_shortText'),
    longText:
    i18n.t('Prevention_Item_5_longText'),
    image: require('../../assets/images/prevention/hygiene.png'),
  },
  {
    id: '6',
    title: i18n.t('Prevention_Item_6_Title'),
    shortText:
    i18n.t('Prevention_Item_6_shortText'),
    longText:
    i18n.t('Prevention_Item_6_longText'),
    image: require('../../assets/images/prevention/travel.png'),
  },
  {
    id: '7',
    title: i18n.t('Prevention_Item_7_Title'),
    shortText:
    i18n.t('Prevention_Item_7_shortText'),
    longText:
    i18n.t('Prevention_Item_7_longText'),
    image: require('../../assets/images/prevention/quarantine.png'),
  },
];

export default function Prevention({
  navigation,
}: PreventionStackNavProps<'Prevention'>) {
  const renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback
        containerStyle={{ flexDirection: 'row' }}
        onPress={() =>
          navigation.navigate('PreventionDetail', {
            item,
          })
        }
      >
        <View style={styles.card}>
          {Platform.OS === 'web' ? (
            <Image
              source={item.image}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <SharedElement id={item.id}>
              <Image
                source={item.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </SharedElement>
          )}
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardText}>{item.shortText}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        contentContainerStyle={{ justifyContent: 'center' }}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
  },
  card: {
    flex: 1,
    width: Layout.window.width / 2 - 15,
    backgroundColor: '#fff',
    padding: 20,
    margin: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardImage: { width: 100, height: 100, alignSelf: 'center' },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    paddingVertical: 10,
  },
  cardText: {
    fontSize: 13,
    fontWeight: '200',
  },
});
