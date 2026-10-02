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

Validación UX en `src/utils/validators.ts`: correo con formato válido (trim en
correo); contraseña obligatoria sin trim (`length > 0`). Errores por campo tras
`onBlur` vía `TextField` (`error`). «Ingresar» deshabilitado hasta que ambos
campos sean válidos. Login simulado contra `src/data/mockUsers.ts` (comparación
de correo sin distinguir mayúsculas; contraseña sí distingue). Cuenta de prueba:
`cliente@lookify.test` / `Lookify123`. Si falla: «Correo o contraseña incorrectos»;
si acierta: `navigation.reset` a Home.

### 2. Selección de tipo de cuenta — `src/screens/AccountTypeScreen.tsx`
Se le agregó el header con logo, marca y slogan igual que en Login. El header
quedó de altura natural (sin `flex`) porque fijarlo en `flex: 2` recortaba la
tarjeta de profesional y el botón Continuar fuera de la pantalla. El cuerpo es
un `ScrollView` con `flexGrow: 1` y `justifyContent: 'space-between'`: tarjetas
y Continuar agrupados arriba, el link "¿Ya tienes cuenta?" anclado abajo.

### 3. Registro de cliente — `src/screens/RegisterClientScreen.tsx`
Formulario con nombre, documento (C.C. / Pasaporte), nacionalidad, fecha de
nacimiento, teléfono, correo, contraseña, **confirmar contraseña** y términos.
Reglas en `validators.ts` (trim en nombre, documento, nacionalidad, teléfono y
correo; **sin trim** en contraseñas). Edad mínima 18 años (fecha completa).
Correo duplicado (incluida la demo): «Este correo ya está registrado». «Crear
cuenta» deshabilitado hasta formulario válido + términos. Errores tras `onBlur`
(fecha al elegir/cerrar el selector). Registro exitoso: `registerMockUser` en
memoria (correo en minúsculas + nombre) y `reset` a Home. Usa
`@react-native-community/datetimepicker` con `onValueChange` + `onDismiss`.

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

### 6. Buscando profesional — `src/screens/MatchingScreen.tsx`
Fondo navy, ícono de búsqueda (pulso), checklist de 3 pasos simulados
(`MOCK_STEP_MS` ≈ 1,5 s; la UI menciona la ventana de 30 s del profesional).
Parámetros: `categoriaId`, `categoriaNombre`, `servicioId`, `radioKm` (3 | 6),
`rejectionCount`, `rejectedIds`. Candidatos vía `filtrarCandidatosMatching`
(misma categoría, `verificado`, `estado === 'DISPONIBLE'`, distancia ≤ radio,
sin rechazados). Si `rejectionCount >= 3` o no hay candidatos → ampliar a 6 km /
cancelar sin costo (sin checklist). Éxito → `replace('ProfessionalOffer', …)` con
`distanciaKm` redondeada a 1 decimal (`redondearDistanciaKm`). Alerta compartida
`promptCancelarSolicitud`; «Seguir buscando» reanuda el checklist donde iba.

### 7. Oferta de profesional — `src/screens/ProfessionalOfferScreen.tsx`
Fondo beige, tarjeta con acento honey: perfil, portafolio, reseña destacada y
desglose vía `src/utils/pricing.ts` (`formatCOP`). `distanciaKm` de la ruta (1 decimal)
para UI, domicilio y params; ETA con `VELOCIDAD_ESTIMADA_KM_H` en `constants/geo.ts`
(mín. 1 min). «Aceptar» → `replace('Tracking', …)` con `allowExitRef` antes del
`replace`. «Buscar otro» → `allowExitRef` +
`replace('Matching', …)` con rechazo. Atrás/gesto: `promptCancelarSolicitud` (cancelación
sin costo). Datos inválidos → `reset` Home.

### 8. Seguimiento en vivo — `src/screens/TrackingScreen.tsx`
Mapa **`MapView` + `PROVIDER_DEFAULT`** (no placeholder), marcadores cliente (navy) y
profesional (honey). En Expo Go (Android) el mapa puede verse en blanco por la API key
embebida vencida (problema conocido, no es bug del código). Pill «En camino», tarjeta
inferior con ETA/distancia animados (`MOCK_TRACKING_MS` 12 s), profesional + servicio,
Llamar/Mensaje (Alert mock), «Cancelar servicio» y atrás/gesto con
`promptCancelarServicio`. Simulación lineal hacia `MOCK_CLIENT_LOCATION`; al terminar →
`replace('ServiceInProgress', …)`. Cancelar confirma con `reset` Home. Entrada desde
Oferta vía `replace` (Oferta no queda en el stack). **Verificada en celular USB.**

### Cambios transversales aplicados a todas las pantallas
- `SafeAreaView` migrado de `react-native` (deprecado) a
  `react-native-safe-area-context`.
- `SafeAreaProvider` envolviendo el `NavigationContainer` en `AppNavigator.tsx`.
- **Validaciones del frontend:** solo UX; el backend debe volver a validar TODO.
  El login actual es simulado (`mockUsers.ts`). `src/utils/validators.ts` se
  reutilizará en el registro del profesional. `TextField` admite `error?: string`
  (borde y texto con `colors.error`). Si recibe `secureTextEntry`, muestra un botón
  de ojo (`eye-outline` / `eye-off-outline`) con estado `visible` propio por campo;
  `autoCapitalize="none"` y `autoCorrect={false}` por defecto en esos inputs.

---

## 2. Pantallas pendientes

### 9. Servicio en progreso — `src/screens/ServiceInProgressScreen.tsx`
ServiceInProgressScreen.tsx existe como placeholder de navegación desde Tracking;
pantalla 9 real sin construir ni verificar.

### 10. Pago y calificación — `PaymentRatingScreen.tsx`
Ícono de check, resumen de precio desglosado, método de pago, selector de 1 a 5
estrellas y comentario opcional. "Enviar calificación" regresa a Inicio.
Regla de negocio: el desglose es siempre
`precioServicio + precioDomicilio = precioTotal`, **nunca** un único campo de
total.

---

## 3. Decisiones de arquitectura

### Separación de los archivos de datos mock
`mockProfessionals.ts` modela **profesionales** (incluye `EstadoProfesional`,
`verificado`, `ajustePrecio`, reseña/portafolio, coords con ids `{cat}-{km}km-…`)
y `mockServices.ts` modela el **catálogo de servicios**. Se separaron porque son entidades distintas que vendrán de
endpoints distintos cuando exista el backend; mezclarlas obligaría a partir el
archivo más adelante.

`mockProfessionals.ts` exporta el tipo `CategoriaId`, que es la fuente de verdad
de las categorías para todo el proyecto. Los servicios se guardan como
`Record<CategoriaId, MockService[]>` a propósito: si se agrega una categoría al
catálogo y se olvidan sus servicios, TypeScript lo marca como error en vez de
fallar en runtime. El mismo patrón se usa en `HomeScreen` para el mapa de
íconos por categoría.

El precio de un servicio se guarda en el campo `precio` y representa
**únicamente el servicio**; el domicilio se suma en el desglose de la pantalla 7
(`precioServicio + precioDomicilio = precioTotal`) y esos valores viajan por
parámetros hasta la 10, que los muestra de nuevo sin recalcular.

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

**¿Renovar una key propia “gratis” arregla Expo Go?** No. Aunque en Google Cloud
se cree una API key con crédito mensual (Maps exige cuenta de facturación
habilitada en el proyecto, aunque el uso quede dentro del free tier), esa key **no
sustituye** la embebida en el binario de Expo Go. Solo aplica en un binario propio.

La solución para tiles de Google es un **development build** con API key propia:
habilitar *Maps SDK for Android*, poner la key en
`plugins.react-native-maps.androidGoogleMapsApiKey` y compilar con
`npx expo run:android`. Recargar no basta: hay que recompilar el binario.

**Alternativa solo para demo en Expo Go (opcional, no implementada):** capa
`UrlTile` con tiles OpenStreetMap encima de `MapView` + `PROVIDER_DEFAULT`, sin
migrar a MapLibre. Seguimiento (pantalla 8) sigue el mismo criterio que Inicio
hasta que exista development build.

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
- Pantalla 5 → `Matching` con params completos. Matching → `replace('ProfessionalOffer', …)`.
  Oferta → `replace('Matching', …)` al rechazar; al aceptar → `replace('Tracking', …)`.
  Tracking → `replace('ServiceInProgress', …)` al fin del mock de llegada. Params de
  precio y distancia siguen hasta la pantalla 10.
- **`ServiceInProgress`:** placeholder mínimo hasta la pantalla 9 completa.
- **Resuelto (Fase 3):** tras el checklist, `replace` monta ProfessionalOffer; el atrás en
  Oferta pide confirmación salvo salidas con `allowExitRef`. En Tracking (8): mismo patrón
  de atrás; Oferta no debe quedar bajo Tracking en el stack.
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

Tras **ingresar** (Login) o **crear cuenta de cliente** (RegisterClient), la app usa
`navigation.reset` hacia Home: Login y el registro no quedan en el stack (el gesto atrás
desde Inicio no vuelve al formulario). Todavía no hay botón de cerrar sesión; para volver
a Login durante las pruebas hay que **recargar la app** (p. ej. menú de desarrollador de
Expo Go → Reload, o cerrar y reabrir la app).

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

**Regla de cancelación en EN_CAMINO:** pendiente de definir. En UI (pantalla 8):
`promptCancelarServicio` con copy neutro (sin montos ni promesas de costo); mock de
notificación al profesional solo en código.

**Rechazar la oferta (OFERTADO, pantalla 7):** gratis para el cliente, sin penalización
(«Buscar otro profesional» vuelve a matching con contador de rechazos).

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
- **precioDomicilio** = 4.000 + 1.200 × km, con tope de 7.000.
- **Cambio:** domicilio ajustado a base $4.000 + $1.200/km, tope $7.000 (equivalente a un
  pasaje de ida y vuelta del profesional); antes era base $5.000, tope $15.000.
- La comisión de Lookify (15 % sobre el servicio) **no** se muestra al cliente. Base de
  la comisión: **`precioServicio` ya ajustado** (catálogo × ajuste ±20 % en
  `calcularPrecioServicio`), no el precio base del catálogo. Constante
  `COMISION_LOOKIFY` en `pricing.ts` (reservada para backend/admin; el desglose al
  cliente no incluye comisión).
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
