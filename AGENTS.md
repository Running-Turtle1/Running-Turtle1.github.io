# Repository Guidelines

## Project Structure & Module Organization
This repository is a static academic homepage. `index.html` is the primary published page. `index_0.html` and `index_2.html` appear to be older or alternate layouts and should only be updated intentionally. Global styles live in `main.css`, `stylesheet.css`, and `css/`. Static assets are organized under `images/`, `work/`, and `data/`. Keep `CNAME` intact for custom-domain publishing.

## Build, Test, and Development Commands
There is no build pipeline in this repo; changes are plain HTML/CSS/assets.

- `python3 -m http.server 8000` runs a local preview server from the repository root.
- `open http://localhost:8000/index.html` opens the main page in a browser on macOS.
- `rg 'src=|href=' index.html` helps audit linked assets before committing.
- `git diff --stat` provides a quick review of content and asset churn.

## Coding Style & Naming Conventions
Match the existing style in `index.html`: 2-space indentation, semantic HTML where practical, and short inline scripts only when necessary. Prefer updating shared CSS files instead of adding more inline `<style>` blocks. Use relative paths for local assets. New filenames should be descriptive and stable, for example `images/new-award-photo.jpg` or `work/paper-title.pdf`; avoid renaming published assets unless all references are updated.

## Testing Guidelines
This project does not include automated tests. Verify changes manually in a browser:

- check desktop and mobile-width layouts,
- confirm navigation anchors scroll correctly,
- confirm images and PDF links load,
- check the browser console for missing files or script errors.

For publication or CV updates, confirm the referenced file exists in `work/` or `data/`.

## Commit & Pull Request Guidelines
Recent history uses generic messages like `update`. Improve on that with short, imperative subjects such as `refresh publications list` or `replace profile header photo`. Pull requests should include a brief summary, note any added or removed assets, link related issues when applicable, and attach screenshots for visible layout or styling changes.
