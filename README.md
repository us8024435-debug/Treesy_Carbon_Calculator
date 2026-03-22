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

## 📐 Methodology
The emissions logic is fully documented inside the application UI under the **"📐 Methodology"** accordion. It dynamically handles the differences between short-haul vs long-haul flights, applying appropriate global detour multipliers. 

## 🌐 Deployment
This project is inherently deployment-ready for any static file hosting platform:
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)

Simply connect your Git repository to your hosting provider's dashboard to automatically publish the site.
