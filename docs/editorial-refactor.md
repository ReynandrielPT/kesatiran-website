# Editorial component refactor

Reference: https://charlesleclerc.com/en/, observed 2026-11-02.

## Evidence and boundaries

REA discovery: `ev_c14782e756facfff75b07a42e45e9d6aa582735f82ba09ca37d3917dc3e56c04`.
REA page inspection: `ev_100cc94715777677c66a919da775a4bdc90e833436fd4aaa392d3481a2fd3d2d`.
Inspection is attach-window evidence, filtered to the reference origin; it cannot recover prior network traffic or establish which animation code executed. The existing static bundle investigation in motion-reverse-engineering.md remains the source for exact timings and library attribution.

Direct browser observations after dismissing cookie consent: full-screen photographic/video opening, oversized condensed BEYOND SPEED title, Chapters navigation, scroll cue, and sections for biography, statistics, racing history and media. Desktop section markup uses absolute positioning; mobile sections switch to relative flow. This is a choreographed chapter composition rather than a dashboard of rounded cards.

## Implementation decisions

Replace the four primary landing pages and shared navigation/footer. Use existing Kesatiran imagery and content, not reference brand assets. Build shared ChapterTitle, EditorialImage and TextLink components, a full-screen chapter menu, asymmetric portrait and work compositions, image parallax, a media-led home opening, and a dark closing section. Reuse the previously extracted split-title, reveal and skew-veil primitives. This is an adaptation in React/Framer Motion, not the original WordPress/GSAP implementation or its complete horizontal timeline.

Works keeps image galleries and native audio/video playback behind an accessible dialog. Team links to the existing profile routes; Games links to existing game details. Those detail views retain their content and existing feature implementations. Reduced motion bypasses parallax and CSS hero motion. Dialogs close on Escape, trap keyboard navigation, restore focus and lock background scrolling.

## Checklist

- Reference component structure: answered by DOM and direct rendered observation.
- Animation implementation: static investigation reused; visible page state corroborated. Exact full timeline runtime behavior remains unmeasured.
- Shared shell and all four index pages: replaced.
- Detail page redesign: outside this implementation; existing detail features preserved.
- Validation: TypeScript, lint on changed TypeScript files, desktop/mobile browser route and interaction checks. Whole-repository lint has pre-existing violations in untouched files.
