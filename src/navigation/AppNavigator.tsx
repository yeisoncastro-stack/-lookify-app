// src/navigation/AppNavigator.tsx
// Stack de navegación principal. A medida que agreguemos pantallas
// (Matching, Profile, Tracking, Payment), se registran aquí.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from '../screens/LoginScreen';
import AccountTypeScreen from '../screens/AccountTypeScreen';
import RegisterClientScreen from '../screens/RegisterClientScreen';
import RegisterProfessionalScreen from '../screens/RegisterProfessionalScreen';
import HomeScreen from '../screens/HomeScreen';
import ServiceSelectionScreen from '../screens/ServiceSelectionScreen';
import { CategoriaId } from '../data/mockProfessionals';

// Define aquí todas las rutas y qué parámetros recibe cada una.
// Esto le da autocompletado y chequeo de tipos a navigation.navigate(...).
export type RootStackParamList = {
  Login: undefined;
  AccountType: undefined;
  RegisterClient: undefined;
  RegisterProfessional: undefined;
  Home: undefined;
  ServiceSelection: { categoriaId: CategoriaId; categoriaNombre: string };
  // Matching: { categoriaId: string };      // se agrega en el próximo paso
  // Profile: { profesionalId: string };
  // Tracking: { solicitudId: string };
  // Payment: { solicitudId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AccountType" component={AccountTypeScreen} />
          <Stack.Screen name="RegisterClient" component={RegisterClientScreen} />
          <Stack.Screen name="RegisterProfessional" component={RegisterProfessionalScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ServiceSelection" component={ServiceSelectionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
