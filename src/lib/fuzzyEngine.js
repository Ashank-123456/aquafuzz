/**
 * AquaFuzz AI - Mamdani Fuzzy Inference System (FIS) Core Engine
 * 
 * Provides continuous mathematical modeling of environmental water quality,
 * translating crisp sensory readings (pH, Turbidity, DO, TDS) into linguistic
 * truth values and defuzzifying the aggregate outcome via Center of Gravity (COG).
 * 
 * @module fuzzyEngine
 * @author Ashank Gupta
 * @license MIT
 */

// ============================================================================
// 1. MEMBERSHIP FUNCTION (MF) PRIMITIVES
// ============================================================================

/**
 * Evaluates a Triangular Membership Function: μ(x; a, b, c)
 * 
 *          1 |       /\
 *            |      /  \
 *            |     /    \
 *          0 |____/______\____
 *                 a   b   c
 * 
 * @param {number} x - The crisp input value to evaluate.
 * @param {number} a - The left baseline anchor (μ = 0).
 * @param {number} b - The apex peak center (μ = 1).
 * @param {number} c - The right baseline anchor (μ = 0).
 * @returns {number} Degree of membership in the interval [0, 1].
 */
export function triangularMF(x, a, b, c) {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x > a && x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
}

/**
 * Evaluates a Trapezoidal Membership Function: μ(x; a, b, c, d)
 * 
 *          1 |      /------\
 *            |     /        \
 *            |    /          \
 *          0 |___/____________\___
 *                a  b      c   d
 * 
 * @param {number} x - The crisp input value to evaluate.
 * @param {number} a - Left lower anchor (μ = 0).
 * @param {number} b - Left upper plateau start (μ = 1).
 * @param {number} c - Right upper plateau end (μ = 1).
 * @param {number} d - Right lower anchor (μ = 0).
 * @returns {number} Degree of membership in the interval [0, 1].
 */
export function trapezoidalMF(x, a, b, c, d) {
  if (x <= a || x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x > a && x < b) return (x - a) / (b - a);
  return (d - x) / (d - c);
}

/**
 * Evaluates a Gaussian Membership Function: μ(x; c, σ)
 * 
 * @param {number} x - The crisp input value.
 * @param {number} c - The distribution center mean.
 * @param {number} sigma - The standard deviation spread.
 * @returns {number} Degree of membership in the interval [0, 1].
 */
export function gaussianMF(x, c, sigma) {
  return Math.exp(-0.5 * Math.pow((x - c) / sigma, 2));
}

// ============================================================================
// 2. INPUT VARIABLE DEFINITIONS & LINGUISTIC SETS
// ============================================================================

/**
 * Standard environmental parameter bounds, measurement units, and linguistic sets.
 * Aligned with World Health Organization (WHO) and EPA potable water guidelines.
 */
export const PARAM_DEFINITIONS = {
  ph: {
    id: "ph",
    name: "pH Level",
    unit: "pH",
    min: 0,
    max: 14,
    step: 0.1,
    default: 7.2,
    standardIdeal: "6.5 - 8.5",
    description: "Measure of hydrogen-ion concentration. Governs chemical toxicity and pipe corrosion.",
    sets: [
      { id: "acidic", name: "Acidic / Corrosive", color: "#f43f5e", mf: (x) => trapezoidalMF(x, 0, 0, 5.8, 6.6) },
      { id: "neutral", name: "Optimal / Neutral", color: "#10b981", mf: (x) => triangularMF(x, 6.3, 7.3, 8.3) },
      { id: "alkaline", name: "Alkaline / Basic", color: "#8b5cf6", mf: (x) => trapezoidalMF(x, 8.0, 8.8, 14, 14) }
    ]
  },
  turbidity: {
    id: "turbidity",
    name: "Turbidity",
    unit: "NTU",
    min: 0,
    max: 100,
    step: 0.5,
    default: 2.5,
    standardIdeal: "< 5.0 NTU",
    description: "Cloudiness caused by suspended silt and organic matter that shields pathogens.",
    sets: [
      { id: "clear", name: "Crystal / Low", color: "#06b6d4", mf: (x) => trapezoidalMF(x, 0, 0, 2.0, 5.0) },
      { id: "moderate", name: "Moderate", color: "#f59e0b", mf: (x) => triangularMF(x, 3.5, 10.0, 22.0) },
      { id: "turbid", name: "Murky / High", color: "#ef4444", mf: (x) => trapezoidalMF(x, 15.0, 30.0, 100, 100) }
    ]
  },
  do: {
    id: "do",
    name: "Dissolved Oxygen (DO)",
    unit: "mg/L",
    min: 0,
    max: 14,
    step: 0.1,
    default: 7.8,
    standardIdeal: "> 6.5 mg/L",
    description: "Concentration of free non-compound oxygen vital for biological respiration.",
    sets: [
      { id: "depleted", name: "Hypoxic / Low", color: "#ef4444", mf: (x) => trapezoidalMF(x, 0, 0, 3.0, 5.2) },
      { id: "moderate", name: "Moderate", color: "#f59e0b", mf: (x) => triangularMF(x, 4.2, 6.8, 8.8) },
      { id: "rich", name: "Well Oxygenated", color: "#10b981", mf: (x) => trapezoidalMF(x, 7.5, 9.5, 14, 14) }
    ]
  },
  tds: {
    id: "tds",
    name: "Total Dissolved Solids",
    unit: "ppm",
    min: 0,
    max: 2000,
    step: 10,
    default: 220,
    standardIdeal: "< 300 ppm",
    description: "Cumulative measure of dissolved inorganic salts, calcium, magnesium, and minerals.",
    sets: [
      { id: "pure", name: "Desirable / Low", color: "#06b6d4", mf: (x) => trapezoidalMF(x, 0, 0, 250, 450) },
      { id: "permissible", name: "Permissible", color: "#f59e0b", mf: (x) => triangularMF(x, 350, 600, 950) },
      { id: "excessive", name: "Contaminated / High", color: "#ef4444", mf: (x) => trapezoidalMF(x, 800, 1200, 2000, 2000) }
    ]
  }
};

// ============================================================================
// 3. OUTPUT VARIABLE: FUZZY WATER QUALITY INDEX (FWQI: 0 - 100)
// ============================================================================

export const OUTPUT_SETS = [
  { id: "severe", name: "Severe / Toxic", color: "#dc2626", grade: "E", mf: (z) => trapezoidalMF(z, 0, 0, 15, 30) },
  { id: "poor", name: "Poor / Degraded", color: "#f97316", grade: "D", mf: (z) => triangularMF(z, 20, 38, 55) },
  { id: "moderate", name: "Moderate / Fair", color: "#eab308", grade: "C", mf: (z) => triangularMF(z, 45, 60, 75) },
  { id: "good", name: "Good / Clean", color: "#06b6d4", grade: "B", mf: (z) => triangularMF(z, 65, 78, 90) },
  { id: "excellent", name: "Pristine / Excellent", color: "#10b981", grade: "A", mf: (z) => trapezoidalMF(z, 80, 92, 100, 100) }
];

// ============================================================================
// 4. MAMDANI RULE BASE (20 ENVIRONMENTAL DOMAIN RULES)
// ============================================================================

export const FUZZY_RULES = [
  {
    id: 1,
    name: "Pristine Mountain Spring",
    conditions: { ph: "neutral", turbidity: "clear", do: "rich", tds: "pure" },
    output: "excellent",
    weight: 1.0,
    rationale: "All core indicators lie within optimal drinking water parameters."
  },
  {
    id: 2,
    name: "Safe Domestic Drinking Water",
    conditions: { ph: "neutral", turbidity: "clear", do: "moderate", tds: "pure" },
    output: "good",
    weight: 1.0,
    rationale: "Clean clarity, healthy pH, and low mineral solids with adequate aeration."
  },
  {
    id: 3,
    name: "Slight Turbidity Impact",
    conditions: { ph: "neutral", turbidity: "moderate", do: "rich", tds: "pure" },
    output: "good",
    weight: 0.9,
    rationale: "High oxygen and pure solids buffer mild suspended solids."
  },
  {
    id: 4,
    name: "Mineral-Rich Clean Water",
    conditions: { ph: "neutral", turbidity: "clear", do: "rich", tds: "permissible" },
    output: "good",
    weight: 0.9,
    rationale: "Slightly elevated minerals (calcium/magnesium) do not pose hazards."
  },
  {
    id: 5,
    name: "Average Balanced Water",
    conditions: { ph: "neutral", turbidity: "moderate", do: "moderate", tds: "permissible" },
    output: "moderate",
    weight: 1.0,
    rationale: "Mid-tier quality suitable for domestic washing, irrigation, and secondary uses."
  },
  {
    id: 6,
    name: "Acidic Water Hazard",
    conditions: { ph: "acidic", turbidity: "clear", do: "rich", tds: "pure" },
    output: "poor",
    weight: 0.95,
    rationale: "Corrosive acidity leaches metals despite clean clarity."
  },
  {
    id: 7,
    name: "Severely Corrosive Acid Mine Runoff",
    conditions: { ph: "acidic", turbidity: "turbid", do: "depleted", tds: "excessive" },
    output: "severe",
    weight: 1.0,
    rationale: "Toxic cocktail of heavy acidity, hypoxia, and mineral saturation."
  },
  {
    id: 8,
    name: "Alkaline Scaled Water",
    conditions: { ph: "alkaline", turbidity: "clear", do: "moderate", tds: "permissible" },
    output: "moderate",
    weight: 0.85,
    rationale: "Mild bitterness and pipe scaling tendencies."
  },
  {
    id: 9,
    name: "High Caustic Alkalinity",
    conditions: { ph: "alkaline", turbidity: "turbid", do: "depleted", tds: "excessive" },
    output: "severe",
    weight: 1.0,
    rationale: "Industrial caustic discharge, unsuitable for any biological life."
  },
  {
    id: 10,
    name: "Hypoxic Aquatic Distress",
    conditions: { ph: "neutral", turbidity: "clear", do: "depleted", tds: "pure" },
    output: "poor",
    weight: 0.9,
    rationale: "Water is suffocating to fauna; high anaerobic decomposition risk."
  },
  {
    id: 11,
    name: "Eutrophic Sludge",
    conditions: { ph: "alkaline", turbidity: "turbid", do: "depleted", tds: "permissible" },
    output: "severe",
    weight: 0.95,
    rationale: "Algal bloom choke conditions with organic turbidity and dead zone DO."
  },
  {
    id: 12,
    name: "Heavy Silt River Flood",
    conditions: { ph: "neutral", turbidity: "turbid", do: "moderate", tds: "permissible" },
    output: "poor",
    weight: 0.9,
    rationale: "Sediment overload requires mandatory coagulation and filtration."
  },
  {
    id: 13,
    name: "Brackish Saline Infiltration",
    conditions: { ph: "neutral", turbidity: "clear", do: "rich", tds: "excessive" },
    output: "moderate",
    weight: 0.85,
    rationale: "High mineral salinity prevents direct drinking without reverse osmosis."
  },
  {
    id: 14,
    name: "Industrial Saline Waste",
    conditions: { ph: "acidic", turbidity: "moderate", do: "moderate", tds: "excessive" },
    output: "poor",
    weight: 0.95,
    rationale: "Acidic mineral effluent."
  },
  {
    id: 15,
    name: "Optimal Aquatic Preserve",
    conditions: { ph: "neutral", turbidity: "moderate", do: "rich", tds: "pure" },
    output: "good",
    weight: 0.95,
    rationale: "Natural stream with living micro-flora, clean solids and high aeration."
  },
  {
    id: 16,
    name: "Organic Storm Runoff",
    conditions: { ph: "neutral", turbidity: "turbid", do: "depleted", tds: "pure" },
    output: "poor",
    weight: 0.9,
    rationale: "Organic matter consuming dissolved oxygen rapidly."
  },
  {
    id: 17,
    name: "Deep Groundwater Mineralized",
    conditions: { ph: "neutral", turbidity: "clear", do: "moderate", tds: "permissible" },
    output: "good",
    weight: 0.85,
    rationale: "Natural subterranean filtration with moderate mineral hardness."
  },
  {
    id: 18,
    name: "Critical Degradation Cascade",
    conditions: { ph: "acidic", turbidity: "turbid", do: "depleted", tds: "permissible" },
    output: "severe",
    weight: 1.0,
    rationale: "Multi-parameter failure."
  },
  {
    id: 19,
    name: "Turbid Mineral Runoff",
    conditions: { ph: "neutral", turbidity: "turbid", do: "rich", tds: "excessive" },
    output: "moderate",
    weight: 0.9,
    rationale: "High oxygen buffers sediment payload but clarity remains restricted."
  },
  {
    id: 20,
    name: "Sub-Zero Pristine Glacial Runoff",
    conditions: { ph: "neutral", turbidity: "clear", do: "rich", tds: "pure" },
    output: "excellent",
    weight: 1.0,
    rationale: "Cold temperature enables maximum oxygen saturation and mineral clarity."
  }
];

// ============================================================================
// 5. STANDARD CASE STUDY PRESETS
// ============================================================================

export const PRESETS = [
  {
    id: "mountain_spring",
    name: "Alpine Mountain Spring",
    icon: "Mountain",
    description: "Untouched glacial source with pristine clarity, neutral pH, and superior dissolved oxygen.",
    params: { ph: 7.4, turbidity: 0.8, do: 10.2, tds: 110 }
  },
  {
    id: "municipal_tap",
    name: "Municipal Treated Tap",
    icon: "GlassWater",
    description: "Standard city distribution conforming to WHO/EPA potable standards.",
    params: { ph: 7.2, turbidity: 2.1, do: 7.5, tds: 260 }
  },
  {
    id: "rural_well",
    name: "Rural Groundwater Well",
    icon: "Droplets",
    description: "Naturally filtered subterranean aquifer with moderate mineral hardness.",
    params: { ph: 7.6, turbidity: 3.8, do: 5.8, tds: 480 }
  },
  {
    id: "agricultural_runoff",
    name: "Agricultural Runoff Canal",
    icon: "Wheat",
    description: "High fertilizer and silt payload; elevated turbidity and oxygen depletion.",
    params: { ph: 6.4, turbidity: 28.5, do: 4.1, tds: 680 }
  },
  {
    id: "eutrophic_lake",
    name: "Eutrophic Urban Lake",
    icon: "Waves",
    description: "Stagnant recreational reservoir suffering from micro-algal blooms and low DO.",
    params: { ph: 8.7, turbidity: 19.0, do: 3.5, tds: 520 }
  },
  {
    id: "industrial_effluent",
    name: "Untreated Industrial Outfall",
    icon: "Flame",
    description: "Corrosive, toxic wastewater with severe suspended solids and near-zero oxygen.",
    params: { ph: 4.6, turbidity: 68.0, do: 1.8, tds: 1420 }
  }
];

// ============================================================================
// 6. MAMDANI INFERENCE EXECUTION PIPELINE
// ============================================================================

/**
 * Evaluates water sample inputs through the Mamdani Fuzzy Inference System.
 * 
 * Steps executed:
 * 1. Fuzzification: Computes μ(x) for all inputs across all linguistic sets.
 * 2. Rule Evaluation: Calculates antecedent firing strength α via T-norm (min or product).
 * 3. Aggregation: Implicates clipped output fuzzy regions via S-norm (max).
 * 4. Defuzzification: Computes crisp FWQI score (0-100) via Centroid (COG).
 * 
 * @param {Object} inputValues - Measured parameters { ph, turbidity, do, tds }.
 * @param {Object} [options] - Engine tuning { tNorm: 'min'|'product', defuzzMethod: 'centroid'|'mom'|'bisector' }.
 * @returns {Object} Comprehensive evaluation metrics, classification, and firing details.
 */
export function evaluateFuzzyWaterQuality(inputValues, options = {}) {
  const tNorm = options.tNorm || "min";
  const defuzzMethod = options.defuzzMethod || "centroid";

  // Step 1: Fuzzification
  const fuzzified = {};
  for (const [paramKey, paramDef] of Object.entries(PARAM_DEFINITIONS)) {
    const val = inputValues[paramKey] !== undefined ? inputValues[paramKey] : paramDef.default;
    fuzzified[paramKey] = {};
    for (const set of paramDef.sets) {
      fuzzified[paramKey][set.id] = set.mf(val);
    }
  }

  // Step 2: Rule Evaluation
  const evaluatedRules = [];
  const ruleFiringsByOutput = {
    severe: 0,
    poor: 0,
    moderate: 0,
    good: 0,
    excellent: 0
  };

  for (const rule of FUZZY_RULES) {
    let antecedentStrength = 1.0;
    const conditionStrengths = {};

    for (const [paramKey, expectedSetId] of Object.entries(rule.conditions)) {
      const memDegree = fuzzified[paramKey]?.[expectedSetId] || 0;
      conditionStrengths[paramKey] = {
        setId: expectedSetId,
        degree: memDegree
      };

      if (tNorm === "product") {
        antecedentStrength *= memDegree;
      } else {
        antecedentStrength = Math.min(antecedentStrength, memDegree);
      }
    }

    const firingStrength = antecedentStrength * (rule.weight || 1.0);

    evaluatedRules.push({
      ...rule,
      conditionStrengths,
      firingStrength: Number(firingStrength.toFixed(4))
    });

    if (firingStrength > (ruleFiringsByOutput[rule.output] || 0)) {
      ruleFiringsByOutput[rule.output] = firingStrength;
    }
  }

  // Step 3: Aggregation & Defuzzification (over Z: 0 to 100)
  const numSamples = 201;
  const zStep = 100 / (numSamples - 1);
  const aggregatedCurve = [];

  let numeratorCentroid = 0;
  let denominatorCentroid = 0;
  let maxDegree = 0;
  let maxDegreeZValues = [];

  for (let i = 0; i < numSamples; i++) {
    const z = i * zStep;
    let muZ = 0;

    for (const outSet of OUTPUT_SETS) {
      const setMembership = outSet.mf(z);
      const ruleCut = ruleFiringsByOutput[outSet.id] || 0;
      const clipped = Math.min(setMembership, ruleCut);
      muZ = Math.max(muZ, clipped);
    }

    aggregatedCurve.push({ z, mu: muZ });

    numeratorCentroid += z * muZ;
    denominatorCentroid += muZ;

    if (muZ > maxDegree) {
      maxDegree = muZ;
      maxDegreeZValues = [z];
    } else if (muZ === maxDegree && maxDegree > 0) {
      maxDegreeZValues.push(z);
    }
  }

  // Defuzzification calculation
  let crispFWQI = 50.0;
  if (denominatorCentroid > 0.0001) {
    if (defuzzMethod === "mom") {
      crispFWQI = maxDegreeZValues.reduce((a, b) => a + b, 0) / maxDegreeZValues.length;
    } else if (defuzzMethod === "bisector") {
      const halfArea = denominatorCentroid / 2;
      let runningArea = 0;
      for (const pt of aggregatedCurve) {
        runningArea += pt.mu;
        if (runningArea >= halfArea) {
          crispFWQI = pt.z;
          break;
        }
      }
    } else {
      crispFWQI = numeratorCentroid / denominatorCentroid;
    }
  } else {
    crispFWQI = calculateClassicalWQI(inputValues).index;
  }

  crispFWQI = Math.max(0, Math.min(100, Number(crispFWQI.toFixed(2))));

  const classification = getQualityCategory(crispFWQI);
  const classicalComparison = calculateClassicalWQI(inputValues);
  const recommendations = getRemediationAdvice(inputValues, crispFWQI);

  return {
    fwqi: crispFWQI,
    classification,
    fuzzified,
    evaluatedRules: evaluatedRules.sort((a, b) => b.firingStrength - a.firingStrength),
    activeRuleCount: evaluatedRules.filter((r) => r.firingStrength > 0.01).length,
    ruleFiringsByOutput,
    aggregatedCurve,
    classicalComparison,
    recommendations,
    defuzzMethod,
    tNorm
  };
}

// ============================================================================
// 7. COMPLIANCE MAPPING & BASELINES
// ============================================================================

/**
 * Maps a crisp FWQI score to qualitative environmental grade and compliance flags.
 * 
 * @param {number} score - Scaled FWQI score [0, 100].
 * @returns {Object} Regulatory classification verdict.
 */
export function getQualityCategory(score) {
  if (score >= 85) {
    return {
      grade: "A+",
      label: "Pristine / Grade I",
      status: "Excellent",
      color: "#10b981",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      summary: "Pristine drinking quality water requiring minimal disinfection. Perfect for all high-grade uses.",
      potable: true,
      aquaticSafe: true,
      irrigationSafe: true,
      swimmingSafe: true,
      industrialSafe: true
    };
  }
  if (score >= 70) {
    return {
      grade: "B",
      label: "Clean / Grade II",
      status: "Good",
      color: "#06b6d4",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      textColor: "text-cyan-400",
      summary: "Safe for human consumption after conventional filtration. Fully supports diverse aquatic life.",
      potable: true,
      aquaticSafe: true,
      irrigationSafe: true,
      swimmingSafe: true,
      industrialSafe: true
    };
  }
  if (score >= 50) {
    return {
      grade: "C",
      label: "Moderate / Grade III",
      status: "Fair",
      color: "#eab308",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-400",
      summary: "Requires comprehensive municipal coagulation, sedimentation, and filtration before drinking.",
      potable: false,
      aquaticSafe: true,
      irrigationSafe: true,
      swimmingSafe: false,
      industrialSafe: true
    };
  }
  if (score >= 30) {
    return {
      grade: "D",
      label: "Poor / Grade IV",
      status: "Degraded",
      color: "#f97316",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      textColor: "text-orange-400",
      summary: "Polluted. Strictly non-potable. Usable only for certain industrial cooling or restricted irrigation.",
      potable: false,
      aquaticSafe: false,
      irrigationSafe: false,
      swimmingSafe: false,
      industrialSafe: true
    };
  }
  return {
    grade: "E",
    label: "Hazardous / Grade V",
    status: "Severe",
    color: "#ef4444",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    textColor: "text-rose-400",
    summary: "Critically contaminated / toxic effluent. Poses acute environmental and physiological hazards.",
    potable: false,
    aquaticSafe: false,
    irrigationSafe: false,
    swimmingSafe: false,
    industrialSafe: false
  };
}

/**
 * Calculates baseline Classical Weighted Arithmetic Water Quality Index (Brown et al.)
 * Demonstrates the masking and cliff effect pitfalls of classical linear modeling.
 * 
 * @param {Object} inputs - Water readings { ph, turbidity, do, tds }.
 * @returns {Object} Classical index and comparative critique.
 */
export function calculateClassicalWQI(inputs) {
  const weights = { ph: 0.25, turbidity: 0.25, do: 0.30, tds: 0.20 };

  const phVal = inputs.ph ?? 7.2;
  const turbVal = inputs.turbidity ?? 2.5;
  const doVal = inputs.do ?? 7.8;
  const tdsVal = inputs.tds ?? 220;

  const q_ph = Math.max(0, 100 - Math.abs(phVal - 7.0) * 35);
  const q_turb = Math.max(0, 100 - (turbVal / 25) * 100);
  const q_do = Math.min(100, Math.max(0, (doVal / 9.0) * 100));
  const q_tds = Math.max(0, 100 - (tdsVal / 1000) * 100);

  const classicalScore = Number(
    (
      q_ph * weights.ph +
      q_turb * weights.turbidity +
      q_do * weights.do +
      q_tds * weights.tds
    ).toFixed(2)
  );

  return {
    index: classicalScore,
    subIndices: { ph: q_ph, turbidity: q_turb, do: q_do, tds: q_tds },
    method: "Weighted Arithmetic Index Method (Brown et al.)",
    critique: "Classical WQI uses rigid linear cutoffs that suffer from eclipse and ambiguity issues. A single toxic factor can be mathematically masked by other high scores, whereas Fuzzy Inference accurately captures non-linear interactions."
  };
}

/**
 * Generates targeted remediation advice based on input parameter deviations.
 * 
 * @param {Object} inputs - Water parameters.
 * @param {number} score - Computed FWQI score.
 * @returns {Array<Object>} Remediation actions list.
 */
export function getRemediationAdvice(inputs, score) {
  const actions = [];
  const ph = inputs.ph ?? 7.2;
  const turb = inputs.turbidity ?? 2.5;
  const doVal = inputs.do ?? 7.8;
  const tds = inputs.tds ?? 220;

  if (ph < 6.5) {
    actions.push({
      priority: "high",
      type: "Neutralization",
      title: "Acidic pH Adjustment",
      message: `pH is ${ph}. Add limestone (CaCO3) or soda ash aeration to buffer acidity and stop piping corrosion.`
    });
  } else if (ph > 8.5) {
    actions.push({
      priority: "medium",
      type: "pH Balancing",
      title: "Alkaline Mitigation",
      message: `pH is ${ph}. Administer mild carbonation (CO2 injection) or organic bio-acidulation to reduce caustic scale.`
    });
  }

  if (turb > 5.0) {
    actions.push({
      priority: turb > 20 ? "high" : "medium",
      type: "Clarification",
      title: "Coagulation & Flocculation",
      message: `Turbidity is ${turb} NTU. Deploy alum / ferric sulfate coagulants followed by sand-anthracite filtration.`
    });
  }

  if (doVal < 5.0) {
    actions.push({
      priority: "high",
      type: "Oxygenation",
      title: "Aeration & Cascade Flow",
      message: `Dissolved Oxygen is only ${doVal} mg/L. Introduce venturi air injectors, cascade weirs, or biological re-aeration.`
    });
  }

  if (tds > 500) {
    actions.push({
      priority: tds > 1000 ? "high" : "medium",
      type: "Desalination",
      title: "Reverse Osmosis / Electrodialysis",
      message: `TDS is ${tds} ppm. Membrane filtration (RO) or ion-exchange resins required to reduce dissolved mineral salts.`
    });
  }

  if (actions.length === 0) {
    actions.push({
      priority: "low",
      type: "Preservation",
      title: "Preventative Monitoring",
      message: "Water parameters are in equilibrium. Maintain periodic bi-weekly sensor telemetry and source protection."
    });
  }

  return actions;
}
