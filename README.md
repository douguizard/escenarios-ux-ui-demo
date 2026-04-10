# Naowee Escenarios UX/UI

Módulo **Escenarios** de Naowee. Colección de prototipos HTML standalone que ilustran flujos UX/UI del producto.

Hereda el design system del módulo Digitación (`Claude-Doug/digitacion`).

## Estructura

```
escenarios-ux-ui-demo/
├── shared/
│   ├── design-system.css   # Tokens + componentes Naowee
│   └── shell.css           # Sidebar, header, layout base
├── index.html              # Landing con índice de escenarios
├── escenario-template.html # Template base para clonar
└── escenario-XX-*.html     # Escenarios individuales
```

## Uso local

```bash
# Opción 1: abrir directamente el HTML en el browser
open index.html

# Opción 2: servidor local (recomendado)
python3 -m http.server 4300
# luego abrir http://localhost:4300
```

## Crear un escenario nuevo

```bash
cp escenario-template.html escenario-01-nombre-del-flujo.html
```

Luego editar:
1. `<title>`
2. `.page-title` y `.page-sub`
3. Bloque "Contenido del escenario"
4. Agregar tarjeta en `index.html`

## Stack
- HTML + CSS + JS vanilla
- Google Fonts Inter
- Sin build tools, sin dependencias

## Design System
Ver [`CLAUDE.md`](./CLAUDE.md) para tokens, componentes y convenciones.
