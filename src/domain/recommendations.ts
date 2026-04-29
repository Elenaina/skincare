import type {
  Product,
  RecommendationCandidate,
  RoutineBlock,
  RoutineRecommendation,
  RoutineStep,
  SkinConcern,
  SkinProfile,
} from "./types";

const stepLabels: Record<RoutineStep, string> = {
  makeup_removal: "Demakijaż",
  cleansing: "Oczyszczanie",
  toner: "Tonik",
  morning_serum: "Serum rano",
  morning_cream: "Krem domykający rano",
  spf: "SPF",
  evening_serum: "Serum wieczorem",
  evening_cream: "Krem domykający wieczorem",
  exfoliation: "Złuszczanie",
  mask: "Maska",
  eye_serum: "Serum pod oczy",
  eye_cream: "Krem pod oczy",
  lip_care: "Pielęgnacja ust",
  spot_treatment: "Leczenie punktowe",
};

const productStepMap: Record<string, RoutineStep[]> = {
  demakijaż: ["makeup_removal"],
  oczyszczanie: ["cleansing"],
  tonik: ["toner"],
  serum: ["morning_serum", "evening_serum"],
  krem: ["morning_cream", "evening_cream"],
  spf: ["spf"],
  SPF: ["spf"],
  peeling: ["exfoliation"],
  maska: ["mask"],
  "serum pod oczy": ["eye_serum"],
  "krem pod oczy": ["eye_cream"],
  "pielęgnacja ust": ["lip_care"],
  "leczenie punktowe": ["spot_treatment"],
};

export function buildRoutineRecommendation(profile: SkinProfile, products: Product[]): RoutineRecommendation {
  const morningSteps: RoutineStep[] = ["cleansing", "morning_serum", "morning_cream", "spf"];
  const eveningSteps: RoutineStep[] = ["cleansing", "evening_serum", "evening_cream"];

  const warnings = [
    "Plan ma charakter kosmetyczny i nie zastępuje konsultacji dermatologicznej.",
    ...(profile.avoidStrongActives
      ? ["Przy reaktywności lub naruszonej barierze mocne kwasy i retinoidy powinny poczekać."]
      : []),
  ];

  return {
    profile,
    morning: morningSteps.map((step) => buildRoutineBlock(step, profile, products)),
    evening: eveningSteps.map((step) => buildRoutineBlock(step, profile, products)),
    warnings,
  };
}

export function buildRoutineBlock(step: RoutineStep, profile: SkinProfile, products: Product[]): RoutineBlock {
  return {
    step,
    title: stepLabels[step],
    instruction: getStepInstruction(step, profile),
    candidates: recommendProductsForStep(products, step, profile, 3),
  };
}

export function recommendProductsForStep(
  products: Product[],
  step: RoutineStep,
  profile: SkinProfile,
  limit = 3,
): RecommendationCandidate[] {
  const ranked = products
    .filter((product) => product.isActive !== false)
    .filter((product) => productMatchesStep(product, step))
    .filter((product) => productMatchesUsageTime(product, step))
    .map((product) => scoreProduct(product, step, profile))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score);

  const selected: RecommendationCandidate[] = [];
  const usedBrands = new Set<string>();

  for (const candidate of ranked) {
    if (usedBrands.has(candidate.product.brand)) continue;
    selected.push(candidate);
    usedBrands.add(candidate.product.brand);
    if (selected.length === limit) break;
  }

  return selected;
}

function scoreProduct(product: Product, step: RoutineStep, profile: SkinProfile): RecommendationCandidate {
  const reasons: string[] = [];
  const warnings: string[] = [];
  let score = 10;

  if (product.skinTypes.includes(profile.skinType)) {
    score += 12;
    reasons.push("pasuje do typu cery");
  }

  const concernMatches = profile.concerns.filter((concern) => product.skinConcerns.includes(concern));
  score += concernMatches.length * 10;
  if (concernMatches.length > 0) {
    reasons.push(`wspiera: ${concernMatches.join(", ")}`);
  }

  if (profile.barrierCompromised && product.barrierFriendly) {
    score += 14;
    reasons.push("przyjazny dla bariery");
  }

  if (profile.preferences.fragranceFree === "yes" && product.fragranceFree) {
    score += 8;
    reasons.push("bezzapachowy");
  }

  if (profile.preferences.pregnancySafe === "yes") {
    if (product.pregnancySafe) {
      score += 8;
      reasons.push("oznaczony jako bezpieczniejszy w ciąży");
    } else {
      score -= 40;
      warnings.push("nie jest oznaczony jako pregnancy-safe");
    }
  }

  if (profile.avoidStrongActives && isStrongActive(product)) {
    score -= 35;
    warnings.push("może być za mocny przy reaktywnej skórze lub naruszonej barierze");
  }

  if (profile.budget !== "any") {
    score += scoreBudget(product.pricePln, profile.budget);
  }

  if (step === "spf" && profile.needsDailySpf) {
    score += 10;
    reasons.push("SPF ma wysoki priorytet w tej rutynie");
  }

  return { product, score, reasons, warnings };
}

function productMatchesStep(product: Product, step: RoutineStep): boolean {
  const mappedSteps = productStepMap[product.recommendedStep] ?? productStepMap[product.category] ?? [];
  return mappedSteps.includes(step);
}

function productMatchesUsageTime(product: Product, step: RoutineStep): boolean {
  const allowedTimes = getAllowedUsageTimes(product.usageTime);
  if (isMorningStep(step)) return allowedTimes.has("morning");
  if (isEveningStep(step)) return allowedTimes.has("evening");
  return true;
}

function getAllowedUsageTimes(usageTime: Product["usageTime"]): Set<"morning" | "evening"> {
  const normalized = usageTime?.trim().toLowerCase();

  if (!normalized || normalized === "rano i wieczorem") return new Set(["morning", "evening"]);
  if (normalized === "rano") return new Set(["morning"]);
  if (normalized === "wieczorem") return new Set(["evening"]);

  return new Set(["morning", "evening"]);
}

function isMorningStep(step: RoutineStep): boolean {
  return ["morning_serum", "morning_cream", "spf"].includes(step);
}

function isEveningStep(step: RoutineStep): boolean {
  return ["evening_serum", "evening_cream", "exfoliation"].includes(step);
}

function scoreBudget(price: Product["pricePln"], budget: SkinProfile["budget"]): number {
  if (!price) return 0;
  if (budget === "budget") return price <= 60 ? 8 : price <= 100 ? 2 : -12;
  if (budget === "mid") return price <= 150 ? 8 : -4;
  if (budget === "premium") return price >= 100 ? 4 : 0;
  return 0;
}

function isStrongActive(product: Product): boolean {
  const text = [product.subcategory, product.keyIngredients.join(" "), product.shortReason, product.avoidIf]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return ["retinol", "retinal", "kwas salicylowy", "kwasy", "aha", "bha", "pha", "peeling"].some((phrase) =>
    text.includes(phrase),
  );
}

function getStepInstruction(step: RoutineStep, profile: SkinProfile): string {
  switch (step) {
    case "cleansing":
      return "Oczyść skórę delikatnie, bez mocnego odtłuszczania.";
    case "morning_serum":
      return profile.barrierCompromised
        ? "Wybierz serum regenerujące lub nawilżające."
        : "Wybierz serum dopasowane do głównego celu skóry.";
    case "morning_cream":
      return "Domknij serum kremem, żeby ograniczyć utratę wody i poprawić komfort skóry.";
    case "spf":
      return "Nałóż SPF jako ostatni krok porannej pielęgnacji.";
    case "evening_serum":
      return getEveningSerumInstruction(profile);
    case "evening_cream":
      return "Domknij pielęgnację kremem, szczególnie po serum aktywnym.";
    default:
      return "Stosuj zgodnie z potrzebami skóry i tolerancją.";
  }
}

function getEveningSerumInstruction(profile: SkinProfile): string {
  if (profile.avoidStrongActives) return "Postaw na serum regenerujące; aktywy wprowadzaj dopiero po stabilizacji.";
  if (profile.concerns.includes("comedones") || profile.concerns.includes("acne")) {
    return "Rozważ serum aktywne 2-3 razy w tygodniu, w pozostałe dni regeneracja.";
  }
  if (profile.concerns.includes("pigmentation")) return "Wybierz serum rozjaśniające lub wspierające koloryt.";
  if (profile.concerns.includes("aging")) return "Rozważ łagodny produkt anti-aging, wprowadzany powoli.";
  return "Wybierz serum regenerujące lub nawilżające.";
}

export function normalizeConcern(value: string): SkinConcern | undefined {
  const map: Record<string, SkinConcern> = {
    odwodnienie: "dehydration",
    bariera: "barrier",
    "naruszona bariera": "barrier",
    trądzik: "acne",
    wypryski: "acne",
    niedoskonałości: "acne",
    zaskórniki: "comedones",
    rumień: "redness",
    naczynkowa: "redness",
    przebarwienia: "pigmentation",
    "szary koloryt": "dullness",
    antyoksydacja: "dullness",
    tekstura: "texture",
    zmarszczki: "aging",
    pierwszezmarszczki: "aging",
    "utrata jędrności": "firmness",
    suchość: "dryness",
    podrażnienia: "irritation",
    regeneracja: "barrier",
  };

  return map[value.trim().toLowerCase()];
}
