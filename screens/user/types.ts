import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type SettingsParamsList = {
  Settings: undefined;
};

export type SettingsStackNavProps<T extends keyof SettingsParamsList> = {
  navigation: StackNavigationProp<SettingsParamsList, T>;
  route: RouteProp<SettingsParamsList, T>;
};
