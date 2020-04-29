import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

import BottomTabNavigator from './BottomTabNavigator';
import { OnboardingSlides } from '../screens/onboaring/OnboardingSlides';
import { Splash } from '../screens/onboaring/Splash';
import UserInfo from '../screens/user/UserInfo';
import Settings from '../screens/user/Settings';
import { MainStackParamList } from './types';
import { UserPreferences } from '../utils/config';
import CountrySelectorScreen from '../screens/user/CountrySelectorScreen';

const Stack = createStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  // ({ userInfo }: UserPreferences) {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalTransition,
      }}
      mode="modal"
      headerMode="none"
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Help" component={OnboardingSlides} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="UserInfo" component={UserInfo} />
    </Stack.Navigator>
  );
}
