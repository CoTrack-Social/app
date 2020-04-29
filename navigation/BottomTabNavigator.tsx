import * as React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import TabBarIcon from '../components/TabBarIcon';
import Diagnostic from '../screens/diagnostic/Diagnostic';
import MapStack from '../screens/map/MapStack';
import Prevention from '../screens/prevention/Prevention';
import PreventionDetail from '../screens/prevention/PreventionDetail';
import Colors from '../constants/Colors';
import { PreventionParamsList } from '../screens/prevention/types';
import Results from '../screens/diagnostic/Results';
import { TransitionSpec } from '@react-navigation/stack/lib/typescript/src/types';
import { DiagnosticParamsList } from '../screens/diagnostic/types';
import { HelpButton } from '../components/HelpButton';
import { SettingsParamsList } from '../screens/user/types';
import Settings from '../screens/user/Settings';
import i18n from 'i18n-js';

import { pageHit } from '../utils/analytics';

const INITIAL_ROUTE_NAME = 'Diagnostic';
const isIOS = Platform.OS === 'ios';
const isWeb = Platform.OS === 'web';

type TabsParamsList = {
  Diagnostic: undefined;
  Map: undefined;
  Prevention: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabsParamsList>();

const DiagnosticStack = createStackNavigator<DiagnosticParamsList>();

const defaultScreenOptions = {
  headerTintColor: Colors.secondaryTextColor,
  headerStyle: { backgroundColor: Colors.primaryColor },
};

const iosTransitionSpec: TransitionSpec = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 10,
    restSpeedThreshold: 10,
  },
};

const PreventionStack = createSharedElementStackNavigator<
  PreventionParamsList
>();

function PreventionNavStack() {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(Colors.primaryColor);
      pageHit('Prevention');
    }, []),
  );
  return (
    <PreventionStack.Navigator
      screenOptions={{
        ...defaultScreenOptions,
        transitionSpec: {
          open: iosTransitionSpec,
          close: iosTransitionSpec,
        },
        animationEnabled: !isWeb,
      }}
    >
      <PreventionStack.Screen
        name="Prevention"
        component={Prevention}
        options={{
          headerTitle: i18n.t('Prevention'),
          headerRight: () => <HelpButton />,
        }}
      />
      <PreventionStack.Screen
        name="PreventionDetail"
        component={PreventionDetail}
        options={{ headerTitle: '' }}
        sharedElementsConfig={(route) => {
          const { item } = route.params;
          return [{ id: item.id }];
        }}
      />
    </PreventionStack.Navigator>
  );
}

const SettingsStack = createSharedElementStackNavigator<SettingsParamsList>();

function SettingsNavStack() {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(Colors.primaryColor);
      pageHit('Settings');
    }, []),
  );
  return (
    <SettingsStack.Navigator
      screenOptions={{
        ...defaultScreenOptions,
        transitionSpec: {
          open: iosTransitionSpec,
          close: iosTransitionSpec,
        },
        animationEnabled: !isWeb,
      }}
    >
      <SettingsStack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTitle: i18n.t('Settings'),
          headerRight: () => <HelpButton />,
        }}
      />
    </SettingsStack.Navigator>
  );
}

function DiagnosticNavStack() {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(Colors.primaryColor);
      pageHit('Diagnostic');
    }, []),
  );
  return (
    <DiagnosticStack.Navigator
      screenOptions={{
        ...defaultScreenOptions,
        gestureEnabled: false,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalTransition,
      }}
      mode="modal"
    >
      <DiagnosticStack.Screen
        name="Diagnostic"
        options={{
          headerTitle: i18n.t('AutoTest'),
          headerRight: () => <HelpButton />,
        }}
        component={Diagnostic}
      />
      <DiagnosticStack.Screen
        name="DiagnosticResults"
        component={Results}
        options={{ headerShown: false }}
      />
    </DiagnosticStack.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{ showLabel: false }}
    >
      <Tab.Screen
        name="Diagnostic"
        component={DiagnosticNavStack}
        options={{
          title: i18n.t('Diagnostic'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={isIOS ? 'ios-medkit' : 'md-medkit'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        options={{
          title: i18n.t('Map'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={isIOS ? 'ios-map' : 'md-map'} />
          ),
        }}
        component={MapStack}
      />
      <Tab.Screen
        name="Prevention"
        options={{
          title: i18n.t('Prevention'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={isIOS ? 'ios-medical' : 'md-medical'}
            />
          ),
        }}
        component={PreventionNavStack}
      />
      <Tab.Screen
        name="Settings"
        options={{
          title: i18n.t('Settings'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={isIOS ? 'ios-settings' : 'md-settings'}
            />
          ),
        }}
        component={SettingsNavStack}
      />
    </Tab.Navigator>
  );
}
