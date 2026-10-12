---
name: Mendoza000 Portfolio
description: Bilingual, Services-led portfolio with adaptive light and dark themes.
colors:
  primary: "#15803d"
  primary-dark: "#166534"
  primary-light: "#4ade80"
  neutral-bg: "#f5f5f4"
  neutral-bg-dark: "#18181b"
  neutral-text: "#27272a"
  neutral-text-dark: "#f4f4f5"
  neutral-muted: "#52525b"
  neutral-muted-dark: "#d4d4d8"
  neutral-border: "#d4d4d4"
  neutral-border-dark: "#3f3f46"
typography:
  display:
    fontFamily: "Barlow, sans-serif"
    fontSize: "clamp(2.2rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Barlow, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Barlow, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "0.35rem"
  md: "0.55rem"
  lg: "0.65rem"
spacing:
  section: "clamp(3rem, 6vw, 6rem)"
  container-gutter: "1.25rem"
components:
  action-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "0.55rem"
    padding: "0.7rem 1rem"
    height: "3rem"
  process-card:
    backgroundColor: "{colors.neutral-bg}"
    rounded: "0.55rem"
    padding: "1.25rem"
---

# Design System: Mendoza000 Portfolio

## Overview

The implemented identity is Services-led: shared typography, spacing, borders, adaptive neutrals, and green accents extend the Services section's visual language across the bilingual portfolio. Services illustrations remain specific to Services; they are not a general-purpose decoration system. The interface is implemented in Spanish and English, with light and dark themes.

This is a snapshot of observed code, not a proposal for future work. Five peer section headings—Services, Projects, Experience, Process, and Contact—use one decorative Phosphor Regular icon from the existing `react-icons/pi` package through the shared typed `PortfolioIcon` component. They are ordered icon-left, before the title: tools, folder, briefcase, list-checks, and chat. The SVGs are inline in the server-rendered output, sized 1em square, nonshrinking (`flex: 0 0 auto`), and aligned to the first text line; the shared icon color is `#15803d` in light mode and `#4ade80` in dark mode. Existing heading gap styling is retained, and icons are decorative (`aria-hidden`, not icon-only hydration). Official technology logos and unused legacy icon families remain intentional exceptions; Hairline artwork is unchanged, and its Service CTA arrow uses Phosphor. Shared section spacing is a total inter-section gap of `clamp(3rem, 6vw, 6rem)`, split evenly as half-padding on each adjoining section; separate header-to-content spacing remains 1.75rem. This supersedes the earlier per-section padding-only interpretation. At 390/820/1440 CSS pixels, measured heading sizes are 32/32.8/48px, and outer gutters are 20/20/80px. Measured text contrast is 13.63:1 in light mode and 16.31:1 in dark mode. Final spacing measurements: independent report `mv5f88q5-z-ot1h`, 12 ES/EN × light/dark cases at 390/820/1440 CSS pixels plus 1920px ES dark. Services→Projects / Skills→Experience / Experience visible text→Process / lowest Process card→Contact gaps measured 48/49/51.6/49px at 390, 49.2/50.2/52/50.2px at 820, 86.4/87.4/89.2/87.4px at 1440, and 96/97/98.8/97px at 1920. Border/leading effects account for differences of at most 4px. Projects has a bilingual intro with 28px from heading to intro and 28px from intro to cards. Contact is top-aligned, not vertically centered. Earlier 56/57.4/96px per-section padding figures are historical and superseded.

**Key Characteristics:**
- Services-led shared visual grammar; Services-specific illustrations.
- Barlow typography, restrained borders and adaptive neutral surfaces.
- Green interaction accents; Spanish/English and light/dark support.

## Colors

Green is the action and emphasis color; neutral text, surfaces, muted copy, and borders adapt between the light and dark themes. These values are the implemented portfolio tokens, not a claim that every legacy section uses identical values.

### Primary
- **Green action** (`#15803d`): Primary actions, process numbering, and emphasis in the light theme.
- **Deep green** (`#166534`): Primary-action hover and related green emphasis.
- **Light green** (`#4ade80`): Green emphasis and process accents in the dark theme.

### Neutral
- **Light surface** (`#f5f5f4`): Portfolio surface in light mode.
- **Dark surface** (`#18181b`): Portfolio surface in dark mode.
- **Light text** (`#27272a`) and **dark-mode text** (`#f4f4f5`): Main portfolio text.
- **Muted text** (`#52525b` / `#d4d4d8`): Secondary copy in light / dark mode.
- **Borders** (`#d4d4d4` / `#3f3f46`): Dividers and component outlines in light / dark mode.

## Typography

**Display Font:** Barlow (with sans-serif fallback)  
**Body Font:** Barlow (with sans-serif fallback)

**Character:** A shared sans-serif family supports both large, tightly tracked portfolio headings and readable supporting copy. The layout uses weight and size contrast rather than a separate display family.

### Hierarchy
- **Display** (700, `clamp(2.2rem, 6vw, 4.5rem)`, line-height 1.03): Offer headline.
- **Headline** (700, `clamp(2rem, 4vw, 3rem)`, line-height 1.08): Section headings.
- **Body** (400, 1.125rem, line-height 1.6): Introductory and supporting copy; commonly constrained to 68ch.
- **Navigation and actions** (600): Stronger-weight interactive labels.

## Layout

The main portfolio container is capped at 80rem and centered; its shared wrapper is `width: min(100% - 2.5rem, 80rem)`, giving 1.25rem outer gutters until the max-width applies. The shared section-gap token is total gap `clamp(3rem, 6vw, 6rem)`, split into two equal half-paddings; header-to-content spacing is separate at 1.75rem. Project and experience layouts adapt from single-column mobile layouts to two-column tablet layouts. Earlier per-section padding figures are historical, not current spacing claims.

The four-step Process sequence is DOM-ordered 1→2→3→4. It is one column on narrow screens, a tablet serpentine grid with 3 at bottom-right and 4 at bottom-left, and a four-card row at desktop widths. Motion connectors are drawn once when the section enters view; reduced-motion preference renders them statically. In the current mobile markup each connector SVG is inside its preceding card, not in the gap; do not assume every connector bridges the gap. Geometry was independently checked at 390, 700, 820, and 1440 CSS pixels.

The Services grid uses one column below 768px, two columns from 768px, and three from 1100px. The navigation is sticky and switches to a stacked arrangement at 40rem and below.

## Elevation & Depth

The documented shared portfolio styling conveys separation with tonal surfaces, thin borders, and spacing; no shared box-shadow token is defined in the inspected stylesheet. Do not infer that unrelated legacy sections have no shadows.

## Shapes

Cards and controls use modest rounded corners rather than pill silhouettes: portfolio actions and Process cards use 0.55rem, project cards 0.65rem, and small tags 0.35rem. Borders are thin and neutral; cards clip overflowing project imagery.

## Components

### Navigation
A sticky, surface-colored navigation bar uses a bottom border, medium-weight links, and a responsive stacked layout on narrow screens. Theme switching is a bordered control. Hover uses green emphasis; keyboard focus is shown with a 3px green outline and 2px offset, with a lighter green outline in dark mode.

### Actions
Primary actions use a green fill, white text, medium rounded corners, and a minimum 3rem height. Secondary actions use green text and a transparent resting background. Both have a short color transition; hover darkens the primary or adds a subtle green wash to the secondary.

### Cards / Containers
Process cards use the adaptive surface, neutral border, and 1.25rem padding (1.5rem at tablet widths). Project cards use the same adaptive surface and border with 0.65rem corners. Services cards and their illustrations are specific to the Services section and should not be generalized into a portfolio-wide illustration style.

### Process sequence
The numbered ordered list is laid out using CSS grid. Connectors are decorative inline SVGs; the one-shot drawing completes when the section becomes visible. Reduced-motion preference disables the drawing animation and shows the connector statically.

### Contact
Contact presents the intro and actions in columns from 48rem; below that, they stack, with the action list following the intro. Keep email and CV as the primary actions, with social links in a compact secondary group. Contact items use a 3rem minimum height for primary actions and 2.75rem for social links (at least 44px); long email text wraps anywhere. Email uses a `mailto:` link; other links open in a new tab with `rel="noopener noreferrer"`.

### Section heading icons
The five peer section headings use `PortfolioIcon` names `tools`, `folder`, `experience`, `process`, and `contact`, backed by unsuffixed Phosphor Regular exports from `react-icons/pi`. The shared typed React component renders the icons as inline SVG during SSR; heading use is decorative, with no icon-only client hydration. Keep icon first, title second; preserve the existing heading gap, 1em square, nonshrinking behavior, first-text-line alignment, and shared light/dark green colors. The existing five portable component examples remain intact; their inline icon-free HTML remains unchanged.

## Do's and Don'ts

### Do:
- **Do** preserve the shared Barlow, spacing, border, adaptive-neutral, and green language when extending the implemented portfolio.
- **Do** keep Spanish/English content and light/dark theme behavior in view.
- **Do** retain the Process sequence's DOM order and responsive visual topology.
- **Do** keep Hairline illustrations within the Services visual context.

### Don't:
- **Don't** describe mobile Process connectors as universally bridging card gaps; their SVGs live inside the preceding card.
- **Don't** describe stale icon-family migration as pending: the five heading icons use Phosphor Regular; official technology logos and unused legacy icon families are intentional exceptions.
- **Don't** treat the Contact body/pending peer-envelope scope as implemented here; this snapshot documents its current top-aligned composition only.
- **Don't** claim unverified browser or accessibility coverage as part of this design snapshot.
