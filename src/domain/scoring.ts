import type { SkinConcern, SkinProfile, SkinType, SurveyAnswers } from "./types";

const concernPriority: SkinConcern[] = [
  "barrier",
  "redness",
  "acne",
  "comedones",
  "pigmentation",
  "dehydration",
  "aging",
  "texture",
];

export function calculateSkinProfile(answers: SurveyAnswers): SkinProfile {
  const skinType = mapSkinType(answers.skinFeel);
  const sensitivity = answers.sensitivity ?? "medium";
  const concernSet = new Set<SkinConcern>(answers.concerns);

  if (answers.barrierSignals.some((signal) => signal !== "none")) {
    concernSet.add("barrier");
  }

  if (answers.lifestyle.includes("aircon")) {
    concernSet.add("dehydration");
  }

  const barrierCompromised =
    sensitivity === "high" ||
    concernSet.has("barrier") ||
    answers.barrierSignals.some((signal) =>
      ["burning", "flaking", "overexfoliation", "dermatological_treatment"].includes(signal),
    );

  const concerns = Array.from(concernSet);
  const needsDailySpf =
    !answers.currentRoutine.includes("spf") ||
    concerns.some((concern) => ["pigmentation", "redness", "aging"].includes(concern)) ||
    answers.lifestyle.includes("outdoor");

  return {
    skinType,
    concerns,
    sensitivity,
    barrierCompromised,
    needsDailySpf,
    avoidStrongActives: barrierCompromised,
    budget: answers.budget ?? "any",
    preferences: answers.preferences,
    priority: getPriority(concerns),
  };
}

function mapSkinType(skinFeel: SurveyAnswers["skinFeel"]): SkinType {
  switch (skinFeel) {
    case "tight":
      return "dry";
    case "tZoneShine":
      return "combination";
    case "allOverShine":
      return "oily";
    case "comfortable":
    default:
      return "balanced";
  }
}

function getPriority(concerns: SkinConcern[]): SkinProfile["priority"] {
  return concernPriority.find((concern) => concerns.includes(concern)) ?? "maintenance";
}
