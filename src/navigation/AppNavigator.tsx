// src/navigation/AppNavigator.tsx
// Stack de navegación principal. A medida que agreguemos pantallas
// (Home, Matching, Profile, Tracking, Payment), se registran aquí.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import AccountTypeScreen from '../screens/AccountTypeScreen';
import RegisterClientScreen from '../screens/RegisterClientScreen';
import RegisterProfessionalScreen from '../screens/RegisterProfessionalScreen';

// Define aquí todas las rutas y qué parámetros recibe cada una.
// Esto le da autocompletado y chequeo de tipos a navigation.navigate(...).
export type RootStackParamList = {
  Login: undefined;
  AccountType: undefined;
  RegisterClient: undefined;
  RegisterProfessional: undefined;
  // Home: undefined;            // se agrega en el próximo paso
  // Matching: { categoriaId: string };
  // Profile: { profesionalId: string };
  // Tracking: { solicitudId: string };
  // Payment: { solicitudId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AccountType" component={AccountTypeScreen} />
        <Stack.Screen name="RegisterClient" component={RegisterClientScreen} />
        <Stack.Screen name="RegisterProfessional" component={RegisterProfessionalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
