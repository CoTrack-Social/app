import React from 'react';
import { View } from 'react-native';
import CountryListItem from '../../components/CountryListItem';
import i18n from 'i18n-js';

const countries = [
  {
    locale: 'ar',
    country: 'Argentina',
    name: 'Español (Argentina)'
  },
  {
    locale: 'it',
    name: 'Italiano',
    country: 'Italia',
  }
];

class CountrySelectorScreen extends React.Component {
  static navigationOptions = {
    title: i18n.t('Country'),
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ marginTop: 15 }}>
        {
          countries.map((countries) => (
            <CountryListItem
              key={countries.locale}
              isActive={countries.locale === 'ar'}
              locale={countries.locale}
              name={countries.name}
              onChangeLocale={(locale) => navigation.navigate('Settings', { locale })}
            />
          ))
        }
      </View>
    );
  }
}

export default CountrySelectorScreen;