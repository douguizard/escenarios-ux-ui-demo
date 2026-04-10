# Naowee Escenarios — Design System Rules

## Project Overview
Módulo **Escenarios** de Naowee. Repo independiente con HTML standalone que hereda el design system del módulo Digitación. Cada escenario ilustra un flujo UX/UI distinto dentro del ecosistema Naowee.

## Tech Stack
- **Language**: HTML, CSS, JavaScript (vanilla)
- **Fonts**: Google Fonts Inter (400, 500, 600, 700, 800)
- **No build tools, no dependencies**
- **Servidor local**: `python3 -m http.server 4300` o similar

## Estructura

```
escenarios-ux-ui-demo/
├── shared/
│   ├── design-system.css   ← Tokens + componentes (copia de digitacion/)
│   └── shell.css           ← Shell, sidebar, header, layout base
├── index.html              ← Landing con grid de escenarios
├── escenario-template.html ← Template base para clonar
└── escenario-XX.html       ← Escenarios individuales
```

## Cómo crear un escenario nuevo
1. Copiar `escenario-template.html` → `escenario-XX-nombre.html`
2. Cambiar `<title>`, `.page-title`, `.page-sub`
3. Reemplazar el bloque `Contenido del escenario` con el flujo a mostrar
4. Agregar una `<a class="esc-card">` en `index.html` apuntando al archivo

## Design System (heredado de Digitación)

### Colores principales
| Token | Valor | Uso |
|-------|-------|-----|
| `--naranja` | `#FF7500` | Primary orange |
| `--azul` | `#002B5B` | Brand blue |
| `--accent` | `#d74009` | Acciones, focus, CTA |
| `--text-primary` | `#282834` | Texto principal |
| `--text-secondary` | `#646587` | Texto secundario |
| `--surface` | `#ffffff` | Fondo cards/modales |
| `--border` | `#e7e9f3` | Bordes suaves |

### Layout
- `--sidebar-w`: `274px` (collapsed `72px`)
- `--header-h`: `88px`
- Responsive: `@media(max-width:900px)` → sidebar colapsa

### Radios
- `--radius-sm` 6px · `--radius-md` 8px · `--radius-lg` 12px · `--radius-xl` 20px · `--radius-full` 9999px

### Tipografía
- Font: `'Inter', sans-serif`
- Page Title: 24px / 700
- Card Title: 15-16px / 700
- Body: 13-14px / 400-500
- Buttons: 13px / 700

## Componentes listos (design-system.css)
El archivo `shared/design-system.css` (5765 líneas) ya incluye: tokens Naowee oficiales (Figma main library), botones, inputs, cards, modales, dropdowns, badges, pills, tablas, stepper, date/time pickers, carousels, etc. **Antes de crear un componente nuevo, revisar si ya existe ahí.**

## Shell (shell.css)
`shared/shell.css` contiene:
- `.shell` → flex container 100vh
- `.sidebar` → 274px, collapsable (toggle con `.collapsed`)
- `.main` → contenedor flex del contenido principal
- `.top-header` → 88px fijo, user-chip a la derecha
- `.page` → scrollable, padding 28px 32px 40px
- `.page-title` / `.page-sub` → headers de página
- `.nav-row` / `.active-bar` → items del sidebar

## Convenciones
- **Cada escenario es standalone**: abrir HTML en browser debe funcionar sin servidor backend
- **Reutilizar antes de crear**: revisar design-system.css y shell.css antes de escribir CSS nuevo
- **Estilos específicos del escenario**: van en `<style>` inline dentro del HTML (no en shared/)
- **Naming**: `escenario-01-nombre-del-flujo.html`, kebab-case

## Relación con Digitación
- `design-system.css` es **copia sincronizada** de `Claude-Doug/digitacion/design-system.css`
- Si se actualiza el design system en Digitación, copiar el archivo actualizado aquí
- Mantener la paridad de tokens/componentes entre ambos repos

## Approach
- Think before acting. Read existing files before writing code.
- Prefer editing over rewriting whole files.
- Keep solutions simple and direct.
- User instructions always override this file.
