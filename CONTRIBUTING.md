# Contributing to GDGoC Tree 🌳

Thank you for your interest in contributing to **GDGoC Tree**! Whether you are a core team member of **Google Developer Groups on Campus - Alamein International University (GDG on Campus AIU)**, a university student, or an open-source enthusiast, your contributions are warmly welcomed.

---

## 📑 Table of Contents

- [Contributing to GDGoC Tree 🌳](#contributing-to-gdgoc-tree-)
  - [📑 Table of Contents](#-table-of-contents)
  - [🤝 Code of Conduct](#-code-of-conduct)
  - [💡 Ways to Contribute](#-ways-to-contribute)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Forking \& Cloning](#forking--cloning)
    - [Running Locally](#running-locally)
  - [📝 Content Contributions (`data.json`)](#-content-contributions-datajson)
    - [Adding or Updating Links \& Buttons](#adding-or-updating-links--buttons)
    - [Adding New Assets \& Icons](#adding-new-assets--icons)
  - [🎨 Code Contributions](#-code-contributions)
    - [Architecture \& Standards](#architecture--standards)
    - [Styling \& Theming Guidelines](#styling--theming-guidelines)
  - [🔄 Pull Request Process](#-pull-request-process)
    - [1. Branch Naming](#1-branch-naming)
    - [2. Commit Message Guidelines](#2-commit-message-guidelines)
    - [3. Submitting a PR](#3-submitting-a-pr)
  - [💬 Need Help?](#-need-help)

---

## 🤝 Code of Conduct

As a Google Developer Groups on Campus project, we are committed to providing a friendly, respectful, and inclusive environment for everyone regardless of level of experience, background, gender, or identity.

- Be respectful and collaborative.
- Welcome newcomers and offer constructive feedback.
- Focus on what is best for the community.

---

## 💡 Ways to Contribute

You can contribute in many ways:
1. **Content Updates**: Add new social links, event forms, or banners in `data.json`.
2. **Bug Fixes**: Fix styling issues, broken animations, or script errors.
3. **Features & Themes**: Build new interactive features, animations, or themes.
4. **Documentation**: Improve guides, fix typos, or add code comments.

---

## 🚀 Getting Started

### Prerequisites
- [Git](https://git-scm.com/) installed on your machine.
- A modern web browser (Chrome, Edge, Firefox, Safari).
- A local HTTP server tool (such as Python 3 or VS Code Live Server).

### Forking & Cloning
1. Fork the repository on GitHub: Click the **Fork** button at the top right of the repo.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/gdgoc_tree.git
   cd gdgoc_tree
   ```
3. Set the upstream remote to keep your fork updated:
   ```bash
   git remote add upstream https://github.com/GDGoC-AIU/gdgoc_tree.git
   ```

### Running Locally
Because the project uses ES Modules (`import`/`export`) and fetches `data.json` asynchronously, it must be served over standard HTTP (not directly via `file://`).

- **Using VS Code** (Recommended):
  Install the **Live Server** extension, right-click `index.html`, and select **Open with Live Server**.

- **Using Node.js**:
  ```bash
  npx serve .
  ```

- **Using Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Open `http://localhost:8000` in your browser.

---

## 📝 Content Contributions (`data.json`)

All page items, links, and banners are stored in [`src/json/data.json`](./src/json/data.json).

### Adding or Updating Links & Buttons
Each button in `data.json` supports the following properties:
- `text`: The visible button label.
- `link`: Destination URL.
- `icon`: Relative path to icon in `assets/icons/`.
- `color`: Signature brand color (e.g., `#4285f4`, `#34a853`, `#f9ab00`, `#ea4335`).
- `active`: (Optional, `boolean`) Set to `false` to hide without deleting. Defaults to `true`.
- `status`: (Optional, `boolean`) Set to `false` to disable the button (turns gray, unclickable). Defaults to `true`.
- `status-text`: (Optional, `string`) Text to display on hover (e.g., `"Coming soon"`, `"Under Development"`).
- `theme`: (Optional, `string`) Restrict visibility to a specific theme (`"classic"` or `"pixel"`).

> [!TIP]
> Check out the full **[Contributor Usage Guide (`src/json/usage_guide.md`)](./src/json/usage_guide.md)** for detailed attribute tables and copy-paste examples.

### Adding New Assets & Icons
- Place new icons or images in `assets/icons/`.
- Use high-resolution, transparent PNGs or SVGs.
- Keep file sizes optimized (compress images before committing if larger than 200KB).
- Use clear, kebab-case filenames (e.g., `discord-icon.png`).

---

## 🎨 Code Contributions

### Architecture & Standards
- **Pure Web Standards**: We use Vanilla HTML5, CSS3, and modern JavaScript (ES6 Modules). Avoid introducing heavy external frameworks or build tools unless discussed and approved.
- **Modularity**:
  - `index.html`: Semantic structure only.
  - `index.css`: Core layout, animations, and Classic theme styles.
  - `src/css/`: Modular stylesheets (`theme-variables.css`, `pixel-theme.css`, `theme-switcher.css`).
  - `src/js/`: Isolated logic (`fillLinks.js`, `background.js`, `themeSwitcher.js`).

### Styling & Theming Guidelines
- **Maintain Multi-Theme Support**: When adding or changing styles, ensure they look great in both **Classic** and **Pixel Art (8-Bit)** modes.
- **Brand Consistency**: Respect the official Google 4-Color palette:
  - Blue: `#4285f4`
  - Red: `#ea4335`
  - Yellow: `#f9ab00`
  - Green: `#34a853`
- **Responsive Layout**: Test all UI changes on both desktop and mobile viewports (use DevTools responsive mode down to 360px).

---

## 🔄 Pull Request Process

### 1. Branch Naming
Create a new branch from `main` using a descriptive name:
```bash
# For a new feature
git checkout -b feature/your-feature-name

# For a bug fix
git checkout -b fix/issue-description

# For content updates
git checkout -b content/update-links
```

### 2. Commit Message Guidelines
Write clear, concise commit messages following conventional commit prefixes:
- `feat:` A new feature or theme component.
- `fix:` A bug fix.
- `content:` Updates to `data.json` or icons.
- `style:` Formatting, styling, or animation tweaks.
- `docs:` Documentation improvements.
- `refactor:` Code restructuring without behavioral changes.

*Example*:
```bash
git commit -m "feat: add status-text hover feature for disabled buttons"
```

### 3. Submitting a PR
1. Update your branch against upstream `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch-name
   git rebase main
   ```
2. Push your branch to your GitHub fork:
   ```bash
   git push origin your-branch-name
   ```
3. Open a **Pull Request** targeting the `main` branch of the upstream repository.
4. Fill in the PR description:
   - What changed and why.
   - Screenshots / GIFs for visual changes (both Classic and Pixel themes or your new theme).
   - Any related issues (e.g., `Closes #12`).

---

## 💬 Need Help?

If you have questions, ideas, or need guidance:
- Open a GitHub Issue for discussion.
- Reach out to the GDG on Campus AIU Core Team.
- Connect with us on our official social channels listed on the website!

Happy Coding! 🚀
