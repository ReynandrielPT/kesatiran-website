# Reverse engineering: reveal animation & visual style

Target: <https://charlesleclerc.com/en/>
Method: static analysis of the shipped bundle (no execution). All facts below were
read out of the production assets, not guessed from the rendered page.

## Artifacts inspected

| Artifact | URL | Bytes |
| --- | --- | --- |
| Document | `https://charlesleclerc.com/en/` | 228,894 |
| Stylesheet | `/wp-content/themes/theme-custom/assets/dist/style/style.css?ver=6.78` | 97,136 |
| Entry bundle | `/wp-content/themes/theme-custom/assets/dist/script/output.js?ver=6.78` | 263,368 |
| Chunk 872 (veil) | `/…/script/872.output.js` | 852 |
| Chunk 328 (scroll reveal) | `/…/script/328.output.js` | 3,363 |
| Chunk 207 (section controllers) | `/…/script/207.output.js` | 37,695 |
| Chunk 590 (home timeline) | `/…/script/590.output.js` | 35,522 |
| Chunk 711 (menu / theme) | `/…/script/711.output.js` | 8,660 |

Stack observed in the bundle: **GSAP 3** (`gsap`, `ScrollTrigger`, `SplitText`,
`Observer`, `MotionPathPlugin`, `CustomEase`), **Lenis** smooth scroll (also used in
horizontal mode for overlays), **Embla** carousels, **lil-gui** for the debug panel
(shipped to production, hidden).

WordPress + Tailwind 3.4.13 (utility layer), custom design system on top.

---

## 1. The signature reveal: the "skewed rectangle veil"

This is the page-load and page-transition effect.

**Markup** — two fixed layers, each holding 20 `.rectangles` grids of 8
`.rectangle--skew` divs = **160 rectangles per layer**:

```html
<div id="mask2" class="mask-container rectangle-bg--black">
  <div class="rectangles"><div class="rectangle--skew"></div> ×8</div>
  ×20
</div>
```

**CSS**

```css
#mask, #mask2 {
  position: fixed; top: 50%; left: -20%; width: 140%;
  transform: translateY(-50%) skew(-10deg);
  pointer-events: none; z-index: 998;      /* #mask2 → 1000 */
}
.rectangles { display: grid; grid-template-columns: repeat(8, minmax(0,1fr)); }
.rectangle--skew {
  height: 12vw; margin: -1px;
  will-change: clip-path;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);  /* fully open */
}
```

**Animation** (chunk 872, `intro()`):

```js
// unveil — the veil "dissolves" upward, rectangle by rectangle, in random order
gsap.to(rects, {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",   // collapse to zero height
  duration: 0.15,
  stagger: { amount: 0.7, from: "random" },
});

// cover — used before navigating away
gsap.set(rects, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" });
gsap.to(rects, {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // grow upward to full
  duration: 0.15,
  stagger: { amount: 0.7, from: "random" },
});
```

Two details make it feel premium rather than gimmicky:

1. **`from: "random"`** — the rectangles do not sweep in a wave, they dissolve
   stochastically, so the eye cannot predict the direction.
2. **`skew(-10deg)` on the parent** — every rectangle edge is a slanted line. A
   straight axis-aligned wipe reads as "loading screen"; a skewed one reads as
   "motion design".

Navigation is gated on it: the global link handler calls `cover()`, waits
`1200 ms`, then sets `document.location.href`.

---

## 2. The scroll reveal vocabulary

Chunk 328 (`IntroAnimation`) is a declarative, attribute-driven system. On
`dispatchLoading` it hides every tagged node, then attaches one `ScrollTrigger.batch`
per variant. Shared timing across **all** variants:

```js
{ stagger: 0.15, duration: 1, ease: "power2.out" }
```

| Attribute | From | To | Trigger start |
| --- | --- | --- | --- |
| `data-left` | `opacity 0, y 40, x -40` | `1, 0, 0` | `top 85%` |
| `data-right` | `opacity 0, y 40, x 40` | `1, 0, 0` | `top 85%` |
| `data-bottom` | `opacity 0, y 40` | `1, 0` | `top 85%` |
| `data-bottom-100` | `opacity 0, y 40` | `1, 0` | `top 100%` |
| `data-bottom-small` | `opacity 0, y 10` | `1, 0` | `top 85%` |
| `data-opacity` | `opacity 0` | `1` | `top 85%` |
| `data-opacity-100` | `opacity 0` | `1` | `top 100%` |
| `data-line` | `width 0` | `width auto` | `top 85%` |
| `data-line-100` | `width 0` | `width auto` | `top 100%` |

`data-line*` animates **width**, not `scaleX`, so hairlines grow with their
real layout width — no sub-pixel stretching.

Mobile (`max-width:1024px and orientation:portrait`) re-registers a `-mobile`
suffix set with `once: false` and `onLeaveBack` resets, so scrolling back up
re-hides the element.

Everything is gated behind a `1000 ms` `setTimeout` after load so the intro
veil finishes first.

---

## 3. The CSS cascade ladder (`.tp-motion-*`)

For section content the site does **not** tween in JS. It creates one
`ScrollTrigger` per block with `toggleClass: "tp-st-active"`, `start: "top 82%"`,
`once: true`, and lets CSS transitions do the work:

```js
ScrollTrigger.create({ trigger, start: "top 82%", once: true,
                       toggleClass: "tp-st-active", toggleActions: "play none none none" });
```

| Class | Rest state | Active state | Duration | Delay | Easing |
| --- | --- | --- | --- | --- | --- |
| `.tp-motion-base-line` | `scaleX(0)` | `scaleX(1)` | 1s | 0 | `cubic-bezier(.645,.045,.355,1)` |
| `.tp-motion-base-title` | `translateY(5rem)` | `0` | 0.8s | 0 | `cubic-bezier(.215,.61,.355,1)` |
| `.tp-motion-base-media` | `translateY(10rem)` | `0` | 0.8s | 0.1s | `cubic-bezier(.215,.61,.355,1)` |
| `.tp-motion-base-paragraph` | `translateY(15rem)` | `0` | 0.8s | 0.2s | `cubic-bezier(.215,.61,.355,1)` |
| `.tp-motion-base-column` | `translateX(5rem), opacity 0` | `0, 1` | 1.2s | 0 | `cubic-bezier(.215,.61,.355,1)` |
| `.tp-motion-media` | `translate(-5rem, 5rem), opacity 0` | `0,0,1` | 1s | 0 | `cubic-bezier(.215,.61,.355,1)` |
| `.tp-motion-card` | `scale(.85), opacity 0` | `1, 1` | 1s | 0 | `cubic-bezier(.215,.61,.355,1)` |

The rule of the system: **distance and delay both grow down the reading order**
(5rem/0ms → 10rem/100ms → 15rem/200ms). That is what produces the cascade; it
is a deliberate ladder, not a coincidence.

---

## 4. Text-roll hover (`.ah` / `.ah2`)

Every link and button is a two-layer roll:

```css
.hover-up { position: relative; overflow: hidden; display: inline-block; }
.ah  { position: relative; }
.ah2 { position: absolute; top: 0; left: 0; transform: translateY(100%); }

.animation-text span, .animation-text:after {
  transition: transform .5s cubic-bezier(0, 0, .2, 1);
}
@media (pointer: fine) {
  .hover-animate:hover .ah        { transform: translateY(-105%); opacity: .7; }
  .hover-animate:hover .ah2       { transform: translateY(0); }
}
```

JS (chunk 711) does the same on `mouseenter`/`mouseleave` with `y: -100%` / `y: 0%`
and `ease: "power2.out"`, so the effect works even without the CSS variant.
Prev/next carousel buttons swap the axis: `x: ±110%`.

The `opacity: .7` on the outgoing copy is the tell — it makes the roll read as
depth (receding) rather than as a wipe.

---

## 5. Hero title split reveal

Chunk 207 `L4.reveal()`:

```js
timeline({ defaults: { ease: "power4.inOut" } })
  .fromTo(videoWrap, { scale: 0.92 }, { scale: 1, duration: 1, ease: "power2.out" }, 0)
  .fromTo(video,     { scale: 1.20 }, { scale: 1, duration: 1, ease: "power2.out" }, 0)
  .fromTo(chars, { yPercent: 110, scale: 0.85 },
                 { yPercent: 0,   scale: 1, duration: 1.8, ease: "power3.inOut",
                   stagger: { from: "left", amount: 0.3 } }, 0)
  .fromTo(scrollLabel, { yPercent: 110 }, { yPercent: 0, duration: 1.2 }, 1)
  .fromTo(scrollLine,  { scaleY: 0 },
          { scaleY: 1, duration: 0.6, transformOrigin: "top center" }, 1.5);
```

Note the **counter-scale**: the wrapper comes *up* from 0.92 while the video
inside comes *down* from 1.20. The two moves overlap and cancel into a slow
parallax-ish settle. Doing only one of them looks flat.

---

## 6. Visual system

### Fluid rem base

```css
html { font-size: max(0.69444vw, 10px); }
```

`1rem = 0.69444vw` clamped at 10px. At a 1440px viewport that is 10px, so their
`44.8rem` hero is 448px. This is why every measurement on the site is
viewport-proportional — the whole layout scales as one unit instead of relying on
breakpoints.

### Palette

```css
--black:      #000016;   --black600: #1a1a26;   --black500: #6f6f6f;
--black400:   #9797a5;   --white:    #f1f1f1;   --white300: #ccccd7;
--white200:   #e3e3e3;   --racingRed:#e4032e;   --SteelBlue:#95c4eb;
```

Never pure black, never pure white. `#f1f1f1` on `#000016` is the house pairing.

### Grid

```css
.tp-container { padding-inline: 1.6rem; }            /* 3.2rem ≥768px */
.tp-grid      { grid-template-columns: repeat(6, 1fr); }  /* 12 cols ≥1024px */
.tp-gap-x     { column-gap: 1.2rem; }                /* 1.6 / 2.8rem */
```

### Type scale (rem against the fluid base)

| Token | Size | Line | Tracking | Weight |
| --- | --- | --- | --- | --- |
| `.text-bodyL` | 2.4rem | 110% | -0.024rem | 500 |
| `.text-bodyM` | 2.0rem | 110% | -0.020rem | 500 |
| `.text-bodyS` | 1.5rem | 120% | -0.015rem | 500 |
| `.text-h4` | 5.2rem | 74% | — | 700 |
| `.text-h2` | 30rem | 78% | — | 400 |
| `.text-smallM` | 1.2rem | normal | +0.048rem | 700 uppercase |

Body copy is **tight and slightly negative-tracked**; small caps labels are
**positive-tracked and uppercase**. That contrast is the whole typographic
personality.

### Surfaces

* Radius: `0.5rem` everywhere, `0.8rem` for media. No large radii.
* Hairlines: `.line { height: 0.1rem }` — a 1px rule at the fluid base.
* Button slab: `.button:before { transform: skew(-10deg); border-radius: .5rem }`
  behind `.button-inner { height: 4.3rem }`. The slab is skewed, the label is not.
* `.tp-label:before` — 0.8rem dot with a **4rem** right margin. Enormous gap on
  purpose.

### Easing vocabulary

`power2.out` (reveals), `power3.inOut` (title/mask), `power4.inOut` (dramatic),
`cubic-bezier(.215,.61,.355,1)` (ease-out-cubic, CSS), `cubic-bezier(.645,.045,.355,1)`
(ease-in-out-cubic, lines), `cubic-bezier(0,0,.2,1)` (material, hover rolls).

---

## What was carried over into this project

See `docs/motion.md` for the mapping from each finding to a concrete module.
Deliberate deviations are listed there and each is justified.
