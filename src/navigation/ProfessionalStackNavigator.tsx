import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfessionalLoginScreen from '../screens/professional/ProfessionalLoginScreen';
import RegisterProfessionalScreen from '../screens/RegisterProfessionalScreen';
import ProfessionalTermsReadScreen from '../screens/professional/ProfessionalTermsReadScreen';
import ProfessionalPrivacyReadScreen from '../screens/professional/ProfessionalPrivacyReadScreen';
import ProfessionalDashboardPlaceholderScreen from '../screens/professional/placeholders/ProfessionalDashboardPlaceholderScreen';
import ProfessionalVerificationPlaceholderScreen from '../screens/professional/placeholders/ProfessionalVerificationPlaceholderScreen';
import ProfessionalServiceSelectionScreen from '../screens/professional/ProfessionalServiceSelectionScreen';
import ProfessionalCertificateUploadScreen from '../screens/professional/ProfessionalCertificateUploadScreen';
import { ProfessionalSessionRouteParams } from '../types/professionalAuth';

export type ProfessionalStackParamList = {
  ProfessionalLogin: undefined;
  RegisterProfessional: undefined;
  ProfessionalTermsRead: undefined;
  ProfessionalPrivacyRead: undefined;
  ProfessionalServiceSelection: ProfessionalSessionRouteParams;
  ProfessionalCertificateUploadPlaceholder: ProfessionalSessionRouteParams;
  ProfessionalDashboardPlaceholder: ProfessionalSessionRouteParams;
  ProfessionalVerificationPlaceholder: ProfessionalSessionRouteParams;
};

const Stack = createNativeStackNavigator<ProfessionalStackParamList>();

export default function ProfessionalStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="ProfessionalLogin" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfessionalLogin" component={ProfessionalLoginScreen} />
      <Stack.Screen name="RegisterProfessional" component={RegisterProfessionalScreen} />
      <Stack.Screen name="ProfessionalTermsRead" component={ProfessionalTermsReadScreen} />
      <Stack.Screen name="ProfessionalPrivacyRead" component={ProfessionalPrivacyReadScreen} />
      <Stack.Screen
        name="ProfessionalDashboardPlaceholder"
        component={ProfessionalDashboardPlaceholderScreen}
      />
      <Stack.Screen
        name="ProfessionalVerificationPlaceholder"
        component={ProfessionalVerificationPlaceholderScreen}
      />
      <Stack.Screen
        name="ProfessionalServiceSelection"
        component={ProfessionalServiceSelectionScreen}
      />
      <Stack.Screen
        name="ProfessionalCertificateUploadPlaceholder"
        component={ProfessionalCertificateUploadScreen}
      />
    </Stack.Navigator>
  );
}
