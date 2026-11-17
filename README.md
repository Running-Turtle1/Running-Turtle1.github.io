# Homepage
This is my personal website.

- `index.html`: desktop entry page, with styles in `css/desktop.css` and interactions in `js/desktop.js`.
- `homepage.html`: the academic homepage. Edit biography, publications, and other academic content here; shared styles are in `main.css`.
- `js/desktop-apps.js`: desktop navigation. Home opens Files, Publications and Projects open their folders, paper/project entries open Document Viewer, and News opens Calendar. File and preview content lives in the templates in `index.html`; keep it in sync with the academic homepage.
- `Homepage.html` in Files opens the original academic page inside Web Browser, with back, forward, reload, and an external-tab link. Internal pages stay in this window; external links open new tabs. `js/desktop-frame.js` lets the embedded academic page navigate and close its browser window via “Back to desktop”, including in local file previews. The system menu’s Classic homepage opens the standalone page.
- Old section URLs such as `/#publications` open the corresponding desktop app; other academic anchors open inside Web Browser.
- `js/code-assistant.js`: Pengchao Code’s prewritten English/Chinese replies and typing animation. Keep its academic facts and links in sync with `homepage.html`. `/help`, `/whoami`, `/clear`, and `open home/readme/papers/projects/news` are supported. Minimize preserves the conversation; close clears it. No chat API or backend is used.
- The desktop runs entirely in the browser, with no backend or comment service. The Ubuntu-style desktop follows [Junyao Hu’s reference homepage](https://junyaohu.github.io/): black GNOME top bar, orange folder icons, a numbered text editor, and a session-only boot animation. `images/background/desktop-ubuntu.svg` is the static output of the reference page’s procedural wallpaper generator. The desktop loads Ubuntu and Ubuntu Mono from Google Fonts, with system fallbacks.

Preview from the repository root with `python3 -m http.server 8000`, then visit `http://localhost:8000/`. Check the desktop at both desktop and mobile widths, window controls, homepage navigation, and existing section links before publishing through GitHub Pages. Keep `CNAME` intact.
