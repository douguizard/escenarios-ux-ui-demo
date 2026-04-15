# Naowee Escenarios — Design System Rules

## Project Overview
Modulo **Escenarios** de Naowee. Standalone HTML files con CSS + JS embebido para el flujo de registro, gestion y revision de sedes/escenarios deportivos en el SUID. No build tools, no external dependencies except Google Fonts Inter.

## Tech Stack
- **Language**: HTML, CSS, JavaScript (vanilla)
- **Fonts**: Google Fonts Inter (400, 500, 600, 700, 800)
- **No build tools, no dependencies** (excepto Leaflet en georref)
- **Servidor local**: `python3 -m http.server 4300` o similar

## Estructura

```
escenarios-ux-ui-demo/
├── shared/
│   ├── design-system.css   ← Tokens + componentes (sincronizado con digitacion/)
│   ├── shell.css           ← Shell, sidebar, header, layout base
│   ├── wizard-shell.css    ← Stepper horizontal del wizard de registro
│   ├── wizard-shell.js     ← Logica del stepper (pasos, validacion, navegacion)
│   ├── transitions.css     ← Animaciones de transicion entre paginas
│   ├── transitions.js      ← JS para transiciones
│   ├── icons/              ← Iconos SVG
│   ├── logos/              ← Logos oficiales
│   └── empty_state.svg     ← Ilustracion empty state
├── index.html              ← Landing con grid de escenarios
├── escenario-template.html ← Template base para clonar
└── escenario-XX-*.html     ← Escenarios individuales
```

## Paginas existentes

| # | Archivo | Flujo |
|---|---------|-------|
| 01 | escenario-01-login.html | Login SUID con carrusel |
| 02 | escenario-02-recuperar-password.html | Recuperar contrasena |
| 03 | escenario-03-registrar-escenario.html | Landing registro (intro) |
| 04 | escenario-04-registrar-prevalidacion.html | Wizard paso 1: datos basicos |
| 05 | escenario-05-registrar-georreferenciacion.html | Wizard paso 2: mapa Leaflet |
| 06 | escenario-06-registrar-propiedad.html | Wizard paso 2: datos propiedad |
| 07 | escenario-07-registrar-exito.html | Pantalla exito con confetti |
| 08 | escenario-08-dashboard.html | Dashboard ciudadano (3 modos: empty/single/multiple) |
| 09 | escenario-09-detalle-revision.html | Detalle revision + tab documentacion |
| 10 | escenario-10-perfil-activo.html | Perfil escenario estilo Airbnb |
| 11 | escenario-11-revisor-dashboard.html | Rol Revisor: dashboard |
| 12 | escenario-12-revisor-detalle.html | Rol Revisor: detalle + aprobacion/rechazo |

## Como crear un escenario nuevo
1. Copiar `escenario-template.html` → `escenario-XX-nombre.html`
2. Cambiar `<title>`, `.page-title`, `.page-sub`
3. Reemplazar el bloque `Contenido del escenario` con el flujo a mostrar
4. Agregar una `<a class="esc-card">` en `index.html` apuntando al archivo

---

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--naranja` | `#FF7500` | Primary orange |
| `--azul` | `#002B5B` | Brand blue |
| `--accent` | `#d74009` | Actions, links, focus, CTA |
| `--text-primary` | `#282834` | Main text |
| `--text-secondary` | `#646587` | Secondary text, hints |
| `--green` | `#1f8923` | Success, completed |
| `--green-bg` | `#e6f4e7` | Success background |
| `--green-border` | `#b7dfb9` | Success border |
| `--blue-info` | `#1f78d1` | Info states |
| `--blue-bg` | `#eef5ff` | Info background |
| `--orange-bg` | `#fff3e6` | Warning/pending bg |
| `--orange-border` | `#ffbf75` | Warning border |
| `--red-bg` | `#fff0ee` | Error bg |
| `--red-border` | `#ffc4bb` | Error border |
| `--purple` | `#7c3aed` | Special states |
| `--surface` | `#ffffff` | Card/modal bg |
| `--bg` | `#ffffff` or `#f5f6fa` | Page background |
| `--border` | `#e7e9f3` | Light borders |
| `--border-dark` | `#d0d4e6` | Strong borders |

### Layout
| Token | Value |
|-------|-------|
| `--sidebar-w` | `274px` (collapsed: `72px`) |
| `--header-h` | `88px` |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `6px` | Buttons, small components |
| `--radius-md` | `8px` | Inputs, controls |
| `--radius-lg` | `12px` | Cards, dropdowns |
| `--radius-xl` | `20px` | Large cards, modals |
| `--radius-full` | `9999px` | Pills, badges, avatars |

### Shadows
| Token | Value |
|-------|-------|
| `--shadow-sm` | `0 1px 4px rgba(0,0,0,.08)` |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,.12)` |
| `--shadow-card` | `0 0 2px rgba(145,158,171,.2), 0 12px 24px -4px rgba(145,158,171,.12)` |

## Typography
- Font: `'Inter', sans-serif`
- Page Title: 22-24px / 700
- Card Title: 15-16px / 700
- Body: 13-14px / 400-500
- Buttons: 13px / 700
- Badges: 10-11px / 700
- Helper: 12px / 400-500
- Nav Labels: 14px / 600

## Layout Structure
```
.shell (flex, 100vh)
├── .sidebar (274px)
│   ├── .sidebar-logo (88px)
│   ├── .sidebar-nav
│   └── .sidebar-bottom
└── .main
    ├── .top-header (88px, user-chip)
    └── .page (scrollable content)
```

## Component Patterns

### Buttons
- Base `.btn`: height 40px, padding 0 20px, radius-md, 13px/700
- `.btn-orange`: naranja bg, white text
- `.btn-accent`: accent bg, white text
- `.btn-outline`: white bg, dark border
- `.btn-sm`: 34px height, 12px font
- `.btn-link`: no bg, accent text, underline hover
- Hover: opacity 0.88 | Active: scale(0.97)

### Cards
- `.card`: surface bg, 1px border, radius-xl, max-width 860px centered
- `.card-header`: flex, gap 14px, padding 24px 28px 18px
- `.card-body`: padding 24px 28px

### Modals
- `.modal-overlay`: fixed inset 0, black 50% opacity, z-index 1000, flex center
- `.modal`: surface bg, radius-xl, 95vw max-width 860px, max-height 90vh
- Sticky header/footer pattern with border separators

### Dropdowns (Floating)
- `.float-dd-wrap`: relative container
- `.float-dd-trigger`: 42px height, accent border on open, arrow rotation
- `.float-dd-menu`: absolute top 100%, smooth max-height/opacity transition
- `.float-dd-opt`: 10px 14px padding, hover bg, selected: orange-bg + accent

### Badges & Status
- `.naowee-badge`: base badge component
- `.naowee-badge--informative`: neutral/borrador (gray)
- `.naowee-badge--caution`: en revision (yellow/orange)
- `.naowee-badge--positive`: activo (green)
- `.naowee-badge--negative`: rechazado (red)
- Pills: radius-full, 1.5px border, flex + gap, selected: green bg/border/text

### Inputs
- Height: 42-44px, padding 0 12px, border 1px border-dark, radius-md
- Focus: accent border, 3px accent shadow

### Tables
- `.naowee-table`: full-width, border-collapse
- Header: text-secondary, 12px/600, uppercase
- Rows: hover bg, border-bottom

### Toasts
- Fixed bottom-right, surface bg, shadow-md, radius-lg
- Success: green left border + green icon
- Auto-dismiss con animacion fadeIn/fadeOut

## Shell (shell.css)
- `.shell` → flex container 100vh
- `.sidebar` → 274px, collapsable (toggle con `.collapsed`)
- `.main` → contenedor flex del contenido principal
- `.top-header` → 88px fijo, user-chip a la derecha
- `.page` → scrollable, padding 28px 32px 40px
- `.page-title` / `.page-sub` → headers de pagina
- `.nav-row` / `.active-bar` → items del sidebar

## Wizard (wizard-shell.css + wizard-shell.js)
- Stepper horizontal de 4 pasos
- `.wizard-stepper` → flex, centered, step circles + connectors
- Paso activo: accent bg, paso completado: green, pendiente: gray
- Navegacion: Anterior/Siguiente con validacion por paso

## Icons
- Inline SVGs throughout
- Stroke-based, `currentColor`, stroke-width 1.2-1.5

## Animations
| Name | Effect | Duration | Easing |
|------|--------|----------|--------|
| `fadeInUp` | opacity + translateY(16px) | 0.4s | cubic-bezier(.4,0,.2,1) |
| `fadeIn` | opacity only | 0.2-0.3s | ease |
| `scaleIn` | opacity + scale(.92) | 0.3-0.35s | cubic-bezier(.4,0,.2,1) |
| `slideInLeft` | opacity + translateX(-20px) | 0.3s | cubic-bezier(.4,0,.2,1) |
| `slideInRight` | opacity + translateX(20px) | 0.3s | cubic-bezier(.4,0,.2,1) |
| `pulse` | box-shadow pulse | 2s infinite | ease-in-out |

## Responsive
- Single breakpoint: `@media(max-width:900px)` — grid switches to 1 column
- Sidebar collapses to 72px (icon-only)
- Modals: 95vw width

## Naming Conventions
- BEM-inspired: `.naowee-btn`, `.naowee-badge`, `.naowee-table`
- State classes: `.active`, `.selected`, `.open`, `.disabled`
- Layout: `.shell`, `.main`, `.sidebar`, `.page`
- Transitions: 0.12s-0.25s on hover/state

## Relacion con Digitacion
- `shared/design-system.css` es **copia sincronizada** de `digitacion-ui-ux-demo/digitacion/design-system.css`
- Si se actualiza el design system en Digitacion, copiar el archivo actualizado aqui
- Mantener la paridad de tokens/componentes entre ambos repos

## Approach
- Think before acting. Read existing files before writing code.
- Prefer editing over rewriting whole files.
- Do not re-read files you have already read unless the file may have changed.
- Antes de crear un componente nuevo, revisar si ya existe en `shared/design-system.css`.
- Estilos especificos del escenario van en `<style>` inline dentro del HTML (no en shared/).
- Test your code before declaring done.
- Keep solutions simple and direct.
- User instructions always override this file.
