# Treesy — Travel CO₂e Offset Calculator

A lightweight, zero-dependency web application that estimates the carbon footprint of multi-segment travel itineraries and recommends how many trees to plant to offset the emissions. Built with a stunning glassmorphism UI, WebGL background effects, and a detailed PDF report generator — designed for travel agencies and eco-conscious travelers.

## Live Demo

**[https://treesy-travel-c02e-calculator.netlify.app](https://treesy-travel-c02e-calculator.netlify.app/)**

## Key Features

- **Multi-segment itinerary builder** — add unlimited journey legs across five transport modes (Flight, Bus, Car, Train, Ferry) with geocoded location autocomplete powered by the Open-Meteo API.
- **Science-backed emission formulas** — uses DEFRA, ICAO, and IPCC emission factors with automatic short-haul vs. long-haul flight classification and a 1.1× great-circle detour multiplier.
- **Accommodation carbon tracking** — calculates hotel-stay emissions per night using the Cornell Hotel Sustainability Benchmark average (30.9 kg CO₂e/night).
- **Adjustable offset slider (0–200%)** — lets users choose partial, full, or carbon-positive offset targets with real-time tree count updates.
- **Branded PDF report generation** — produces a professional A4 report with per-segment tables, category breakdowns, tree visualizations, QR codes, and methodology citations via jsPDF.
- **Admin settings panel** — fine-tune every emission factor and the CO₂e-per-tree value; settings persist in `localStorage`.
- **WebGL light-pillar background** — a volumetric Three.js shader effect with adaptive quality scaling for mobile, tablet, and desktop.
- **Fully offline-capable** — zero server-side dependencies; all state lives in the browser via `localStorage`.

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| Structure | HTML5 | Semantic page layout and accessible markup |
| Styling | CSS3 (Vanilla) | Glassmorphism design system with CSS custom properties, animations, and responsive breakpoints |
| Logic | Vanilla JavaScript (ES6+) | Calculation engine, state management, DOM rendering, clipboard API |
| 3D Background | Three.js r128 (CDN) | WebGL volumetric light-pillar shader effect |
| PDF Generation | jsPDF 2.5.1 (CDN) | Client-side A4 PDF report creation |
| QR Codes | QRCode.js 1.0.0 (CDN) | QR code canvas rendering for PDF reports |
| Typography | Google Fonts — Inter | Modern sans-serif typeface (weights 300–800) |
| Geocoding API | Open-Meteo Geocoding | Location autocomplete and lat/lon resolution |
| Deployment | Netlify | Static site hosting with cache headers and SPA fallback |

## Project Architecture

```
TREESY/
├── index.html           # Main application — UI, modals, inline PDF logic, light-pillar init
├── app.js               # Core calculation engine, segment CRUD, offset controls, clipboard
├── styles.css           # Full design system — tokens, glassmorphism cards, responsive layout
├── light-pillar.js      # Three.js WebGL shader for the volumetric background effect
├── fix_logo.js          # Node utility to re-embed the logo as base64 into index.html
├── netlify.toml         # Netlify deployment config — cache headers, SPA redirect
├── .gitignore           # Ignores node_modules, .env, IDE configs, OS metadata
├── TREESY_LOGO.png      # White logo used in the PDF report header
├── TREESY LOGO BG.png   # Logo with background used in the page header
├── TREESY.jpg           # Source image for the favicon
├── FAVICON.png          # Browser tab favicon
└── README.md            # This file
```

**File-by-file breakdown:**

- **index.html** — The single-page application entry point. Contains the header, journey-segment card, emissions-breakdown table, results/offset panel, admin-settings modal, download-report modal, and the full inline PDF generation logic (~560 lines of jsPDF code). Also initializes the light-pillar WebGL effect.
- **app.js** — The calculation core. Manages segment state, geocoding via Open-Meteo, haversine distance computation, emission-factor lookups (domestic/short-haul/long-haul flights, ground transport, accommodation), offset percentage controls, clipboard summary, and `localStorage` persistence for both segments and admin config.
- **styles.css** — A comprehensive 1,685-line design system. Defines CSS custom properties (color tokens, radii, fonts), glassmorphism card styles, animated background gradients, segment grid layout, slider/range styling, responsive breakpoints (1024px, 768px, 480px), modal overlays, autocomplete dropdowns, and tree-icon animations.
- **light-pillar.js** — A standalone Three.js module that renders a volumetric light-pillar via custom GLSL vertex/fragment shaders. Features adaptive quality detection (low/medium/high based on device), framerate throttling, resize handling, and optional mouse interactivity.
- **fix_logo.js** — A one-off Node.js helper script that reads `TREESY LOGO BG.png`, converts it to base64, and patches it into the `logoBase64` variable inside `index.html`. Excluded from deployment via `.gitignore`.
- **netlify.toml** — Configures Netlify to serve the root directory as a static site with aggressive cache headers (1 year) for CSS, JS, PNG, and JPG assets, plus a catch-all SPA redirect.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge).
- No build tools, package managers, or runtimes are required — this is a fully static site.
- (Optional) [Node.js](https://nodejs.org/) v14+ only if you need to run the `fix_logo.js` utility.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/treesy-calculator.git
cd treesy-calculator
```

### Running Locally

Since the project is a static site with no build step, simply open `index.html` in your browser:

```bash
# Option 1 — Double-click index.html in your file explorer

# Option 2 — Use a lightweight local server (recommended for best results)
npx serve .

# Option 3 — Python HTTP server
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### Running the Logo Utility (Optional)

If you update `TREESY LOGO BG.png` and need to re-embed it into the PDF's base64 string:

```bash
node fix_logo.js
```

### Tests

This project does not currently include automated tests. The calculation engine can be verified manually through the in-app methodology panel and the live emissions breakdown table.

## Environment Variables

This project does not use any environment variables. All configuration (emission factors, CO₂e per tree) is managed through the in-app Admin Settings panel and persisted to `localStorage` under the key `treesy_config`.

## API Reference

The application consumes one external API for location autocomplete. It does not expose any API endpoints of its own.

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `https://geocoding-api.open-meteo.com/v1/search` | Searches for city/location names and returns latitude, longitude, country, and admin region. Used for the "From" and "To" autocomplete fields. | No |

**Query parameters:**

| Parameter | Example | Description |
|---|---|---|
| `name` | `Copenhagen` | The search query string (minimum 2 characters) |
| `count` | `5` | Maximum number of results to return |
| `language` | `en` | Response language |
| `format` | `json` | Response format |

## Contributing

Contributions are welcome. To get started:

1. **Fork** the repository.
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes** with a clear, descriptive message:
   ```bash
   git commit -m "Add: brief description of what changed"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against `main` with a summary of your changes.

Please keep commits focused and avoid bundling unrelated changes into a single PR.

## License

This project is proprietary to **Treesy** ([treesy.dk](https://treesy.dk)). All rights reserved.

No LICENSE file is included in the repository. If you intend to open-source this project, consider adding an [MIT License](https://opensource.org/licenses/MIT) or another permissive license.
