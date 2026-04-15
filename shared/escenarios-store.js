/* ═══════════════════════════════════════════════════════════════
   EscStore — fuente única de verdad para registros de escenarios
   Persistencia: localStorage (sobrevive cierre de pestaña)
   Uso: cargar este script ANTES del JS de la página que lo consuma
   ═══════════════════════════════════════════════════════════════ */
(function(global){
  'use strict';

  const STORAGE_KEY = 'regDrafts';
  const SESSION_LEGACY_KEY = 'regDrafts'; // misma key, distinto storage
  const SEED_FLAG_KEY = 'regDraftsSeeded'; // para no resemilla en cada visita
  const REV_LEGACY_KEY = 'revEstados'; // se ignora, todo va al store
  const SHOW_TOAST_KEY = 'escToast'; // mensajes flotantes entre páginas
  const GESTOR_NAME = 'Juan Hernandez Granados';
  const REVISOR_NAME = 'María Alejandra Gómez';

  // ─── Estados y mappings DS ─────────────────────────────────────
  const ESTADO_BADGE = {
    'borrador':  { label: 'Borrador',     variant: 'neutral' },
    'revision':  { label: 'En revisión',  variant: 'caution' },
    'activo':    { label: 'Activo',       variant: 'positive' },
    'rechazado': { label: 'Rechazado',    variant: 'negative' }
  };
  const DOC_BADGE = {
    'pendiente': { label: 'Pendiente', variant: 'informative' },
    'aprobado':  { label: 'Aprobado',  variant: 'positive' },
    'rechazado': { label: 'Rechazado', variant: 'negative' }
  };

  // ─── IO básico ─────────────────────────────────────────────────
  function read(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch(e){ return []; }
  }
  function write(arr){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
    catch(e){ /* quota / privacy mode */ }
  }

  // ─── Migración legacy desde sessionStorage ─────────────────────
  function migrateLegacy(){
    try {
      const legacyRaw = sessionStorage.getItem(SESSION_LEGACY_KEY);
      if(!legacyRaw) return;
      const legacy = JSON.parse(legacyRaw);
      if(!Array.isArray(legacy) || legacy.length === 0) return;
      // Si localStorage ya tiene datos, no pisar — solo borrar legacy
      const current = read();
      if(current.length === 0){
        const migrated = legacy.map(d => normalizeRecord(d));
        write(migrated);
      }
      sessionStorage.removeItem(SESSION_LEGACY_KEY);
      sessionStorage.removeItem(REV_LEGACY_KEY);
    } catch(e){}
  }

  // ─── Normalización: asegurar campos requeridos por el modelo ───
  function normalizeRecord(d){
    if(!d || typeof d !== 'object') return d;
    if(!d.status) d.status = 'borrador';
    if(d.sentAt === undefined) d.sentAt = null;
    if(d.reviewedAt === undefined) d.reviewedAt = null;
    if(d.reviewerName === undefined) d.reviewerName = null;
    if(!d.documentacion || typeof d.documentacion !== 'object') d.documentacion = {};
    Object.keys(d.documentacion).forEach(docId => {
      const doc = d.documentacion[docId];
      if(typeof doc === 'string'){
        d.documentacion[docId] = { file: doc, uploadedAt: null, docStatus: 'pendiente', notaRechazo: null, reviewedAt: null };
      } else if(doc && typeof doc === 'object'){
        if(!doc.docStatus) doc.docStatus = 'pendiente';
        if(doc.notaRechazo === undefined) doc.notaRechazo = null;
        if(doc.reviewedAt === undefined) doc.reviewedAt = null;
      }
    });
    if(!Array.isArray(d.historial)) d.historial = [];
    return d;
  }

  // ─── Eventos / historial ───────────────────────────────────────
  function buildEvent(category, title, desc, actor, actorName){
    return {
      ts: Date.now(),
      category: category || 'estado',
      title: title || '',
      desc: desc || '',
      actor: actor || 'sistema',
      actorName: actorName || ''
    };
  }
  function pushEvent(idx, evento){
    const arr = read();
    if(!arr[idx]) return;
    if(!Array.isArray(arr[idx].historial)) arr[idx].historial = [];
    arr[idx].historial.push(evento);
    write(arr);
  }

  // ─── API CRUD ──────────────────────────────────────────────────
  function getAll(){ return read().map(normalizeRecord); }
  // Variante ordenada (más reciente primero) que preserva el índice global del store.
  // Devuelve [{record, originalIdx}, ...] para que el consumidor pueda rutear por idx.
  function getAllSorted(){
    return read()
      .map((d, i) => ({ record: normalizeRecord(d), originalIdx: i }))
      .sort((a, b) => {
        const ta = a.record.sentAt || a.record.reviewedAt || a.record.savedAt || 0;
        const tb = b.record.sentAt || b.record.reviewedAt || b.record.savedAt || 0;
        return tb - ta;
      });
  }
  function setAll(arr){ write(arr); }
  function get(idx){ const arr = read(); return arr[idx] ? normalizeRecord(arr[idx]) : null; }
  function update(idx, patch){
    const arr = read();
    if(!arr[idx]) return null;
    arr[idx] = Object.assign(arr[idx], patch || {});
    write(arr);
    return arr[idx];
  }
  function add(record){
    const arr = read();
    const norm = normalizeRecord(record || {});
    if(!norm.savedAt) norm.savedAt = Date.now();
    arr.push(norm);
    write(arr);
    return arr.length - 1;
  }
  function remove(idx){
    const arr = read();
    if(idx < 0 || idx >= arr.length) return;
    arr.splice(idx, 1);
    write(arr);
  }

  // ─── Helpers de flujo (las acciones del negocio) ───────────────
  function sendToReview(idx, actorName){
    const arr = read();
    if(!arr[idx]) return;
    const wasRejected = arr[idx].status === 'rechazado';
    arr[idx].status = 'revision';
    arr[idx].sentAt = Date.now();
    if(wasRejected){
      // Limpiar estado de docs rechazados al reenviar (gestor corrigió)
      const docs = arr[idx].documentacion || {};
      Object.keys(docs).forEach(k => {
        if(docs[k] && docs[k].docStatus === 'rechazado'){
          docs[k].docStatus = 'pendiente';
          docs[k].notaRechazo = null;
          docs[k].reviewedAt = null;
        }
      });
    }
    write(arr);
    pushEvent(idx, buildEvent(
      'estado',
      wasRejected ? 'Reenviado a revisión' : 'Enviado a revisión',
      wasRejected ? 'El gestor reenvió el registro tras aplicar correcciones.' : 'El registro fue enviado al revisor.',
      'gestor',
      actorName || GESTOR_NAME
    ));
  }
  function approve(idx, reviewerName){
    const arr = read();
    if(!arr[idx]) return;
    arr[idx].status = 'activo';
    arr[idx].reviewedAt = Date.now();
    arr[idx].reviewerName = reviewerName || REVISOR_NAME;
    write(arr);
    pushEvent(idx, buildEvent(
      'estado', 'Registro aprobado',
      'El revisor aprobó el registro y todos sus documentos.',
      'revisor', reviewerName || REVISOR_NAME
    ));
  }
  function reject(idx, reviewerName, motivo){
    const arr = read();
    if(!arr[idx]) return;
    arr[idx].status = 'rechazado';
    arr[idx].reviewedAt = Date.now();
    arr[idx].reviewerName = reviewerName || REVISOR_NAME;
    write(arr);
    pushEvent(idx, buildEvent(
      'estado', 'Registro rechazado',
      motivo || 'El revisor rechazó el registro. Revisa los documentos con observaciones.',
      'revisor', reviewerName || REVISOR_NAME
    ));
  }
  function approveDoc(idx, docId, reviewerName){
    const arr = read();
    if(!arr[idx]) return;
    if(!arr[idx].documentacion) arr[idx].documentacion = {};
    if(!arr[idx].documentacion[docId]) arr[idx].documentacion[docId] = { file: null };
    arr[idx].documentacion[docId].docStatus = 'aprobado';
    arr[idx].documentacion[docId].notaRechazo = null;
    arr[idx].documentacion[docId].reviewedAt = Date.now();
    write(arr);
    pushEvent(idx, buildEvent(
      'documentos', 'Documento aprobado',
      `${docLabel(docId)} fue aprobado por el revisor.`,
      'revisor', reviewerName || REVISOR_NAME
    ));
  }
  function rejectDoc(idx, docId, reviewerName, nota){
    const arr = read();
    if(!arr[idx]) return;
    if(!arr[idx].documentacion) arr[idx].documentacion = {};
    if(!arr[idx].documentacion[docId]) arr[idx].documentacion[docId] = { file: null };
    arr[idx].documentacion[docId].docStatus = 'rechazado';
    arr[idx].documentacion[docId].notaRechazo = nota || 'Documento rechazado.';
    arr[idx].documentacion[docId].reviewedAt = Date.now();
    write(arr);
    pushEvent(idx, buildEvent(
      'documentos', 'Documento rechazado',
      `${docLabel(docId)}: ${nota || 'sin nota'}`,
      'revisor', reviewerName || REVISOR_NAME
    ));
  }

  // ─── Labels conocidos para mensajes humanos en el historial ────
  const DOC_LABELS = {
    fotoFrontalGeneral: 'Foto frontal general',
    fotoPanoramica: 'Foto panorámica',
    fotoInstalaciones: 'Fotos instalaciones',
    planoEscenario: 'Plano del escenario',
    planoLocalizacion: 'Plano de localización',
    docPropiedad: 'Documento de propiedad',
    conceptoBomberos: 'Concepto bomberos',
    conceptoSalud: 'Concepto salud',
    conceptoInfraestructura: 'Concepto infraestructura',
    resolucionCreacion: 'Resolución de creación'
  };
  function docLabel(docId){ return DOC_LABELS[docId] || docId; }

  // ─── Toasts entre páginas ──────────────────────────────────────
  function setToast(payload){
    try { sessionStorage.setItem(SHOW_TOAST_KEY, JSON.stringify(payload || {})); }
    catch(e){}
  }
  function consumeToast(){
    try {
      const raw = sessionStorage.getItem(SHOW_TOAST_KEY);
      if(!raw) return null;
      sessionStorage.removeItem(SHOW_TOAST_KEY);
      return JSON.parse(raw);
    } catch(e){ return null; }
  }

  // ─── Semilla de demo (4 registros con estados coherentes) ─────
  function buildSeed(){
    const now = Date.now();
    const days = (n) => now - n * 86400000;
    const hours = (n) => now - n * 3600000;

    const seed = [
      // ── 1. BORRADOR ─────────────────────────────
      {
        nombre: 'Centro deportivo Prado',
        catastral: '10000101010',
        departamento: 'Antioquia',
        municipio: 'Medellín',
        responsable: GESTOR_NAME,
        car: false,
        savedAt: days(2),
        sentAt: null,
        reviewedAt: null,
        reviewerName: null,
        status: 'borrador',
        documentacion: {},
        historial: [
          { ts: days(2), category: 'asignaciones', title: 'Registro creado', desc: 'Borrador iniciado por el gestor.', actor: 'gestor', actorName: GESTOR_NAME }
        ]
      },
      // ── 2. EN REVISIÓN ──────────────────────────
      {
        nombre: 'Centro deportivo Miramar',
        catastral: '1000020202',
        departamento: 'Atlántico',
        municipio: 'Barranquilla',
        responsable: GESTOR_NAME,
        car: true,
        savedAt: days(7),
        sentAt: hours(3),
        reviewedAt: null,
        reviewerName: null,
        status: 'revision',
        documentacion: {
          fotoFrontalGeneral: { file: 'foto-frontal.jpg', uploadedAt: days(7), docStatus: 'pendiente', notaRechazo: null, reviewedAt: null },
          fotoPanoramica: { file: 'foto-panoramica.jpg', uploadedAt: days(7), docStatus: 'pendiente', notaRechazo: null, reviewedAt: null },
          planoEscenario: { file: 'plano.pdf', uploadedAt: days(6), docStatus: 'pendiente', notaRechazo: null, reviewedAt: null },
          docPropiedad: { file: 'propiedad.pdf', uploadedAt: days(6), docStatus: 'pendiente', notaRechazo: null, reviewedAt: null }
        },
        historial: [
          { ts: days(7), category: 'asignaciones', title: 'Registro creado', desc: 'El gestor creó el registro inicial.', actor: 'gestor', actorName: GESTOR_NAME },
          { ts: days(6), category: 'documentos', title: 'Documentación cargada', desc: '4 documentos cargados.', actor: 'gestor', actorName: GESTOR_NAME },
          { ts: hours(3), category: 'estado', title: 'Enviado a revisión', desc: 'El registro fue enviado al revisor.', actor: 'gestor', actorName: GESTOR_NAME }
        ]
      },
      // ── 3. ACTIVO ───────────────────────────────
      {
        nombre: 'Centro deportivo Norte',
        catastral: '1000030303',
        departamento: 'Cundinamarca',
        municipio: 'Bogotá D.C.',
        responsable: GESTOR_NAME,
        car: true,
        savedAt: days(20),
        sentAt: days(15),
        reviewedAt: days(10),
        reviewerName: REVISOR_NAME,
        status: 'activo',
        documentacion: {
          fotoFrontalGeneral: { file: 'frontal.jpg', uploadedAt: days(18), docStatus: 'aprobado', notaRechazo: null, reviewedAt: days(10) },
          fotoPanoramica: { file: 'panoramica.jpg', uploadedAt: days(18), docStatus: 'aprobado', notaRechazo: null, reviewedAt: days(10) },
          planoEscenario: { file: 'plano.pdf', uploadedAt: days(17), docStatus: 'aprobado', notaRechazo: null, reviewedAt: days(10) },
          docPropiedad: { file: 'propiedad.pdf', uploadedAt: days(17), docStatus: 'aprobado', notaRechazo: null, reviewedAt: days(10) }
        },
        historial: [
          { ts: days(20), category: 'asignaciones', title: 'Registro creado', desc: 'El gestor creó el registro inicial.', actor: 'gestor', actorName: GESTOR_NAME },
          { ts: days(18), category: 'documentos', title: 'Documentación cargada', desc: '4 documentos cargados.', actor: 'gestor', actorName: GESTOR_NAME },
          { ts: days(15), category: 'estado', title: 'Enviado a revisión', desc: 'El registro fue enviado al revisor.', actor: 'gestor', actorName: GESTOR_NAME },
          { ts: days(10), category: 'estado', title: 'Registro aprobado', desc: 'El revisor aprobó el registro y todos sus documentos.', actor: 'revisor', actorName: REVISOR_NAME }
        ]
      },
      // ── 4. RECHAZADO (con docs rechazados y notas reales) ─────
      {
        nombre: 'Centro deportivo Sur',
        catastral: '1000040404',
        departamento: 'Valle del Cauca',
        municipio: 'Cali',
        responsable: GESTOR_NAME,
        car: false,
        savedAt: days(15),
        sentAt: days(10),
        reviewedAt: days(5),
        reviewerName: REVISOR_NAME,
        status: 'rechazado',
        documentacion: {
          fotoFrontalGeneral: {
            file: 'frontal.jpg', uploadedAt: days(13),
            docStatus: 'rechazado', reviewedAt: days(5),
            notaRechazo: 'La imagen no corresponde al escenario registrado. Se requiere una fotografía frontal clara donde se identifique la fachada principal de la instalación.'
          },
          fotoPanoramica: {
            file: 'panoramica.jpg', uploadedAt: days(13),
            docStatus: 'aprobado', notaRechazo: null, reviewedAt: days(5)
          },
          planoEscenario: {
            file: 'plano.pdf', uploadedAt: days(12),
            docStatus: 'rechazado', reviewedAt: days(5),
            notaRechazo: 'El plano presentado no incluye las medidas reglamentarias ni la distribución de las áreas de juego. Debe cumplir con la normativa vigente.'
          },
          docPropiedad: {
            file: 'propiedad.pdf', uploadedAt: days(12),
            docStatus: 'aprobado', notaRechazo: null, reviewedAt: days(5)
          }
        },
        historial: [
          { ts: days(15), category: 'asignaciones', title: 'Registro creado', desc: 'El gestor creó el registro inicial.', actor: 'gestor', actorName: GESTOR_NAME },
          { ts: days(13), category: 'documentos', title: 'Documentación cargada', desc: '4 documentos cargados.', actor: 'gestor', actorName: GESTOR_NAME },
          { ts: days(10), category: 'estado', title: 'Enviado a revisión', desc: 'El registro fue enviado al revisor.', actor: 'gestor', actorName: GESTOR_NAME },
          { ts: days(5), category: 'documentos', title: 'Documento rechazado', desc: 'Foto frontal general: imagen no corresponde al escenario.', actor: 'revisor', actorName: REVISOR_NAME },
          { ts: days(5), category: 'documentos', title: 'Documento aprobado', desc: 'Foto panorámica fue aprobada.', actor: 'revisor', actorName: REVISOR_NAME },
          { ts: days(5), category: 'documentos', title: 'Documento rechazado', desc: 'Plano del escenario: falta normativa vigente.', actor: 'revisor', actorName: REVISOR_NAME },
          { ts: days(5), category: 'documentos', title: 'Documento aprobado', desc: 'Documento de propiedad fue aprobado.', actor: 'revisor', actorName: REVISOR_NAME },
          { ts: days(5), category: 'estado', title: 'Registro rechazado', desc: 'El revisor rechazó el registro. Revisa los documentos con observaciones.', actor: 'revisor', actorName: REVISOR_NAME }
        ]
      }
    ];
    return seed;
  }

  function seed(){
    const arr = read();
    if(arr.length === 0){
      write(buildSeed());
      try { localStorage.setItem(SEED_FLAG_KEY, '1'); } catch(e){}
    }
  }
  function reset(){
    try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(SEED_FLAG_KEY); } catch(e){}
    seed();
  }

  // ─── Inicialización al cargar el script ────────────────────────
  migrateLegacy();
  seed();

  // ─── Exponer API ───────────────────────────────────────────────
  global.EscStore = {
    STORAGE_KEY,
    GESTOR_NAME, REVISOR_NAME,
    ESTADO_BADGE, DOC_BADGE,
    docLabel,
    // CRUD
    getAll, getAllSorted, setAll, get, update, add, remove,
    // Flujo
    sendToReview, approve, reject, approveDoc, rejectDoc,
    // Historial
    pushEvent, buildEvent,
    // Toasts
    setToast, consumeToast,
    // Demo
    seed, reset
  };
})(window);
