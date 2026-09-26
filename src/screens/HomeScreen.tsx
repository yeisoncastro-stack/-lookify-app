// src/screens/HomeScreen.tsx
// Pantalla 4: Inicio. Muestra el mapa con profesionales cercanos (datos de
// ejemplo por ahora), un selector de categorías, y el botón "Solicitar ahora".
//
// Usa PROVIDER_DEFAULT (no PROVIDER_GOOGLE) para no depender de una API key
// de Google Maps todavía: en iOS usa Apple Maps, en Android el mapa del
// sistema. Cuando tengas la API key, el cambio es una sola línea (ver TODO).

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { colors, radius, spacing, typography } from '../theme/colors';
import Button from '../components/Button';
import { MOCK_PROFESSIONALS, CATEGORIAS } from '../data/mockProfessionals';

type CategoriaId = (typeof CATEGORIAS)[number]['id'];

interface HomeScreenProps {
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
}

// Ubicación inicial del mapa (Chapinero, Bogotá) — cuando conectemos
// geolocalización real, esto se reemplaza por la ubicación del usuario.
const INITIAL_REGION = {
  latitude: 4.6533,
  longitude: -74.0627,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaId>('peluqueria');

  const profesionalesFiltrados = MOCK_PROFESSIONALS.filter(
    (p) => p.categoria === categoriaActiva
  );

  const handleSolicitar = () => {
    const categoria = CATEGORIAS.find((c) => c.id === categoriaActiva);
    navigation.navigate('ServiceSelection', {
      categoriaId: categoriaActiva,
      categoriaNombre: categoria?.nombre,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con ubicación */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Ubicación actual</Text>
          <Text style={styles.headerLocation}>Chapinero, Bogotá</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Selector de categorías */}
      <FlatList
        data={CATEGORIAS}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
        renderItem={({ item }) => {
          const active = item.id === categoriaActiva;
          return (
            <TouchableOpacity
              style={[styles.categoryChip, active && styles.categoryChipActive]}
              onPress={() => setCategoriaActiva(item.id)}
            >
              <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                {item.nombre}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Mapa */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_DEFAULT}
          // TODO: cuando tengas la API key de Google, cambia a:
          // provider={PROVIDER_GOOGLE} y agrega la key en app.json (Android)
          // / AndroidManifest / Info.plist según la guía de react-native-maps.
          style={styles.map}
          initialRegion={INITIAL_REGION}
        >
          {profesionalesFiltrados.map((p) => (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              title={p.nombre}
              description={`⭐ ${p.calificacion}`}
              pinColor={colors.navy}
            />
          ))}
        </MapView>
      </View>

      {/* Resumen + acción principal */}
      <View style={styles.footer}>
        <Text style={styles.footerCount}>
          {profesionalesFiltrados.length} profesionales cerca de ti
        </Text>
        <Button label="Solicitar ahora" onPress={handleSolicitar} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 11,
    color: colors.textOnNavyMuted,
  },
  headerLocation: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    marginTop: 2,
  },
  notifButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.honey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: {
    fontSize: 16,
  },
  categoriesRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.beige,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.navy,
  },
  categoryText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.white,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  footer: {
    padding: spacing.lg,
  },
  footerCount: {
    ...typography.heading,
    marginBottom: spacing.sm,
  },
});
