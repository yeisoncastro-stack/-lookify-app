# Lookify — Estado del proyecto

Fase actual: **frontend únicamente** (React Native + Expo SDK 57). El backend se
construye después de cerrar todo el frontend. No hay autenticación real, base de
datos ni llamadas HTTP: todos los datos son mocks locales.

---

## 1. Pantallas construidas y verificadas

Flujo del cliente, en orden de navegación.

### 1. Login — `src/screens/LoginScreen.tsx`
Se eliminó el bloque "o continúa con" junto a los botones de Google y Apple
(y sus 6 estilos huérfanos), se quitó el import sin usar de `typography`, y el
contenido quedó centrado verticalmente dentro de la tarjeta blanca
(`justifyContent: 'center'`) en vez de apilado arriba. La zona navy se amplió a
`flex: 2` contra `flex: 3` de la tarjeta, con el logo a 96 px.

### 2. Selección de tipo de cuenta — `src/screens/AccountTypeScreen.tsx`
Se le agregó el header con logo, marca y slogan igual que en Login. El header
quedó de altura natural (sin `flex`) porque fijarlo en `flex: 2` recortaba la
tarjeta de profesional y el botón Continuar fuera de la pantalla. El cuerpo es
un `ScrollView` con `flexGrow: 1` y `justifyContent: 'space-between'`: tarjetas
y Continuar agrupados arriba, el link "¿Ya tienes cuenta?" anclado abajo.

### 3. Registro de cliente — `src/screens/RegisterClientScreen.tsx`
Se amplió de 4 a 8 campos: nombre, tipo de documento (C.C. / Pasaporte) con su
número, nacionalidad, fecha de nacimiento, teléfono, correo, contraseña y el
checkbox obligatorio de términos. El botón "Crear cuenta" está deshabilitado
mientras el checkbox no esté marcado. Usa `@react-native-community/datetimepicker`
con la API vigente (`onValueChange` + `onDismiss`, no el `onChange` deprecado).

### 4. Inicio — `src/screens/HomeScreen.tsx`
Se corrigió el estirado vertical de los chips de categoría, causado por dos
cosas a la vez: el `FlatList` horizontal sin `style` crecía verticalmente, y su
contenedor de contenido estiraba cada chip con el `alignItems: 'stretch'`
implícito. Se agregaron los íconos de `@expo/vector-icons` encima del texto y se
corrigió la pluralización del contador ("1 profesional" vs "2 profesionales").

### 5. Selección de servicio — `src/screens/ServiceSelectionScreen.tsx`
Pantalla nueva. Recibe `categoriaId` y `categoriaNombre` por parámetros de
navegación desde Inicio, muestra el nombre de la categoría en el header y lista
los servicios de esa categoría con nombre, duración y precio. Selección única
por radio; "Continuar" deshabilitado hasta elegir uno.

### Cambios transversales aplicados a todas las pantallas
- `SafeAreaView` migrado de `react-native` (deprecado) a
  `react-native-safe-area-context`.
- `SafeAreaProvider` envolviendo el `NavigationContainer` en `AppNavigator.tsx`.

---

## 2. Pantallas pendientes

### 6. Buscando profesional — `MatchingScreen.tsx`
Pantalla de espera con fondo navy, ícono de búsqueda y checklist de 3 pasos
(Solicitud enviada / Buscando candidatos / Preparando oferta), más un botón
"Cancelar solicitud". Tras unos segundos simulados con `setTimeout` (no hay
backend), navega sola a la pantalla 7.

### 7. Oferta de profesional — `ProfessionalOfferScreen.tsx`
Perfil de un profesional de ejemplo: avatar, nombre, calificación, reseñas,
grid de portafolio y una reseña destacada. Dos acciones: "Aceptar profesional"
lleva a la pantalla 8, "Buscar otro profesional" regresa a la 6.

### 8. Seguimiento en vivo — `TrackingScreen.tsx`
Mapa con `react-native-maps` y `PROVIDER_DEFAULT` (igual que Inicio) con un
marcador del profesional y otro del cliente. Tarjeta inferior con tiempo
estimado, distancia, datos del profesional, botones de llamar y mensaje, y
"Cancelar servicio". Tras un tiempo simulado pasa a la pantalla 9.

### 9. Servicio en progreso — `ServiceInProgressScreen.tsx`
Fondo navy, cronómetro circular (puede ser una barra de progreso simple por
ahora) y checklist de 3 estados: Profesional llegó / Servicio iniciado /
Servicio finalizado. Al completarse navega a la pantalla 10.

### 10. Pago y calificación — `PaymentRatingScreen.tsx`
Ícono de check, resumen de precio desglosado, método de pago, selector de 1 a 5
estrellas y comentario opcional. "Enviar calificación" regresa a Inicio.
Regla de negocio: el desglose es siempre
`precioServicio + precioDomicilio = precioTotal`, **nunca** un único campo de
total.

---

## 3. Decisiones de arquitectura

### Separación de los archivos de datos mock
`mockProfessionals.ts` modela **profesionales** (nombre, categoría,
calificación, coordenadas) y `mockServices.ts` modela el **catálogo de
servicios**. Se separaron porque son entidades distintas que vendrán de
endpoints distintos cuando exista el backend; mezclarlas obligaría a partir el
archivo más adelante.

`mockProfessionals.ts` exporta el tipo `CategoriaId`, que es la fuente de verdad
de las categorías para todo el proyecto. Los servicios se guardan como
`Record<CategoriaId, MockService[]>` a propósito: si se agrega una categoría al
catálogo y se olvidan sus servicios, TypeScript lo marca como error en vez de
fallar en runtime. El mismo patrón se usa en `HomeScreen` para el mapa de
íconos por categoría.

El precio de un servicio se guarda en el campo `precio` y representa
**únicamente el servicio**; el domicilio se suma aparte en la pantalla 10.

### Patrón de espaciado
Regla según el tipo de contenido de la pantalla:

| Tipo de pantalla | Patrón |
|---|---|
| Formulario largo o lista que puede crecer | `flexGrow: 1` en el `contentContainerStyle` del `ScrollView`, sin forzar `justifyContent` |
| Poco contenido fijo + elemento secundario abajo | Agrupar el bloque principal en un `View` y usar `justifyContent: 'space-between'` en el padre |
| Una sola tarjeta sin elemento secundario | `justifyContent: 'center'` para centrar verticalmente |

Caso aparte, ya resuelto pero fácil de repetir: **un `FlatList` horizontal
necesita `flexGrow: 0`**, porque por dentro es un `ScrollView` y si no se limita
crece verticalmente y estira sus hijos. Conviene además darle
`alignItems: 'center'` al `contentContainerStyle`.

Otra lección de este proyecto: no asignar `flex` fijo a un header cuyo contenido
puede variar entre pantallas. En `AccountTypeScreen` un `flex: 2` copiado de
Login dejó las tarjetas y el botón fuera de la pantalla.

### Áreas seguras
`SafeAreaView` viene de `react-native-safe-area-context`, nunca de
`react-native` (deprecado). `SafeAreaProvider` envuelve el `NavigationContainer`
en `AppNavigator.tsx`, que es el montaje que documenta la librería y lo que da
contexto a los hooks de insets.

### Categorías oficiales
Coinciden con el catálogo del admin y no deben divergir:

| `id` | Nombre visible | Ícono (MaterialCommunityIcons) |
|---|---|---|
| `peluqueria` | Peluquería | `content-cut` |
| `barberia` | Barbería | `razor-double-edge` |
| `maquillaje` | Maquillaje | `lipstick` |
| `unas` | Uñas | `hand-back-right-outline` |

Los nombres de íconos se verificaron contra el glyphmap real instalado, no se
asumieron.

---

## 4. Pendientes técnicos conocidos

### El mapa se ve vacío en Expo Go (Android)
El mapa dibuja su fondo y el logo de Google, pero los tiles nunca cargan y los
pines no aparecen. **No es un problema del código ni de conectividad.** La causa
es que la API key de Google Maps que Expo Go trae embebida para Android en
SDK 57 está vencida, y una app no puede sobreescribirla desde su propio
`app.json` porque Expo Go usa la suya.

La solución es un **development build** con una API key propia:
habilitar *Maps SDK for Android* en Google Cloud Console, poner la key en
`plugins.react-native-maps.androidGoogleMapsApiKey` y compilar con
`npx expo run:android`. Recargar no basta: hay que recompilar el binario.

### Emulador de Android Studio
El emulador va muy lento en el equipo de desarrollo y no resultó usable. La vía
que sí funciona es el **celular físico por cable USB** con Expo Go:

```bash
adb -s <serial> reverse tcp:8081 tcp:8081
adb -s <serial> shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081" host.exp.exponent
```

`adb` está en `%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe` y no está en
el PATH, hay que invocarlo con la ruta completa. Si hay un emulador apagado
además del celular, `adb` responde `more than one device/emulator` y hay que
pasarle `-s <serial>`.

Importante: al presionar `a` en la terminal de Expo se abre la app por **Wi-Fi**
(`exp://192.168.x.x:8081`), no por USB. Si la red falla, hay que abrirla
manualmente con el comando de arriba apuntando a `127.0.0.1`.

`npx expo start --tunnel` **no funciona** en este equipo: ngrok no llegó a
levantar y el proceso se queda en `Starting Metro Bundler`.

### La web no soporta el mapa
`react-native-maps` no tiene soporte para `react-native-web`. En el navegador la
pantalla de Inicio falla con
`codegenNativeComponent is not a function`. Las pantallas sin mapa sí funcionan
en web. Si se necesita probar Inicio en navegador, habría que crear un
`HomeScreen.web.tsx` con un placeholder.

### Navegación
- La pantalla 5 navega a `Matching`, que aún no existe: en consola aparece
  `The action 'NAVIGATE' with payload {"name":"Matching"} was not handled`.
  Es intencional, sirve de recordatorio hasta construir la pantalla 6.
- El stack usa `headerShown: false`; el retorno visual está en
  `src/components/BackHeader.tsx` (MaterialCommunityIcons `arrow-left`, área táctil
  44×44, `accessibilityLabel="Volver"`). Props: `title?`, `onBack?` (default
  `navigation.goBack()`), `variant?: 'light' | 'dark'`, `rightSlot?`. Sin flecha si
  no hay `onBack` y `navigation.canGoBack()` es false.

| Pantalla | BackHeader |
|----------|------------|
| 1 Login | No (raíz) |
| 2 AccountType | Sí, `variant="dark"` |
| 3 RegisterClient | Sí, `variant="dark"` |
| 4 Home | No (raíz post-login) |
| 5 ServiceSelection | Sí, `title` = nombre de categoría, `variant="dark"` |
| 6–10 | No (cancelar o acciones propias) |

En pantallas 2, 3 y 5 el gesto o botón físico de Android también retrocede; el stack
nativo no muestra header de React Navigation.

### Registro de profesional
`RegisterProfessionalScreen.tsx` existe y es alcanzable desde la pantalla 2,
pero **no forma parte de las 10 pantallas del flujo cliente** y no se ha
revisado contra ninguna spec. Sigue con el layout viejo (formulario y botón
dentro de un único `ScrollView`), así que arrastra el problema de espacio vacío
abajo que ya se corrigió en las demás.

---

## 5. Reglas de negocio del flujo de solicitud

### Orden de aceptación

El profesional acepta **primero** (App Profesional, pantalla «Solicitud entrante»,
ventana de 30 s). Solo cuando acepta, se le ofrece al cliente (pantalla 7), que
revisa calificación, reseñas, portafolio y precio, y confirma o rechaza. El cliente
**nunca** ve un profesional que no haya aceptado.

### Máquina de estados

```
SOLICITADO
  → BUSCANDO_PROFESIONAL (se envía la solicitud al candidato disponible más cercano)
     → [profesional no responde en 30 s] → siguiente candidato; sigue en BUSCANDO_PROFESIONAL
     → [profesional acepta] → OFERTADO (cliente ve perfil, reseñas, portafolio y precio)
        → ACEPTADO (por el cliente) → EN_CAMINO → INICIADO → FINALIZADO
        → RECHAZADO_POR_CLIENTE → vuelve a BUSCANDO_PROFESIONAL (si no se llegó al límite)
  → CANCELADO (en cualquier punto antes de INICIADO)
```

### Regla de los 30 s

Si el profesional no responde, se pasa al siguiente candidato y el profesional sigue
en estado **Disponible**. No se le penaliza ni se le marca **Ocupado**.

### Radio de búsqueda

Radio inicial: **3 km**. Se puede ampliar **una sola vez** hasta **6 km**, que es el
tope absoluto.

### Límite de rechazos

Máximo **3 rechazos del cliente por radio**. Al llegar a 3:

- Si el radio es **3 km** → opciones «Ampliar radio a 6 km» (el contador se reinicia a
  0) o «Cancelar sin costo».
- Si ya está en **6 km** → solo «Cancelar sin costo».

En el frontend (sin backend) se simula pasando `rejectionCount`, `radioKm` y
`rejectedIds` por parámetros de navegación entre las pantallas 6 y 7.

### Precio en la oferta

La pantalla 7 muestra el desglose **antes** de aceptar:

`precioServicio + precioDomicilio = precioTotal` (nunca un solo campo de total).

- **precioServicio** = precio base del servicio × ajuste del profesional (±20 %, entre
  0,8 y 1,2).
- **precioDomicilio** = 5.000 + 1.200 × km, con tope de 15.000.
- La comisión de Lookify (15 % sobre el servicio) **no** se muestra al cliente.
- Esos mismos valores viajan por parámetros hasta la pantalla 10; no se recalculan de
  otra forma.

### Otras decisiones

- El panel Admin **no existe en código**: solo mockups, que son la fuente de verdad de
  diseño (categorías, precios de Barbería, verificación todo-o-nada) hasta que se
  construya.
- Las **10 pantallas oficiales** de App Profesional: Login, Tipo de cuenta, Registro
  datos personales, Selección de servicios, Carga de certificados, Estado de
  verificación, Panel principal (incluye el toggle Disponible/Ocupado), Solicitud
  entrante, Servicio en curso, Historial/ingresos (incluye la gestión de portafolio).
- Las duraciones y precios de `mockServices.ts` son **oficiales**. Catálogo vigente:

| Categoría | Servicio | Precio (COP) | Duración (min) |
|-----------|----------|--------------|----------------|
| Peluquería | Corte de dama | 35.000 | 45 |
| Peluquería | Cepillado | 28.000 | 40 |
| Peluquería | Tinte y color | 85.000 | 120 |
| Peluquería | Peinado para evento | 60.000 | 60 |
| Barbería | Corte clásico | 25.000 | 30 |
| Barbería | Corte y barba | 38.000 | 45 |
| Barbería | Perfilado de barba | 15.000 | 20 |
| Barbería | Corte infantil | 20.000 | 30 |
| Maquillaje | Básico | 45.000 | 45 |
| Maquillaje | Especial | 75.000 | 60 |
| Maquillaje | Premium | 110.000 | 90 |
| Uñas | Básico | 20.000 | 45 |
| Uñas | Especial | 35.000 | 60 |
| Uñas | Premium | 50.000 | 90 |

IDs en código: `pel-1`…`pel-4`, `bar-1`…`bar-4`, `maq-1`…`maq-3`, `una-1`…`una-3`.
