<!-- SEED — re-run $impeccable document once there's code to capture the actual tokens and components. -->

---
name: Portfolio
description: CRO Expert, Shopify and WordPress Developer — dark, technical, premium one-page portfolio
---

# Design System: Portfolio

## 1. Overview

**Creative North Star: "The Precision Instrument"**

This system is built on a single premise: the design is the proof. A CRO expert and developer who understands conversion doesn't need decoration — the interface itself demonstrates the skill. Every choice is deliberate, every element has a job. The surface is dark not for atmosphere, but because contrast is leverage.

The color strategy is Committed: one dominant dark surface tone carries the identity, punctuated by a single precise accent used with intention. No gradients hedging between choices. No color noise. One voice, one direction.

Motion is choreographed — orchestrated scroll-driven entrances reward the visitor's attention without distracting from the work being showcased. Animation earns its place by reinforcing hierarchy and signaling quality of execution, never decorating for its own sake.

**Key Characteristics:**
- Near-black dominant surface with a single committed accent
- Single geometric sans at all scales — precision through repetition
- Choreographed scroll sequences with exponential easing, 40–80ms sibling stagger
- Typography-led hierarchy; no decorative illustration or iconography
- Flat by default; elevation earned through interaction only

## 2. Colors

A dominated dark surface with one cold, precise accent. The darkness is the brand — it signals focus, expertise, and control.

### Primary
- **Deep Carbon** [to be resolved during implementation]: The dominant surface. Covers 50–70% of the visible screen. Near-black with a slight cool undertone — not pure black. This IS the identity. The committed color.

### Neutral
- **Cold Paper** [to be resolved during implementation]: High-contrast reading text on dark surfaces. Slightly cool-tinted — not pure white. Primary text and headline color.
- **Muted Carbon** [to be resolved during implementation]: Secondary text, dividers, inactive labels, metadata. Same hue family as Deep Carbon, stepped up in lightness. Never a warm gray.

### Named Rules
**The One Accent Rule.** One saturated accent color exists in this system. It appears on interactive elements, primary CTAs, and the single most important highlight per section. Its rarity is its power — diluting it across decorative uses destroys the signal. If you are unsure whether something earns the accent, it doesn't.

**The No-Gradient Rule.** Gradients are prohibited in all contexts — linear, radial, conic, mesh. A gradient signals a designer hedging between two choices. Pick one color and commit.

**The No-Multicolor Rule.** This system has one accent. A second accent color introduced anywhere is not a refinement — it is a contradiction of identity. Prohibited.

## 3. Typography

**Primary Font:** Single geometric sans [font pairing to be chosen at implementation — Inter and DM Sans are explicitly prohibited; prefer Geist, Neue Haas Grotesk, or Söhne]

**Character:** One family, all weights. Precision through repetition — the same typeface at different scales creates hierarchy without tonal inconsistency. Technical without coldness. Authoritative without decoration.

### Hierarchy
- **Display** (thin or light weight, large fluid scale, tight leading ~0.95–1.0): Section-opening statements. Hero headline. Maximum one per viewport. Signals confidence through scale, not style.
- **Headline** (medium weight, mid-large scale, leading ~1.1–1.2): Section headings, project titles. The primary hierarchy workhorse.
- **Title** (medium weight, smaller scale, leading ~1.2–1.3): Service names, card headings, sub-section labels.
- **Body** (regular weight, base scale, leading ~1.6–1.7, max 65–75ch): Case study copy, service descriptions, about text. Comfortable at reading pace.
- **Label** (medium weight, small scale, tracked 0.08–0.12em, uppercase): Navigation, category tags, metadata, section markers. The precision accent of the typographic system.

### Named Rules
**The One Family Rule.** One sans-serif at all scales and weights. No display/body pairings, no mono used decoratively. The constraint is the identity.

**The No-Inter Rule.** Inter is prohibited. It signals no typographic opinion and reads immediately as template. Every project using Inter has already lost the distinctiveness argument.

## 4. Elevation

Flat by default. Depth is conveyed through tonal layering — stepped lightness values on the same cool hue family — not drop shadows. A resting element casts no shadow.

Shadows appear only as a direct response to interaction state: a slight lift on portfolio card hover, a brightened border on focused inputs. Ambient shadows on static elements are prohibited.

**The Flat-by-Default Rule.** If an element is at rest, it casts no shadow and claims no elevation. Elevation is earned by interaction, not assigned by component type.

## 5. Components

*[Components to be documented once implementation begins. Re-run `$impeccable document` to capture real tokens and component patterns.]*

Anticipated key components: portfolio showcase card (primary unit — vary scale and prominence by project weight, never an identical grid), primary CTA button (the One Accent Rule applies here first), fixed navigation bar (scroll-triggered opacity transition), service item, contact form inputs.

## 6. Do's and Don'ts

### Do:
- **Do** apply the single accent color only to interactive elements, primary CTAs, and one key highlight per section. Scarcity is the signal.
- **Do** choreograph scroll-driven entrances with exponential easing (ease-out-quart or ease-out-expo). Stagger sibling elements 40–80ms. Orchestrate the page, not individual components.
- **Do** tint every neutral toward the primary cool hue — even chroma 0.005 is enough. Pure `#000000` and `#ffffff` are prohibited.
- **Do** let whitespace and typographic scale carry the hierarchy. If you are reaching for a decorative element, remove it instead.
- **Do** vary portfolio card scale, weight, and prominence by project importance. The most important work gets the most visual real estate.
- **Do** write copy that earns its place. If a sentence restates the heading, delete it.

### Don't:
- **Don't** use Inter. It signals no typographic opinion and reads as template at a glance.
- **Don't** use gradients anywhere — on backgrounds, text, borders, or overlays. This is an unconditional ban.
- **Don't** use multiple accent colors. A second accent is noise, not identity.
- **Don't** use `background-clip: text` with any gradient. Decorative, never meaningful.
- **Don't** use glassmorphism as a default card or panel treatment. Blur and translucency are decorative shortcuts.
- **Don't** build the portfolio as an identical card grid (same size, icon + heading + text, repeated). That is the AI slop template.
- **Don't** animate layout properties — no transitions on width, height, top, left, or margin. Animate transform and opacity only.
- **Don't** let motion run without purpose. Every animation must reinforce hierarchy or confirm state. Decoration is noise.
- **Don't** use a side-stripe border (border-left or border-right greater than 1px as a colored accent) on any card, callout, or list item.
