import type { Product, SkinConcern, SkinType } from "../domain/types";
import { normalizeConcern } from "../domain/recommendations";

type ProductRow = {
  id?: string;
  brand: string;
  product_name: string;
  category: string;
  subcategory?: string | null;
  price_pln?: number | string | null;
  size_ml?: number | string | null;
  skin_types?: string[] | string | null;
  skin_concerns?: string[] | string | null;
  key_ingredients?: string[] | string | null;
  avoid_if?: string | null;
  fragrance_free?: boolean | string | null;
  pregnancy_safe?: boolean | string | null;
  barrier_friendly?: boolean | string | null;
  comedogenic_risk?: string | null;
  recommended_step: string;
  usage_time?: string | null;
  usage_frequency?: string | null;
  short_reason?: string | null;
  source_url?: string | null;
  is_active?: boolean | null;
};

const skinTypeMap: Record<string, SkinType> = {
  sucha: "dry",
  odwodniona: "dry",
  normalna: "balanced",
  mieszana: "combination",
  tłusta: "oily",
};

export function mapProductRow(row: ProductRow, index = 0): Product {
  return {
    id: row.id ?? createStableProductId(row, index),
    brand: row.brand,
    productName: row.product_name,
    category: row.category,
    subcategory: row.subcategory ?? undefined,
    pricePln: toNumber(row.price_pln),
    sizeMl: toNumber(row.size_ml),
    skinTypes: normalizeSkinTypes(row.skin_types),
    skinConcerns: normalizeSkinConcerns(row.skin_concerns),
    keyIngredients: toArray(row.key_ingredients),
    avoidIf: row.avoid_if ?? undefined,
    fragranceFree: toBoolean(row.fragrance_free),
    pregnancySafe: toBoolean(row.pregnancy_safe),
    barrierFriendly: toBoolean(row.barrier_friendly),
    comedogenicRisk: row.comedogenic_risk ?? undefined,
    recommendedStep: row.recommended_step,
    usageTime: row.usage_time ?? undefined,
    usageFrequency: row.usage_frequency ?? undefined,
    shortReason: row.short_reason ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    isActive: row.is_active ?? true,
  };
}

function normalizeSkinTypes(value: ProductRow["skin_types"]): string[] {
  return toArray(value).flatMap((item) => {
    const normalized = skinTypeMap[item.toLowerCase()];
    return normalized ? [normalized] : [];
  });
}

function normalizeSkinConcerns(value: ProductRow["skin_concerns"]): SkinConcern[] {
  return toArray(value).flatMap((item) => {
    const normalized = normalizeConcern(item);
    return normalized ? [normalized] : [];
  });
}

function toArray(value: string[] | string | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNumber(value: string | number | null | undefined): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (!value) return undefined;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toBoolean(value: boolean | string | null | undefined): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === "tak" || normalized === "true" || normalized === "yes") return true;
  if (normalized === "nie" || normalized === "false" || normalized === "no") return false;
  return undefined;
}

function createStableProductId(row: ProductRow, index: number): string {
  return `${row.brand}-${row.product_name}-${index}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
