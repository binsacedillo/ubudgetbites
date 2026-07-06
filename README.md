# 🍜 U-BudgetBites — "Eat Smart, Spend Less"

**U-BudgetBites** is a clean, fast, and responsive web application designed for college students in Manila's University Belt (U-Belt). It helps students quickly discover affordable meals within their available budget, bypassing the need to walk around campus searching for cheap spots or relying solely on word-of-mouth.

The application’s visual design takes inspiration from popular consumer food discovery platforms like GrabFood, Foodpanda, and Google Maps—clean, simple, functional, and fast.

---

## 🌟 Core Features

- **Proximity Filter by Campus:** Instantly filter food stalls and deals near specific U-Belt universities:
  - **UST** (University of Santo Tomas)
  - **FEU** (Far Eastern University)
  - **UE** (University of the East)
  - **NU** (National University)
  - **CEU** (Centro Escolar University)
  - **San Beda** (San Beda University)
- **Dominant Search Experience:** Clean home screen search bar built to query meals, stalls, ingredients, or locations.
- **Budget-First Selection:** Hero filter chips categorized into pricing tiers:
  - **Under ₱50**
  - **₱50 – ₱75**
  - **₱75 – ₱100**
  - **₱100+**
- **Zero-Cost Map Routing:** Links directly to native Google/Apple Maps queries (`https://maps.google.com/?q=[Stall+Name+Campus]`), allowing free turn-by-turn navigation without active Maps API keys or billing.
- **Community-Driven Updates:** Students can submit reviews, verify prices, and contribute new meal deals.
- **LocalStorage DB Layer:** Configured with a version-controlled LocalStorage system that syncs mock data changes locally on reload (useful for local development and pitching offline).

---

## 📁 Project Structure

```
ubudgetbites/
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Local generated food/stall images and vectors
│   ├── components/
│   │   ├── cards/          # FoodCard.jsx, StallCard.jsx (Grab-style flat cards)
│   │   ├── layout/         # Navbar.jsx (Responsive header and mobile bottom tab bar)
│   │   └── ui/             # Logo.jsx (SVG perspective map logo), RatingStars.jsx
│   ├── constants/          # index.js (Pre-seeded database values)
│   ├── contexts/           # AuthContext.jsx, ToastContext.jsx
│   ├── pages/              # Home, Search, MealDetails, StallDetails, Favorites, Profile, Login
│   ├── services/           # db.js (Versioned LocalStorage manager), auth.js
│   ├── utils/              # theme.js (University brand color styles)
│   ├── App.jsx             # React routing setup
│   ├── main.jsx            # Entry mount point
│   └── index.css           # Tailwind configuration and custom animation declarations
├── package.json            # Scripts and dependencies
└── vite.config.js          # Vite configurations
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd ubudgetbites
   ```
2. Install the project dependencies:
   ```bash
   npm install
   ```

### Development Server
Run the local Vite server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) (or the port specified in your console) to view the app in the browser.

### Production Build
Build the optimized application bundle for deployment:
```bash
npm run build
```
The output will be placed in the `dist/` directory, ready to be served on platforms like Vercel, Netlify, or Firebase Hosting.

### Code Quality (Linting)
Check for code style warnings and potential issues:
```bash
npm run lint
```
*(Uses [Oxlint](https://oxc.rs/docs/guide/usage/linter/rules) for fast, zero-dependency static analysis).*

---

## 🎨 Visual Identity & Style

- **Primary Slogan:** "Eat Smart, Spend Less."
- **Brand Colors:** Standardized off-white (`#FAFAFA`) background, solid white layout surfaces, and a primary brand orange (`#F97316`) representing appetite.
- **Micro-Animations:** Clean `.flat-card` transitions, `scale-in` highlights, and hardware-accelerated layouts to ensure smooth scrolling in Edge, Chrome, Safari, and Firefox.
