# 🌊 AquaFuzz AI: Fuzzy Water Quality Assessment System

An advanced **Soft Computing** application that implements a **Mamdani Fuzzy Inference System (FIS)** for evaluating environmental water quality. Built with **Next.js 16 (App Router)**, **Tailwind CSS**, and **pure JavaScript**.

Developed by **Ashank Gupta**  
*Soft Computing Laboratory • Department of Computer Science & Engineering*

---

## 🔬 Project Overview

Conventional water quality assessment methods (such as the Weighted Arithmetic Index) rely on **rigid Boolean thresholds** that suffer from two major flaws:
1. **The "Cliff Effect"**: A pH of 6.49 fails compliance while 6.50 passes, creating an artificial discontinuity that does not reflect actual toxicological biology.
2. **The "Masking / Eclipse Effect"**: A single severe toxic spike can be mathematically diluted and concealed by high scores across other parameters.

**AquaFuzz AI** overcomes these limitations by applying **Soft Computing approximate reasoning**:
- **Continuous Fuzzification**: Maps sensory measurements (pH, Turbidity, DO, TDS, Temperature) into linguistic truth values $\mu(x) \in [0, 1]$.
- **Mamdani Multi-Rule Evaluation**: 20 comprehensive domain-expert environmental rules evaluated via T-norm (min or product).
- **Geometric Defuzzification**: Center of Gravity (Centroid / COG), Mean of Maxima (MOM), and Bisector methods that compute continuous crisp Water Quality Index (FWQI) scores (0 to 100).

---

## ✨ Key Features

1. **Live Physico-Chemical Parameter Simulator**:
   - Interactive sliders with numeric inputs and +/- steppers for **pH**, **Turbidity (NTU)**, **Dissolved Oxygen (DO in mg/L)**, **Total Dissolved Solids (TDS in ppm)**, and optional **Temperature (°C)**.
   - Real-time membership badges showing active linguistic sets with exact $\mu(x)$ values.
   - Inference operator switch: Mamdani Min vs. Algebraic Product T-Norm.
   - Defuzzification method selector: Centroid (COG), MOM, Bisector.

2. **Real-Time Quality Gauge & Grading**:
   - Circular SVG gauge with animated glow, Letter Grade (A+, B, C, D, E), and WHO/EPA classification.
   - Celebratory confetti on achieving pristine Grade A water quality.
   - Copy assessment summary to clipboard with one click.

3. **Water Use Suitability Matrix**:
   - Real-time compliance checks across 5 sectors:
     - 🚰 **Drinking & Potable**
     - 🐟 **Aquatic Life & Fisheries**
     - 🌾 **Agricultural Irrigation**
     - 🏊 **Primary Contact / Bathing**
     - 🏭 **Industrial Cooling & Processing**

4. **Fuzzy vs. Classical Comparison Card**:
   - Side-by-side benchmark contrasting Mamdani Fuzzy WQI against the classical Weighted Arithmetic Index (Brown et al.), explaining how Fuzzy Logic eliminates boundary ambiguity.

5. **Remediation & Treatment Advisor**:
   - Generates actionable physical and chemical remediation steps (e.g., aeration cascades for hypoxia, alum coagulation for turbidity, lime neutralization for acidity, RO for dissolved minerals).

6. **Interactive Membership Function Curves Visualizer**:
   - High-fidelity interactive SVG rendering smooth linguistic curves with filled gradients.
   - Animated vertical laser line showing the current input value and exact intersection dots.
   - Switch between pH, Turbidity, DO, TDS, and Output FWQI variables.

7. **Rule Base & Defuzzification Inspector**:
   - Visualizes the aggregated clipped fuzzy output polygon $\int \mu_C(z) dz$.
   - Shows the Centroid balance line ($z^*$) where the final index is derived.
   - Searchable and filterable table of all 20 Mamdani rules with individual $\alpha$-cut firing strengths.

8. **River Basin Longitudinal Continuum Simulator**:
   - Simulates water degradation across a 5-station river watershed (Headwaters $\to$ Montane Tributary $\to$ Farmland Inflow $\to$ City Confluence $\to$ Industrial Estuary).
   - One-click "Load in Simulator" action.
   - Download survey readings as a CSV report.

9. **Official Laboratory Certificate Generator**:
   - High-resolution, printable water testing certificate with certificate ID, timestamp, sensor readings table, suitability verdict, and digital sign-off by **Ashank Gupta**.

10. **Smart Floating Navigation Bar**:
    - Disappears on downward scroll, reappears smoothly on scroll up.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation
```bash
git clone <repo-url>
cd project_softcumputing
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

### Building for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```
project_softcumputing/
├── src/
│   ├── app/
│   │   ├── globals.css          # Aquatic dark theme, glassmorphism, print styles
│   │   ├── layout.js            # Root layout with Geist fonts & SEO metadata
│   │   └── page.js              # Main reactive application page
│   ├── components/
│   │   ├── Navbar.jsx           # Floating navbar with hide-on-scroll logic
│   │   ├── ParameterControl.jsx # Interactive sliders & fuzzification displays
│   │   ├── QualityGauge.jsx     # Glowing circular gauge & confetti
│   │   ├── SuitabilityMatrix.jsx# 5-sector water use compliance
│   │   ├── ComparisonCard.jsx   # Fuzzy vs Classical Arithmetic comparison
│   │   ├── RemediationAdvisor.jsx # Targeted chemical/physical treatment
│   │   ├── MembershipVisualizer.jsx # Interactive SVG curve plotter
│   │   ├── RuleInspector.jsx    # Mamdani rule base & defuzzification surface
│   │   ├── RiverBasinSimulator.jsx # 5-station longitudinal watershed model
│   │   ├── TheorySection.jsx    # Soft computing mathematical documentation
│   │   └── ReportModal.jsx      # Printable official laboratory certificate
│   └── lib/
│       └── fuzzyEngine.js       # Pure Mamdani FIS implementation
├── public/                      # Static assets & icons
├── package.json
└── README.md
```

---

## 📐 Mathematical Formulation

### 1. Triangular Membership Function
$$\mu(x; a, b, c) = \max\left(\min\left(\frac{x - a}{b - a}, \frac{c - x}{c - b}\right), 0\right)$$

### 2. Trapezoidal Membership Function
$$\mu(x; a, b, c, d) = \max\left(\min\left(\frac{x - a}{b - a}, 1, \frac{d - x}{d - c}\right), 0\right)$$

### 3. T-Norm (Antecedent Intersection)
$$\alpha_k = \min(\mu_{pH}, \mu_{Turbidity}, \mu_{DO}, \mu_{TDS})$$

### 4. Defuzzification via Center of Gravity (Centroid)
$$z^* = \frac{\int z \cdot \mu_{agg}(z) \, dz}{\int \mu_{agg}(z) \, dz}$$

---

## 👤 Author & Academic Credit

- **Author**: Ashank Gupta
- **Domain**: Soft Computing / Fuzzy Inference Systems / Environmental Informatics
