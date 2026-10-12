// App Profesional — destino temporal tras aceptación del cliente (pantalla 9 real pendiente).

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackHeader from '../../../components/BackHeader';
import { colors, spacing, typography } from '../../../theme/colors';
import { ProfessionalStackParamList } from '../../../navigation/ProfessionalStackNavigator';

type Props = NativeStackScreenProps<
  ProfessionalStackParamList,
  'ProfessionalServiceInProgressPlaceholder'
>;

export default function ProfessionalServiceInProgressPlaceholderScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Servicio en curso" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>Servicio en curso</Text>
        <Text style={styles.hint}>
          El cliente confirmó la solicitud. La pantalla de servicio en curso (ingreso del PIN) se
          construirá en el siguiente paso.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  hint: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
