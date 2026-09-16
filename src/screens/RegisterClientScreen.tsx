// src/screens/RegisterClientScreen.tsx
// Formulario de registro para Cliente: corto, sin verificación pendiente.

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import Button from '../components/Button';
import TextField from '../components/TextField';

export default function RegisterClientScreen() {
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', password: '' });

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    // TODO: POST /auth/register/client con { ...form }
    console.log('Registrar cliente', form);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta de cliente</Text>
        </View>

        <View style={styles.body}>
          <TextField label="Nombre completo" placeholder="Tu nombre" value={form.nombre} onChangeText={update('nombre')} />
          <TextField label="Teléfono" placeholder="300 000 0000" keyboardType="phone-pad" value={form.telefono} onChangeText={update('telefono')} />
          <TextField label="Correo electrónico" placeholder="nombre@correo.com" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={update('email')} />
          <TextField label="Contraseña" placeholder="••••••••" secureTextEntry value={form.password} onChangeText={update('password')} />

          <Button label="Crear cuenta" onPress={handleSubmit} style={{ marginTop: spacing.md }} />
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
  body: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
  },
});
