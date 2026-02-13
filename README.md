# Wolters Candidate Portal (Phase 3 - Match Engine)

App web React offline-first para captación y gestión de trabajadores.
Los datos se guardan en el `localStorage` del navegador.

## Novedades Fase 3: Módulo de Pedidos y Match

Ahora es posible crear vacantes (jobs) y generar listas de candidatos (shortlists) automáticamente basadas en criterios de compatibilidad.

### Flujo de Test del Match

1. **Crear Datos**: Ir a "Trabajadores" o "Pedidos" y hacer click en "Demo" (o Generar Datos) para poblar la base de datos local.
2. **Crear Pedido**: Ir a "Pedidos/Match" -> "Nuevo Pedido". Rellenar el formulario con los requisitos (ej: Soldador, Francia, Pasaporte UE).
3. **Generar Match**: En el detalle del pedido, click en "Generar Match".
4. **Gestionar Shortlist**:
   - Se mostrará una lista de trabajadores ordenada por score.
   - El score (0-100+) se basa en profesión (+50), tags (+25), doc (+20), idioma (+10) y ubicación (+10).
   - Acciones disponibles: Contactar, Aprobar, Rechazar.
   - **Aprobar** un candidato añade automáticamente una nota en su perfil de trabajador.

## Cómo Usar

1. La ruta principal es `/#/candidatar` (redirección automática desde `/`).
2. Login admin: `admin@wolters.com` / `1234`.
3. Navegue por el menú lateral para gestionar Candidatos, Trabajadores y Pedidos.

## Debugging

Para verificar los datos guardados:
1. Navegue a `/#/debug`.
2. Verá una tabla con los últimos envíos.
3. Puede usar el botón "Limpiar Storage" para reiniciar las pruebas.

## Estructura de Datos (LocalStorage)

- `wolters_candidate_submissions`: Formularios brutos.
- `wolters_workers`: Perfiles de trabajadores convertidos.
- `wolters_jobs`: Vacantes activas.
- `wolters_shortlists`: Relación Job <-> Worker con puntuación.
