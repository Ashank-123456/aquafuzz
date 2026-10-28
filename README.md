# 🌊 AquaFuzz AI: Intelligent Fuzzy Water Quality Assessment System

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **AquaFuzz AI** is an advanced **Soft Computing** application implementing a **Mamdani Fuzzy Inference System (FIS)** to model environmental water quality, eliminate rigid Boolean cliff effects, evaluate multi-sector compliance (potable, aquaculture, agriculture), and compute in-field emergency chemical dosages.

Developed by **Ashank Gupta**  
*Department of Computer Science & Engineering • Soft Computing Laboratory*

---

## 📌 Table of Contents
- [Real-World Problem Statement](#-real-world-problem-statement)
- [Why Soft Computing? (Fuzzy vs Classical WQI)](#-why-soft-computing-fuzzy-vs-classical-wqi)
- [Mathematical Formulation](#-mathematical-formulation)
- [Key Features](#-key-features)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Author & Academic Credit](#-author--academic-credit)
- [License](#-license)

---

## 🌍 Real-World Problem Statement

Conventional water testing relies on laboratory tests with rigid numerical limits (e.g., WHO limits pH $6.5 - 8.5$, Turbidity $< 5.0\text{ NTU}$). In real life:
1. **The Boolean "Cliff Effect"**: A pH of $6.49$ is classified as a compliance failure, while $6.50$ is deemed safe. In nature, chemical toxicity and biological absorption change smoothly, not as sudden cliffs.
2. **The Masking / Eclipse Effect**: Classical arithmetic index formulas (such as the Weighted Arithmetic Index) compute weighted averages. A deadly acidic spill ($\text{pH} = 4.2$) can be mathematically masked by clean turbidity and high dissolved oxygen.
3. **Field Emergency Dilemma**: In disaster zones (floods, refugee camps, village well contamination), field workers receive sensor numbers but lack the exact chemistry knowledge to know **how much alum, bleach, or lime to add per $1,000\text{ L}$**.

**AquaFuzz AI** resolves all three challenges by providing continuous fuzzy truth modeling, non-linear multi-rule implication, and instant chemical dosing calculations.

---

## 🔬 Why Soft Computing? (Fuzzy vs Classical WQI)

| Characteristic | Classical Arithmetic Index (Brown et al.) | AquaFuzz Mamdani Fuzzy System |
| :--- | :--- | :--- |
| **Boundary Handling** | Rigid, discrete thresholds ($0$ or $1$) | Continuous partial truth $\mu(x) \in [0, 1]$ |
| **Outlier Resilience** | Severe toxic spikes can be diluted/masked | Critical rules fire instantly regardless of averages |
| **Heuristic Integration** | Linear mathematical weights only | 20 expert environmental IF-THEN linguistic rules |
| **Output Type** | Fixed score | Scaled index ($0-100$), grade, and sector advice |
| **Emergency Action** | Diagnostic only | Calculates exact chemical weights ($\text{g}$, $\text{ml}$) |

---

## 📐 Mathematical Formulation

### 1. Triangular Membership Function
$$\mu_{\text{Triangle}}(x; a, b, c) = \max\left(\min\left(\frac{x - a}{b - a}, \frac{c - x}{c - b}\right), 0\right)$$

### 2. Trapezoidal Membership Function
$$\mu_{\text{Trapezoid}}(x; a, b, c, d) = \max\left(\min\left(\frac{x - a}{b - a}, 1, \frac{d - x}{d - c}\right), 0\right)$$

### 3. Mamdani T-Norm (Antecedent Conjunction)
$$\alpha_k = \min\Big(\mu_{pH}(x), \mu_{\text{Turbidity}}(x), \mu_{DO}(x), \mu_{TDS}(x)\Big)$$

### 4. Fuzzy Rule Implication & Aggregation
$$\mu_{\text{agg}}(z) = \max_{k=1}^{20} \Big( \min\big(\alpha_k, \mu_{C_k}(z)\big) \Big)$$

### 5. Centroid Defuzzification (Center of Gravity)
$$z^* = \frac{\int_0^{100} z \cdot \mu_{\text{agg}}(z) \, dz}{\int_0^{100} \mu_{\text{agg}}(z) \, dz}$$

---

## ✨ Key Features

- **Floating Smart Island Navbar**: Positioned dynamically with scroll-aware smooth hiding on downward scroll and instant slide-down reveal on upward scroll.
- **Interactive Physico-Chemical Sliders**: Stepper buttons, range tracks, and real-time linguistic set indicators for **pH**, **Turbidity (NTU)**, **Dissolved Oxygen (DO)**, and **Total Dissolved Solids (TDS)**.
- **Radial Quality Gauge**: Glowing SVG arc indicator with letter grades (`Grade A+`, `B`, `C`, `D`, `E`) and celebratory confetti on pristine water scores.
- **Sector Compliance Matrix**: Compliance evaluations for **Drinking & Potable**, **Aquatic Habitat**, **Crop Irrigation**, and **Primary Bathing**.
- **Field Chemical Dosing Calculator**:
  - Exact grams of **Alum coagulant** ($\text{Al}_2(\text{SO}_4)_3$).
  - Exact milliliters of **Sodium hypochlorite bleach** ($5\%\text{ NaOCl}$) or chlorine tablets.
  - Exact grams of **Hydrated lime buffer** ($\text{Ca}(\text{OH})_2$).
  - Required flocculation, settling, and contact times with batch cost estimation.
- **Interactive SVG Membership Curves**: High-definition vector visualizer plotting linguistic sets with vertical scanlines and exact $\mu(x)$ intersect points.
- **Mamdani Rule Base & Centroid Surface**: Displays the aggregated output fuzzy polygon and the balance line ($z^*$).
- **IoT Batch Telemetry Ingestion**: Ingests multi-node sensor CSV files, verifies regulatory compliance, and exports downloadable audit reports.
- **Official Laboratory Certificate**: Printable certificate modal (`window.print()`) with digital verification sign-off.

---

## 📁 Project Architecture

```
aquafuzz-ai/
├── src/
│   ├── app/
│   │   ├── globals.css              # Custom aquatic dark styling & animations
│   │   ├── layout.js                # Geist font integration & SEO metadata
│   │   └── page.js                  # Main dashboard controller
│   ├── components/
│   │   ├── BrandLogo.jsx            # Custom vector mark & typography
│   │   ├── Navbar.jsx               # Floating island navbar with scroll detection
│   │   ├── ParameterControl.jsx     # Sensor sliders & linguistic indicators
│   │   ├── QualityGauge.jsx         # Radial gauge & grade display
│   │   ├── SuitabilityMatrix.jsx    # 4-sector water use compliance
│   │   ├── TreatmentDosingCalculator.jsx # Emergency field chemical dosing
│   │   ├── FuzzyEngineTabs.jsx      # Segmented tab controller
│   │   ├── MembershipVisualizer.jsx # Interactive SVG curve plotter
│   │   ├── RuleInspector.jsx        # Mamdani rule base & centroid surface
│   │   ├── RealWorldUseCases.jsx    # Public health, aquaculture & crops
│   │   ├── BatchTelemetryAnalyzer.jsx # CSV ingestion & regulatory audit
│   │   ├── TheorySection.jsx        # Soft Computing mathematical docs
│   │   └── ReportModal.jsx          # Official printable certificate
│   └── lib/
│       ├── fuzzyEngine.js           # Pure Mamdani FIS implementation
│       └── realWorldEngine.js       # Chemical dosing & sector risk formulas
├── public/                          # Static icons and assets
├── .gitignore                       # Public GitHub configuration
├── LICENSE                          # MIT License
├── package.json                     # Dependencies & scripts
└── README.md                        # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Ashank-123456/AquaFuzz-AI.git
cd AquaFuzz-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** (or the port displayed in terminal) in your browser.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 👤 Author & Academic Credit

- **Author**: Ashank Gupta
- **Project**: Soft Computing Laboratory Project (Fuzzy Logic & Environmental AI)
- **Institution**: Department of Computer Science & Engineering

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
