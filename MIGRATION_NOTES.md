# React / Three.js Portfolio Migration

This branch is the in-progress redesign of Parth Shah's portfolio. The current live static site remains preserved on `main`.

## Implemented

- React 19 + Vite + TypeScript foundation
- Three.js / React Three Fiber interactive hero
- Drei controls, floating geometry and particles
- Framer Motion entrance and scroll-reveal animation
- Existing portfolio branding and dark visual language
- Selected Work using existing Ancient Temple, Ancient Well and Fight Sequence assets
- Full Ancient Temple project detail
- Four-image Ancient Well gallery and project detail
- Fight Sequence project detail with playable video
- Projects-by-discipline directory
- About, toolset, contact, resume, LinkedIn and ArtStation links
- Responsive desktop / tablet / mobile layouts
- GitHub Pages Vite base path `/Parth_Shah/`

## Preserved

The production site is not modified by this branch. Existing static files and media remain available from `main` while the React migration is developed and reviewed.

## Next passes

- Add dedicated motion graphics media when supplied
- Replace or supplement the procedural hero object with a custom portfolio GLB/GLTF if desired
- Performance pass: optimize large PNGs and video poster/preload strategy
- Add production GitHub Pages build/deploy workflow after design approval
