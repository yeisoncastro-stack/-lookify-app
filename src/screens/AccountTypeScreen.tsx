// src/screens/AccountTypeScreen.tsx
// Pantalla 2: el usuario elige si se registra como Cliente o Profesional.
// Según la elección, navega a un formulario de registro distinto —
// el de Profesional es más largo (categorías, certificaciones, portafolio).

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/colors';
import Button from '../components/Button';

type AccountType = 'client' | 'professional';

interface AccountTypeScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function AccountTypeScreen({ navigation }: AccountTypeScreenProps) {
  const [selected, setSelected] = useState<AccountType>('client');

  const handleContinue = () => {
    if (selected === 'client') {
      navigation.navigate('RegisterClient');
    } else {
      navigation.navigate('RegisterProfessional');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>¿Cómo quieres usar Lookify?</Text>
      </View>

      <View style={styles.body}>
        <OptionCard
          icon="person"
          title="Soy cliente"
          description="Quiero solicitar servicios a domicilio"
          selected={selected === 'client'}
          onPress={() => setSelected('client')}
        />
        <OptionCard
          icon="scissors"
          title="Soy profesional"
          description="Quiero ofrecer mis servicios"
          selected={selected === 'professional'}
          onPress={() => setSelected('professional')}
        />

        <Button label="Continuar" onPress={handleContinue} style={{ marginTop: spacing.lg }} />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>
            ¿Ya tienes cuenta? <Text style={styles.loginLinkAccent}>Ingresar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Sub-componente de tarjeta seleccionable ---
// Nota: "icon" es solo texto de marcador por ahora. Cuando instales
// @expo/vector-icons, reemplaza el círculo de abajo por el ícono real.
interface OptionCardProps {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

function OptionCard({ icon, title, description, selected, onPress }: OptionCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.iconPlaceholder}>{icon === 'person' ? '👤' : '✂️'}</Text>
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.navy,
    paddingTop: spacing.xl,
    paddingBottom: 40,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textOnNavyMuted,
    marginTop: spacing.xs,
  },
  body: {
    flex: 1,
    marginTop: -20,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  cardSelected: {
    borderColor: colors.navy,
    borderWidth: 2,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    backgroundColor: colors.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    fontSize: 20,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    ...typography.heading,
  },
  cardDescription: {
    ...typography.caption,
    marginTop: 2,
  },
  loginLink: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  loginLinkAccent: {
    color: colors.honey,
    fontWeight: '600',
  },
});
