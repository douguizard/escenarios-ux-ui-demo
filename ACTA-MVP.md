# ACTA DE ALCANCE MVP — Epic: Escenarios

**Proyecto:** Naowee — Sistema Único de Información del Deporte (SUID)
**Epic:** Escenarios (Registro, revisión y gestión de sedes y escenarios deportivos)
**Fecha:** 15 de abril de 2026
**Versión:** 1.23.0
**Roles involucrados:** Ciudadano (Gestor de Escenarios), Revisor del Ministerio del Deporte

---

## 1. Resumen Ejecutivo

El MVP de Escenarios permite a un ciudadano registrar sedes y escenarios deportivos en el SUID a través de un formulario público multipaso. El registro pasa por un flujo de revisión institucional donde un revisor del Ministerio del Deporte evalúa la documentación adjunta documento por documento, con la posibilidad de aprobar el registro completo o rechazar documentos específicos con notas de motivo. El sistema mantiene trazabilidad completa del ciclo de vida de cada registro mediante un historial de eventos auditable y permite al ciudadano corregir y reenviar registros rechazados.

El módulo cubre 12 pantallas, 4 estados de registro, evaluación documento por documento, persistencia en navegador (localStorage) y un design system institucional con la marca del Ministerio del Deporte y SUID.

---

## 2. Historias de Usuario — Ciudadano (Gestor de Escenarios)

### HU-CI-01: Login y Recuperación de Contraseña

**Como** ciudadano
**quiero** acceder al SUID con mis credenciales o recuperar mi contraseña
**para** poder registrar y gestionar mis sedes deportivas.

**Criterios de aceptación:**
- Pantalla de login con carrusel de 5 slides motivacionales (deporte colombiano)
- Campos: correo electrónico (validación email), contraseña (toggle visibilidad)
- Validación inline con helpers contextuales (vacío, formato inválido)
- Botón "Recuperar contraseña" → flujo de recuperación
- Botón "Crear cuenta" en header → redirige a registro
- Header institucional: logos Ministerio del Deporte + SUID con divider
- Botón "Iniciar sesión" deshabilitado hasta validación correcta

---

### HU-CI-02: Landing del Registro de Escenarios

**Como** ciudadano
**quiero** entender qué información necesito antes de iniciar el registro
**para** preparar la documentación requerida.

**Criterios de aceptación:**
- Tarjeta intro con título, descripción y CTA "Iniciar registro"
- Listado claro de documentos requeridos
- Texto legal sobre uso de los datos
- Header con opción "¿Ya tienes cuenta? Inicia sesión"

---

### HU-CI-03: Wizard de Registro — Paso 1: Pre-validación

**Como** ciudadano
**quiero** ingresar los datos básicos del escenario
**para** verificar que no exista un registro previo con el mismo número catastral.

**Criterios de aceptación:**
- Wizard con stepper de 3 pasos visibles (Pre-validación, Georreferenciación, Propiedad)
- Campos obligatorios:
  - Nombre del escenario (autocomplete)
  - Departamento (dropdown)
  - Municipio (dropdown dependiente)
  - Número de registro catastral (validación de duplicados)
  - Correo electrónico del responsable (validación email + disponibilidad)
- Componente DS `naowee-message--negative` cuando el catastral ya está registrado
- Helpers contextuales por campo (vacío, inválido, validado)
- Validación bloquea avance al paso 2

**Subfuncionalidades:**
- CTA "Aún no estás registrado? Ir al registro ciudadano" cuando el correo no existe
- Header con scroll-shrink (logos se reducen al hacer scroll)

---

### HU-CI-04: Wizard de Registro — Paso 2: Georreferenciación

**Como** ciudadano
**quiero** ubicar el escenario en un mapa
**para** que el sistema capture la latitud, longitud y dirección.

**Criterios de aceptación:**
- Mapa Leaflet centrado en Colombia
- Marcador draggable
- Captura automática de lat/lon al mover el marcador
- Campos: dirección, corregimiento, zona (urbana/rural)
- Botón "Volver" al paso 1, "Siguiente" al paso 3

---

### HU-CI-05: Wizard de Registro — Paso 2 (alterno): Datos de Propiedad

**Como** ciudadano
**quiero** registrar los datos legales del propietario y la entidad administradora
**para** acreditar la titularidad del escenario.

**Criterios de aceptación:**
- Campos: entidad propietaria, tipo de propiedad (pública/privada/mixta), administradora, tipo de tenencia
- Datos del responsable: nombre, teléfono, correo
- Validación de campos obligatorios

---

### HU-CI-06: Wizard de Registro — Paso 3 (modal): Ficha Técnica + Documentación

**Como** ciudadano
**quiero** completar la ficha técnica del escenario, sus sub-espacios, dotación, disciplinas y documentación
**para** entregar al revisor toda la información necesaria.

**Criterios de aceptación:**
- Modal a pantalla completa (95vw, max 860px) con stepper interno de 3 sub-pasos
- **Sub-paso 1 — Ficha técnica común:**
  - Toggle CAR (Categoría de Alto Rendimiento) Sí/No
  - Tipo de escenario (dropdown con opciones por tipología)
  - Área total, área útil, cubierto/descubierto/mixto
  - Capacidad, año de construcción, estado general
- **Sub-paso 2 — Sub-espacios:**
  - Lista dinámica de sub-espacios con sus fichas específicas
  - Toggle "Compartir disciplinas entre sub-espacios"
  - Toggle "Compartir detalles entre sub-espacios"
  - Asignación de disciplinas por sub-espacio o globales
  - Dotación deportiva por sub-espacio (parametrizable)
- **Sub-paso 3 — Documentación:**
  - 11 slots de documento: 3 fotos (frontal, panorámica, instalaciones) + plano + plano localización + escritura propiedad + 4 conceptos técnicos (bomberos, salud, infraestructura, resolución)
  - Componente `naowee-file-uploader-photo` (variante card-based)
  - Estados: vacío, filled, error
  - Dismiss on hover para reemplazar
- Validación por sub-paso
- Persistencia en cada cambio (no perder datos al cerrar)

**Subfuncionalidades:**
- Diálogo "Guardar borrador" o "Continuar" antes de salir
- Wiggle + scroll automático al primer error de validación
- Modal sticky header con stepper visible

---

### HU-CI-07: Pantalla de Éxito del Registro

**Como** ciudadano
**quiero** confirmación visual de que mi registro fue enviado correctamente
**para** saber qué pasos siguen.

**Criterios de aceptación:**
- Animación de confetti al cargar
- Tarjeta con título "¡Registro enviado!" + descripción del flujo de revisión
- Mock de email de confirmación (visualización del correo que recibirá)
- Botones: "Ir al dashboard" y "Cerrar"
- Logo institucional en el email simulado

---

### HU-CI-08: Dashboard del Ciudadano

**Como** ciudadano
**quiero** ver todas mis sedes registradas con su estado actual
**para** monitorear el progreso de la revisión.

**Criterios de aceptación:**
- 3 modos de visualización vía query param `?mode=`:
  - `empty`: estado vacío con ilustración + CTA "Registrar primer escenario"
  - `single`: 1 registro
  - `multiple`: todos los registros del store
- Tabla con columnas: nombre, ID único, CAR (Sí/No/—), estado, última modificación, acción
- 4 estados con badges DS coherentes:
  - Borrador → `naowee-badge--neutral` (gris) → acción "Editar"
  - En revisión → `naowee-badge--caution` (naranja) → acción "Ver detalle"
  - Activo → `naowee-badge--positive` (verde) → acción "Ver perfil"
  - Rechazado → `naowee-badge--negative` (rojo) → acción "Editar"
- Buscador de texto (nombre, catastral)
- Dropdown filtro por estado
- Paginador
- Botón "Registrar sede o escenario" (CTA principal naranja)
- Click en row enruta según status:
  - Borrador → modal de edición
  - Activo → perfil read-only
  - En revisión / Rechazado → detalle del gestor

**Subfuncionalidades:**
- Botón "Resetear demo" en sidebar (restaura los 4 mock semilla)
- Toast de "Registro enviado a revisión" tras submit del wizard
- Toast de "Borrador guardado" tras guardar incompleto

---

### HU-CI-09: Detalle del Registro (Vista del Gestor)

**Como** ciudadano
**quiero** ver el detalle completo de un registro mío y su estado actual
**para** consultar los documentos cargados, las observaciones del revisor y el historial.

**Criterios de aceptación:**
- 3 tabs: Información general, Documentación, Historial
- Banner superior tipo `naowee-message` según status real:
  - Borrador → informative azul "Borrador — Último guardado el…"
  - En revisión → caution naranja "Registro en revisión — Enviado el…"
  - Activo → positive verde "Registro activo — Aprobado el…"
  - Rechazado → negative rojo "Registro rechazado — Rechazado el…"
- Botón header derecho condicional según estado:
  - Borrador → "Enviar a revisión"
  - Rechazado → "Reenviar a revisión"
  - En revisión / Activo → oculto

**Tab Información general:**
- Datos pre-validación, georreferenciación, propiedad, ficha técnica, sub-espacios, disciplinas, dotación
- Mapa Leaflet readonly con marcador de la ubicación

**Tab Documentación:**
- Tabla de documentos con badge por documento (No cargado / En revisión / Aprobado / Rechazado)
- Panel derecho con preview del documento seleccionado (zoom in/out, descarga)
- Bajo el preview: componente `naowee-message--negative` con el motivo del rechazo + revisor + fecha (solo si el doc fue rechazado)
- Botón "Subir" disponible para documentos no cargados o rechazados (gestor reemplaza)
- Tabla agrupada por sub-espacio si hay múltiples

**Tab Historial:**
- Timeline dinámica desde el store (`d.historial`) ordenada cronológicamente descendente
- Iconos y colores por tipo de evento:
  - Verde + check → aprobaciones, documentos cargados
  - Rojo + X → rechazos
  - Azul + send → envíos a revisión
  - Azul + user → asignaciones de revisor
  - Gris + info → creaciones de registro
  - Naranja + clock → estados intermedios
- Filtros con `naowee-segment` por categoría (Todos, Documentos, Estado, Asignaciones)
- Cada evento muestra: título, descripción, autor, fecha y hora
- Contador de eventos por categoría

---

### HU-CI-10: Reenvío de Registro Rechazado

**Como** ciudadano
**quiero** corregir los documentos rechazados y reenviar el registro a revisión
**para** continuar el proceso de aprobación de mi escenario.

**Criterios de aceptación:**
- Botón "Reenviar a revisión" visible solo cuando `d.status === 'rechazado'`
- Al reenviar:
  - `status` cambia a `revision`
  - `sentAt` se actualiza con timestamp nuevo
  - Documentos rechazados pasan a `pendiente` (revisor los re-evalúa)
  - Documentos previamente aprobados se mantienen `aprobado` (no se re-evalúan)
  - Notas de rechazo previas se limpian
  - Se agrega evento "Reenviado a revisión" al historial
- Toast de confirmación + redirect al dashboard

---

### HU-CI-11: Perfil Activo (Vista Read-Only)

**Como** ciudadano
**quiero** ver una ficha pública estilo Airbnb de mi escenario aprobado
**para** consultar la información tal como otros usuarios la verán.

**Aplica a:** Registros con `status === 'activo'`.

**Criterios de aceptación:**
- Hero section con galería de fotos del escenario
- Datos institucionales (nombre, ID, CAR, ubicación)
- Mapa de georreferenciación
- Sección por sub-espacio: nombre, tipo, ficha técnica, fotos, disciplinas, dotación
- Información de propiedad y administradora
- Documentación aprobada (descargable)
- Sin acciones de edición (read-only)

---

### HU-CI-12: Cambio de Perfil (Ciudadano ↔ Revisor)

**Como** usuario que tiene ambos roles asignados
**quiero** alternar entre las vistas de Gestor y Revisor desde un menú de perfil
**para** acceder a las funcionalidades de cada rol sin volver a iniciar sesión.

**Criterios de aceptación:**
- Pill de perfil en header derecho con avatar (color plano por rol), nombre y rol
- Avatar de Gestor: `#FF7500` (naranja brand), iniciales "JH"
- Avatar de Revisor: `#7c3aed` (morado), iniciales "MA"
- Chevron rota 180° animado al abrir dropdown
- Dropdown con dos opciones marcadas con icono + descripción
- Cambiar rol redirige a la pantalla principal del rol seleccionado

---

## 3. Historias de Usuario — Revisor del Ministerio del Deporte

### HU-RV-01: Dashboard del Revisor

**Como** revisor del Ministerio del Deporte
**quiero** ver todos los registros que requieren revisión, ya aprobados o rechazados
**para** priorizar mi trabajo y dar seguimiento a los casos cerrados.

**Criterios de aceptación:**
- Tabla con columnas: checkbox, escenario o sede, ID único, CAR, estado, última actualización, acciones
- Solo aparecen registros con `status` ≠ borrador (gestores no han enviado borradores)
- Estados visibles: Por revisar (caution), Activo (positive), Rechazado (negative)
- Fecha de "última actualización" muestra `reviewedAt || sentAt || savedAt`
- Sidebar con dos secciones: Documentación, Aprobación
- Buscador de escenario o ID
- Dropdown filtro por estado (Todos, Por revisar, Activos, Rechazados)
- Paginador
- Avatar morado plano "MA" — María Alejandra Gómez

---

### HU-RV-02: Acciones por Registro (Context Menu)

**Como** revisor
**quiero** ver, aprobar o rechazar un registro desde el menú contextual de la fila
**para** actuar rápidamente sin abrir el detalle.

**Criterios de aceptación:**
- Menú contextual en cada fila con tres opciones (icono ⋮):
  - Ver → abre detalle del registro
  - Aceptar → diálogo de confirmación de aprobación
  - Rechazar → diálogo con textarea obligatorio para motivo
- Si el registro ya está activo, solo aparece la opción "Ver"
- Diálogo de aprobación: ícono check verde + título + descripción + Cancelar / Confirmar aprobación
- Diálogo de rechazo: ícono cross naranja + título + descripción + textarea para motivo + Cancelar / Rechazar registro
- Tras confirmar, el registro cambia de estado en el store y la tabla se re-renderiza
- Toast de feedback (verde para aprobado, rojo para rechazado)

---

### HU-RV-03: Acciones en Lote (Bulk Approve / Reject)

**Como** revisor
**quiero** aprobar o rechazar varios registros seleccionados a la vez
**para** acelerar mi trabajo cuando hay registros similares.

**Criterios de aceptación:**
- Checkbox por fila + checkbox "Seleccionar todos" en el header
- Barra de acciones bulk visible cuando hay 1+ seleccionados
- Botones "Aprobar seleccionados" y "Rechazar seleccionados" con icons unificados (check verde, X rojo)
- Diálogo de confirmación bulk muestra cantidad
- Aplica el mismo motivo de rechazo a todos los seleccionados (textarea único)
- Tras la acción, todos los seleccionados cambian de estado en el store
- Toast con cantidad de registros afectados

---

### HU-RV-04: Detalle del Revisor — Layout Lado a Lado

**Como** revisor
**quiero** revisar la documentación de un registro con vista de tabla a la izquierda y preview a la derecha
**para** evaluar cada documento sin perder el contexto.

**Criterios de aceptación:**
- Layout de dos columnas:
  - Izquierda: tabla de documentos agrupados por sección (Fotografías, Planos, Conceptos, Otros)
  - Derecha: panel de preview del documento seleccionado + acciones aprobar/rechazar
- Tabs principales: Información general, Documentación, Historial
- Banner superior según status: Por revisión (caution), Activo (positive), Rechazado (negative)
- Header derecho con dos botones: "Rechazar registro" (link) + "Aprobar registro" (CTA verde)

---

### HU-RV-05: Aprobación / Rechazo de Documento Individual

**Como** revisor
**quiero** aprobar o rechazar cada documento con un motivo específico
**para** dar feedback granular al gestor sobre qué necesita corregir.

**Criterios de aceptación:**
- Click en row de documento → preview en panel derecho con badge de estado
- Botones de acción en panel derecho: Aprobar (verde) / Rechazar (rojo)
- Aprobar:
  - Cambia badge del row a "Aprobado"
  - Persiste `documentacion[id].docStatus = 'aprobado'` + `reviewedAt`
  - Emite evento al historial: "Documento aprobado: {nombre}"
  - Toast verde
- Rechazar:
  - Cambia badge del row a "Rechazado"
  - Habilita textarea de motivo en panel derecho
  - El motivo se persiste en `documentacion[id].notaRechazo` al perder foco
  - Emite evento al historial: "Documento rechazado: {nombre} — {motivo}"
  - Toast rojo
- Estado "Pendiente" inicial cuando el documento fue cargado pero no evaluado
- Bulk approve/reject de documentos seleccionados (checkboxes en filas)

---

### HU-RV-06: Aprobación / Rechazo del Registro Completo

**Como** revisor
**quiero** aprobar o rechazar el registro completo
**para** comunicar la decisión final al gestor.

**Criterios de aceptación:**
- Botón "Aprobar registro" en header derecho (CTA verde):
  - Diálogo de confirmación con descripción del impacto
  - Confirmar → `Store.approve(idx, reviewerName)` → `status='activo'`
  - Toast verde + redirect al dashboard del revisor en 1.2s
- Botón "Rechazar registro" en header derecho (link rojo):
  - Diálogo con textarea obligatorio para motivo general
  - Confirmar → `Store.reject(idx, reviewerName, motivo)` → `status='rechazado'`
  - Motivo se incluye en el evento del historial
  - Toast rojo + redirect en 1.2s
- Si el registro ya está activo: solo se muestra botón "Desactivar escenario"

---

### HU-RV-07: Notas de Rechazo Visibles para el Gestor

**Como** revisor
**quiero** que las notas que escribo al rechazar un documento queden visibles para el gestor
**para** que pueda corregir sabiendo exactamente qué falló.

**Criterios de aceptación:**
- La nota persiste en `documentacion[id].notaRechazo` en localStorage
- En el detalle del gestor (esc-09), bajo el preview del documento rechazado:
  - Componente `naowee-message--negative` con título "Motivo del rechazo"
  - Texto de la nota
  - Línea inferior: "Revisado por: {nombre}" + fecha
- La nota sobrevive al cierre de pestaña (localStorage)
- Cuando el gestor reenvía el registro, las notas de rechazo de documentos aprobados se preservan; las de rechazados se limpian (porque el documento fue corregido)

---

## 4. Historias de Usuario — Transversales

### HU-TR-01: Header Institucional

**Como** usuario del sistema
**quiero** ver el branding del Ministerio del Deporte y del SUID en cada pantalla
**para** reconocer que estoy en la plataforma oficial.

**Criterios de aceptación:**
- Header pre-login (login + wizard de registro): logos Ministerio del Deporte (56px) + divider + SUID (56px)
- Logos centrados a la derecha del burger menu en sidebar post-login (40px)
- Responsive: en pantallas <640px solo se muestra el logo SUID
- Scroll-shrink: en wizard de registro los logos se reducen al 70% al hacer scroll
- Sin marca "Naowee" ni "Comité Olímpico Colombiano" en el header (decisión de marca)

---

### HU-TR-02: Sidebar de Navegación

**Como** usuario logueado
**quiero** un sidebar fijo con navegación clara
**para** acceder rápidamente a las secciones de mi rol.

**Criterios de aceptación:**
- Sidebar de 274px con burger toggle a 72px (collapsed)
- Sección superior: logos institucionales
- Navegación por rol:
  - Gestor: "Sedes y escenarios" → "Registro de escenarios"
  - Revisor: "Gestión" → "Documentación", "Aprobación"
- Indicador visual del item activo (borde naranja izquierdo)
- Sección inferior: "Resetear demo" (gestor) + "Cerrar sesión" (ambos)
- Burger animado: rotación 180° al colapsar
- Persistencia del estado collapsed en localStorage

---

### HU-TR-03: Pill de Perfil de Usuario

**Como** usuario logueado
**quiero** ver mi nombre, rol y avatar en el header derecho
**para** saber con qué identidad estoy navegando y cambiar de perfil si tengo varios.

**Criterios de aceptación:**
- Pill `naowee-pill` con avatar circular (40px) + nombre + rol + chevron
- Avatar con color plano según rol (no gradiente):
  - Gestor de escenarios: `#FF7500` (naranja Naowee)
  - Revisor: `#7c3aed` (morado)
- Iniciales del usuario centradas (JH para Juan Hernandez, MA para María Alejandra)
- Punto verde de presencia (esquina inferior derecha del avatar)
- Click → dropdown con opciones de cambio de rol
- Chevron rota 180° animado (transición 0.2s) al abrir/cerrar
- Dropdown muestra: rol actual (resaltado naranja) + roles alternativos + descripción

---

### HU-TR-04: Persistencia de Datos (EscStore)

**Como** sistema
**quiero** una capa única de persistencia para todos los registros
**para** garantizar que el estado sobreviva navegación entre páginas y cierre de pestaña.

**Criterios de aceptación:**
- Módulo `shared/escenarios-store.js` cargado en todas las páginas relevantes
- Persistencia en `localStorage` (sobrevive cierre de pestaña, soporta hasta ~5MB por dominio)
- Migración automática de datos legacy en `sessionStorage` al primer load
- API pública `window.EscStore` con CRUD + helpers de flujo
- Semilla automática de 4 registros mock al primer load (uno por estado)
- Botón "Resetear demo" restaura la semilla

---

### HU-TR-05: Toasts de Feedback

**Como** usuario
**quiero** confirmación visual cada vez que ejecuto una acción importante
**para** saber que mi acción fue procesada correctamente.

**Criterios de aceptación:**
- Componente `naowee-message` adaptado a toast (esquina superior derecha o centro)
- Variantes: positive (verde), negative (rojo), informative (azul), caution (naranja)
- Auto-cierre en 4-6 segundos con animación slide+fade
- Botón de cierre manual (X)
- Iconos del DS por variante

---

### HU-TR-06: Componentes del Design System Naowee

**Como** sistema
**quiero** una librería de componentes BEM coherente
**para** mantener consistencia visual en toda la plataforma.

**Componentes utilizados:**
- `naowee-btn` (variantes: accent, mute, link, loud, small, icon)
- `naowee-textfield` (text, textarea con label, helper, error states)
- `naowee-dropdown` (menu, item, chevron animado)
- `naowee-checkbox` (checked, indeterminate)
- `naowee-badge` (variantes: positive, negative, caution, neutral, informative; sizes: small)
- `naowee-message` (informative, positive, caution, negative; con título, texto, ícono)
- `naowee-segment` (segmented control para tabs/filtros)
- `naowee-tab` (tabs principales con indicador animado)
- `naowee-helper` (helper text bajo inputs con badge de estado)
- `naowee-pill` (chip con avatar)
- `naowee-datepicker` (selector de fecha con calendario)
- `naowee-file-uploader-photo` (variante card-based para fotos)
- `naowee-searchbox` (con clear button)
- `naowee-snackbar` (toast persistente con acción)
- `naowee-list-row` (item de lista con media + content + chevron)

---

## 5. Modelo de Datos (EscStore)

### HU-DB-01: Esquema de un Registro

**Como** sistema
**quiero** un modelo de datos estable y completo para cada registro de escenario
**para** soportar el flujo end-to-end gestor↔revisor con trazabilidad.

**Estructura:**

```js
{
  // Identificación
  nombre: string,
  catastral: string,
  departamento: string,
  municipio: string,
  lat: number,
  lon: number,
  direccion: string,
  corregimiento: string,
  zona: string,

  // Propiedad
  entidad: string,
  propietario: string,
  administradora: string,
  tenencia: string,
  responsable: string,
  telefono: string,
  correoResp: string,

  // Ficha técnica
  car: boolean,                  // Categoría de Alto Rendimiento
  tipoEscenario: string,
  fichaComun: { areaTotal, areaUtil, cubierto, capacidad, anioCons, estado },
  fichaEspecifica: object,
  subEspacios: [{ nombre, tipo, ficha, dotacion, disciplinas }],
  subCount: number,
  compartirDisciplinas: boolean,
  compartirDetalles: boolean,
  dotacion: object,
  disciplinas: string[],
  disciplinasData: object,

  // Estado del flujo (4 valores estables)
  status: 'borrador' | 'revision' | 'activo' | 'rechazado',

  // Metadata del flujo
  savedAt: number,               // timestamp de creación / última edición
  sentAt: number | null,         // timestamp de último envío a revisión
  reviewedAt: number | null,     // timestamp de última acción del revisor
  reviewerName: string | null,

  // Documentación con estado y nota por documento
  documentacion: {
    [docId]: {
      file: string | null,
      uploadedAt: number | null,
      docStatus: 'pendiente' | 'aprobado' | 'rechazado',
      notaRechazo: string | null,
      reviewedAt: number | null
    }
  },

  // Historial dinámico (append-only)
  historial: [
    {
      ts: number,
      category: 'estado' | 'documentos' | 'asignaciones',
      title: string,
      desc: string,
      actor: 'gestor' | 'revisor' | 'sistema',
      actorName: string
    }
  ]
}
```

---

### HU-DB-02: API Pública del Store

**Como** desarrollador
**quiero** una API simple para todas las operaciones sobre registros
**para** evitar duplicar lógica de persistencia en cada página.

**Métodos expuestos en `window.EscStore`:**

| Método | Propósito |
|---|---|
| `getAll()` | Devuelve todos los registros normalizados |
| `get(idx)` | Devuelve un registro por índice |
| `add(record)` | Agrega un registro nuevo y devuelve su índice |
| `update(idx, patch)` | Merge superficial + persiste |
| `remove(idx)` | Elimina por índice |
| `sendToReview(idx, actor)` | Cambia status a 'revision', emite evento |
| `approve(idx, reviewer)` | Cambia status a 'activo', emite evento |
| `reject(idx, reviewer, motivo)` | Cambia status a 'rechazado', emite evento |
| `approveDoc(idx, docId, reviewer)` | Aprueba documento individual + evento |
| `rejectDoc(idx, docId, reviewer, nota)` | Rechaza documento individual + nota + evento |
| `pushEvent(idx, evento)` | Agrega evento al historial |
| `setToast(payload)` / `consumeToast()` | Mensajes flotantes entre páginas |
| `seed()` | Carga 4 registros mock si está vacío |
| `reset()` | Borra storage y restaura semilla |
| `ESTADO_BADGE`, `DOC_BADGE` | Constantes de mapeo a clases del DS |
| `GESTOR_NAME`, `REVISOR_NAME` | Constantes de nombres |

---

## 6. Flujo End-to-End del Sistema

```
CIUDADANO (Gestor)                                    REVISOR
==================                                    =======

1. Acceder al SUID (HU-CI-01)
   └─> Login o Recuperar contraseña

2. Iniciar registro público (HU-CI-02)
   └─> Wizard 3 pasos:
       ├─ Paso 1: Pre-validación (HU-CI-03)
       ├─ Paso 2: Georreferenciación (HU-CI-04)
       │  ó Datos de propiedad (HU-CI-05)
       └─ Paso 3 modal: Ficha técnica + Documentación (HU-CI-06)
           └─> Submit → Store.add({status:'borrador'})
                + Store.sendToReview() → status='revision'
                + 3 eventos al historial

3. Pantalla de éxito (HU-CI-07)
   └─> Email confirmación + redirect dashboard

4. Dashboard (HU-CI-08)            ──────────────>    1. Dashboard del revisor (HU-RV-01)
   ├─ Ve registro como "En revisión"                    └─> Tabla con todos los registros
   ├─ Toast "Enviado a revisión"                            ≠ borrador, ordenados por fecha
   └─> Click row → Detalle (HU-CI-09)
                                                       2. Click row → Detalle (HU-RV-04)
                                                          ├─ Tab Documentación
                                                          ├─> Aprueba doc por doc (HU-RV-05)
                                                          ├─> Rechaza doc con nota (HU-RV-05)
                                                          │   └─ Persiste docStatus + notaRechazo
                                                          └─> Decisión final (HU-RV-06):
                                                              ├─ Aprobar registro completo
                                                              │  └─ Store.approve()
                                                              │     status='activo'
                                                              └─ Rechazar con motivo
                                                                 └─ Store.reject(motivo)
                                                                    status='rechazado'

5. Detalle ve banner según status (HU-CI-09)
   ├─ Activo verde "Aprobado el…"
   │  └─> Click "Ver perfil" (HU-CI-11)
   └─ Rechazado rojo "Rechazado el…"
      ├─> Tab Documentación: cada doc con su nota visible (HU-RV-07)
      ├─> Tab Historial: timeline con todos los eventos
      └─> Botón "Reenviar a revisión" (HU-CI-10)
          └─> Store.sendToReview()
              status='revision' (loop)
              docs rechazados → 'pendiente'
              docs aprobados → 'aprobado' (preservados)
                                       ──────────────>  Vuelve al paso 1 del revisor
```

---

## 7. Mapa de Estados y Transiciones

| Estado actual | Acción del gestor | Acción del revisor | Próximo estado |
|---|---|---|---|
| (no existe) | Crear borrador | — | `borrador` |
| `borrador` | Editar | — | `borrador` |
| `borrador` | Enviar a revisión | — | `revision` |
| `borrador` | Completar wizard | — | `revision` |
| `revision` | — | Aprobar registro | `activo` |
| `revision` | — | Rechazar registro | `rechazado` |
| `activo` | — | Desactivar escenario | `revision` (futuro, no en MVP) |
| `rechazado` | Editar y reenviar | — | `revision` |

**Estados de un documento dentro de un registro:**

| Estado del doc | Visible para gestor en esc-09 | Editable por revisor en esc-12 |
|---|---|---|
| (sin file) → `No cargado` | Botón "Subir" | — |
| `pendiente` (cargado) → `En revisión` | — | Sí: aprobar / rechazar |
| `aprobado` | Badge verde, descargable | Solo si reenvío |
| `rechazado` | Badge rojo + nota visible | Sí: corregir docStatus |

---

## 8. Páginas del Sistema

| # | Página | Archivo | Rol Principal | Función |
|---|---|---|---|---|
| 01 | Login | `escenario-01-login.html` | Ambos | Autenticación con carrusel |
| 02 | Recuperar contraseña | `escenario-02-recuperar-password.html` | Ambos | Flujo de recuperación |
| 03 | Landing registro | `escenario-03-registrar-escenario.html` | Ciudadano | Intro al wizard |
| 04 | Wizard paso 1 | `escenario-04-registrar-prevalidacion.html` | Ciudadano | Pre-validación de datos |
| 05 | Wizard paso 2 | `escenario-05-registrar-georreferenciacion.html` | Ciudadano | Mapa de ubicación |
| 06 | Wizard paso 2 (alt) | `escenario-06-registrar-propiedad.html` | Ciudadano | Datos de propiedad |
| 07 | Éxito | `escenario-07-registrar-exito.html` | Ciudadano | Confirmación + email mock |
| 08 | Dashboard | `escenario-08-dashboard.html` | Ciudadano | Tabla de mis registros |
| 09 | Detalle gestor | `escenario-09-detalle-revision.html` | Ciudadano | Vista detallada de un registro |
| 10 | Perfil activo | `escenario-10-perfil-activo.html` | Ciudadano | Vista pública estilo Airbnb |
| 11 | Dashboard revisor | `escenario-11-revisor-dashboard.html` | Revisor | Lista de registros a revisar |
| 12 | Detalle revisor | `escenario-12-revisor-detalle.html` | Revisor | Evaluación documento por documento |

**Módulos compartidos:**
- `shared/design-system.css` — DS Naowee (sincronizado con módulo Digitación)
- `shared/shell.css` — Layout shell, sidebar, header
- `shared/wizard-shell.css` — Stepper del wizard de registro
- `shared/wizard-shell.js` — Lógica del stepper
- `shared/transitions.css` + `transitions.js` — Animaciones entre páginas
- `shared/escenarios-store.js` — Capa de persistencia y flujo (EscStore)
- `shared/icons/` — SVGs de iconos genéricos
- `shared/logos/` — Logos institucionales (Ministerio, SUID, Naowee, Colombia)

---

## 9. Backlog para JIRA — Resumen Sugerido

**Epic:** SUID — Módulo Escenarios

**Stories sugeridas (16):**

| # | Story | Story Points sugeridos | Etiquetas |
|---|---|---|---|
| 1 | Login + recuperar contraseña ciudadano | 5 | frontend, auth, mvp |
| 2 | Wizard registro público — Paso 1 (pre-validación + duplicados) | 8 | frontend, registro, validation |
| 3 | Wizard registro público — Paso 2 (mapa Leaflet + propiedad) | 8 | frontend, registro, gis |
| 4 | Wizard registro público — Paso 3 (ficha técnica + documentación) | 13 | frontend, registro, fileupload |
| 5 | Pantalla de éxito + email mock | 3 | frontend, registro |
| 6 | Dashboard ciudadano (3 modos + filtros + paginador) | 8 | frontend, dashboard |
| 7 | Detalle gestor — Tab Información general | 5 | frontend, detalle |
| 8 | Detalle gestor — Tab Documentación con notas de rechazo | 8 | frontend, detalle, ds |
| 9 | Detalle gestor — Tab Historial dinámico desde store | 5 | frontend, detalle, audit |
| 10 | Reenvío de registro rechazado con preservación de docs aprobados | 5 | frontend, flujo |
| 11 | Perfil activo read-only estilo Airbnb | 8 | frontend, perfil |
| 12 | Dashboard revisor con bulk approve/reject | 8 | frontend, revisor |
| 13 | Detalle revisor — Layout 2 columnas + acciones por documento | 13 | frontend, revisor, ds |
| 14 | Aprobación / rechazo de documento individual con nota persistida | 8 | frontend, revisor, store |
| 15 | Capa EscStore (persistencia + helpers de flujo + semilla) | 13 | core, store, audit |
| 16 | Header institucional + branding + pill de perfil + cambio de rol | 5 | frontend, ds, branding |

**Subtareas técnicas transversales:**
- Migración de datos legacy `sessionStorage → localStorage`
- Botón "Resetear demo" en sidebar
- Consistencia de iconos action-approve / action-reject del DS
- Tests E2E de los 4 estados (Cypress / Playwright cuando se integre)

---

## 10. Entregables del MVP

### Entregables de Diseño
- 12 pantallas implementadas en HTML/CSS/JS
- Componentes del Design System Naowee adaptados al SUID
- Branding institucional completo (Ministerio + SUID)
- Sistema de iconos compartido
- Animaciones de transición entre pantallas

### Entregables Funcionales
- Flujo end-to-end gestor ↔ revisor con persistencia real
- 4 estados del registro (borrador, revisión, activo, rechazado) con transiciones validadas
- Evaluación documento por documento con notas de rechazo persistidas
- Historial completo y dinámico de eventos por registro
- Bulk approve/reject de registros y documentos
- Cambio de rol en sesión
- 4 registros semilla coherentes para demo

### Entregables Técnicos
- Capa de persistencia `EscStore` (270 líneas, API documentada)
- Modelo de datos extensible con campos opcionales y normalización
- Migración automática desde sessionStorage legacy
- Botón "Resetear demo" para repetir flujos
- Repositorios:
  - `naowee-tech/digitacion-ui-ux-demo` (carpeta `escenarios/`)
  - `naowee-tech/naowee-test-escenarios` (GitHub Pages)

### Entregables de Documentación
- Acta de alcance MVP (este documento)
- README de la carpeta `escenarios/` con instrucciones de ejecución local
- CLAUDE.md con convenciones del proyecto y design tokens
- Memoria de decisiones de branding (logos, avatar, naming) en `feedback_*.md`

---

## 11. Criterios de Aceptación Globales del MVP

Para considerar el MVP de Escenarios completado:

- [ ] Un ciudadano puede registrar un escenario completo desde el formulario público
- [ ] El registro aparece automáticamente en su dashboard con badge "En revisión"
- [ ] El mismo registro aparece en el dashboard del revisor con fecha de envío
- [ ] El revisor puede aprobar o rechazar cada documento individualmente con un motivo
- [ ] El revisor puede aprobar o rechazar el registro completo con un motivo general
- [ ] Si rechaza, el registro vuelve a aparecer en el dashboard del gestor con badge "Rechazado"
- [ ] El gestor ve la nota de rechazo bajo cada documento rechazado en el detalle
- [ ] El gestor puede editar y reenviar el registro a revisión
- [ ] Al reenviar, los documentos previamente aprobados se preservan; los rechazados vuelven a "En revisión"
- [ ] Todo el ciclo queda registrado en el historial visible para el gestor
- [ ] Los datos persisten al cerrar y reabrir la pestaña del navegador (localStorage)
- [ ] Existe un botón "Resetear demo" para restaurar la semilla y poder repetir flujos
- [ ] El cambio entre rol Gestor y Revisor funciona desde el header sin reingresar credenciales
- [ ] Todos los componentes visuales usan el Design System Naowee (cero estilos custom inline para componentes del DS)
- [ ] El branding del header en pre-login y sidebar post-login es solo Ministerio del Deporte + SUID

---

## 12. Alcance Excluido del MVP

- Backend real con base de datos (todo persiste en localStorage del navegador)
- Autenticación y autorización con tokens (login es mock visual)
- Notificaciones email/SMS reales al cambiar de estado
- Notificaciones push o en tiempo real entre roles
- Carga real de archivos a un servidor (los uploads quedan en memoria del navegador)
- Generación de PDF / exportación de reportes
- Integración con sistemas externos del Ministerio (catastro real, CRM, etc.)
- Versionado de documentos (subir nueva versión sobre uno rechazado, mantener histórico)
- Comentarios libres del gestor al reenviar (campo opcional para responder a las observaciones)
- Asignación múltiple de revisores por registro
- Aprobación parcial (algunos documentos aprobados, otros pendientes, registro queda en estado intermedio)
- Búsqueda full-text avanzada o indexación
- Vista pública del escenario para usuarios externos (perfil Airbnb es solo para el dueño del registro)
- Dashboard analítico para el ministerio (KPIs de revisión, tiempos promedio, etc.)
- Internacionalización (todo en español)
- Modo oscuro
- Accesibilidad WCAG AA completa (queda parcial: alt texts y labels en formularios)

---

## 13. Notas Técnicas

- **Stack:** HTML + CSS + JavaScript vanilla, sin framework ni build tools
- **Fuente:** Google Fonts Inter (400, 500, 600, 700, 800)
- **Mapas:** Leaflet 1.9.4 (CDN)
- **Persistencia:** localStorage del navegador (~5MB por dominio)
- **Responsive:** Breakpoint principal 900px (sidebar colapsa); breakpoint secundario 640px (oculta logos secundarios del header)
- **Animaciones:** fadeInUp, scaleIn, slideInLeft/Right con cubic-bezier, transición de chevron 0.2s
- **Compatibilidad:** Chrome / Edge / Firefox modernos (uso de `:has()`, `?.`, template strings, async-friendly)
- **Hosting actual:** GitHub Pages en `https://naowee-tech.github.io/naowee-test-escenarios/`
- **Repositorio principal:** `naowee-tech/digitacion-ui-ux-demo` (carpeta `escenarios/`)
- **Versionado:** semver, último tag `v1.23.0` (las versiones futuras documentarán cambios visibles para el usuario)
- **Slack:** notificaciones de deploy a `#digitacionui` vía webhook configurado

---

## 14. Próximos Pasos Sugeridos (Roadmap Post-MVP)

**Fase 2 — Hardening del flujo:**
- Aprobación parcial de registros (estados intermedios)
- Versionado de documentos con histórico
- Comentarios del gestor al reenviar
- Reasignación de revisores y carga de trabajo balanceada

**Fase 3 — Integración:**
- Backend Angular con API REST (handoff a Daniel)
- Autenticación real con SUID central
- Carga de archivos a S3 / storage institucional
- Notificaciones email automatizadas en cada cambio de estado

**Fase 4 — Analítica y reporting:**
- Dashboard del ministerio con KPIs (tiempos promedio, tasa de aprobación, etc.)
- Exportación de reportes a PDF / Excel
- Auditoría avanzada (quién vio qué, búsqueda en historial)

**Fase 5 — Vista pública:**
- Mapa público de escenarios deportivos del país
- Perfil público de cada escenario activo
- Búsqueda y filtros para ciudadanos

---

*Documento generado el 15 de abril de 2026*
*MVP versión 1.23.0 — Epic Escenarios*
*Para entregar a: Isa (Scrum Master)*
