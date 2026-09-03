# GDGoC Tree 🌳

A modern, responsive, serverless Linktree alternative designed specifically for **Google Developer Groups (GDG) on Campus - Alamein International University**.

Built with Vanilla HTML5, CSS3, and JavaScript, powered by a file-based JSON database with zero server/database overhead.

---

## ✨ Features

- **Google 4-Color Brand Aesthetic**: Distinct Google colors (`#4285F4`, `#EA4335`, `#FBBC04`, `#34A853`), four animated corner circles, and signature button hover animations.
- **Top-to-Bottom Sequential Ordering**: Manage the order of every link, announcement, banner, and divider directly in [`src/json/data.json`](./src/json/data.json).
- **Linktree-Style Component Types**: Support for interactive `button`s, promotional image cards (`img`), separator `divider`s, and section `text` blocks.
- **Zero Database Overhead**: Everything runs directly off a file-based JSON database.
- **Mobile-First & Fluid Responsive**: Works on mobile screens, tablets, and desktops.

---

## 📁 Project Structure

```text
gdgoc_tree/
├── assets/
│   └── icons/                 # High-resolution brand & social media icons
├── src/
│   ├── js/
│   │   └── fillLinks.js       # Dynamic renderer for data.json
│   └── json/
│       ├── data.json          # Primary JSON database (items rendered top to bottom)
│       └── usage_guide.md     # Contributor documentation for data.json attributes
├── index.html                 # Main HTML structure
├── index.css                  # Google brand styles, animations, and responsive layout
└── README.md
```

---

## 🛠️ How to Update Links & Content

All content is managed through [`src/json/data.json`](./src/json/data.json).

For a complete guide with code examples and attribute tables for buttons, images, dividers, and text, see:
👉 **[Contributor Usage Guide (`src/json/usage_guide.md`)](./src/json/usage_guide.md)**

---

## 💻 Running Locally

Because the application fetches `data.json` over standard HTTP, run a local web server:

### Using Python:
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Using VS Code Live Server:
Right-click `index.html` and select **Open with Live Server**.

---

## 📄 License
Licensed under the [MIT License](./LICENSE).
