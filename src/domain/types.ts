export type SkinType = "dry" | "balanced" | "combination" | "oily";

export type SkinConcern =
  | "dehydration"
  | "barrier"
  | "acne"
  | "comedones"
  | "redness"
  | "pigmentation"
  | "texture"
  | "aging"
  | "firmness"
  | "dullness"
  | "dryness"
  | "irritation";

export type SensitivityLevel = "low" | "medium" | "high";

export type RoutineStep =
  | "makeup_removal"
  | "cleansing"
  | "toner"
  | "morning_serum"
  | "morning_cream"
  | "spf"
  | "evening_serum"
  | "evening_cream"
  | "exfoliation"
  | "mask"
  | "eye_serum"
  | "eye_cream"
  | "lip_care"
  | "spot_treatment";

export type UsageTime = "morning" | "evening" | "morning_and_evening";

export type BooleanPreference = "yes" | "no" | "unknown";

export type BudgetRange = "budget" | "mid" | "premium" | "any";

export type SurveyAnswers = {
  skinFeel?: "tight" | "comfortable" | "tZoneShine" | "allOverShine";
  concerns: SkinConcern[];
  sensitivity?: SensitivityLevel;
  currentRoutine: Array<"cleanser" | "cream" | "spf" | "acids" | "retinoid" | "vitamin_c" | "none">;
  barrierSignals: Array<"burning" | "flaking" | "overexfoliation" | "dermatological_treatment" | "none">;
  lifestyle: Array<"makeup" | "sport" | "outdoor" | "stress" | "aircon">;
  ageRange?: "under_20" | "20_29" | "30_39" | "40_49" | "50_plus";
  budget?: BudgetRange;
  preferences: {
    fragranceFree?: BooleanPreference;
    pregnancySafe?: BooleanPreference;
    lightFinish?: BooleanPreference;
  };
  notes?: string;
};

export type SkinProfile = {
  skinType: SkinType;
  concerns: SkinConcern[];
  sensitivity: SensitivityLevel;
  barrierCompromised: boolean;
  needsDailySpf: boolean;
  avoidStrongActives: boolean;
  budget: BudgetRange;
  preferences: SurveyAnswers["preferences"];
  priority: SkinConcern | "maintenance";
};

export type Product = {
  id: string;
  brand: string;
  productName: string;
  category: string;
  subcategory?: string;
  pricePln?: number;
  sizeMl?: number;
  skinTypes: string[];
  skinConcerns: string[];
  keyIngredients: string[];
  avoidIf?: string;
  fragranceFree?: boolean;
  pregnancySafe?: boolean;
  barrierFriendly?: boolean;
  comedogenicRisk?: "niskie" | "średnie" | "wysokie" | string;
  recommendedStep: string;
  usageTime?: string;
  usageFrequency?: string;
  shortReason?: string;
  sourceUrl?: string;
  isActive?: boolean;
};

export type RecommendationCandidate = {
  product: Product;
  score: number;
  reasons: string[];
  warnings: string[];
};

export type RoutineRecommendation = {
  profile: SkinProfile;
  morning: RoutineBlock[];
  evening: RoutineBlock[];
  warnings: string[];
};

export type RoutineBlock = {
  step: RoutineStep;
  title: string;
  instruction: string;
  candidates: RecommendationCandidate[];
};
