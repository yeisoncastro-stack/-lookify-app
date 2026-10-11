# Contratos backend — App Profesional (pantallas 3–6)

Documento de referencia para implementación server-side. El frontend mock valida las mismas reglas; el servidor **debe revalidar todo**.

## Pantalla 3 — Servicios

### GET `/api/v1/catalogo/servicios`
- **Respuesta 200:** catálogo por categoría (ids oficiales del admin).
- **Errores:** `500`.

### PUT `/api/v1/profesionales/solicitudes/:id/servicios`
- **Body:** `{ "servicioIds": string[] }` (mínimo 1, ids válidos del catálogo).
- **Respuesta 200:** `{ solicitudId, servicioIds, onboardingPaso: "CERTIFICADOS" }`.
- **Errores:** `404` `SOLICITUD_NO_ENCONTRADA`, `400` `SERVICIO_INVALIDO` / `VALIDATION`.

## Pantalla 4 — Certificados

### GET `/api/v1/profesionales/solicitudes/:id/certificados`
- **Respuesta 200:** lista de certificados (metadatos + URL firmada o id de archivo).

### POST `/api/v1/profesionales/solicitudes/:id/certificados` (multipart)
- **Campos:** archivo + JSON (`nombreTipo`, `entidadEmisora`, `fechaEmision?`, `servicioIds[]`).
- **Validación servidor:** MIME real (JPG/PNG/PDF), máx. **5 MB**, `servicioIds` ⊆ servicios elegidos, ≥1 servicio, máx. **3 certificados por servicio** (certificado multi-servicio cuenta en cada uno).
- **Errores:** `400` `ARCHIVO_INVALIDO`, `ARCHIVO_MUY_GRANDE`, `LIMITE_CERTIFICADOS_SERVICIO`, `SERVICIO_INVALIDO`, `VALIDATION`.

### PATCH `/api/v1/profesionales/solicitudes/:id/certificados/:certificadoId`
- Mismas reglas que POST (excluyendo el certificado editado al contar límites).

### DELETE `/api/v1/profesionales/solicitudes/:id/certificados/:certificadoId`

### POST `/api/v1/profesionales/solicitudes/:id/enviar-verificacion`
- **Reglas:** todo-o-nada — cada servicio elegido con **1–3** certificados.
- **Efecto:** `estadoSolicitud = EN_REVISION`; borrar rechazo previo y estado de activación pendiente.
- **Errores:** `400` `SERVICIO_SIN_CERTIFICADO`.

## Pantalla 5 — Verificación y activación

**Nota:** ningún endpoint devuelve el código de activación en claro. El campo `codigoActivacionDemo` del mock TypeScript **no existe** en respuestas HTTP.

### GET `/api/v1/profesionales/solicitudes/:id/estado-verificacion`
- **Respuesta 200:** `estadoSolicitud`, `emailEnmascarado` (ya enmascarado), resumen envío, rechazo si aplica, flags de activación (`codigoExpirado`, `bloqueadoHasta`, `reenvioDisponibleEn`, `reenviosRestantes`, `sinSalidaActivacion`).
- **Nota:** el primer código tras aprobación lo genera el servidor (correo); la app solo **reenvía**.

### POST `/api/v1/profesionales/solicitudes/:id/corregir-certificados`
- **Efecto:** `DOCUMENTOS_PENDIENTES`, conservar certificados; devolver motivo anterior como aviso informativo en pantalla 4.
- **Errores:** `400` si no está `RECHAZADO`.

### POST `/api/v1/profesionales/solicitudes/:id/activacion/reenviar-codigo`
- **Reglas:** cooldown **60 s**, máx. **3 reenvíos**; invalida código anterior; nuevo código 6 dígitos, vigencia **10 min**.
- **Errores:** `429`/`400` `REENVIO_NO_DISPONIBLE`, `REENVIOS_AGOTADOS`, `BLOQUEO_TEMPORAL`.

### POST `/api/v1/profesionales/solicitudes/:id/activacion/validar-codigo`
- **Body:** `{ "codigo": "123456" }`.
- **Reglas:** hash en servidor, un solo uso, máx. **5 intentos** → bloqueo **15 min**; mensajes **genéricos** (`CODIGO_INVALIDO` / `CODIGO_EXPIRADO` sin filtrar existencia).
- **Éxito:** marca profesional activado; emite sesión/JWT con claim `activado=true`. Hasta entonces endpoints del panel → **403**.

### Caso sin salida
- Reenvíos agotados + código expirado: UI contacto soporte. **Admin** puede reiniciar activación (nuevo código, reset contadores) vía panel interno (endpoint TBD, p. ej. `POST /admin/profesionales/:id/reiniciar-activacion`).

## Seguridad código de activación (requisito backend)

- Generación en servidor (CSPRNG), almacenamiento **hash** (nunca claro), un solo uso, invalidar al emitir nuevo.
- Vigencia 10 min; 5 intentos fallidos → bloqueo 15 min; reenvío 60 s, máx. 3.
- Rate limit por solicitud, cuenta e IP.
- Auditoría: aprobación, envío código, intentos fallidos, activación exitosa.

## Pantalla 6 — Panel principal

Requisito transversal: endpoints del panel exigen JWT de profesional con **`estadoSolicitud = APROBADO`** y **`activado = true`**. Si no → **403** `PROFESIONAL_NO_HABILITADO` (el servidor **revalida**; no confiar en la UI).

### GET `/api/v1/profesionales/me/panel`
- **Respuesta 200:** `{ nombre, calificacionPromedio | null, totalResenas, disponibilidad: "DISPONIBLE" | "OCUPADO", resumenDia: { serviciosRealizados, ingresosCop }, serviciosOfrecidos: [{ servicioId, nombre, duracionMin, precioBaseCop }], fotoPerfil: { urlPublica } | null, ultimasResenas: [{ autor, texto, estrellas }] }`.
- **`calificacionPromedio`:** `null` si `totalResenas === 0`.
- **Errores:** `401`, `403` `PROFESIONAL_NO_HABILITADO`, `404` si la cuenta no existe.

### PATCH `/api/v1/profesionales/me/disponibilidad`
- **Body:** `{ "disponibilidad": "DISPONIBLE" | "OCUPADO" }`.
- **Reglas servidor:** solo **`DISPONIBLE`** si aprobado **y** activado; la app ya pidió permiso de ubicación en primer plano — el backend puede exigir última ubicación reciente vía `PUT .../ubicacion` en una fase posterior. **`OCUPADO`** siempre permitido.
- **Inactividad / heartbeat:** el servidor debe forzar **`OCUPADO`** tras timeout sin heartbeat (p. ej. cierre de sesión, app en background prolongado, o `PATCH` periódico no recibido). Documentar SLA TBD en ops.
- **Efecto logout:** al invalidar sesión/JWT → marcar profesional **OCUPADO** (refuerzo del mock `registrarCierreSesion`).
- **Respuesta 200:** `{ disponibilidad }`.
- **Errores:** `403` `PROFESIONAL_NO_HABILITADO`, `400` `VALIDATION`.

### POST `/api/v1/profesionales/me/foto-perfil` (multipart)
- **Campo:** archivo imagen (JPG/PNG).
- **Validación servidor:** MIME **real** (magic bytes), máx. **5 MB**, recorte cuadrado recomendado en cliente; **rechazar** si no cumple.
- **Flujo producto:** la foto queda en estado **pendiente de revisión admin**; **no** es visible al cliente en oferta/matching hasta aprobación. Respuesta incluye `estadoFoto: "PENDIENTE_REVISION" | "APROBADA" | "RECHAZADA"` y URL solo si aprobada (o URL privada para el profesional mientras revisa).
- **Errores:** `400` `ARCHIVO_INVALIDO`, `ARCHIVO_MUY_GRANDE`, `403` `PROFESIONAL_NO_HABILITADO`.

### GET `/api/v1/profesionales/me/resenas?limit=3`
- **Respuesta 200:** `{ calificacionPromedio, totalResenas, items: [{ autor, texto, estrellas, creadoEn }] }`.
- **Errores:** `403` `PROFESIONAL_NO_HABILITADO`.

### PUT `/api/v1/profesionales/me/ubicacion` (futuro — matching en vivo)
- **Body:** `{ "latitude": number, "longitude": number, "accuracyM": number?, "capturedAt": ISO8601 }`.
- **Uso previsto:** enviar posición cuando el profesional está **DISPONIBLE** (tras permiso en app); rate limit y retención acotada (política de datos).
- **Nota MVP frontend:** hoy solo se verifica permiso; **no** implementar en app hasta acordar frecuencia y privacidad.
- **Errores:** `403` si no habilitado o no disponible, `400` `VALIDATION`.
