# Design System Strategy: The Breathable Interface

## 1. Overview & Creative North Star
**Creative North Star: "The Cognitive Sanctuary"**

Standard productivity apps often fail users with ADHD by creating "visual noise"—cluttered grids, harsh borders, and high-contrast alerts that trigger anxiety rather than action. This design system rejects the "hustle-culture" aesthetic in favor of an editorial, soft-focus environment. 

We are building a **Cognitive Sanctuary**. This is achieved through intentional asymmetry (giving the eye a clear path to follow), tonal depth (using color to imply priority), and a "Post-Material" approach where containers feel like weightless sheets of silk rather than rigid boxes. By removing traditional structural lines and embracing a pastel-utility palette, we reduce the "friction of looking," allowing the user’s focus to land exactly where it needs to be without the weight of a complex UI.

---

## 2. Colors & Tonal Architecture
The palette is rooted in a calming Lake Blue (`#0B5C7A`), evolved into a sophisticated spectrum of functional pastels that evoke the stillness of a misty morning lake.

### The "No-Line" Rule
**Explicit Instruction:** Solid 1px borders are strictly prohibited for sectioning or containment. Traditional lines act as "visual speedbumps" for ADHD brains. Instead, define boundaries through:
- **Tonal Shifts:** Placing a `surface-container-low` section against a `background`.
- **Negative Space:** Using large gutters to imply separation.

### Surface Hierarchy & Nesting
Think of the UI as a series of physical layers. Use the `surface-container` tiers to create a "nested" depth that guides the user from the general to the specific:
- **Base Level:** `background` (#F5F8FB) – The canvas (misty morning water).
- **Section Level:** `surface-container-low` (#E8EFF5) – Large groupings (shallow water).
- **Interactive Level:** `surface-container-lowest` (#ffffff) – High-focus cards or inputs that "lift" off the page.

### The "Glass" Rule
To elevate the experience from "minimalist" to "premium," use **Glassmorphism** for floating elements (like persistent action buttons or navigation). Use `surface` colors at 70% opacity with a `24px` backdrop blur — this mimics light diffusing through still water without introducing color transitions.

**Flat Color Principle:** Primary CTAs use the solid `primary` (#0B5C7A) Lake Deep. **No color gradients.** Gradients introduce visual motion that competes for attention; the sanctuary is defined by stillness. Tactility comes from the Ambient Shadow, subtle hover-state saturation shifts, and the Ghost Border on focus — not from painted depth. (Exception: fade-to-transparent edge-softening on dividers is permitted, since it creates *absence*, not a color transition.)

---

## 3. Typography: The Editorial Rhythm
We utilize **Plus Jakarta Sans**, a modern geometric sans-serif with open apertures that maximize legibility for neurodivergent readers.

- **Display & Headline (The Narrative):** Use `display-md` and `headline-lg` to create clear, unmissable anchors on the page. These should be set with tight letter-spacing (-0.02em) to feel like a high-end magazine.
- **Body & Labels (The Utility):** `body-lg` is the workhorse. Ensure a generous line-height (1.6) to prevent "text crowding," which can lead to visual overstimulation.
- **Hierarchy as Focus:** Use `title-lg` in `on_surface` for active tasks, and `body-md` in `on_surface_variant` for completed or secondary tasks. The shift in weight and color provides an immediate, non-verbal status update.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering**, not structural shadows.

- **The Layering Principle:** Avoid the "flat" look by stacking surfaces. A card using `surface-container-highest` (#CFDCE6) placed on a `surface` (#F5F8FB) provides enough contrast to be distinct without the need for a stroke.
- **Ambient Shadows:** When an element must float (e.g., a Modal or a FAB), use an "Ambient Shadow." 
    - *Formula:* `0px 12px 32px rgba(36, 50, 61, 0.06)`. 
    - The shadow is tinted with the `on_surface` color (a cool slate blue), making it feel like a natural part of the environment.
- **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in a high-glare environment), use the `outline_variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons & Chips
- **Primary Button:** Large roundedness (`xl` - 3rem). Solid `primary` (#0B5C7A) fill — no gradients. No shadow, except on hover (Ambient Shadow). Hover raises saturation subtly over 400ms for "tactile" feedback.
- **Secondary/Selection Chips:** Use `secondary_container` (#D5E4EE) with `on_secondary_container` text. When unselected, use `surface_container_high`.
- **Interaction:** All interactive elements must have a `400ms` ease-out transition on hover, subtly increasing the background saturation.

### Input Fields
- **Styling:** Use `surface_container_lowest` (#ffffff) for the input body. 
- **Focus State:** Instead of a thick border, use a 2px "Ghost Border" of `primary` and a subtle inner glow.
- **Micro-Copy:** Helper text must use `label-md` in `on_surface_variant` to keep the UI quiet.

### Cards & Lists (The "No Divider" Rule)
- **Cards:** Use `lg` (2rem) or `xl` (3rem) corner radius. Forbid the use of divider lines between list items. 
- **The Alternating Surface:** Separate list items by alternating between `surface` and `surface_container_low`, or simply by providing `1.5rem` of vertical whitespace.

### Contextual "Nudge" Tooltips
- **Styling:** Soft-focus `tertiary_container` (#A8CFE3) with `on_tertiary_container` text. 
- **Placement:** Always offset from the center to maintain the "intentional asymmetry" of the system.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace White Space:** If the layout feels "empty," you are likely on the right track. White space is a functional tool for reducing cognitive load.
- **Use "Soft" Corners:** Stick to the `lg` (2rem) and `xl` (3rem) tokens. Sharp corners create "visual spikes" that increase tension.
- **Prioritize Tonal Contrast:** Ensure that `on_surface` text always meets WCAG AA standards against its respective `surface-container`.

### Don't:
- **No 1px Lines:** Never use a solid line to separate content. Use a background color shift instead.
- **No Pure Black:** Never use `#000000`. Use `on_background` (#24323D — a cool slate blue) to keep the contrast "soft-focus."
- **No Chaotic Motion:** Avoid "pop" animations. Use "glide" or "fade-in" transitions to keep the user’s nervous system regulated.
- **No Center-Align Overload:** While some editorial moments call for it, over-centering can make it hard for ADHD eyes to find the "start" of a line. Stick to left-aligned body text with asymmetric headers.