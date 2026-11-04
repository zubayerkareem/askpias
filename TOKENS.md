# TOKENS.md — design tokens as they exist in code

Source of truth: `src/styles.css` (Tailwind v4 `@theme inline` + CSS variables).
Rule stated in the file itself: "All colours are oklch semantic tokens; never hardcode
colours in components." (`src/styles.css:13`)

## Typography
| Token | Value | Source |
| --- | --- | --- |
| `--font-sans` | `"Manrope", "Hind Siliguri", system-ui, -apple-system, "Segoe UI", sans-serif` | `src/styles.css:17` |
| `--font-display` | `"Bricolage Grotesque", "Arial Black", system-ui, sans-serif` | `src/styles.css:18` |
| Loading | Google Fonts: Bricolage Grotesque 400–800, Manrope 400–800, Hind Siliguri 400–700 | `src/routes/__root.tsx` (`fonts.googleapis.com` link) |
| Heading weight | `800`, letter-spacing `-0.035em`, line-height `1.02` | `src/styles.css:208-217` |
| Body | `1rem` / `1.6` | `src/styles.css:197-206` |

The stack is a per-glyph fallback: Latin text picks Manrope, Bengali glyphs fall through to
Hind Siliguri. Don't collapse it to a single family.

Type utilities (`@utility`):
- `h-display` — `clamp(3rem, 6.6vw, 5.75rem)`, lh `0.9`, tracking `-0.045em` (`:236`)
- `h-page` — `clamp(2.4rem, 4.8vw, 4rem)`, lh `0.95` (`:244`)
- `h-section` — `clamp(2rem, 3.6vw, 3.25rem)`, lh `0.98` (`:252`)
- `label` — 13px/700, colour `--accent-text` (`:260`)
- `meta` — 12px/500, tabular numerals (`:268`)
- `eyebrow` — 13px/700, muted (`:277`)

## Colour — light (`:root`, `src/styles.css:65-125`)
| Token | Value |
| --- | --- |
| `--background` | `#fdfaf3` (cream canvas) |
| `--foreground` | `#101012` |
| `--page` | `#ffffff` |
| `--line` | `rgba(16,16,18,0.1)` |
| `--surface` / `--surface-2` | `#f4efe4` / `#ece6d8` |
| `--brand`, `--primary`, `--accent` | `#0141c5` |
| `--brand-bright` | `#0141c5` |
| `--brand-foreground` | `#ffffff` |
| `--brand-soft` | `#e7eefb` |
| `--accent-text` | `#0141c5` |
| `--sheet` | `oklch(0.998 0 0)` |
| `--sheet-foreground` | `oklch(0.17 0.012 300)` |
| `--sheet-muted` | `oklch(0.48 0.014 300)` |
| `--muted-foreground` | `oklch(0.47 0.014 300)` |
| `--destructive` | `oklch(0.55 0.2 26)` |
| `--ring` | `#0141c5` |
| `--grid-line` | `rgba(16,16,18,0.07)` |
| `--glass-bg` | `rgba(255,255,255,0.62)` |

## Colour — dark (`.dark`, `src/styles.css:128-184`)
| Token | Value |
| --- | --- |
| `--background` | `oklch(0.175 0.022 298)` |
| `--foreground` | `oklch(0.97 0.004 300)` |
| `--page` | `oklch(0.205 0.018 298)` |
| `--brand`, `--primary` | `#4d82f0` |
| `--brand-bright` | `#7aa6f8` |
| `--brand-foreground` | `#ffffff` |
| `--brand-soft` | `oklch(0.3 0.06 260)` |
| `--line` | `oklch(1 0 0 / 0.12)` |
| `--accent-text` | `#8ab0f7` |
| `--muted-foreground` | `oklch(0.72 0.012 300)` |
| `--sheet` | `oklch(0.985 0.002 300)` (sheets stay light in both themes) |
| `--grid-line` | `oklch(1 0 0 / 0.06)` |
| `--glass-bg` | `oklch(0.26 0.014 300 / 0.46)` |

## Radius
`--radius-sm 4px`, `-md 6px`, `-lg 10px`, `-xl 14px`, `-2xl 18px`, `-3xl 24px`,
`-4xl 32px`; `--radius: 0.75rem` (`src/styles.css:20-26`, `:67`).

## Surfaces / utilities
- `canvas-grid` — 64×64px graph-paper grid from `--grid-line` (`:287-292`)
- `sheet` — `--sheet` bg, 1px `--sheet-border`, radius `--radius-2xl` (`:295-300`)
- `sheet-shadow` — `0 40px 80px -40px oklch(0 0 0 / .55)` + `0 2px 6px -2px` (`:302-306`)
- `page-sheet` — white page, radius `--radius-3xl`, shadow `0 40px 90px -70px` (`:309-314`)
- `.glass` tokens: `--glass-bg`, `--glass-border`, `--glass-highlight` (`:120-122`, `:179-181`)
- `.video-embed` — responsive embed wrapper (`:317+`)

## Layout & spacing (observed usage)
- Content max width **1280px**: `max-w-[1280px]` (`src/components/site/PageShell.tsx`)
- Section padding pattern: `px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20`
  (e.g. `src/routes/about.tsx`, `src/routes/notes/$slug.tsx:51`)
- Header offset: `pt-20 sm:pt-24` on `<main>` (`PageShell.tsx`)
- Grid gap scale in use: `gap-3/4/5/6/10/16` (same files)

## Admin (Filament) brand
- Panel primary colour `Color::hex('#0141C5')`, brand name `AskPias`
  (`backend/app/Providers/Filament/AdminPanelProvider.php`).
- Admin CSS overrides live in `resources/css/filament/admin/theme.css` and are injected via
  `PanelsRenderHook::STYLES_AFTER` → `filament.admin-theme` view (`AdminPanelProvider.php`).
