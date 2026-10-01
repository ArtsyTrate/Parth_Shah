# Parth Shah | 3D Portfolio

Portfolio for Parth Shah, 3D generalist and motion designer. Four pages (Home, Projects, About, Contact) in plain HTML, CSS and JavaScript, with no build step.

The site goes live at `https://artsytrate.github.io/Parth_Shah/` once GitHub Pages is pointed at the branch you want to publish.

## Where things live

- `js/site-config.js`: email, résumé, social links, availability line and the 3D model shown on the home page.
- `js/projects-data.js`: the project list. Each entry points at images and videos in `assets/`. The comments at the top of the file explain every field.
- `css/styles.css`: the design. The primary color `#485696` and the rest of the palette are variables at the top.
- `assets/`, `Alarm_Clock.glb`, `Parth_Shah_Resume_3D.pdf`: the media and files the site uses.

The earlier single-page site (`style.css`, `script.js`) is still in the repository root and is no longer loaded by `index.html`.

## Preview locally

Run this in the repository folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening the files with a double click will not load the 3D viewer, because browsers block modules from `file://` addresses.

## Publish with GitHub Pages

1. Open Settings, then Pages.
2. Under "Build and deployment", choose "Deploy from a branch".
3. Select the branch to publish and the `/ (root)` folder, then save.
