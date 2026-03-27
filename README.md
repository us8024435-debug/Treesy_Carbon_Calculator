# Treesy — Travel CO₂e Offset Calculator

A lightweight, modern web application for estimating travel carbon footprints and suggesting offset equivalents in planted trees. Designed with beautiful glassmorphism UI for travel agencies and direct consumers. 

**🌍 Live Demo:** [https://treesy-services-co2-calculator.netlify.app/](https://treesy-services-co2-calculator.netlify.app/)

## 📸 Overview
![Treesy Logo](TREESY%20LOGO%20BG.png)

## ✨ Features
- **Calculate emissions** across multiple journey segments (Flights, Bus, Car, Train, Ferry).
- **Accommodation footprint** logic based on stays/nights. 
- **Interactive UI** with sleek sliders, copy-to-clipboard summaries, and detailed emission breakdowns based on dynamic formulas.
- **Admin Settings** to fine-tune emission conversion factors (`kg CO₂e/km`).
- **Data Persistence** to browser `localStorage` to save user trip configurations without any external database.
- Built safely with zero dependencies using robust vanilla HTML, CSS, and JS. 

## 🚀 Quick Start
Since this project is a purely static site, you can run it entirely locally in your browser. No build steps or complex dependencies are required.

```bash
git clone https://github.com/your-username/treesy-calculator.git
cd treesy-calculator
# Open the index.html file in your preferred web browser
```

## 🛠 Tech Stack
- **HTML5** — Semantic structure
- **CSS3** — Glassmorphism UI with CSS variables and animations
- **Vanilla JavaScript** — Zero-dependency calculation engine
- **Three.js** (CDN) — WebGL light pillar background effect
- **jsPDF** (CDN) — Client-side PDF report generation
- **QRCode.js** (CDN) — QR code generation for PDF reports

## 📁 Project Structure
```
TREESY/
├── index.html          # Main application page
├── app.js              # Calculation engine & state management
├── styles.css          # Design system & responsive layout
├── light-pillar.js     # Three.js background effect
├── TREESY LOGO BG.png  # Logo with background
├── TREESY_LOGO.png     # White logo for PDF headers
├── TREESY.jpg          # Favicon
├── netlify.toml        # Netlify deployment configuration
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🚀 Deploy to Netlify
1. Push this repo to GitHub (see below).
2. Go to [app.netlify.com](https://app.netlify.com/) and click **"Add new site" → "Import an existing project"**.
3. Connect your GitHub account and select this repository.
4. Netlify will auto-detect the `netlify.toml` config — no build command is needed.
5. Click **Deploy site**. Your calculator will be live in seconds.

## 📤 Publish to GitHub
```bash
# If starting fresh (no remote yet):
git remote add origin https://github.com/YOUR_USERNAME/treesy-calculator.git

# Stage, commit, and push:
git add -A
git commit -m "Ready for deployment"
git branch -M main
git push -u origin main
```
> Replace `YOUR_USERNAME` with your actual GitHub username.

## 📐 Methodology
The emissions logic is fully documented inside the application UI under the **"📐 Methodology"** accordion. It dynamically handles differences between short-haul vs long-haul flights, applying appropriate global detour multipliers.

## 📄 License
This project is proprietary to **Treesy** ([treesy.dk](https://treesy.dk)). All rights reserved.
