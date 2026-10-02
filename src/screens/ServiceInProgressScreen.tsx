// Pantalla 9 — placeholder mínimo hasta la implementación completa.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../theme/colors';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceInProgress'>;

export default function ServiceInProgressScreen(_props: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Servicio en progreso</Text>
        <Text style={styles.body}>
          Pantalla 9 — placeholder. El diseño completo llegará en la siguiente iteración.
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
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.heading,
    textAlign: 'center',
  },
  body: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
