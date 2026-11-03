# Kesatiran spatial redesign

All routes share a midnight / steel blue visual system in `src/app/spatial.css`. Home, Team, Works, Games, member details, game details and not-found screens use layered media, perspective, and readable HTML content. Profile data (including social links, skills, tools, career, projects and favorites) and game roster/settings/montage functionality remain accessible.

## Real 3D and lightweight depth

`SpatialWorld` lazily imports Three.js after initial content, mounts one fixed WebGL scene in the persistent layout, and disposes its geometries, materials and renderer on disable/unmount. The scene uses a torus knot, orbit meshes and seven satellite meshes. It is decorative, hidden from assistive technology, and never blocks links or scrolling.

Rendering is on demand: pointer, scroll and resize events request a frame, capped to approximately 30fps during interaction. No idle animation loop, shadows, postprocessing, external models or texture downloads. Pixel ratio is capped at 1.25. A hidden document does not render. Context loss selects the lightweight fallback.

Mobile and reduced-motion users start without WebGL. CSS orbit geometry remains as a static fallback. The 3D view button persists an explicit off choice. `DepthSurface` applies small pointer-driven transforms with one scheduled frame, cleans up on unmount, and skips touch/reduced-motion input.

## Verification

Production build, TypeScript and lint on changed files pass. Browser checks cover desktop/mobile route rendering, profile and game 404s, work filtering and dialogs, reduced-motion member listing, persistent canvas across client-side navigation and toggling 3D off/on. Instrumented WebGL draw calls stop at idle and resume after pointer movement. These are local checks, not a guarantee of smoothness on every GPU.

References for renderer lifecycle and resource ownership:
- https://threejs.org/docs/pages/WebGLRenderer
- https://threejs.org/manual/pages/how-to-dispose-of-objects.html
- https://threejs.org/manual/pages/responsive.html
