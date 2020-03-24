import * as React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { Ionicons as Icon } from '@expo/vector-icons';

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
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const INITIAL_ROUTE_NAME = 'Map';
const isIOS = Platform.OS === 'ios';
const isWeb = Platform.OS === 'web';

type TabsParamsList = {
  Diagnostic: undefined;
  Map: undefined;
  Prevention: undefined;
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

function HelpButton() {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Help')}>
      <Icon
        name="ios-help-circle-outline"
        size={30}
        color="#fff"
        // backgroundColor={Colors.primaryColor}
        style={{ paddingRight: 20 }}
      />
    </TouchableWithoutFeedback>
  );
}

function PreventionNavStack() {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(Colors.primaryColor);
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
          headerTitle: 'Prevención',
          headerRight: () => <HelpButton />,
        }}
      />
      <PreventionStack.Screen
        name="PreventionDetail"
        component={PreventionDetail}
        options={{ headerTitle: '' }}
        sharedElementsConfig={route => {
          const { item } = route.params;
          return [{ id: item.id }];
        }}
      />
    </PreventionStack.Navigator>
  );
}

function DiagnosticNavStack() {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      Platform.OS === 'android' &&
        StatusBar.setBackgroundColor(Colors.primaryColor);
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
          headerTitle: 'Auto Diagnóstico',
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
          title: 'Diagnóstico',
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
          title: 'Mapa',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={isIOS ? 'ios-map' : 'md-map'} />
          ),
        }}
        component={MapStack}
      />
      <Tab.Screen
        name="Prevention"
        options={{
          title: 'Prevención',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={isIOS ? 'ios-medical' : 'md-medical'}
            />
          ),
        }}
        component={PreventionNavStack}
      />
    </Tab.Navigator>
  );
}
