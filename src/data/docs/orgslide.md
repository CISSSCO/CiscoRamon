# OrgSlide

OrgSlide is a beautiful, single-file HTML presentation engine for Emacs Org-mode files. It runs entirely in the browser—no backend, no database, no complex build steps required. Simply drag and drop your `.org` file into the browser, and watch it instantly transform into a sleek, interactive, PowerPoint-style presentation.

Developed by **Cisco Ramon**.

- [GitHub Repository](https://github.com/CISSSCO/OrgSlide)
- [Live Demo](https://cisssco.github.io/OrgSlide/)
- [Portfolio](https://ciscoramon.netlify.app)
- [LinkedIn Profile](https://www.linkedin.com/in/abhi581b/)

---

## Table of Contents

1. [Features](#features)
2. [Keyboard Shortcuts](#keyboard-shortcuts)
3. [How to Use](#how-to-use)
4. [License](#license)

---

## Features

- **Zero Dependencies:** Everything (HTML, CSS, JS) is bundled without needing a backend or npm build chain.
- **Client-Side Parsing:** Completely private. Your files are parsed locally using the HTML5 FileReader API.
- **Interactive Mindmap & Outline Views:** Press `Alt + .` to open a multi-view Table of Contents. Features an infinite canvas, pinch-to-zoom, native touch gestures, and 5 distinct layouts (Tree, List, Details, Cards, and Reveal.js-style Overview).
- **Light & Dark Themes:** Toggle seamlessly between a clean light mode and a deep, glassmorphic dark mode.
- **Code Block Superpowers:** Beautiful syntax highlighting, single-click copy buttons, fullscreen toggle, and on-the-fly font size adjustment (`+` / `-` / `0`).
- **Intelligent Navigation:** Clickable breadcrumb trees, a redesigned footer with quick-navigation SVGs, and a Jump to Page shortcut.
- **Keyboard Driven:** Navigate smoothly through slides without touching the mouse.

---

## Keyboard Shortcuts

OrgSlide is designed to avoid conflicts with browser extensions like Vimium.

| Shortcut | Action |
| :--- | :--- |
| `Alt + J` | Next Slide |
| `Alt + K` | Previous Slide |
| `Alt + .` | Open Interactive Table of Contents (Tree/Overview) |
| `Alt + G` | Go to Slide |
| `Alt + E` | Edit Social Links (Footer Icons) |
| `+` / `-` / `0` | Zoom In/Out/Fit (in TOC) or Adjust Code Font Size |
| `Home` / `End` | First / Last Slide |
| `Alt + ?` | Open Help Menu |
| `Escape` | Close Modals / Exit Fullscreen Code |

---

## How to Use

The easiest way to use OrgSlide is directly from the web—no installation required!

1. Visit the live web app at: [https://cisssco.github.io/OrgSlide/](https://cisssco.github.io/OrgSlide/)
2. Click the **Load Org File** button (or drag and drop your `.org` file onto the page).
3. Your presentation will instantly render and you're ready to present!

### Running Locally

If you prefer to run it locally, simply clone the repository and open `index.html` in any modern web browser:

```bash
git clone https://github.com/CISSSCO/OrgSlide.git
cd OrgSlide

# Open localhost:8000 directly in your default browser
python3 -m http.server
```

---

## License

This project is licensed under the MIT License - feel free to use, modify, and distribute it!
