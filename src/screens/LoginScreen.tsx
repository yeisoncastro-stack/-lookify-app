// src/screens/LoginScreen.tsx
// Pantalla 1 del flujo: Login / Registro.
// El toggle superior alterna entre "Ingresar" y "Crear cuenta".
// Cuando el usuario presiona "Crear cuenta", navegamos a AccountTypeScreen
// (ahí se elige Cliente o Profesional) en vez de mostrar el form aquí mismo.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme/colors';
import Button from '../components/Button';
import TextField from '../components/TextField';

// Cuando conectes react-navigation, reemplaza esto por el tipo real de tu stack.
interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // TODO: reemplazar con la llamada real a tu API de autenticación
      // await api.post('/auth/login', { email, password });
      console.log('Login con', email);
    } catch (error) {
      console.error('Error al iniciar sesión', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newTab: 'login' | 'register') => {
    setTab(newTab);
    if (newTab === 'register') {
      navigation.navigate('AccountType');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header de marca */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>L</Text>
          </View>
          <Text style={styles.brand}>Lookify</Text>
          <Text style={styles.tagline}>Belleza a un toque de distancia</Text>
        </View>

        {/* Tarjeta de formulario */}
        <View style={styles.card}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, tab === 'login' && styles.tabActive]}
              onPress={() => handleTabChange('login')}
            >
              <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>
                Ingresar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'register' && styles.tabActive]}
              onPress={() => handleTabChange('register')}
            >
              <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>
                Crear cuenta
              </Text>
            </TouchableOpacity>
          </View>

          <TextField
            label="Correo electrónico"
            placeholder="nombre@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.forgotWrap}>
            <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <Button label="Ingresar" onPress={handleLogin} loading={loading} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o continúa con</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  scroll: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: 48,
    paddingHorizontal: spacing.lg,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.honey,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.navy,
  },
  brand: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
  },
  tagline: {
    fontSize: 13,
    color: colors.textOnNavyMuted,
    marginTop: spacing.xs,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.beige,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.navy,
  },
  tabText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgot: {
    fontSize: 12,
    color: colors.honey,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 11,
    color: colors.textMuted,
    marginHorizontal: spacing.sm,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  socialText: {
    fontSize: 13,
    color: colors.navy,
    fontWeight: '500',
  },
});
