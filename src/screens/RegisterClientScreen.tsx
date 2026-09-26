// src/screens/RegisterClientScreen.tsx
// Formulario de registro para Cliente (frontend mock; sin backend todavía).

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { colors, radius, spacing, typography } from '../theme/colors';
import Button from '../components/Button';
import TextField from '../components/TextField';

const TIPOS_DOCUMENTO = [
  { id: 'CC', label: 'C.C.' },
  { id: 'Pasaporte', label: 'Pasaporte' },
] as const;

type TipoDocumentoId = (typeof TIPOS_DOCUMENTO)[number]['id'];

interface RegisterClientScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

function formatFecha(date: Date | null): string {
  if (!date) return 'Selecciona tu fecha de nacimiento';
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function RegisterClientScreen({ navigation }: RegisterClientScreenProps) {
  const [form, setForm] = useState({
    nombre: '',
    numeroDocumento: '',
    nacionalidad: '',
    telefono: '',
    email: '',
    password: '',
  });
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumentoId>('CC');
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onDateChange = (_event: DateTimePickerChangeEvent, selected: Date) => {
    // En Android el diálogo se cierra solo tras elegir; en iOS lo mantenemos
    // abierto hasta que el usuario toque "Listo".
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    setFechaNacimiento(selected);
  };

  const handleSubmit = () => {
    if (!aceptaTerminos) return;
    // TODO: POST /auth/register/client cuando exista backend
    console.log('Registrar cliente', {
      ...form,
      tipoDocumento,
      fechaNacimiento,
    });
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Crear cuenta de cliente</Text>
        <Text style={styles.subtitle}>Completa tus datos para continuar</Text>
      </View>

      <View style={styles.body}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TextField
            label="Nombre completo"
            placeholder="Tu nombre"
            value={form.nombre}
            onChangeText={update('nombre')}
          />

          <Text style={styles.fieldLabel}>Documento de identidad</Text>
          <View style={styles.chipsRow}>
            {TIPOS_DOCUMENTO.map((tipo) => {
              const active = tipoDocumento === tipo.id;
              return (
                <TouchableOpacity
                  key={tipo.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setTipoDocumento(tipo.id)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{tipo.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TextField
            label="Número de documento"
            placeholder="1234567890"
            keyboardType="number-pad"
            value={form.numeroDocumento}
            onChangeText={update('numeroDocumento')}
          />

          <TextField
            label="Nacionalidad"
            placeholder="Ej. Colombiana"
            value={form.nacionalidad}
            onChangeText={update('nacionalidad')}
          />

          <Text style={styles.fieldLabel}>Fecha de nacimiento</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text style={[styles.dateButtonText, !fechaNacimiento && styles.datePlaceholder]}>
              {formatFecha(fechaNacimiento)}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={fechaNacimiento ?? new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onValueChange={onDateChange}
              onDismiss={() => setShowDatePicker(false)}
            />
          )}
          {Platform.OS === 'ios' && showDatePicker && (
            <TouchableOpacity style={styles.dateDone} onPress={() => setShowDatePicker(false)}>
              <Text style={styles.dateDoneText}>Listo</Text>
            </TouchableOpacity>
          )}

          <TextField
            label="Teléfono"
            placeholder="300 000 0000"
            keyboardType="phone-pad"
            value={form.telefono}
            onChangeText={update('telefono')}
          />
          <TextField
            label="Correo electrónico"
            placeholder="nombre@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={update('email')}
          />
          <TextField
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            value={form.password}
            onChangeText={update('password')}
          />

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAceptaTerminos((prev) => !prev)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, aceptaTerminos && styles.checkboxChecked]}>
              {aceptaTerminos ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.termsText}>
              Acepto los Términos y Condiciones y la Política de tratamiento de datos personales de
              Lookify
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="Crear cuenta"
            onPress={handleSubmit}
            disabled={!aceptaTerminos}
            style={styles.submitButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
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
    textAlign: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  chipText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  dateButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  datePlaceholder: {
    color: colors.textMuted,
  },
  dateDone: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  dateDoneText: {
    color: colors.honey,
    fontWeight: '600',
    fontSize: 14,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  submitButton: {
    marginBottom: 0,
  },
});
