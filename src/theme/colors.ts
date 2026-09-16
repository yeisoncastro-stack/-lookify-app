// src/theme/colors.ts
// Paleta oficial de Lookify — definida en el sistema de diseño del Lab 2.
// Cualquier pantalla nueva debe usar estos colores, nunca valores sueltos.

export const colors = {
  // Primario — barras de navegación, botones principales, marca
  navy: '#0F2A4A',
  navyLight: '#1B3A5C',

  // Acento — calificaciones, botones de acción destacada, badges
  honey: '#D9A441',
  honeyLight: '#F5C349',

  // Fondos y neutros
  white: '#FFFFFF',
  beige: '#F4F1EC',
  border: '#E4E1D8',

  // Texto
  textPrimary: '#1E1E1E',
  textSecondary: '#7A7A76',
  textMuted: '#B9B7AE',
  textOnNavy: '#FFFFFF',
  textOnNavyMuted: '#B9C6D6',

  // Estados
  success: '#2E7D32',
  error: '#C62828',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: { fontSize: 22, fontWeight: '700' as const, color: colors.navy },
  subtitle: { fontSize: 14, fontWeight: '400' as const, color: colors.textSecondary },
  heading: { fontSize: 16, fontWeight: '600' as const, color: colors.navy },
  body: { fontSize: 14, fontWeight: '400' as const, color: colors.textPrimary },
  caption: { fontSize: 12, fontWeight: '400' as const, color: colors.textSecondary },
  button: { fontSize: 15, fontWeight: '600' as const },
};
