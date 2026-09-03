# 📖 `data.json` Contributor Usage Guide

Welcome to the contributor guide for managing links, announcements, and content on the **GDG on Campus AIU** tree website.

All content on the site is controlled directly through a single file: [`src/json/data.json`](./data.json).

---

## 📌 Top-to-Bottom Sequential Ordering

- **Direct Line Order**: Every element in the `"items"` array renders on the webpage in the **exact order** it is written in `data.json`, from top to bottom.
- **To Reorder**: Cut and paste any item block higher or lower in the array.
- **To Temporarily Hide**: Set `"active": false`. The item will remain in the file but will not be rendered on the page.

---

## 🧱 General File Structure

```json
{
  "meta": {
    "title": "Stay Connected!",
    "description": "Click the button below to be redirected to our Social Media profiles."
  },
  "items": [
    /* List of components ordered from top to bottom */
  ]
}
```

---

## 🏷️ Supported Component Types

The application supports **4 distinct component types**:
1. **`button`** — Standard interactive link button with hover animations.
2. **`img`** — Image card or promotional banner (e.g., Core Team applications, workshop posters).
3. **`divider`** — Visual separator line between groups.
4. **`text`** — Section titles or informational text blocks.

---

### 1️⃣ Button Component: `type: "button"`
The classic interactive pill button featuring an icon, label, sliding brand color background, and zooming icon hover animation.

#### Attributes:
| Attribute | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | `string` | **Yes** | Must be `"button"`. |
| `text` | `string` | **Yes** | The button label (e.g., `"WhatsApp"`, `"Instagram"`). |
| `link` | `string` | **Yes** | Destination URL (automatically opens in a new tab with `target="_blank"`). |
| `icon` | `string` | **Yes** | Local path to the icon, e.g., `"./assets/icons/whatsapp-icon.png"`. |
| `color` | `string` | **Yes** | Hex code or CSS color for the hover fill effect (e.g., `"#25d366"`, `"#ea4335"`). |
| `id` | `string` | No | Optional unique identifier (e.g., `"whatsapp"`). |
| `active` | `boolean` | No | Set to `false` to hide the button. Defaults to `true`. |

#### Code Example:
```json
{
  "type": "button",
  "id": "whatsapp",
  "text": "WhatsApp Community",
  "link": "https://chat.whatsapp.com/Lx0mHZvlvWm8U2WOgy0djZ",
  "icon": "./assets/icons/whatsapp-icon.png",
  "color": "#25d366",
  "active": true
}
```

---

### 2️⃣ Image Card Component: `type: "img"`
Used for visual banners and promotional announcements, such as Core Team recruitment posters, hackathon flyers, or event announcements. Clicking the card can optionally redirect to a form or registration page.

#### Attributes:
| Attribute | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | `string` | **Yes** | Must be `"img"`. |
| `src` | `string` | **Yes** | Local image path, e.g., `"./assets/icons/gdgoc-logo.png"`. |
| `alt` | `string` | No | Alternative text for accessibility and screen readers. |
| `caption` | `string` | No | Text label displayed in a badge below the image. |
| `link` | `string` | No | If provided, wraps the image in a link that opens in a new tab upon click. |
| `active` | `boolean` | No | Set to `false` to hide the image card. Defaults to `true`. |

#### Code Example:
```json
{
  "type": "img",
  "src": "./assets/icons/gdgoc-logo.png",
  "alt": "Core Team Recruitment Banner",
  "caption": "🔥 Core Team Applications Open!",
  "link": "https://gdg.community.dev/gdg-on-campus-alamein-international-university/",
  "active": true
}
```

---

### 3️⃣ Divider Component: `type: "divider"`
A subtle separator line used to segment different categories of content (e.g., separating community chat groups from official social channels).

#### Attributes:
| Attribute | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | `string` | **Yes** | Must be `"divider"`. |
| `color` | `string` | No | Custom hex color for the line (defaults to subtle gray `"#e0e0e0"`). |
| `active` | `boolean` | No | Set to `false` to hide the divider. Defaults to `true`. |

#### Code Example:
```json
{
  "type": "divider",
  "active": true
}
```

---

### 4️⃣ Text Component: `type: "text"`
Used for section headings (e.g., "Official Channels", "Community Groups") or descriptive notes and announcements.

#### Attributes:
| Attribute | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | `string` | **Yes** | Must be `"text"`. |
| `text` | `string` | **Yes** | The text content to display. |
| `variant` | `string` | No | `"heading"` for bold section titles, or `"paragraph"` for small body notes. Defaults to `"heading"`. |
| `active` | `boolean` | No | Set to `false` to hide the text block. Defaults to `true`. |

#### Code Example:
```json
{
  "type": "text",
  "variant": "heading",
  "text": "Official Channels",
  "active": true
}
```

---

## 🎨 Contributor Best Practices

1. **Local Assets**:
   - Always place new icons and images inside [`assets/icons/`](../../assets/icons/).
   - Always reference assets using local relative paths starting with `./assets/icons/`.
   - Avoid using external URLs (such as GitHub raw URLs) to ensure fast load times and offline compatibility.
2. **File Formats**:
   - **Icons**: Use transparent `PNG` or `SVG` files.
   - **Banners / Posters**: Use `PNG`, `WEBP`, or `JPG` with appropriate compression (around 600px–800px width is ideal).
3. **Official Google Brand Colors**:
   - **Google Blue**: `"#4285f4"`
   - **Google Red**: `"#ea4335"`
   - **Google Yellow**: `"#f9ab00"` or `"#fbbc04"`
   - **Google Green**: `"#34a853"`
   - **WhatsApp Green**: `"#25d366"`
   - **GitHub Dark**: `"gray"` or `"#24292e"`
