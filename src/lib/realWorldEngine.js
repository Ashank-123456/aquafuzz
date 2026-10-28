/**
 * AquaFuzz AI - Real-World Field Treatment & Chemical Dosing Engine
 * 
 * Provides field-ready chemical calculations (alum, bleach, lime) based on jar-test
 * correlations, public health pathogen vulnerability estimates, and agricultural
 * salinity hazard indices.
 * 
 * @module realWorldEngine
 * @author Ashank Gupta
 * @license MIT
 */

// ============================================================================
// 1. IN-FIELD CHEMICAL DOSING CALCULATOR
// ============================================================================

/**
 * Calculates emergency chemical dosages for a batch volume of contaminated water.
 * 
 * Formulations:
 * - Coagulation: Based on Jar Test standard dosage curve (mg/L Alum).
 * - Disinfection: Target 0.8 mg/L free chlorine residual over turbidity demand.
 * - Neutralization: Lime Ca(OH)2 dosage to balance pH deficit below 6.5.
 * 
 * @param {Object} inputs - Water readings { ph, turbidity, do, tds }.
 * @param {number} [volumeLiters=1000] - Volume in liters to treat.
 * @returns {Object} Calculated dosages, procedures, and batch cost.
 */
export function calculateChemicalDosing(inputs, volumeLiters = 1000) {
  const ph = inputs.ph ?? 7.2;
  const turb = inputs.turbidity ?? 2.5;
  const doVal = inputs.do ?? 7.8;

  // 1. Coagulant Dosing (Alum: Al2(SO4)3 · 14H2O)
  let alumMgPerL = 0;
  if (turb > 50) alumMgPerL = 75;
  else if (turb > 20) alumMgPerL = 45;
  else if (turb > 10) alumMgPerL = 25;
  else if (turb > 4) alumMgPerL = 12;
  else alumMgPerL = 0;

  const totalAlumGrams = Number(((alumMgPerL * volumeLiters) / 1000).toFixed(1));

  // 2. Disinfection Dosing (5% Household Liquid Bleach NaOCl)
  const chlorineDemandMgL = 1.0 + (turb > 5 ? turb * 0.08 : 0);
  const targetResidualMgL = 0.8;
  const totalChlorineMgL = chlorineDemandMgL + targetResidualMgL;
  const bleachMlPerLiter = totalChlorineMgL / 50;
  const totalBleachMl = Number((bleachMlPerLiter * volumeLiters).toFixed(1));
  const chlorineTablets33mg = Math.ceil((totalChlorineMgL * volumeLiters) / 33);

  // 3. pH Neutralization Dosing (Hydrated Lime Ca(OH)2)
  let limeGrams = 0;
  let acidGrams = 0;
  if (ph < 6.5) {
    const phDeficit = 7.2 - ph;
    const limeMgL = phDeficit * 22;
    limeGrams = Number(((limeMgL * volumeLiters) / 1000).toFixed(1));
  } else if (ph > 8.5) {
    const phExcess = ph - 7.5;
    acidGrams = Number(((phExcess * 18 * volumeLiters) / 1000).toFixed(1));
  }

  // 4. Physical Timings
  const settlingMinutes = turb > 30 ? 60 : turb > 10 ? 35 : 15;
  const aerationMinutes = doVal < 3.0 ? 45 : doVal < 5.0 ? 20 : 0;
  const boilMinutes = 3;

  // 5. Estimated Cost in USD
  const estimatedCostUSD = Number(
    (
      (totalAlumGrams / 1000) * 0.4 +
      (totalBleachMl / 1000) * 0.6 +
      (limeGrams / 1000) * 0.3 +
      0.02
    ).toFixed(3)
  );

  return {
    volumeLiters,
    alum: {
      concentrationMgL: alumMgPerL,
      totalGrams: totalAlumGrams,
      procedure: alumMgPerL > 0 
        ? `Dissolve ${totalAlumGrams}g of alum powder in a cup of water; stir rapidly into tank for 2 minutes, then agitate gently for 5 minutes.`
        : "Turbidity is low. No chemical coagulant needed; direct sand filtration or sediment cartridge is adequate."
    },
    disinfection: {
      bleachMl: totalBleachMl,
      tablets: chlorineTablets33mg,
      procedure: `Add ${totalBleachMl} ml of 5% household bleach (or ${chlorineTablets33mg} chlorination tablets). Mix thoroughly and wait minimum 30 minutes contact time before consumption.`
    },
    neutralization: {
      limeGrams,
      acidGrams,
      action: ph < 6.5 ? "Lime Buffering Required" : ph > 8.5 ? "Mild Acidification Required" : "pH Balanced (No Buffer Needed)",
      procedure: ph < 6.5 
        ? `Add ${limeGrams}g of hydrated lime (Ca(OH)2) to neutralize corrosive acidity and protect pipe linings.`
        : ph > 8.5 
        ? `Water is alkaline (${ph}). Add ${acidGrams}g of food-grade citric acid or aerate thoroughly.`
        : "pH is in the healthy neutral zone (6.5 - 8.5). No adjustment needed."
    },
    timings: {
      settlingMinutes,
      aerationMinutes,
      boilMinutes
    },
    costUSD: estimatedCostUSD
  };
}

// ============================================================================
// 2. SECTOR 1: AQUACULTURE & FISHERIES
// ============================================================================

/**
 * Assesses aquatic habitat and commercial fish species survival.
 * 
 * @param {Object} inputs - Measured water parameters.
 * @returns {Object} Hypoxia severity, ammonia risk, and species suitability.
 */
export function evaluateAquacultureSuitability(inputs) {
  const ph = inputs.ph ?? 7.2;
  const doVal = inputs.do ?? 7.8;
  const turb = inputs.turbidity ?? 2.5;
  const tds = inputs.tds ?? 220;

  const ammoniaRiskLevel = ph > 8.5 ? "Critical Toxic" : ph > 8.0 ? "Elevated Danger" : "Safe Minimal";

  let hypoxiaSeverity = "Optimal";
  if (doVal < 2.0) hypoxiaSeverity = "Acute Lethal Suffocation (< 2 mg/L)";
  else if (doVal < 4.0) hypoxiaSeverity = "Severe Stress / Stunted Growth";
  else if (doVal < 6.0) hypoxiaSeverity = "Sub-Optimal / Reduced Appetite";

  const species = [
    {
      name: "Trout & Salmon (Coldwater Salmonids)",
      suitable: doVal >= 7.0 && ph >= 6.8 && ph <= 8.2 && turb <= 8 && tds <= 500,
      minDO: "7.0 mg/L",
      optimalPH: "6.8 - 8.0",
      status: doVal < 7.0 ? "Oxygen Deprived" : ph < 6.8 || ph > 8.2 ? "pH Stress" : turb > 8 ? "Gill Clogging" : "Optimal Thriving"
    },
    {
      name: "Tilapia & Carp (Warmwater Robust)",
      suitable: doVal >= 4.0 && ph >= 6.2 && ph <= 8.8 && turb <= 40 && tds <= 1200,
      minDO: "4.0 mg/L",
      optimalPH: "6.5 - 8.5",
      status: doVal < 4.0 ? "Suffocating" : ph < 6.2 ? "Acid Burn" : "Surviving Well"
    },
    {
      name: "Catfish & Pangasius",
      suitable: doVal >= 3.0 && ph >= 6.0 && ph <= 9.0 && turb <= 60 && tds <= 1400,
      minDO: "3.0 mg/L",
      optimalPH: "6.5 - 8.5",
      status: doVal < 3.0 ? "Lethal Hypoxia" : "Highly Tolerant"
    },
    {
      name: "Freshwater Prawn & Shrimp",
      suitable: doVal >= 5.5 && ph >= 7.2 && ph <= 8.4 && turb <= 15 && tds >= 150 && tds <= 1000,
      minDO: "5.5 mg/L",
      optimalPH: "7.5 - 8.3",
      status: doVal < 5.5 ? "Low Oxygen Molt Death" : ph < 7.2 ? "Soft Shell Disorder" : "Commercial Grade"
    }
  ];

  return {
    hypoxiaSeverity,
    ammoniaRiskLevel,
    species,
    keyIntervention: doVal < 5.0 ? "Immediate surface paddlewheel or venturi aeration required to prevent fish mortality." : "Ecosystem dissolved gas dynamics stable."
  };
}

// ============================================================================
// 3. SECTOR 2: AGRICULTURE & CROP IRRIGATION
// ============================================================================

/**
 * Assesses agricultural irrigation suitability per US Salinity Laboratory standards.
 * 
 * @param {Object} inputs - Water parameters.
 * @returns {Object} Salinity class, clogging risk, and crop suitability list.
 */
export function evaluateAgriculturalSuitability(inputs) {
  const ph = inputs.ph ?? 7.2;
  const tds = inputs.tds ?? 220;
  const turb = inputs.turbidity ?? 2.5;

  let salinityClass = "C1 (Low Salinity)";
  let salinityDescription = "Can be used for irrigation with most crops on most soils.";
  if (tds > 1200) {
    salinityClass = "C4 (Very High Salinity)";
    salinityDescription = "Unsuitable for irrigation under ordinary conditions; causes severe osmotic root dehydration.";
  } else if (tds > 750) {
    salinityClass = "C3 (High Salinity)";
    salinityDescription = "Requires special drainage and salinity-tolerant crops (e.g. barley, cotton, sugar beet).";
  } else if (tds > 350) {
    salinityClass = "C2 (Medium Salinity)";
    salinityDescription = "Can be used if a moderate degree of leaching occurs. Most plants can be grown.";
  }

  const dripCloggingRisk = turb > 30 ? "Severe Clogging (Requires Disc Filter + Settling Basin)" : turb > 10 ? "Moderate Clogging (Screen Filter Recommended)" : "Low Clogging Risk";
  const soilHazard = ph < 6.0 ? "Soil Acidification & Aluminum Toxicity" : ph > 8.4 ? "Soil Dispersion & Reduced Water Permeability" : "Optimal Neutral Soil Compatibility";

  const crops = [
    { name: "Sensitive Crops (Strawberry, Bean, Onion, Carrot)", maxTDS: "350 ppm", suitable: tds <= 350 && ph >= 6.5 && ph <= 8.0 },
    { name: "Moderately Sensitive (Corn, Potato, Tomato, Rice)", maxTDS: "650 ppm", suitable: tds <= 650 && ph >= 6.2 && ph <= 8.3 },
    { name: "Tolerant Field Crops (Wheat, Sorghum, Soybean)", maxTDS: "1,000 ppm", suitable: tds <= 1000 && ph >= 6.0 && ph <= 8.5 },
    { name: "Highly Salt-Tolerant (Cotton, Barley, Sugarbeet)", maxTDS: "1,500 ppm", suitable: tds <= 1500 && ph >= 6.0 && ph <= 8.8 }
  ];

  return {
    salinityClass,
    salinityDescription,
    dripCloggingRisk,
    soilHazard,
    crops
  };
}

// ============================================================================
// 4. SECTOR 3: PUBLIC HEALTH & EPIDEMIOLOGY
// ============================================================================

/**
 * Computes waterborne pathogen risk and corrosive heavy-metal leaching hazard.
 * 
 * @param {Object} inputs - Water readings.
 * @returns {Object} Illness risk %, pathogen shielding factor, and plumbing leaching hazard.
 */
export function evaluateHealthAndPathogenRisk(inputs) {
  const turb = inputs.turbidity ?? 2.5;
  const ph = inputs.ph ?? 7.2;

  let pathogenShielding = "Low (Clarity permits effective UV / Chlorine penetration)";
  let illnessRiskPercent = 2;

  if (turb > 30) {
    pathogenShielding = "Extreme Threat (Particulates completely shield pathogens from chemical disinfection)";
    illnessRiskPercent = 88;
  } else if (turb > 10) {
    pathogenShielding = "High Shielding (Disinfection dose must be doubled)";
    illnessRiskPercent = 54;
  } else if (turb > 5) {
    pathogenShielding = "Moderate (Turbidity violates WHO < 1 NTU potable threshold)";
    illnessRiskPercent = 22;
  }

  const leadCopperLeachingHazard = ph < 6.5 ? "Critical (Corrosive pH leaches lead, copper, and iron from plumbing)" : "Safe Passivated (Water forms protective mineral film on pipes)";

  return {
    illnessRiskPercent,
    pathogenShielding,
    leadCopperLeachingHazard,
    recommendation: turb > 5 || ph < 6.5 ? "Mandatory filtration and rolling boil required prior to infant or immunocompromised consumption." : "Low epidemiological health risk under normal municipal management."
  };
}

// ============================================================================
// 5. REAL-WORLD DATASETS FOR BATCH INGESTION
// ============================================================================

export const REAL_WORLD_DATASETS = [
  {
    id: "flint_river_crisis",
    name: "Municipal Pipe Corrosion Scenario",
    location: "Urban Distribution Grid",
    description: "Low pH and moderate chloride/TDS leading to internal lead pipe corrosion and particulate contamination.",
    records: [
      { id: "S-101", timestamp: "08:00 AM", location: "Water Treatment Plant Outlet", ph: 7.4, turbidity: 1.2, do: 8.5, tds: 210 },
      { id: "S-102", timestamp: "10:30 AM", location: "Distribution Main Branch A", ph: 6.8, turbidity: 3.5, do: 6.8, tds: 280 },
      { id: "S-103", timestamp: "01:15 PM", location: "Older Lead Service Line Junction", ph: 5.9, turbidity: 8.9, do: 5.2, tds: 390 },
      { id: "S-104", timestamp: "03:45 PM", location: "School Domestic Tap Inlet", ph: 5.4, turbidity: 16.4, do: 3.8, tds: 540 }
    ]
  },
  {
    id: "ganga_monsoon_survey",
    name: "River Watershed Monsoon Silt & Agricultural Runoff",
    location: "Northern River Basin (250 km stretch)",
    description: "Torrential monsoon rains carry agricultural fertilizer nitrogen and heavy eroded topsoil silt.",
    records: [
      { id: "R-01", timestamp: "Day 1 - 06:00", location: "Foothill Clean Tributary", ph: 7.5, turbidity: 2.8, do: 9.6, tds: 140 },
      { id: "R-02", timestamp: "Day 1 - 14:00", location: "Irrigation Canal Drainage Confluence", ph: 6.5, turbidity: 24.0, do: 6.1, tds: 480 },
      { id: "R-03", timestamp: "Day 2 - 09:00", location: "Urban Silt Plain Outfall", ph: 7.9, turbidity: 42.0, do: 4.4, tds: 690 },
      { id: "R-04", timestamp: "Day 2 - 16:30", location: "Downstream Delta Estuary", ph: 8.4, turbidity: 58.0, do: 3.1, tds: 1250 }
    ]
  },
  {
    id: "post_flood_disaster",
    name: "Post-Cyclone Flood Disaster Emergency Relief",
    location: "Coastal Disaster District",
    description: "Floodwaters inundated municipal open wells and domestic tube-wells with septic overflow.",
    records: [
      { id: "EM-01", timestamp: "07:00", location: "Community Health Center Borewell", ph: 6.7, turbidity: 38.0, do: 3.4, tds: 820 },
      { id: "EM-02", timestamp: "09:30", location: "Primary School Refugee Shelter Tank", ph: 6.3, turbidity: 62.0, do: 2.8, tds: 940 },
      { id: "EM-03", timestamp: "12:00", location: "Village Center Open Drinking Well", ph: 5.8, turbidity: 85.0, do: 1.9, tds: 1380 },
      { id: "EM-04", timestamp: "15:00", location: "Mobile Water Tanker Relief Supply", ph: 7.3, turbidity: 1.8, do: 7.6, tds: 220 }
    ]
  }
];
