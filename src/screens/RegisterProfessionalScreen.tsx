// src/screens/RegisterProfessionalScreen.tsx
// Formulario de registro para Profesional: más largo, incluye categorías
// que ofrece y queda con verificación pendiente hasta que un admin lo apruebe.

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/colors';
import Button from '../components/Button';
import TextField from '../components/TextField';

const CATEGORIAS = ['Peluquería', 'Barbería', 'Maquillaje', 'Uñas'];

export default function RegisterProfessionalScreen() {
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', password: '' });
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleCategoria = (cat: string) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = () => {
    // TODO: POST /auth/register/professional con { ...form, categorias: categoriasSeleccionadas }
    // El backend debe crear el registro con estado "pendiente de verificación".
    console.log('Registrar profesional', form, categoriasSeleccionadas);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta de profesional</Text>
          <Text style={styles.subtitle}>Tu cuenta quedará pendiente de verificación</Text>
        </View>

        <View style={styles.body}>
          <TextField label="Nombre completo" placeholder="Tu nombre" value={form.nombre} onChangeText={update('nombre')} />
          <TextField label="Teléfono" placeholder="300 000 0000" keyboardType="phone-pad" value={form.telefono} onChangeText={update('telefono')} />
          <TextField label="Correo electrónico" placeholder="nombre@correo.com" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={update('email')} />
          <TextField label="Contraseña" placeholder="••••••••" secureTextEntry value={form.password} onChangeText={update('password')} />

          <Text style={styles.label}>¿Qué servicios ofreces?</Text>
          <View style={styles.chipsRow}>
            {CATEGORIAS.map((cat) => {
              const active = categoriasSeleccionadas.includes(cat);
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => toggleCategoria(cat)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* TODO: agregar aquí selector de fotos de portafolio y documentos de certificación */}

          <Button label="Enviar solicitud" onPress={handleSubmit} style={{ marginTop: spacing.lg }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy },
  scroll: { flexGrow: 1 },
  header: { paddingTop: spacing.xl, paddingBottom: 32, paddingHorizontal: spacing.lg, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', color: colors.white },
  subtitle: { fontSize: 12, color: colors.textOnNavyMuted, marginTop: 4, textAlign: 'center' },
  body: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
  },
  label: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
});
