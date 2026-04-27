# Design System Strategy: The Breathable Interface

## 1. Overview & Creative North Star
**Creative North Star: "The Cognitive Sanctuary"**

Standard productivity apps often fail users with ADHD by creating "visual noise"—cluttered grids, harsh borders, and high-contrast alerts that trigger anxiety rather than action. This design system rejects the "hustle-culture" aesthetic in favor of an editorial, soft-focus environment. 

We are building a **Cognitive Sanctuary**. This is achieved through intentional asymmetry (giving the eye a clear path to follow), tonal depth (using color to imply priority), and a "Post-Material" approach where containers feel like weightless sheets of silk rather than rigid boxes. By removing traditional structural lines and embracing a pastel-utility palette, we reduce the "friction of looking," allowing the user’s focus to land exactly where it needs to be without the weight of a complex UI.

---

## 2. Colors & Tonal Architecture
The palette is **one calm sky-blue accent on neutral cool gray**. Visual stimulation is minimized to a single point of color so attention has nowhere to scatter.

### Token Reference
| Role | Hex | Usage |
|---|---|---|
| `bg` | `#EEF1F5` | App canvas — neutral cool gray |
| `surface` | `#FFFFFF` | Cards, inputs, lifted surfaces |
| `border` | `#E4E9F0` | Ghost borders, dividers |
| `text` | `#1F2937` | Primary text |
| `muted` | `#6B7280` | Secondary text, metadata |
| `accent` | `#1F76EB` | The single point of color — CTAs, active state, focus ring |
| `accent-soft` | `#E8F0FC` | Selected chip background, accent hover surface |

### The "No-Line" Rule
**Explicit Instruction:** Solid 1px borders are strictly prohibited for sectioning or containment. Traditional lines act as "visual speedbumps" for ADHD brains. Instead, define boundaries through:
- **Tonal Shifts:** Placing `surface` (#FFFFFF) cards on the `bg` (#EEF1F5) canvas.
- **Negative Space:** Using large gutters to imply separation.
- **Ghost Border (when essential):** `border` (#E4E9F0) at 15% opacity. Should be felt, not seen.

### Surface Hierarchy
Two layers, not five. Simplicity is the point:
- **Base:** `bg` (#EEF1F5) – The canvas.
- **Lifted:** `surface` (#FFFFFF) – Cards, inputs, modals.

### The "Glass" Rule
For floating elements (sidebar, FAB), use **Glassmorphism**: `surface` at 70% opacity with `24px` backdrop blur. Adds premium depth without introducing color.

### The "Single Point" Principle
**Only `accent` (#1F76EB) carries color. Everything else is gray.** This is the entire color philosophy. Gradients are forbidden. Multi-color schemes are forbidden. The accent appears on:
- Primary CTAs
- Active navigation state
- Focus rings
- Progress indicators
- Brand mark

`accent-soft` (#E8F0FC) is the accent's only companion — used for chip selection states and subtle accent surfaces. Tactility comes from Ambient Shadow, 400ms hover-saturation shifts, and Ghost Border on focus — not from painted depth. (Exception: fade-to-transparent edge-softening on dividers is permitted, since it creates *absence*, not a color transition.)

---

## 3. Typography: The Editorial Rhythm
We utilize **Plus Jakarta Sans**, a modern geometric sans-serif with open apertures that maximize legibility for neurodivergent readers.

- **Display & Headline (The Narrative):** Use `display-md` and `headline-lg` to create clear, unmissable anchors on the page. These should be set with tight letter-spacing (-0.02em) to feel like a high-end magazine.
- **Body & Labels (The Utility):** `body-lg` is the workhorse. Ensure a generous line-height (1.6) to prevent "text crowding," which can lead to visual overstimulation.
- **Hierarchy as Focus:** Use `title-lg` in `on_surface` for active tasks, and `body-md` in `on_surface_variant` for completed or secondary tasks. The shift in weight and color provides an immediate, non-verbal status update.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering**, not structural shadows.

- **The Layering Principle:** A `surface` (#FFFFFF) card on the `bg` (#EEF1F5) canvas provides enough tonal contrast to be distinct without a stroke.
- **Ambient Shadows:** When an element must float (e.g., a Modal or a FAB), use an "Ambient Shadow." 
    - *Formula:* `0px 12px 32px rgba(31, 41, 55, 0.06)`. 
    - The shadow is tinted with the `text` color, making it feel like a natural part of the environment.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use `border` (#E4E9F0) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons & Chips
- **Primary Button:** Large roundedness (`xl` - 3rem). Solid `accent` (#1F76EB) fill with white text — no gradients. No shadow, except on hover (Ambient Shadow). Hover raises saturation subtly over 400ms for "tactile" feedback.
- **Secondary Button:** `surface` (#FFFFFF) fill with `text` color. Used when the action is non-primary.
- **Selection Chips (selected):** `accent-soft` (#E8F0FC) background with `accent` (#1F76EB) text.
- **Selection Chips (unselected):** `surface` (#FFFFFF) with `muted` (#6B7280) text.

### Input Fields
- **Styling:** Use `surface` (#FFFFFF) for the input body on the `bg` canvas.
- **Focus State:** 2px "Ghost Border" in `accent` (#1F76EB) with a subtle `accent-soft` inner glow.
- **Micro-Copy:** Helper text must use `muted` (#6B7280) to keep the UI quiet.

### Cards & Lists (The "No Divider" Rule)
- **Cards:** `surface` (#FFFFFF) on `bg` canvas. Use `lg` (2rem) or `xl` (3rem) corner radius. Forbid divider lines between list items.
- **Separation:** Alternate `surface` and `bg`, or provide `1.5rem` of vertical whitespace.

### Contextual "Nudge" Tooltips
- **Styling:** `accent-soft` (#E8F0FC) background with `accent` (#1F76EB) text.
- **Placement:** Always offset from the center to maintain the "intentional asymmetry" of the system.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace White Space:** If the layout feels "empty," you are likely on the right track. White space is a functional tool for reducing cognitive load.
- **Use "Soft" Corners:** Stick to the `lg` (2rem) and `xl` (3rem) tokens. Sharp corners create "visual spikes" that increase tension.
- **Prioritize Tonal Contrast:** Ensure that `on_surface` text always meets WCAG AA standards against its respective `surface-container`.

### Don't:
- **No 1px Lines:** Never use a solid line to separate content. Use a background color shift instead.
- **No Pure Black:** Never use `#000000`. Use `text` (#1F2937) to keep the contrast "soft-focus."
- **No Multi-Color Schemes:** Only `accent` (#1F76EB) carries color. Resist the urge to assign different hues to categories, statuses, or tabs — use weight, position, or `accent-soft` instead.
- **No Chaotic Motion:** Avoid "pop" animations. Use "glide" or "fade-in" transitions to keep the user’s nervous system regulated.
- **No Center-Align Overload:** While some editorial moments call for it, over-centering can make it hard for ADHD eyes to find the "start" of a line. Stick to left-aligned body text with asymmetric headers.