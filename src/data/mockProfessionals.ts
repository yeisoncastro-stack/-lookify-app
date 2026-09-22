// src/data/mockProfessionals.ts
// Datos de ejemplo (mock) para poder ver la pantalla de Inicio poblada
// mientras el backend real todavía no existe.
// TODO: eliminar este archivo cuando conectemos GET /profesionales/cercanos

export interface MockProfessional {
  id: string;
  nombre: string;
  categoria: 'peluqueria' | 'barberia' | 'maquillaje' | 'unas';
  calificacion: number;
  latitude: number;
  longitude: number;
}

// Coordenadas de ejemplo alrededor de Chapinero, Bogotá.
// Cuando haya backend real, este arreglo se reemplaza por la respuesta de la API.
export const MOCK_PROFESSIONALS: MockProfessional[] = [
  {
    id: '1',
    nombre: 'Mariana Jiménez',
    categoria: 'peluqueria',
    calificacion: 4.9,
    latitude: 4.6533,
    longitude: -74.0627,
  },
  {
    id: '2',
    nombre: 'Andrés Ramírez',
    categoria: 'barberia',
    calificacion: 4.8,
    latitude: 4.6501,
    longitude: -74.0655,
  },
  {
    id: '3',
    nombre: 'Camila Torres',
    categoria: 'maquillaje',
    calificacion: 4.7,
    latitude: 4.6555,
    longitude: -74.0598,
  },
  {
    id: '4',
    nombre: 'Laura Gómez',
    categoria: 'unas',
    calificacion: 5.0,
    latitude: 4.6489,
    longitude: -74.0612,
  },
];

export const CATEGORIAS = [
  { id: 'peluqueria', nombre: 'Peluquería' },
  { id: 'barberia', nombre: 'Barbería' },
  { id: 'maquillaje', nombre: 'Maquillaje' },
  { id: 'unas', nombre: 'Uñas' },
] as const;
